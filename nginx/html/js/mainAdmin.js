
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
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @version   1.0.1
 */

// Порт для Web Socket
const WebSocketPort = 8200;
// Отладочная информация
var debuging = true;
$(document).ready(function(){
    let ws;
    function connect() {
        ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
        ws.onopen = function() {
            if (debuging != false) {console.log('WebSocket connected');};

        };
        ws.onclose = function(e) {
            EventDB = [];
            if (debuging != false) {console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);};
            setTimeout(function() {
                connect();
            }, 1000);
        };

        ws.onerror = function(err) {
            if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
            ws.close();
        };
    }
    

    connect();
    /* Показать счёт */
    $('#ShowBoardCount').click(function() {
        ws.send("ShowBoardCount");
    });
    /* Скрыть счёт */
    $('#HideBoardCount').click(function() {
        ws.send("HideBoardCount");
    });
    /* Прибавить гол первой команде */
    $('#CountPlayer1Plus').click(function() {
        ws.send("CountPlayer1Plus");
    });
    /* Вычесть гол первой команде */
    $('#CountPlayer1Minus').click(function() {
        ws.send("CountPlayer1Minus");
    });
    /* Прибавить гол второй команде */
    $('#CountPlayer2Plus').click(function() {
        ws.send("CountPlayer2Plus");
    });
    /* Вычесть гол второй команде */
    $('#CountPlayer2Minus').click(function() {
        ws.send("CountPlayer2Minus");
    });
    /* Прибавить период */
    $('#PeriodPlus').click(function() {
        ws.send("PeriodPlus");
    });
    /* Вычесть период */
    $('#PeriodMinus').click(function() {
        ws.send("PeriodMinus");
    });

    $('#Clear').click(function(s) {
        ws.send("Clear");
    });
    $('#ClearTablo').click(function(s) {
        ws.send("ClearTablo");
    });
    $('#ClearTV').click(function(s) {
        ws.send("ClearTV");
    });
    $('#ReloadTablo').click(function() {
        ws.send("ReloadTablo");
    });
    $('#ReloadTV').click(function() {
        ws.send("ReloadTV");
    });
    $('#XXXXXXX').click(function() {
        ws.send("XXXXXXX");
    });
});
