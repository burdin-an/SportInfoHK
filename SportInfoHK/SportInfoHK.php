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
    'BoardCountStatus'   => 'disable',
];

$timeOldCheckAction = -1;
//Start List (STL) Стартовый лист
//Warm Group (WUP) Список группы разминки
//3nd Score (3SC) Список промежуточных результатов соревнования
function ActionGroup($CommandAction,$ParticipantID) {
    global $EventDB;
    $ReturnJsonToWeb = [
        "timestamp"    => time(),
        "EventName"  => (string)$EventDB["Name"],
        "pCategory"  => (string)$EventDB["Category"]["Name"],
        "pSegment"   => (string)$EventDB["Segment"]["Name"],
        "pParticipant" => [],
    ];

    echo "---------------------------------------------------------------------\n";
    if ($CommandAction == 'STL') {
        $ReturnJsonToWeb["dAction"] = 'STL';
        echo "Action: STL;\n";
    }
    elseif ($CommandAction == 'WUP') {
        $ReturnJsonToWeb["dAction"] = 'WUP';
        $ReturnJsonToWeb["pCurrentGroup"] = (int)$EventDB['Participants']["p-" . $ParticipantID]['GroupNumber'];
        echo "Action: WUP;\n";
        echo "CurrentGroupNumber: "  . $ReturnJsonToWeb["pGroup"] . ";\n";
    }
    elseif ($CommandAction == '3SC') {
        $ReturnJsonToWeb["dAction"] = '3SC';
        echo "Action: 3SC;\n";
    }
    elseif ($CommandAction == 'IRS') {
        $ReturnJsonToWeb["dAction"] = 'IRS';
        echo "Action: IRS;\n";
    }
    elseif ($CommandAction == 'RES') {
        $ReturnJsonToWeb["dAction"] = 'RES';
        echo "Action: RES;\n";
    }

    echo "EventName: " . $ReturnJsonToWeb['EventName'] . ";\n";
    echo "CategoryName: " . $ReturnJsonToWeb['pCategory'] . ";\n";
    echo "SegmentName: " . $ReturnJsonToWeb['pSegment'] . ";\n";

    foreach ($EventDB['Participants'] as $ParticipantStr) {
        if ($CommandAction == 'STL' || $CommandAction == 'WUP') {
            $idLine = (int)$ParticipantStr['StartNumber'];
        }
        elseif ($CommandAction == '3SC' || $CommandAction == 'IRS' || $CommandAction == 'RES') {
            $idLine = (int)$ParticipantStr['TSort'];
        }
        //Для WUP (Группа разминки)
        //Пропускаем участника не из своей группы разминки
        if ($CommandAction == 'WUP' && $ReturnJsonToWeb["pCurrentGroup"] != $ParticipantStr['GroupNumber']) {
            //echo "StartNumber: "  . $ParticipantStr['StartNumber'] . ";\n";
            //echo "GroupNumber: "  . $ParticipantStr['GroupNumber'] . ";\n";
            continue;
        }

        $ReturnJsonToWeb["pParticipant"][$idLine] = [
            "ID"           => $ParticipantStr["ID"],
            "pStartNumber" => (int)$ParticipantStr["StartNumber"],
            "pGroupNumber" => (int)$ParticipantStr["GroupNumber"],
            "pFullName"    => (string)$ParticipantStr["FullName"],
            "pNation"      => (string)$ParticipantStr["Nation"],
            "pClub"        => (string)$ParticipantStr["Club"],
            "pCity"        => (string)$ParticipantStr["City"],
            "pTRank"       => (int)$ParticipantStr["TRank"],
            "pTPoint"      => (string)$ParticipantStr["TPoint"],
            "pTSort"       => (int)$ParticipantStr["TSort"],
            "pStatus"      => (string)$ParticipantStr["Status"],
            "pCurrent"     => 2
        ];
        if ($ParticipantStr['ID'] === (int)$ParticipantID) {
            $ReturnJsonToWeb["pParticipant"][$idLine]["pCurrent"]  = 1;
        }

        echo "-----------------\n";
        echo "StartLine: "    . $idLine . ";\n";
        echo "ID: "           . $ReturnJsonToWeb["pParticipant"][$idLine]['ID'] . ";\n";
        echo "StartNumber: "  . $ReturnJsonToWeb["pParticipant"][$idLine]['pStartNumber'] . ";\n";
        echo "GroupNumber: "  . $ReturnJsonToWeb["pParticipant"][$idLine]['pGroupNumber'] . ";\n";
        echo "FullName: "     . $ReturnJsonToWeb["pParticipant"][$idLine]['pFullName'] . ";\n";
        echo "Nation: "       . $ReturnJsonToWeb["pParticipant"][$idLine]['pNation'] . ";\n";
        echo "Club: "         . $ReturnJsonToWeb["pParticipant"][$idLine]['pClub'] . ";\n";
        echo "City: "         . $ReturnJsonToWeb["pParticipant"][$idLine]['pCity'] . ";\n";
        echo "TRank: "        . $ReturnJsonToWeb["pParticipant"][$idLine]['pTRank'] . ";\n";
        echo "TPoint: "       . $ReturnJsonToWeb["pParticipant"][$idLine]['pTPoint'] . ";\n";
        echo "TSort: "        . $ReturnJsonToWeb["pParticipant"][$idLine]['pTSort'] . ";\n";
        echo "Status: "       . $ReturnJsonToWeb["pParticipant"][$idLine]['pStatus'] . ";\n";
        if ($CommandAction == '3SC' || $CommandAction == 'IRS' || $CommandAction == 'RES') {
            echo "Current: "  . $ReturnJsonToWeb["pParticipant"][$idLine]["pCurrent"] . ";\n";
        }
    }
    ksort($ReturnJsonToWeb["pParticipant"],0);
    return $ReturnJsonToWeb;
}

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
//Очистить титры: Персональные данные
function ActionClearTVPersonal() {
    echo "Очистка экрана\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "ClearTVPersonal",
    ];
}
//Очистить титры: Группы
function ActionClearTVGroup() {
    echo "Очистка титры: Группы\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "ClearTVGroup",
    ];
}
//Очистить титры: Название соревнования (Segment)
function ActionClearTVSegment() {
    echo "Очистка титры: Название соревнования (Segment)\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "ClearTVSegment",
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
        /**************** Наполняем базу 2 ********************************/
        $ReturnJsonToWeb = [];
        
        if ($data == "CountPlayer1Plus" || $data == "CountPlayer1Minus") {
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
        elseif ($data == "Segment") {
            echo "---------------------------------------------------------------------\n";
            echo "ADMIN ACTION: Segment\n";
            $ReturnJsonToWeb = ActionSegment();
        }
        //Очистить всё
        elseif ($data == "Clear") {
            echo "---------------------------------------------------------------------\n";
            echo "ADMIN ACTION: Clear All\n";
            $ReturnJsonToWeb = ActionClearAll();
        }
        //Очистить Титры
        elseif ($data == "ClearTV") {
            echo "---------------------------------------------------------------------\n";
            echo "ADMIN ACTION Clear TV\n";
            $ReturnJsonToWeb = ActionClearTV();
        }
        //Перезагрузка титров
        elseif ($data == "ReloadTV") {
            echo "---------------------------------------------------------------------\n";
            echo "ADMIN ACTION: Reload TV\n";
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

if ($ini['WriteRawInput'] == 1) {
    $RawInputLogFile = fopen(__DIR__ . '/logs/RawInput-' . date('Y-m-d') . '-' . rand() . '.log', 'w');
}

require_once __DIR__ . '/vendor/autoload.php';
use Workerman\Worker;
use Workerman\Connection\AsyncTcpConnection;
//TcpConnection::$defaultMaxSendBufferSize = 2*1024*1024;
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
    echo "Клиент WebSocket Подключился, с IP:" . $connection->getRemoteIp() . "\n";
};

$ws_worker->onMessage = function($connection, $data) use (&$users) {
    global $EventDB;
    global $ini;
    if ($users[$connection->id]['admin'] == 1) {
        if (in_array('None',    $users[$connection->id]['role'], true)) {
            echo "---------------------------------------------------------------------\n";
            echo "У пользователя нет никаких прав\n";
        }
        elseif (in_array('All', $users[$connection->id]['role'], true)) {
            echo "---------------------------------------------------------------------\n";
            echo "У пользователя полные права\n";
            FuncWorks($data, $connection);
        }
        elseif (($data == "CountPlayer1Plus" || $data == "CountPlayer1Minus" || $data == "CountPlayer2Plus" || $data == "CountPlayer2Minus") && false !== array_search('CountPlayer', $users[$connection->id]['role'])) {
            FuncWorks($data, $connection);
        }
        elseif (($data == "PeriodPlus" || $data == "PeriodMinus") && false !== array_search('Period', $users[$connection->id]['role'])) {
            FuncWorks($data, $connection);
        }
        else {
            echo "У пользователя нет прав на выполнение данной команды или нет такой команды!\n";
        }
    }
};

$ws_worker->onClose = function($connection) use(&$users) {
    // unset parameter when user is disconnected
    unset($users[$connection->id]);
    echo "Клиент WebSocket Отключился, с IP:" . $connection->getRemoteIp() . "\n";
};

// Run worker
Worker::runAll();