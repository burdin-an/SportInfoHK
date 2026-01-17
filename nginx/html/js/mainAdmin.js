
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

// Отладочная информация
// Значение: true  - Включено
// Значение: false - Выключено
//var debuging = true;
// Отладочная информация
const debuging = true;

let BoardType = 'All';

$(document).ready(function(){
    var PlayerData = [];
    function SendOrGetData(Action,JsonDataOut) {
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
				// Комментатор#1
				for (const [Key, Value] of Object.entries(JSONData.CommentatorsArray)) {
					$("#InputCommentatorFirst" ).append( "<option" + (JSONData.Event.Commentator1.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
				}
				// Комментатор#2
				for (const [Key, Value] of Object.entries(JSONData.CommentatorsArray)) {
					$("#InputCommentatorSecond" ).append( "<option" + (JSONData.Event.Commentator2.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
				}
				// Судейская бригада: Судья №1
				for (const [Key, Value] of Object.entries(JSONData.JudgesArray)) {
					$("#InputJudgeFirst" ).append( "<option" + (JSONData.Event.JudgeFirst.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
				}
				// Судейская бригада: Судья №2
				for (const [Key, Value] of Object.entries(JSONData.JudgesArray)) {
					$("#InputJudgeSecond" ).append( "<option" + (JSONData.Event.JudgeSecond.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
				}
				// Судейская бригада: Судья №3
				for (const [Key, Value] of Object.entries(JSONData.JudgesArray)) {
					$("#InputJudgeThird" ).append( "<option" + (JSONData.Event.JudgeThird.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
				}
				// Судейская бригада: Судья №4
				for (const [Key, Value] of Object.entries(JSONData.JudgesArray)) {
					$("#InputJudgeFourth" ).append( "<option" + (JSONData.Event.JudgeFourth.UID == Key ? ' selected="selected" class="fw-bold font-weight-bold  bg-danger text-white"' : '') + " value='" + Key + "'>" + Value.ShortName + " (" + Value.Desc + ")</option>" );
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
	$(".ActionJsonButton2").click(function(event) {
		SendOrGetData(event.target.dataset.action,{
			Value: (event.target.dataset.value ? event.target.dataset.value : ""),
			TeamPosition: (event.target.dataset.team_position == "left" ? "Left" : "Right")
		});
		return false;
	});
	$(".ActionJsonButton").click(function(event) {
		SendOrGetData(event.target.dataset.action,{
			Value: document.getElementById(event.target.dataset.parent).value
		});
		document.getElementById(event.target.dataset.parent).value = "";
		if (event.target.id == "ChangeCurrentEvent") {
			$("#ChangeCurrentEvent").removeClass('buttonFlash');
		}
	});
	$("#SendGameWeather").click(function(event) {
		var Weather = "";
		var WeatherInputCloudiness = parseInt(document.getElementById("InputGameWeatherCloudiness").value);
		var WeatherInputPrecipitationType = parseInt(document.getElementById("InputGameWeatherPrecipitationType").value);
		var WeatherInputPrecipitationIntensity = parseInt(document.getElementById("InputGameWeatherPrecipitationIntensity").value);
		var WeatherInputStorm = parseInt(document.getElementById("InputGameWeatherStorm").value);
		switch (WeatherInputCloudiness) {
			case 0:
				Weather = "d";
				break;
			case 1:
			case 2:
				Weather = Weather + "d_c" + WeatherInputCloudiness;
				break;
			case 3:
				Weather = "c" + WeatherInputCloudiness;
				break;
		}
		switch (WeatherInputPrecipitationType) {
			case 1:
				Weather = Weather + "_r" + WeatherInputPrecipitationIntensity;
				break;
			case 2:
				Weather = Weather + "_s" + WeatherInputPrecipitationIntensity;
				break;
			case 3:
				Weather = Weather + "_rs" + WeatherInputPrecipitationIntensity;
				break;
		}
		if (WeatherInputStorm == 1) {
			Weather = Weather + "_st";
		}
		SendOrGetData("SendGameWeather","All",{
			Value: Weather
		});
		$("#SendGameWeather").removeClass('buttonFlash');
		return false;
	});
	$(".InputChange").change(function(event) {
        $("#" + event.target.dataset.button).addClass('buttonFlash');
    });
	$("#InputEventsList").change(function() {
        $("#ChangeCurrentEvent").addClass('buttonFlash');
    });

    SendOrGetData("GetEventsList",false);
});
