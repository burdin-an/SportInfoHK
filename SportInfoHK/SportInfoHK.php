<?php
/**
 * Проект "Информатор спортивных соревнований: фигурное катание на коньках"
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    Бурдин А.Н. <support@it-sakh.net>
 * @copyright Бурдин А.Н. <support@it-sakh.net>
 * @link      http://www.it-sakh.info/SportInfo/
 * @link      https://github.com/burdin-an/SportInfoFS
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @version   1.0.4
 */

setlocale(LC_CTYPE, 'ru_RU.UTF-8');
error_reporting(E_ALL ^ E_WARNING);

require_once __DIR__ . '/vendor/autoload.php';
use Workerman\Worker;
use Workerman\Lib\Timer;
use Workerman\Connection\AsyncTcpConnection;


// Обрабатываем конфигурационный файл по-умолчанию: config-default.ini
$configDefault = parse_ini_file(__DIR__ . "/config-default.ini");
// Обрабатываем локальный конфигурационный файл: config-local.ini
if (file_exists(__DIR__ . "/config-local.ini")) {
    $configLocal = parse_ini_file(__DIR__ . "/config-local.ini");
    $ini = array_merge($configDefault, $configLocal);
    unset($configLocal);
}
else {
    $ini = $configDefault;
}

unset($configDefault);

if (!is_array($ini)) {
    print_r($ini);
    echo "Не удалось прочитать конфигурационный файл.\n";
    exit;
}

$Start_time = 1;

$EventDB = [
    'NamePlayer1' => '123',
    'NamePlayer2' => '456',
    'CountPlayer1' => 0,
    'CountPlayer2' => 0,
    'Period'       => 1,
    'Timer'        => (string)'00:00',
    'BoardCountStatus'   => 'disable',
];

//Очистить всё
function ActionClearALL() {
    echo "Очистка экрана\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "Clear",
    ];
}
//Очистить Титры
function ActionClearTV() {
    echo "Очистка Титров\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "ClearTV",
    ];
}
//Перезагрузить: Титры
function ActionReloadTV() {
    echo "Перезагрузить: Титры\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "ReloadTV",
    ];
}
//Открыть титры для Хоккея
function ActionOpenTVHK() {
    echo "Открыть титры для Хоккея\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "OpenTVHK",
    ];
}
//Открыть титры для Футбола
function ActionOpenTVFootball() {
    echo "Открыть титры для Футбола\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "OpenTVFootball",
    ];
}

function FuncWorks($data, $connection) {
    global $EventDB;
    global $users;
    global $TimerID;
    global $Start_time;
    global $ini;

    if (!empty($data)) {
        /**************** Наполняем базу 2 убрали счёт ********************************/
        $ReturnJsonToWeb = [];
        $data = rtrim($data);
        $dataJson = json_decode($data, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            // Данные в JSON формате
            if ($dataJson['Action'] == 'SendNamePlayerOne') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['NamePlayer1'] = $dataJson['Value'];
                $ReturnJsonToWeb = ActionReloadTV();
            }
            elseif ($dataJson['Action'] == 'SendNamePlayerTwo') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['NamePlayer2'] = $dataJson['Value'];
                $ReturnJsonToWeb = ActionReloadTV();
            }
            elseif ($dataJson['Action'] == 'SendTimer') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                list($minutes, $second) = explode(":", $dataJson['Value']);
                if ($minutes < 1) {$minutes = 0;}
                if ($second < 1) {$second = 0;}
                if ($minutes >= 45) {$minutes = $minutes-45;}
                $minutes = $minutes * 60;
                $Start_time = $minutes + $second;
                $EventDB['Timer'] = $dataJson['Value'];
                $ReturnJsonToWeb = ActionReloadTV();
            }
            else {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
            }
        }
        elseif ($data == "TimerStartFirstPeriod" || $data == "TimerStartSecondPeriod") {
            if ($TimerID == 0) {
                //$Start_time = 0;
                $TimerID = Timer::add(1, function()use(&$TimerID, &$users, &$Start_time, &$data, &$ini) {
                    $timerShow = $Start_time++;
                    if($timerShow >= 2701) {
                        if ($ini["PrintConsoleInfo"] == "y") {
                            echo "Timer::del($TimerID)\n";
                        }
                        Timer::del($TimerID);
                        $TimerID=0;
                    }
                    else {
                        if ($data == "TimerStartSecondPeriod") {
                            $timerShow = $timerShow+2700;
                        }
                        $minutes = floor($timerShow / 60);
                        if ($minutes < 10) {$minutes = "0".$minutes;} 
                        $seconds = $timerShow % 60;
                        if ($seconds < 10) {$seconds = "0".$seconds;} 
                        if ($ini["PrintConsoleInfo"] == "y") {
                            echo "Timer run ".$minutes.":".$seconds." \n";
                        }
                        $ReturnJsonToWeb = [
                            "timestamp" => time(),
                            "dAction" => "TimerUpdate",
                            "Value"   => $minutes.":".$seconds,
                        ];
                        foreach($users as $connection) {
                            $connection['connect']->send(json_encode($ReturnJsonToWeb));
                        }
                    }
                });
            }
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "TimerPause") {
            if ($TimerID != 0) {
                Timer::del($TimerID);
                $TimerID=0;
            }
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "TimerClean") {
            if ($TimerID != 0) {
                Timer::del($TimerID);
                $TimerID=0;
                $Start_time=1;
            }
            $EventDB['Timer'] = (string)'00:00';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction" => "TimerUpdate",
                "Value"   => $EventDB['Timer'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "CountPlayer1Plus" || $data == "CountPlayer1Minus") {
            if ($data == "CountPlayer1Plus") {
                $EventDB['CountPlayer1'] = $EventDB['CountPlayer1'] + 1;
            }
            elseif ($data == "CountPlayer1Minus") {
                $EventDB['CountPlayer1'] = $EventDB['CountPlayer1'] - 1;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "CountPlayer1",
                "Value"     => $EventDB['CountPlayer1'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "CountPlayer2Plus" || $data == "CountPlayer2Minus") {
            if ($data == "CountPlayer2Plus") {
                $EventDB['CountPlayer2'] = $EventDB['CountPlayer2'] + 1;
            }
            elseif ($data == "CountPlayer2Minus") {
                $EventDB['CountPlayer2'] = $EventDB['CountPlayer2'] - 1;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "CountPlayer2",
                "Value"     => $EventDB['CountPlayer2'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "PeriodPlus" || $data == "PeriodMinus") {
            if ($data == "PeriodPlus") {
                $EventDB['Period'] = $EventDB['Period'] + 1;
            }
            elseif ($data == "PeriodMinus") {
                $EventDB['Period'] = $EventDB['Period'] - 1;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "Period",
                "Value"     => $EventDB['Period'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "ShowBoardCount") {
            $EventDB['BoardCountStatus'] = 'active';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "BoardCountStatus" => $EventDB['BoardCountStatus'],
                "CountPlayer1"     => $EventDB['CountPlayer1'],
                "CountPlayer2"     => $EventDB['CountPlayer2'],
                "NamePlayer1"      => $EventDB['NamePlayer1'],
                "NamePlayer2"      => $EventDB['NamePlayer2'],
                "Period"           => $EventDB['Period'],
                "Timer"            => $EventDB['Timer'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "HideBoardCount") {
            $EventDB['BoardCountStatus'] = 'disable';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "Value"     => $EventDB['BoardCountStatus'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "UpdateBoardCount") {
            $ReturnJsonToWeb = [
                "timestamp"        => time(),
                "dAction"          => $data,
                "BoardCountStatus" => $EventDB['BoardCountStatus'],
                "CountPlayer1"     => $EventDB['CountPlayer1'],
                "CountPlayer2"     => $EventDB['CountPlayer2'],
                "NamePlayer1"      => $EventDB['NamePlayer1'],
                "NamePlayer2"      => $EventDB['NamePlayer2'],
                "Period"           => $EventDB['Period'],
                "Timer"            => $EventDB['Timer'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        //Очистить всё
        elseif ($data == "Clear") {
            echo "Action: Clear All\n";
            $ReturnJsonToWeb = ActionClearAll();
        }
        //Очистить Титры
        elseif ($data == "ClearTV") {
            echo "Action Clear TV\n";
            $ReturnJsonToWeb = ActionClearTV();
        }
        //Перезагрузка титров
        elseif ($data == "ReloadTV") {
            echo "Action: Reload TV\n";
            $ReturnJsonToWeb = ActionReloadTV();
        }
        //Открыть титры для Хоккея
        elseif ($data == "OpenTVHK") {
            echo "Action: OpenTVHK\n";
            $ReturnJsonToWeb = ActionOpenTVHK();
        }
        //Открыть титры для Футбола
        elseif ($data == "OpenTVFootball") {
            echo "Action: OpenTVFootball\n";
            $ReturnJsonToWeb = ActionOpenTVFootball();
        }
        //Перезагрузка конфиг. файла
        elseif ($data == "ReOpenINI") {
            echo "Action: ReOpenINI TV\n";
            // Обрабатываем конфигурационный файл по-умолчанию: config-default.ini
            $configDefault = parse_ini_file(__DIR__ . "/config-default.ini");
            // Обрабатываем локальный конфигурационный файл: config-local.ini
            if (file_exists(__DIR__ . "/config-local.ini")) {
                $configLocal = parse_ini_file(__DIR__ . "/config-local.ini");
                $ini = array_merge($configDefault, $configLocal);
                unset($configLocal);
            }
            else {
                $ini = $configDefault;
            }

            unset($configDefault);

            if (!is_array($ini)) {
                print_r($ini);
                echo "Не удалось прочитать конфигурационный файл.\n";
                exit;
            }
        }
        else {
            echo "Нет такой команды!\n";
        }

        if (array_key_exists('dAction', $ReturnJsonToWeb)) {
            foreach($users as $connection) {
                $connection['connect']->send(json_encode($ReturnJsonToWeb));
            }
        }
        $DBFile = fopen(__DIR__ . '/DB/DB.json', 'w');
        fwrite($DBFile, json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
        fclose($DBFile);

        empty($ReturnJsonToWeb);
    }
    return 1;
}

$ws_worker = new Worker("websocket://0.0.0.0:" . $ini["WebSocketPort"]);

// Тут храним пользовательские соединения
$users = [];

$ws_worker->onConnect = function($connection) use (&$ini, &$users) {
    $connection->onWebSocketConnect = function($connection) use (&$users, &$ini) {
        $users[$connection->id]['connect'] = $connection;
        $RemoteIP = (string)$connection->getRemoteIp();
        if (array_key_exists($RemoteIP, $ini)) {
            if ($ini[$RemoteIP] != "") {
                $users[$connection->id]['admin'] = 1;
                $users[$connection->id]['role']  = [];
                foreach(explode(",", $ini[$RemoteIP]) as $val) {
                    array_push($users[$connection->id]['role'], trim($val));
                }
                if ($ini["PrintConsoleInfo"] == "y") {echo "Пользователь Администратор\n";}
            }
            else {
                $users[$connection->id]['admin'] = 0;
                if ($ini["PrintConsoleInfo"] == "y") {echo "Пользователь НЕ Администратор\n";}
            }
        }
        else {
            $users[$connection->id]['admin'] = 0;
            if ($ini["PrintConsoleInfo"] == "y") {echo "Пользователь НЕ Администратор\n";}
        }
    };
    if ($ini["PrintConsoleInfo"] == "y") {echo "Клиент подключился, с IP:" . $connection->getRemoteIp() . "\n";}
};

$ws_worker->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$users) {
    if ($users[$connection->id]['admin'] == 1) {
        if (in_array('All', $users[$connection->id]['role'], true)) {
            if ($ini["PrintConsoleInfo"] == "y") {echo "---------------------------------------------------------------------\n";}
            if ($ini["PrintConsoleInfo"] == "y") {echo "У пользователя полные права\n";}
            FuncWorks($data, $connection);
        }
        else {
            if ($ini["PrintConsoleInfo"] == "y") {echo "У пользователя нет прав на выполнение команд!\n";}
        }
    }
};

// it starts once when you start server.php:
$ws_worker->onWorkerStart = function() use (&$EventDB, &$ini, &$users) {
    // Обрабатываем базу данных
    if (file_exists(__DIR__ . "/DB/DB.json")) {
        $EventDB = json_decode( file_get_contents(__DIR__ . '/DB/DB.json') , true );
        if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем базу\n";}
    }
    if ($ini['HOCKEY_CONNECT']=="y") {
        echo "Мы пытаемся подключиться к Hockey!\n";
        $connection = new AsyncTcpConnection("tcp://" . $ini['HOCKEY_IP'] . ":". $ini['HOCKEY_PORT']);
        $connection->maxSendBufferSize = 4*1024*1024;
        $connection->onConnect = function($connection) {
            echo "Мы подключились к Hockey!\n";
        };
        $schetLeftMemory  = 0;
        $schetRightMemory = 0;
        $secondMemory = 0;
        $connection->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$users, &$schetLeftMemory, &$schetRightMemory, &$secondMemory, &$LogFile) {
            $ReturnJsonToWeb = '';
            $ActionBin = unpack("h1Action",$data);
            //print_r(unpack("h*",$data));          
            //Таймер
            if ($ActionBin["Action"] == 1) {
                $byteArray = unpack("@1/hMin1/hMin2/h1Sec1/h1Sec2/h1Dol1/h1Start1/h1Start2/h1Dol4/h1Dol5/h1Dol6/h1Dol7/h1Dol8",$data);
                if ($byteArray["Sec2"] != $secondMemory && $byteArray["Start1"] == 1) {
                    echo "Action: 1 " . "\n";
                    //echo ($byteArray["Min1"] == "c" ? 0 : $byteArray["Min1"]) . $byteArray["Min2"] . ":" . ($byteArray["Sec1"] == "c" ? 0 : $byteArray["Sec1"]) . $byteArray["Sec2"] . "//" . $byteArray["Start1"] . "\n";
                    $EventDB['Timer'] = ($byteArray["Min1"] == "c" ? 0 : $byteArray["Min1"]) . $byteArray["Min2"] . ":" . ($byteArray["Sec1"] == "c" ? 0 : $byteArray["Sec1"]) . $byteArray["Sec2"];
                    $ReturnJsonToWeb = [
                        "timestamp" => time(),
                        "dAction" => "TimerUpdate",
                        "Value"   => $EventDB['Timer'],
                    ];
                    echo "Timer: " . $EventDB['Timer'] . "\n";
                    $secondMemory = $byteArray["Sec2"];
                }
                unset($byteArray);
            }
            //
            elseif ($ActionBin["Action"] == 2) {
                $byteArray = unpack("@1/h1ChetL1/h1ChetL2/h1ChetL3/h1Period/h1ChetR1/h1ChetR2/h1ChetR3/h1FolL/h1FolR",$data);
                echo "Action: 2 " . "\n";
                if($byteArray["ChetL3"] != $schetLeftMemory || $byteArray["ChetR3"] != $schetRightMemory) {
                    $EventDB['Period'] = $byteArray["Period"];
                    $EventDB['CountPlayer1'] = ($byteArray["ChetL1"] >= 1 ? $byteArray["ChetL1"] : '') . ($byteArray["ChetL2"] >= 1 ? $byteArray["ChetL2"] : '') . $byteArray["ChetL3"];
                    $EventDB['CountPlayer2'] = ($byteArray["ChetR1"] >= 1 ? $byteArray["ChetR1"] : '') . ($byteArray["ChetR2"] >= 1 ? $byteArray["ChetR2"] : '') . $byteArray["ChetR3"];
                    echo ($byteArray["ChetL1"] == "c" ? 0 : $byteArray["ChetL1"]) . ($byteArray["ChetL2"] == "c" ? 0 : $byteArray["ChetL2"]) . $byteArray["ChetL3"] . " - " . $byteArray["Period"] . " - " . ($byteArray["ChetR1"] == "c" ? 0 : $byteArray["ChetR1"]) . ($byteArray["ChetR2"] == "c" ? 0 : $byteArray["ChetR2"]) . $byteArray["ChetR3"] . " " . "\n";
                    echo $byteArray["FolL"] . " " . $byteArray["FolR"] . "\n";
                    $ReturnJsonToWeb = [
                        "timestamp"    => time(),
                        "dAction"      => "CountPlayerAll",
                        "CountPlayer1" => $EventDB['CountPlayer1'],
                        "CountPlayer2" => $EventDB['CountPlayer2'],
                        "Period"       => $EventDB['Period'],
                    ];
                    $schetLeftMemory  = $byteArray["ChetL3"];
                    $schetRightMemory = $byteArray["ChetR3"];
                }
                //$ActionBinStop = unpack("@10/h1Stop",$data);
                //echo $ActionBinStop['Stop'] . "\n";
                unset($byteArray);
            }
            if ($ActionBin["Action"] == 0) {
                $byteArray = unpack("@1/h1Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8",$data);
                echo "Action: " . $ActionBin["Action"] . " -" .$byteArray['Chet1'] . "-" .$byteArray['Chet2'] . "-" .$byteArray['Chet3'] . "-" .$byteArray['Chet4'] . "-" .$byteArray['Chet5'] . "-" .$byteArray['Chet6'] . "-" .$byteArray['Chet7'] . "-" .$byteArray['Chet8'] . "-" . "\n";
            }
            if ($ActionBin["Action"] == 3) {
                $byteArray = unpack("@1/h1Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8",$data);
                echo "Action: " . $ActionBin["Action"] . " -" .$byteArray['Chet1'] . "-" .$byteArray['Chet2'] . "-" .$byteArray['Chet3'] . "-" .$byteArray['Chet4'] . "-" .$byteArray['Chet5'] . "-" .$byteArray['Chet6'] . "-" .$byteArray['Chet7'] . "-" .$byteArray['Chet8'] . "-" . "\n";
            }
            unset($ActionBin);
            if ($ReturnJsonToWeb != '' && array_key_exists('dAction', $ReturnJsonToWeb)) {
                //var_dump($ReturnJsonToWeb);
                foreach($users as $connectionUsers) {
                    $connectionUsers['connect']->send(json_encode($ReturnJsonToWeb, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
                }
                $DBFile = fopen(__DIR__ . '/DB/DB.json', 'w');
                fwrite($DBFile, json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
                fclose($DBFile);
            }
            empty($ReturnJsonToWeb);
            $connection->send("\x15\x30\x30");
        };
        $connection->onClose = function($connection) {
            echo "Отключились от Calc. Подключаемся повторно через 5 секунд.\n";
            // Подключаемся повторно через 5 секунд
            $connection->reConnect(5);
        };
        $connection->connect();
    }
};


$ws_worker->onClose = function($connection) use(&$users, &$ini) {
    // unset parameter when user is disconnected
    unset($users[$connection->id]);
    if ($ini["PrintConsoleInfo"] == "y") {echo "Клиент отключился, с IP:" . $connection->getRemoteIp() . "\n";}
};

// Run worker
Worker::runAll();