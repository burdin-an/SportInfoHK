<?php
/**
 * Проект "Информатор спортивных соревнований: Хоккей"
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    Бурдин А.Н. <support@it-sakh.net>
 * @copyright Бурдин А.Н. <support@it-sakh.net>
 * @link      http://www.it-sakh.info/SportInfo/
 * @link      https://github.com/burdin-an/SportInfoHK
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @version   1.0.5
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

//---------------------------------
$EventsTimer = [];
$EventsType = ['min','sec','period','status','type'];
// Обрабатываем файл событий: events.ini
$EventsTimer = parse_ini_file(__DIR__ . "/Events.ini", true);
if (!is_array($EventsTimer)) {
    print_r($EventsTimer);
    echo "Файл событий отсутствует.\n";
}
foreach($EventsTimer as $key => $value) {
    if (!is_array($value)) {
        echo "Файл событий неправильный.\n";
        exit;
    }
    else {
        foreach($EventsType as $check) {
            if (array_key_exists($check, $value)) {
                if ((int)$value[$check] >= 0) {
                    //Значит всё пучком!!!
                    if (!array_key_exists('COUNT', $EventsTimer[$key])) {
                        $EventsTimer[$key]['COUNT']=0;
                    }
                    $EventsTimer[$key]['COUNT']++;
                }
                else {
                    echo "Файл событий неправильный: " . $check . ".\n";
                    exit;
                }
            }
        }
    }
}
print_r($EventsTimer);
//---------------------------------


$Start_time = 1;

$EventDB = [
    'DBVersion'   => 5,
    'dAction'     => 'None',
    'NamePlayer1' => '123',
    'NamePlayer2' => '456',
    'BoardCountStatus' => 'disable',
    'CountPlayerLeft' => [
        'Upd'   => 0,
        'Count' => -1,
    ],
    'CountPlayerRight' => [
        'Upd'   => 0,
        'Count' => -1,
    ],
    'Period' => [
        'Upd'   => 0,
        'Count' => -1,
    ],
    'TimerUpdate'   => 0,
    'TimerMinutes'  => -1,
    'TimerSecondes' => (string)'00',
    'TimerStatus'   => [
        'Upd'   => 0,
        'Count' => -1,
    ],
    'TimerType' => [
        'Upd'   => 0,
        'Count' => -1,
    ],
    'DelPlayer' => [
        'Left1'  => [
            'Upd' => 0,
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Left2'  => [
            'Upd' => 0,
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Left3'  => [
            'Upd' => 0,
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Right1' => [
            'Upd' => 0,
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Right2' => [
            'Upd' => 0,
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Right3' => [
            'Upd' => 0,
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
    ],
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
            $EventDB['TimerMinutes'] = 0;
            $EventDB['TimerSecondes'] = 0;
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction" => "TimerUpdate",
                "Value"   => (string)'00:00',
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "CountPlayer1Plus" || $data == "CountPlayer1Minus") {
            if ($data == "CountPlayer1Plus") {
                $EventDB['CountPlayerLeft']['Count']++;
            }
            elseif ($data == "CountPlayer1Minus") {
                $EventDB['CountPlayerLeft']['Count']--;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "CountPlayer1",
                "Value"     => $EventDB['CountPlayerLeft']['Count'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "CountPlayer2Plus" || $data == "CountPlayer2Minus") {
            if ($data == "CountPlayer2Plus") {
                $EventDB['CountPlayerRight']['Count']++;
            }
            elseif ($data == "CountPlayer2Minus") {
                $EventDB['CountPlayerRight']['Count']--;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "CountPlayer2",
                "Value"     => $EventDB['CountPlayerRight']['Count'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "PeriodPlus" || $data == "PeriodMinus") {
            if ($data == "PeriodPlus") {
                $EventDB['Period']['Count']++;
            }
            elseif ($data == "PeriodMinus") {
                $EventDB['Period']['Count']--;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "Period",
                "Value"     => $EventDB['Period']['Count'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "ShowBoardCount") {
            $EventDB['BoardCountStatus'] = 'active';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "BoardCountStatus" => $EventDB['BoardCountStatus'],
                "CountPlayer1"     => $EventDB['CountPlayerLeft']['Count'],
                "CountPlayer2"     => $EventDB['CountPlayerRight']['Count'],
                "NamePlayer1"      => $EventDB['NamePlayer1'],
                "NamePlayer2"      => $EventDB['NamePlayer2'],
                "Period"           => $EventDB['Period']['Count'],
                "Timer"            => $EventDB['TimerMinutes'] . ":" . ($EventDB['TimerSecondes'] < 10 ? "" . $EventDB['TimerSecondes']: $EventDB['TimerSecondes']),
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
                "CountPlayer1"     => $EventDB['CountPlayerLeft']['Count'],
                "CountPlayer2"     => $EventDB['CountPlayerRight']['Count'],
                "NamePlayer1"      => $EventDB['NamePlayer1'],
                "NamePlayer2"      => $EventDB['NamePlayer2'],
                "Period"           => $EventDB['Period']['Count'],
                "Timer"            => $EventDB['TimerMinutes'] . ":" . ($EventDB['TimerSecondes'] < 10 ? "" . $EventDB['TimerSecondes']: $EventDB['TimerSecondes']),
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
$ws_worker->onWorkerStart = function() use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users) {
    // Обрабатываем базу данных
    if (file_exists(__DIR__ . "/DB/DB.json")) {
        $tempEventDB = json_decode( file_get_contents(__DIR__ . '/DB/DB.json') , true );
        if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем базу\n";}
        if (is_array($tempEventDB) && $tempEventDB['DBVersion'] == $EventDB['DBVersion']) {
            $EventDB['NamePlayer1'] = $tempEventDB['NamePlayer1'];
            $EventDB['NamePlayer2'] = $tempEventDB['NamePlayer1'];
            if ($ini["PrintConsoleInfo"] == "y") {echo "База актуальной версии!\n";}
        }
        else {
            if ($ini["PrintConsoleInfo"] == "y") {echo "База старой версии!!!!\n";}
        }
    }
    if ($ini['HOCKEY_CONNECT']=="y") {
        //----------------------------------------------------

        echo "Мы пытаемся подключиться к Hockey!\n";
        $connection = new AsyncTcpConnection("tcp://" . $ini['HOCKEY_IP'] . ":". $ini['HOCKEY_PORT']);
        $connection->onConnect = function($connection) {
            echo "Мы подключились к Hockey!\n";
        };
        $connection->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users, &$RawInputLogFile) {
            $ReturnJsonToWeb = '';
            if ($ini["PrintConsoleInfo"] == "y") {
                //print_r (unpack("h*",$data));
            }
            $len = strlen($data);
            $Modify = 0;
            for($index = 0;          $index < $len;               $index++){
                //echo "Counter: {$index}\n";
                $d = unpack("H*data", substr($data, $index, 1));
                // Пакеты статичных строк (10 байт):
                if (hexdec($d["data"]) == 3) {
                    $byteArray = unpack("H2Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8/H2Chet9",substr($data, $index+1, 9));
                    $command = (int)hexdec($byteArray["Chet1"]);
                    if (hexdec($byteArray["Chet9"]) == 9) {
                        // Строки удалений:
                        // 101[ 1 0:00] 107[ 1 0:00]
                        // 102[ 2 0:00] 108[ 2 0:00]
                        // 103[ 3 0:00] 109[ 3 0:00]
                        $numDelPlayer = (int)($byteArray["Chet2"] . $byteArray["Chet3"]);
                        $minDelPlayer = (int)($byteArray["Chet4"] . $byteArray["Chet5"]);
                        $secDelPlayer = (int)($byteArray["Chet7"] . $byteArray["Chet8"]);
                        //echo "Counter: {$command}\n";
                        if (($command >= 149 && $command <= 151) || ($command >= 155 && $command <= 157)) {
                            if ($command == 149) {
                                $DeleteLinePlayer = 'Left1';
                            }
                            elseif ($command == 150) {
                                $DeleteLinePlayer = 'Left2';
                            }
                            elseif ($command == 151) {
                                $DeleteLinePlayer = 'Left3';
                            }
                            elseif ($command == 155) {
                                $DeleteLinePlayer = 'Right1';
                            }
                            elseif ($command == 156) {
                                $DeleteLinePlayer = 'Right2';
                            }
                            elseif ($command == 157) {
                                $DeleteLinePlayer = 'Right3';
                            }
                            // Добавляем информацию об удаленном игроке
                            if ($EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != $numDelPlayer && $numDelPlayer != 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] == 0) {
                                if ($ini["PrintConsoleInfo"] == "y") {
                                    echo "[Add Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
                                }
                                $EventDB['DelPlayer'][$DeleteLinePlayer] = [
                                    'Upd' => 1,
                                    'Num' => $numDelPlayer,
                                    'Min' => $minDelPlayer,
                                    'Sec' => $secDelPlayer,
                                    'Time' => $minDelPlayer . ":" . $secDelPlayer,
                                ];
                                $Modify = 1;
                            }
                            // Удаляем информацию об удаленном игроке
                            elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != $numDelPlayer && $numDelPlayer == 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != 0) {
                                if ($ini["PrintConsoleInfo"] == "y") {
                                    echo "[Remove Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
                                }
                                $EventDB['DelPlayer'][$DeleteLinePlayer] = [
                                    'Upd' => 2,
                                    'Num' => $numDelPlayer,
                                    'Min' => $minDelPlayer,
                                    'Sec' => $secDelPlayer,
                                    'Time' => $minDelPlayer . ":" . $secDelPlayer,
                                ];
                                $Modify = 1;
                            }
                            // Обновляем информацию об удаленном игроке
                            elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Min'] != $minDelPlayer || $EventDB['DelPlayer'][$DeleteLinePlayer]['Sec'] != $secDelPlayer) {
                                if ($ini["PrintConsoleInfo"] == "y") {
                                    echo "[Update Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
                                }
                                $EventDB['DelPlayer'][$DeleteLinePlayer] = [
                                    'Upd' => 3,
                                    'Num' => $numDelPlayer,
                                    'Min' => $minDelPlayer,
                                    'Sec' => $secDelPlayer,
                                    'Time' => $minDelPlayer . ":" . $secDelPlayer,
                                ];
                                $Modify = 1;
                            }
                        }
                        elseif ($command == 254) {
                            //echo "[Chet3.1----------------------------------------] => " . (hexdec($byteArray["Chet1"])) . "\n";
                            // 4: Флаги таймеров: 0-ой бит таймер игры идет, 2 - перерыв, 4 - правый таймаут, 8 - левый таймаут, 4 - таймер 24-сек. идет
                            if ($EventDB['TimerType']['Count'] != (int)$byteArray["Chet4"]) {
                                if ($ini["PrintConsoleInfo"] == "y") {
                                    echo "[Timer Type] => " . $byteArray["Chet4"] . "\n";
                                }
                                $EventDB['TimerType']['Count'] = (int)$byteArray["Chet4"];
                                $EventDB['TimerType']['Upd']   = 1;
                                $Modify = 1;
                            }
                            //echo "[Chet3.3] => " . hexdec($byteArray["Chet5"]) . "\n";
                            //echo "[Chet3.4] => " . hexdec($byteArray["Chet6"]) . "\n";
                            //echo "[Chet3.1----------------------------------------] <= \n";
                        }
                    }

                    $index+=9;
                }
                // Пакет таймера (10 байт):
                elseif (hexdec($d["data"]) == 1) {
                    $byteArray = unpack("h1Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8/H2Chet9",substr($data, $index+1, 9));
                    if (hexdec($byteArray["Chet9"]) == 7) {
                        // 1: Таймер игры минуты 1-ая цифра
                        // 2: Таймер игры минуты 2-ая цифра
                        $TimerMinutes = (($byteArray["Chet1"] == "c" || $byteArray["Chet1"] == "e") ? "" : $byteArray["Chet1"]) . $byteArray["Chet2"];
                        if ($EventDB['TimerMinutes'] != $TimerMinutes) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Timer Min] => ${TimerMinutes}\n";
                            }
                            $EventDB['TimerMinutes'] = $TimerMinutes;
                            $EventDB['TimerUpdate'] = 1;
                            $Modify = 1;
                        }
                        
                        // 3: Таймер игры секунды 1-ая цифра
                        // 4: Таймер игры секунды 2-ая цифра
                        $TimerSecondes = (int)($byteArray["Chet3"] . $byteArray["Chet4"]);
                        if ($EventDB['TimerSecondes'] != $TimerSecondes) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Time Sec] => ${TimerSecondes}\n";
                            }
                            $EventDB['TimerSecondes'] = $TimerSecondes;
                            $EventDB['TimerUpdate'] = 1;
                            $Modify = 1;
                        }
                        unset($TimerMinutes);
                        unset($TimerSecondes);
                        // 5: Таймер игры десятые
                        //echo "[Timer dec] => " . ($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . "\n";
                        // 6: 1 (таймер игры идет) или 2 (таймер игры не идет)
                        if ($EventDB['TimerStatus']['Count'] != (int)$byteArray["Chet6"]) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Timer Status] => " . ((int)$byteArray["Chet6"] == 1 ? "Play" : "Stop") . "\n";
                            }
                            $EventDB['TimerStatus']['Count'] = (int)$byteArray["Chet6"];
                            $EventDB['TimerStatus']['Upd'] = 1;
                            $Modify = 1;
                        }
                        // 8: Флаги сирен: 0-ой бит основная, 1 - команд, 2 - судей, 4 - 24-сек.
                        //echo "[Alarm] => " . $byteArray["Chet8"] . "\n";
                    }
                    $index+=9;
                }
                // Пакет счета (11 байт):
                elseif (hexdec($d["data"]) == 2) {
                    $byteArray = unpack("h1Chet1/h1Chet2/h1Chet3/h1Period/h1Chet5/h1Chet6/h1Chet7/h1Chet8/h1Chet9/H2Chet10",substr($data, $index+1, 10));
                    if (hexdec($byteArray["Chet10"]) == 8) {
                        // 1: Счет левой команды 1-ая цифра
                        // 2: Счет левой команды 2-ая цифра
                        // 3: Счет левой команды 3-ая цифра
                        $CountPlayerLeft = ($byteArray["Chet1"] == "c" ? "" : $byteArray["Chet1"]) . ($byteArray["Chet2"] == "c" ? "" : $byteArray["Chet2"]) . $byteArray["Chet3"];
                        if ($EventDB['CountPlayerLeft']['Count'] != $CountPlayerLeft) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Count Left] => ${CountPlayerLeft}\n";
                            }
                            $EventDB['CountPlayerLeft']['Count'] = $CountPlayerLeft;
                            $EventDB['CountPlayerLeft']['Upd'] = 1;
                            $Modify = 1;
                        }
                        unset($CountPlayerLeft);
                        // 5: Счет левой команды 1-ая цифра
                        // 6: Счет левой команды 2-ая цифра
                        // 7: Счет левой команды 3-ая цифра
                        $CountPlayerRight = ($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . ($byteArray["Chet6"] == "c" ? "" : $byteArray["Chet6"]) . $byteArray["Chet7"];
                        if ($EventDB['CountPlayerRight']['Count'] != $CountPlayerRight) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Count Right] => ${CountPlayerRight}\n";
                            }
                            $EventDB['CountPlayerRight']['Count'] = $CountPlayerRight;
                            $EventDB['CountPlayerRight']['Upd'] = 1;
                            $Modify = 1;
                        }
                        unset($CountPlayerRight);
                        // 4: Период
                        if ($EventDB['Period']['Count'] != $byteArray["Period"]) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Period] => " . $byteArray["Period"] . "\n";
                            }
                            $EventDB['Period']['Count']  = $byteArray["Period"];
                            $EventDB['Period']['Upd']  = 1;
                            $Modify = 1;
                        }
                        // 8: Фолы левой команды
                        //echo "[Foll left] => " . (hexdec($byteArray["Chet8"])-12) . "\n";
                        // 9: Фолы правой команды
                        //echo "[Foll Right] => " . (hexdec($byteArray["Chet9"])-12) . "\n";
                    }
                    $index+=10;
                }
                // Пакет названия левой команды: 4 ... 10
                elseif (hexdec($d["data"]) == 4) {
                    if ($ini["PrintConsoleInfo"] == "y") {
                        //echo "4-----------------\n";
                    }
                }
                // Пакет названия правой команды: 5 ... 11
                elseif (hexdec($d["data"]) == 5) {
                    if ($ini["PrintConsoleInfo"] == "y") {
                        //echo "5-----------------\n";
                    }
                }
                // Пакет бегущей строки: 6 ... 12
                elseif (hexdec($d["data"]) == 6) {
                    if ($ini["PrintConsoleInfo"] == "y") {
                        //echo "6-----------------\n";
                    }
                }
                if (hexdec($d["data"]) == 14) {
                    if ($Modify === 1) {
                        foreach($users as $connectionUsers) {
                            $EventDB['dAction'] = 'Update';
                            $connectionUsers['connect']->send(json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
                        }
                        $EventsExecute = [
                            "Execute" => 0,
                            "Page" => 0,
                            "Bank" => 0,
                        ];
                        foreach($EventsTimer as $key => $value) {
                            foreach($EventsType as $check) {
                                if ($check == "min" && array_key_exists($check, $value) && $value[$check] == $EventDB['TimerMinutes']) {
                                    $EventsExecute['Execute']++;
                                    if ($ini["PrintConsoleInfo"] == "y") {/* echo "Events min >>>>>>>>>>>\n";*/}
                                }
                                if ($check == "sec" && array_key_exists($check, $value) && $value[$check] == $EventDB['TimerSecondes']) {
                                    $EventsExecute['Execute']++;
                                    if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events sec >>>>>>>>>>>\n";*/}
                                }
                                if ($check == "period" && array_key_exists($check, $value)) {
                                    if (array_key_exists("periodOnlyChange", $value)) {
                                        if ($EventDB['Period']['Upd'] == 1 && $value[$check] == $EventDB['Period']['Count']) {
                                            $EventsExecute['Execute']++;
                                            if ($ini["PrintConsoleInfo"] == "y") { /* echo "Events period >>>>>>>>>>>\n"; */}
                                        }
                                    }
                                    else if ($value[$check] == $EventDB['Period']['Count']) {
                                        $EventsExecute['Execute']++;
                                        if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events period >>>>>>>>>>>\n";*/ }
                                    }
                                }
                                if ($check == "status" && array_key_exists($check, $value)) {
                                    if (array_key_exists("statusOnlyChange", $value)) {
                                        if ($EventDB['TimerStatus']['Upd'] == 1 && $value[$check] == $EventDB['TimerStatus']['Count']) {
                                            $EventsExecute['Execute']++;
                                            if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events type >>>>>>>>>>>\n";*/}
                                        }
                                    }
                                    else if ($value[$check] == $EventDB['TimerStatus']['Count']) {
                                        $EventsExecute['Execute']++;
                                        if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events type >>>>>>>>>>>\n";*/}
                                    }
                                }
                                if ($check == "type" && array_key_exists($check, $value)) {
                                    if (array_key_exists("typeOnlyChange", $value)) {
                                        if ($EventDB['TimerType']['Upd'] == 1 && $value[$check] == $EventDB['TimerType']['Count']) {
                                            $EventsExecute['Execute']++;
                                            if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events type >>>>>>>>>>>\n";*/}
                                        }
                                    }
                                    else if ($value[$check] == $EventDB['TimerType']['Count']) {
                                        $EventsExecute['Execute']++;
                                        if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events type >>>>>>>>>>>\n";*/}
                                    }
                                }
                                if ($EventsExecute['Execute'] >= 1) {
                                    $EventsExecute['Page'] = $value['page'];
                                    $EventsExecute['Bank'] = $value['bank'];
                                }
                            }
                            if ($EventsExecute['Execute'] == $EventsTimer[$key]['COUNT']) {
                                if ($ini["PrintConsoleInfo"] == "y") {
                                    echo "Events >>>>>>>>>>>\n";
                                }
                                $fp = stream_socket_client($ini['COMPANION_ADDRESS']);
                                if ($fp) {
                                    fwrite($fp, "BANK-PRESS " . $EventsExecute['Page'] . " " . $EventsExecute['Bank'] . "\n");
                                    fclose($fp);
                                }
                            }
                            echo "Events  ".$EventsExecute['Execute']. " == " . $EventsTimer[$key]['COUNT'] ."  >>>>>>>>>>>\n";
                            $EventsExecute = [
                                "Execute" => 0,
                                "Page" => 0,
                                "Bank" => 0,
                            ];
                        }
                        
                        $EventDB['CountPlayerLeft']['Upd'] = 0;
                        $EventDB['CountPlayerRight']['Upd'] = 0;
                        $EventDB['Period']['Upd'] = 0;
                        $EventDB['TimerStatus']['Upd'] = 0;
                        $EventDB['TimerUpdate'] = 0;
                        $EventDB['TimerType']['Upd'] = 0;
                        $EventDB['DelPlayer']['Left1']['Upd'] = 0;
                        $EventDB['DelPlayer']['Left2']['Upd'] = 0;
                        $EventDB['DelPlayer']['Left3']['Upd'] = 0;
                        $EventDB['DelPlayer']['Right1']['Upd'] = 0;
                        $EventDB['DelPlayer']['Right2']['Upd'] = 0;
                        $EventDB['DelPlayer']['Right3']['Upd'] = 0;
                        $EventDB['dAction'] = 'None';
                        if ($ini["PrintConsoleInfo"] == "y") {
                            echo "Данные отправлены>>>>>>>>>>>\n";
                        }
                    }
                }
            }
            $connection->send("\x15\x30\x30");
        };
        $connection->onClose = function($connection) use (&$ini) {
            if ($ini["PrintConsoleInfo"] == "y") { echo "Отключились от хоккейного сервера управления. Подключаемся повторно через 5 секунд.\n"; }
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