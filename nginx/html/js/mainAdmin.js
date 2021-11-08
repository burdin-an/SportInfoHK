
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
    function SendMessage(inputAction) {
        let ws;
        ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
        ws.onopen = function() {
            if (debuging != false) {console.log('WebSocket connected');};
            ws.send(inputAction);
            ws.close();
        };
        ws.onerror = function(err) {
            if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
            ws.close();
        };
    }
    $("a.ActionButton").click(function(event) {
        SendMessage(event.target.id);
    });
    $("#SendNamePlayerOne").click(function(event) {
        var msg = {
            Action: event.target.id,
            Value: document.getElementById("InputNamePlayerOne").value
        };
        SendMessage(JSON.stringify(msg));
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputNamePlayerOne").value = "";
    });
    $("#SendNamePlayerTwo").click(function(event) {
        var msg = {
            Action: event.target.id,
            Value: document.getElementById("InputNamePlayerTwo").value
        };
        SendMessage(JSON.stringify(msg));
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputNamePlayerTwo").value = "";
    });
    $("#SendTimer").click(function(event) {
        var msg = {
            Action: event.target.id,
            Value: document.getElementById("InputTimer").value
        };
        SendMessage(JSON.stringify(msg));
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputTimer").value = "";
    });
});
