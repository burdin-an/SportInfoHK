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
use Workerman\Connection\AsyncUdpConnection;
use Workerman\Connection\UdpConnection;

$worker = new Worker();
$worker->onWorkerStart = function()
{
    // Websocket protocol for client.
    $ws_connection = new UdpConnection("udp://255.255.255.255:55555");
    $ws_connection->onConnect = function($connection){
		echo "Мы подключились к WebSocket!\n";
        $connection->send('hello');
		echo "Мы подключились к WebSocket!\n";
    };
    $ws_connection->onMessage = function($connection, $data){
        echo "recv: $data\n";
    };
    $ws_connection->onError = function($connection, $code, $msg){
        echo "error: $msg\n";
    };
    $ws_connection->onClose = function($connection){
        echo "connection closed\n";
    };
    $ws_connection->connect();
};
Worker::runAll();
