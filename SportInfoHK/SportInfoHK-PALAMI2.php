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

// #### create socket and listen 1234 port ####
$udp_worker = new Worker('tcp://0.0.0.0:8202');

// 4 processes
$udp_worker->count = 4;
// Тут храним пользовательские соединения
$users = [];

// Emitted when new connection come
$udp_worker->onConnect = function ($connection) use (&$users) {
    echo "New Connection: " . $connection->id . "\n";
	$users[$connection->id]['connect'] = $connection;
};

// Emitted when data received
$udp_worker->onMessage = function ($connection, $data) use (&$users) {
	if (strlen($data) == 5 && $data == "Tablo") {
		$users[$connection->id]['Tablo'] = 1;
		echo "Tablo \n";
	}
	else {
		// Send data to client
		foreach($users as $connection) {
			if (array_key_exists('Tablo', $connection) && $connection['Tablo'] == 1) {
				$connection['connect']->send($data);
				echo "Hello $data \n";
			}
		}
	}
};

// Emitted when connection is closed
$udp_worker->onClose = function ($connection) use (&$users) {
	unset($users[$connection->id]);
    echo "Connection closed: " . $connection->id . "\n";
};

// Run worker
Worker::runAll();
