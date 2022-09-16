
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
    function SendOrGetData(Action,SendJson,JsonDataOut) {
        let ws;
        ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
        ws.onopen = function() {
            if (debuging != false) {console.log('WebSocket Player connected');};
			var msg = {
				"Action": Action
			};
			if (Action == "GetPlayer") {
				ws.send(JSON.stringify(msg));
			}
			else {
				if (SendJson && JsonDataOut) {
					ws.send(JSON.stringify(Object.assign({},msg, JsonDataOut)));
				}
				else {
					ws.send(Action);
				}
				ws.close();
			}

			var tagBlockContext = document.getElementById('BlockContext');
			if (tagBlockContext) {
				tagBlockContext.remove(); // Удалит элемент div с идентификатором 'div-02'
			}
        };
        ws.onmessage = function(evt) {
            JSONData = JSON.parse(evt.data);
			if (Action == "GetPlayer") {
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
			}
            ws.close();
        };
        ws.onerror = function(err) {
            if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
            ws.close();
			var tagBlockContext = document.createElement("div");
			tagBlockContext.setAttribute("id","BlockContext");
			var textBlockContext = document.createTextNode("Нет подключения");
			tagBlockContext.appendChild(textBlockContext);
			document.body.insertBefore(tagBlockContext, document.body.firstChild);
			/*document.body.prepend(tagBlockContext);*/
        };
    }
    $("a.ActionButton").click(function(event) {
        SendOrGetData(event.target.id,false);
    });
    $("button.ActionJsonButton").click(function(event) {
        SendOrGetData(event.target.id,true,{
            Value: document.getElementById(event.target.dataset.parent).value
        });
        document.getElementById(event.target.dataset.parent).value = "";
    });
    SendOrGetData("GetPlayer",false);
});
