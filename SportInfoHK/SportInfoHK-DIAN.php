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
use Workerman\Connection\TcpConnection;


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
    'modify'           => 0,
    'CountPlayerLeft'  => -1,
    'CountPlayerRight' => -1,
    'Period'           => -1,
    'TimerMinutes'     => -1,
    'TimerSecondes'    => (string)'00',
    'TimerStatus'      => -1,
    'TimerType'        => -1,
    'DelPlayer'        => [
        'Left1'  => [
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Left2'  => [
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Left3'  => [
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Right1' => [
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Right2' => [
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
        'Right3' => [
            'Num' => 0,
            'Min' => 0,
            'Sec' => 0,
        ],
    ],
];

$fp = stream_socket_client("tcp://" . $ini['HOCKEY_IP'] . ":". $ini['HOCKEY_PORT'], $errno, $errstr, 30);
if (!$fp) {
    echo "$errstr ($errno)<br />\n";
} else {
    while (!feof($data = fread($fp, 34))) {
        $ReturnJsonToWeb = '';
        $len = strlen($data);
        for($index = 0;          $index < $len;               $index++){
            //echo "Counter: {$index}\n";
            $d = unpack("H*data", substr($data, $index, 1));
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
                        if ($EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != $numDelPlayer && $numDelPlayer != 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] == 0) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Add Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
                            }
                            $EventDB['DelPlayer'][$DeleteLinePlayer] = [
                                'Num' => $numDelPlayer,
                                'Min' => $minDelPlayer,
                                'Sec' => $secDelPlayer,
                            ];
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'AddDeletePlayer.'.$DeleteLinePlayer;
                        }
                        elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != $numDelPlayer && $numDelPlayer == 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != 0) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Remove Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
                            }
                            $EventDB['DelPlayer'][$DeleteLinePlayer] = [
                                'Num' => $numDelPlayer,
                                'Min' => $minDelPlayer,
                                'Sec' => $secDelPlayer,
                            ];
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'RemoveDeletePlayer.'.$DeleteLinePlayer;
                        }
                        elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Min'] != $minDelPlayer || $EventDB['DelPlayer'][$DeleteLinePlayer]['Sec'] != $secDelPlayer) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Update Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
                            }
                            $EventDB['DelPlayer'][$DeleteLinePlayer] = [
                                'Num' => $numDelPlayer,
                                'Min' => $minDelPlayer,
                                'Sec' => $secDelPlayer,
                            ];
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'UpdateDeletePlayer.'.$DeleteLinePlayer;
                        }
                        //print_r($EventDB);
                    }
                    elseif ($command == 254) {
                        //print_r($byteArray);
                        //echo "[Chet3.1----------------------------------------] => " . (hexdec($byteArray["Chet1"])) . "\n";
                        // 4: Флаги таймеров: 0-ой бит таймер игры идет, 1 - перерыв, 4 - правый таймаут, 8 - левый таймаут, 4 - таймер 24-сек. идет
                        if ($EventDB['TimerType'] != (int)$byteArray["Chet4"]) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Chet3.254] => " . $byteArray["Chet4"] . "\n";
                            }
                            $EventDB['TimerType'] = (int)$byteArray["Chet4"];
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
                        }
                        //echo "[Chet3.3] => " . hexdec($byteArray["Chet5"]) . "\n";
                        //echo "[Chet3.4] => " . hexdec($byteArray["Chet6"]) . "\n";
                        //echo "[Chet3.1----------------------------------------] <= \n";
                    }
                }

                $index+=9;
            }
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
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
                        }
                        unset($TimerMinutes);
                        // 3: Таймер игры секунды 1-ая цифра
                        // 4: Таймер игры секунды 2-ая цифра
                        $TimerSecondes = (int)($byteArray["Chet3"] . $byteArray["Chet4"]);
                        if ($EventDB['TimerSecondes'] != $TimerSecondes) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Time Sec] => ${TimerSecondes}\n";
                            }
                            $EventDB['TimerSecondes'] = $TimerSecondes;
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
                        }
                        unset($TimerSecondes);
                        // 5: Таймер игры десятые
                        //echo "[Timer dec] => " . ($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . "\n";
                        // 6: 1 (таймер игры идет) или 2 (таймер игры не идет)
                        if ($EventDB['TimerStatus'] != (int)$byteArray["Chet6"]) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Timer Status] => " . ((int)$byteArray["Chet6"] == 1 ? "Play" : "Stop") . "\n";
                            }
                            $EventDB['TimerStatus'] = (int)$byteArray["Chet6"];
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
                        }
                        unset($TimerMinutes);
                        // 8: Флаги сирен: 0-ой бит основная, 1 - команд, 2 - судей, 4 - 24-сек.
                        //echo "[Alarm] => " . $byteArray["Chet8"] . "\n";
                }
                $index+=9;
            }
            elseif (hexdec($d["data"]) == 2) {
                $byteArray = unpack("h1Chet1/h1Chet2/h1Chet3/h1Period/h1Chet5/h1Chet6/h1Chet7/h1Chet8/h1Chet9/H2Chet10",substr($data, $index+1, 10));
                if (hexdec($byteArray["Chet10"]) == 8) {
                        // 1: Счет левой команды 1-ая цифра
                        // 2: Счет левой команды 2-ая цифра
                        // 3: Счет левой команды 3-ая цифра
                        $CountPlayerLeft = ($byteArray["Chet1"] == "c" ? "" : $byteArray["Chet1"]) . ($byteArray["Chet2"] == "c" ? "" : $byteArray["Chet2"]) . $byteArray["Chet3"];
                        if ($EventDB['CountPlayerLeft'] != $CountPlayerLeft) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Count Left] => ${CountPlayerLeft}\n";
                            }
                            $EventDB['CountPlayerLeft'] = $CountPlayerLeft;
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
                        }
                        unset($CountPlayerLeft);
                        // 5: Счет левой команды 1-ая цифра
                        // 6: Счет левой команды 2-ая цифра
                        // 7: Счет левой команды 3-ая цифра
                        $CountPlayerRight = ($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . ($byteArray["Chet6"] == "c" ? "" : $byteArray["Chet6"]) . $byteArray["Chet7"];
                        if ($EventDB['CountPlayerRight'] != $CountPlayerRight) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Count Right] => ${CountPlayerRight}\n";
                            }
                            $EventDB['CountPlayerRight'] = $CountPlayerRight;
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
                        }
                        unset($CountPlayerRight);
                        // 4: Период
                        if ($EventDB['Period'] != $byteArray["Period"]) {
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "[Period] => " . $byteArray["Period"] . "\n";
                            }
                            $EventDB['Period']  = $byteArray["Period"];
                            $EventDB['modify'] = 1;
                            $EventDB['Action'] = 'Update';
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
                    echo "4-----------------\n";
                }
            }
            // Пакет названия правой команды: 5 ... 11
            elseif (hexdec($d["data"]) == 5) {
                if ($ini["PrintConsoleInfo"] == "y") {
                    echo "5-----------------\n";
                }
            }
            // Пакет бегущей строки: 6 ... 12
            elseif (hexdec($d["data"]) == 6) {
                if ($ini["PrintConsoleInfo"] == "y") {
                    echo "6-----------------\n";
                }
            }
            if (hexdec($d["data"]) == 14) {
                if ($EventDB['modify'] == 1) {

                }
                echo "-\n";
            }
            //echo hexdec($d["data"]) . "-";
        }
        //print_r($EventDB);
        if ($fp) {
            echo "$errstr ($errno)<br />\n";
            fwrite($fp, "\x15\x30\x30");
        }
    }
    fclose($fp);
}

// Run worker
Worker::runAll();