
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
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @version   1.0.1
 */

$(document).ready(function(){
    var PlayerData = [];
    function SendMessage(inputAction,JsonOut) {
        let ws;
        ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
        ws.onopen = function() {
            if (debuging != false) {console.log('WebSocket connected');};
            if (JsonOut) {
                ws.send(JSON.stringify(inputAction));
            }
            else {
                ws.send(inputAction);
            }
            ws.close();
        };
        ws.onerror = function(err) {
            if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
            ws.close();
        };
    }
    function GetPlayer() {
        let ws;
        ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
        ws.onopen = function() {
            if (debuging != false) {console.log('WebSocket Player connected');};
            var msg = {
                "Action": "GetPlayer"
            };
            ws.send(JSON.stringify(msg));
        };
        ws.onmessage = function(evt) {
            JSONData = JSON.parse(evt.data);
            // Команды
            for (const [Key, Value] of Object.entries(JSONData.Player)) {
                $("#InputNamePlayerLeft" ).append( "<option value='" + Key + "'>" + Value.FullName + " (" + Value.Desc + ")</option>" );
                $("#InputNamePlayerRight").append( "<option value='" + Key + "'>" + Value.FullName + " (" + Value.Desc + ")</option>" );
            }
            // Название игры
            for (const [Key, Value] of Object.entries(JSONData.GameName)) {
                $("#InputGameName").append( "<option value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
            }
            // Место проведения игры
            for (const [Key, Value] of Object.entries(JSONData.GamePlace)) {
                $("#InputGamePlace").append( "<option value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
            }
            ws.close();
        };
        ws.onerror = function(err) {
            if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
            ws.close();
        };
    }
    $("a.ActionButton").click(function(event) {
        SendMessage(event.target.id,false);
    });
    $("#SendNamePlayerLeft").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputNamePlayerLeft").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputNamePlayerLeft").value = "";
    });
    $("#SendNamePlayerRight").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputNamePlayerRight").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputNamePlayerRight").value = "";
    });
    $("#SendTimer").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputTimer").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputTimer").value = "";
    });
    $("#SendGameName").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputGameName").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputGameName").value = "";
    });
    $("#SendGameDate").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputGameDate").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputGameDate").value = "";
    });
    $("#SendGameTime").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputGameTime").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputGameTime").value = "";
    });
    $("#SendGamePlace").click(function(event) {
        SendMessage({
            Action: event.target.id,
            Value: document.getElementById("InputGamePlace").value
        },true);
        // Очистите элемент ввода текста, чтобы получить следующую строку текста от пользователя.
        document.getElementById("InputGamePlace").value = "";
    });
    GetPlayer();
});
