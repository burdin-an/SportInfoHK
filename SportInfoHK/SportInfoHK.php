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


function FuncWorks($data, $connection) {
    global $EventDB;
    global $users;

    if (!empty($data)) {
        /**************** Наполняем базу 2 убрали счёт ********************************/
        $ReturnJsonToWeb = [];
        $data = rtrim($data);
        $dataJson = json_decode($data, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            // Данные в JSON формате
            if ($dataJson['Action'] == 'TimerStart') {
                $EventDB['NamePlayer1'] = $dataJson['Value'];
            }
            elseif ($dataJson['Action'] == 'TimerStart') {
                $EventDB['NamePlayer1'] = $dataJson['Value'];
            }
            elseif ($dataJson['Action'] == 'SendNamePlayerOne') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['NamePlayer1'] = $dataJson['Value'];
                $ReturnJsonToWeb = ActionReloadTV();
            }
            elseif ($dataJson['Action'] == 'SendNamePlayerTwo') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['NamePlayer2'] = $dataJson['Value'];
                $ReturnJsonToWeb = ActionReloadTV();
            }
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
            echo "Action: " . $dataJson['Action'] .  ";\n";
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

require_once __DIR__ . '/vendor/autoload.php';
use Workerman\Worker;
$ws_worker = new Worker("websocket://0.0.0.0:" . $ini["WebSocketPort"]);

// Тут храним пользовательские соединения
$users = [];

$ws_worker->onConnect = function($connection) use (&$users, &$ini) {
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
                if ($ini["PrintConsoleInfo"] == 1) {echo "Пользователь Администратор\n";}
            }
            else {
                $users[$connection->id]['admin'] = 0;
                echo "Пользователь НЕ Администратор\n";
            }
        }
        else {
            $users[$connection->id]['admin'] = 0;
            echo "Пользователь НЕ Администратор\n";
        }
    };
    echo "Клиент подключился, с IP:" . $connection->getRemoteIp() . "\n";
};

$ws_worker->onMessage = function($connection, $data) use (&$users, &$EventDB, &$ini) {
    if ($users[$connection->id]['admin'] == 1) {
        if (in_array('All', $users[$connection->id]['role'], true)) {
            echo "---------------------------------------------------------------------\n";
            echo "У пользователя полные права\n";
            FuncWorks($data, $connection);
        }
        else {
            echo "У пользователя нет прав на выполнение команд!\n";
        }
    }
};
// it starts once when you start server.php:
$ws_worker->onWorkerStart = function() use (&$EventDB) {
    // Обрабатываем базу данных
    if (file_exists(__DIR__ . "/DB/DB.json")) {
        $EventDB = json_decode( file_get_contents(__DIR__ . '/DB/DB.json') , true );
        echo "Читаем базу\n";
    }
};
$ws_worker->onClose = function($connection) use(&$users) {
    // unset parameter when user is disconnected
    unset($users[$connection->id]);
    echo "Клиент отключился, с IP:" . $connection->getRemoteIp() . "\n";
};
// Run worker
Worker::runAll();