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
		//echo $data . "\n";
		/*$d = unpack("h1Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8/h1Chet9/h1Chet10/h1Chet11/h1Chet12/h1Chet13/h1Chet14/h1Chet15/h1Chet16/h1Chet17/h1Chet18/h1Chet19",$data);            
		echo $d["Chet1"] . "-" . $d["Chet2"] . "-" . $d["Chet3"] . "-" . $d["Chet4"] . "-" . $d["Chet5"] . "-" . $d["Chet6"] . "-" . $d["Chet7"] . "-" . $d["Chet8"] . "-" . $d["Chet9"] . "-" . $d["Chet10"] . "-" . $d["Chet11"] . "-" . $d["Chet12"] . "-" . $d["Chet13"] . "-" . $d["Chet14"] . "->" . $d["Chet15"] . "-" . $d["Chet16"] . "-" . $d["Chet17"] . "-" . $d["Chet18"] . "-" . $d["Chet19"] . "\n";
		*/
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
		$command2 = unpack("H*Chet",substr($data, 24, 1));
		$GameMode = (int)hexdec($command2["Chet"]);
		echo "Game Mode: " . $GameMode . "\n";

		$TimeMin = substr($data, 111, 2);
		echo "Время (мин.): " . $TimeMin . "\n";
		$TimeSec = substr($data, 114, 2);
		echo "Время (сек.): " . $TimeSec . "\n";
		$SchetLeft = substr($data, 117, 2);
		echo "Счёт левый: " . $SchetLeft . "\n";
		$SchetRight = substr($data, 121, 1);
		//$d = unpack("H1data", substr($data, 120, 2));
		//$SchetRight = $d["data"];
		//$SchetRight = " ";
		echo "Счёт правый: =" . $SchetRight . "-\n";
		$ReturnJsonToWeb = [
			"Action" => "Update",
			"Min" => $TimeMin,
			"Sec" => $TimeSec,
			"SchetLeft" => $SchetLeft,
			"SchetRight" => $SchetRight,
			"Period" => $GameMode,
		];
		$len = strlen($data);
		for($index = 0;          $index < $len;               $index++){
			$command3 = substr($data, $index, 1);
			//echo "Index" . $index .": " .$command3 . "\n";
		}
		$fp = stream_socket_client("udp://127.0.0.1:8201", $errno, $errstr);
		if (!$fp) {
			echo "ОШИБКА: $errno - $errstr<br />\n";
		} else {
			echo "ОШИБКА1: \n";
			fwrite($fp, json_encode($ReturnJsonToWeb));
			fclose($fp);
		}
		//$connection->send(json_encode($ReturnJsonToWeb));
		echo "\n";
	}
}

