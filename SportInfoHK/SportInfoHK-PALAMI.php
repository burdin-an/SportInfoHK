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

echo "Мы пытаемся подключиться к Hockey!\n";

//Create socket.
$socket = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
if (!$socket) { die("socket_create failed.\n"); }

//Set socket options.
socket_set_nonblock($socket);
socket_set_option($socket, SOL_SOCKET, SO_BROADCAST, 1);
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
if (defined('SO_REUSEPORT'))
	socket_set_option($socket, SOL_SOCKET, SO_REUSEPORT, 1);

//Bind to any address & port 55555.
if(!socket_bind($socket, '0.0.0.0', 55555))
	die("socket_bind failed.\n");


//Wait for data.
$read = array($socket);
$write = NULL; $except = NULL;
while(socket_select($read, $write, $except, NULL)) {

	//Read received packets with a maximum size of 5120 bytes.
	while(is_string($data = socket_read($socket, 5120))) {

		$command1 = unpack("h1Chet1",substr($data, 4, 1));
					
		if ($command1["Chet1"] == 1) {
			echo "Идет игра\n";
		}
		elseif ($command1["Chet1"] == 2) {
			echo "Идет таймаут\n";
		}
		elseif ($command1["Chet1"] == 3) {
			echo "Время стоит\n";
		}
		$TimerStatus = (int)$command1["Chet1"];
		$command2 = unpack("H*Chet",substr($data, 24, 1));
		$GameMode = (int)hexdec($command2["Chet"]);
		echo "Game Mode: " . $GameMode . "\n";

		$TimeMin  = substr($data, 111, 2);
		echo "Время (мин.): " . $TimeMin . "\n";
		$TimeSec = substr($data, 114, 2);
		echo "Время (сек.): " . $TimeSec . "\n";
		echo "-------------------: " . mb_ord(substr($data, 118, 1), "UTF-8") . "\n";
		$command3 = unpack("H*Chet",substr($data, 118, 1));
		$GameMode1 = (int)hexdec($command3["Chet"]);
		echo "Game Mode2: " . $GameMode1 . "\n";
		
		$SchetLeft_first  = substr($data, 117, 1);
		$SchetLeft_second = substr($data, 118, 1);
		
		if (mb_ord($SchetLeft_second, "UTF-8") == 0) {$SchetLeft_second = -1;}

		if ($SchetLeft_second == -1 || ($SchetLeft_first > 2 && $SchetLeft_second == 0) || ($SchetLeft_first == 0 && $SchetLeft_second == 0)) {
			$SchetLeft = $SchetLeft_first;
		}
		else {
			$SchetLeft = $SchetLeft_first.$SchetLeft_second;
		}
		echo "Счёт левый: " . $SchetLeft . "\n";
		//$SchetRight = substr($data, 121, 1);
		$SchetRight_first  = substr($data, 120, 1);
		$SchetRight_second = substr($data, 121, 1);
		
		if (mb_ord($SchetRight_second, "UTF-8") == 0) {$SchetRight_second = -1;}

		if ($SchetRight_second == -1 || ($SchetRight_first > 2 && $SchetRight_second == 0) || ($SchetRight_first == 0 && $SchetRight_second == 0)) {
			$SchetRight = $SchetRight_first;
		}
		else {
			$SchetRight = $SchetRight_first.$SchetRight_second;
		}
		echo "Счёт правый: " . $SchetRight . "\n";
		$ReturnJsonToWeb = [
			"Action" => "UpdateExternal",
			"Min" => (int)$TimeMin,
			"Sec" => (int)$TimeSec,
			"SchetLeft" => (int)$SchetLeft,
			"SchetRight" => (int)$SchetRight,
			"Period" => $GameMode,
			"TimerStatus" => $TimerStatus
		];
		$len = strlen($data);
		for($index = 0;          $index < $len;               $index++){
			$command3 = substr($data, $index, 1);
			//echo "Index" . $index .": " .$command3 . "\n";
		}
		$fp = stream_socket_client("tcp://127.0.0.1:8202", $errno, $errstr);
		if (!$fp) {
			echo "ОШИБКА: $errno - $errstr<br />\n";
		} else {
			echo "Отправка: \n";
			fwrite($fp, json_encode($ReturnJsonToWeb));
			fclose($fp);
		}
		//$connection->send(json_encode($ReturnJsonToWeb));
		echo "\n";
	}
}

