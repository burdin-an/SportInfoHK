
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
    function SendOrGetData(Action,BoardType,JsonDataOut) {
        let ws;
        ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
        ws.onopen = function() {
            if (debuging != false) {console.log('WebSocket connected');};
			var msg = {
				"Action": Action,
				"Board": BoardType
			};
			if (Action == "GetEventsList") {
				ws.send(JSON.stringify(msg));
			}
			else if(Action == "ChangeCurrentEvent") {
				ws.send(JSON.stringify(Object.assign({},msg, JsonDataOut)));
			}
			else {
				if (JsonDataOut) {
					ws.send(JSON.stringify(Object.assign({},msg, JsonDataOut)));
				}
				else {
					ws.send('EmptyRequest001');
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
			if (JSONData.dAction == "ListEvents") {
				if (debuging != false) {console.log('ListEvents');};
				$("#InputEventsList" ).html("");
				// Команды
				for (const [Key, Value] of Object.entries(JSONData.ListEvents)) {
					$("#InputEventsList" ).append( "<option" + (JSONData.SelectEvent.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.Name + "</option>" );
				}
				if (JSONData.SelectEvent.GameOver == 1) {
					$("#ShowStatusEvent").html("Игра завершена! Вносить изменения нельзя.");
				}
				else {
					$("#ShowStatusEvent").html("");
				}
				$("#ShowEventDate").html(JSONData.SelectEvent.GameDate);
				$("#ShowEventTime").html(JSONData.SelectEvent.GameTime);
				$("#ShowEventFileName").html(JSONData.SelectEvent.FileName);
				$("#ShowEventPlayerLeftName") .html(JSONData.SelectEvent.PlayerLeft.FullName);
				$("#ShowEventPlayerRightName").html(JSONData.SelectEvent.PlayerRight.FullName);
				$("#ClassPlayerLeftLogo") .css('background-image',"url('LogoTeamLocal/" + JSONData.SelectEvent.PlayerLeft.Logo + ".png')");
				$("#ClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JSONData.SelectEvent.PlayerRight.Logo + ".png')");
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
	$("a.ActionJsonButton2").click(function(event) {
        SendOrGetData(event.target.dataset.action,event.target.dataset.board,{
			Value: (event.target.dataset.value ? event.target.dataset.value : ""),
			TeamPosition: (event.target.dataset.team_position == "left" ? "Left" : "Right")
		});
		return false;
    });
	$("button.ActionJsonButton").click(function(event) {
		SendOrGetData(event.target.dataset.action,'All',{
			Value: document.getElementById(event.target.dataset.parent).value
		});
		document.getElementById(event.target.dataset.parent).value = "";
		if (event.target.id == "ChangeCurrentEvent") {
			$("#ChangeCurrentEvent").removeClass('buttonFlash');
		}
	});
	$("#InputEventsList").change(function() {
        $("#ChangeCurrentEvent").addClass('buttonFlash');
    });
    SendOrGetData("GetEventsList",false);
});
