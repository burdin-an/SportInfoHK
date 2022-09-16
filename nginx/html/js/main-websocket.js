
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
 * @version   1.0.5
 */
// Порт для Web Socket
//const WebSocketPort = 8200;
var EventDB = [];
var JsonData;
var boardOpen = {
	'Count': false,
	'Logo1': false,
	'Start': false,
	'Welcome': false,
	'Judges': false
};
var boardConfigure = false;

const ConfigShowTimer = false;

// Таймер закрытия панели
let timerCloseBoardCount;

$(document).ready(function(){
	$("#root_board").html('<div id="root_boardWelcome"></div><div id="root_boardJudges"></div><div id="root_boardCount"></div><div id="root_boardLogo1"></div><div id="root_boardStart"></div><div id="root_boardSostav"></div>');


	function connect() {
		var ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
		ws.onopen = function() {
			if (debuging != false) {console.log('WebSocket connected');};
		};

		ws.onmessage = function(evt) {
			JsonData = JSON.parse(evt.data);
			if (JsonData) {
				//Обновить табло
				if (boardOpen['Count'] && JsonData.dAction == 'Update') {
					console.log(JsonData.dAction);
					if (JsonData.CountPlayerLeft.Upd == 1) {
						$("#CountClassCountPlayerLeft").html(JsonData.CountPlayerLeft.Count);
					}
					if (JsonData.CountPlayerRight.Upd == 1) {
						$("#CountClassCountPlayerRight").html(JsonData.CountPlayerRight.Count);
					}
					if (JsonData.Period.Upd == 1) {
						$("#CountIdPeriod" ).html(JsonData.Period.Count);
					}
					if (JsonData.TimerUpdate == 1) {

						if (JsonData.TimerSecondes < 10) {
							tempSec = "0" + JsonData.TimerSecondes;
						}
						else {
							tempSec = JsonData.TimerSecondes;
						}
						$("#CountClassTime").html(JsonData.TimerMinutes + ":" + tempSec);
					}
					if (JsonData.TimerType.Upd == 1) {
						if (JsonData.TimerType.Count == 2) {
							$("#CountClassPause").removeClass("d-none");
							$("#CountClassPause").addClass("d-block");
						}
						else {
							$("#CountClassPause").removeClass("d-block");
							$("#CountClassPause").addClass("d-none");
						}
					}
					LineDelPlayer = JsonData.DelPlayer.Left1;
					if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
						$(".CountClassDeletePlayerLeft>div:nth-child(1)>.Num").html(LineDelPlayer.Num);
						$(".CountClassDeletePlayerLeft>div:nth-child(1)>.Time" ).html(LineDelPlayer.Time);
						if (LineDelPlayer.Upd == 1) {
							$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-none");
							$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-block");
						}
						if (LineDelPlayer.Upd == 2) {
							$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-block");
							$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-none");
							
						}
					}
					LineDelPlayer = JsonData.DelPlayer.Left2;
					if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
						$(".CountClassDeletePlayerLeft>div:nth-child(2)>.Num").html(LineDelPlayer.Num);
						$(".CountClassDeletePlayerLeft>div:nth-child(2)>.Time").html(LineDelPlayer.Time);
						if (LineDelPlayer.Upd == 1) {
							$(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-none");
							$(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-block");
						}
						if (LineDelPlayer.Upd == 2) {
							$(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-block");
							$(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-none");
						}
					}
					LineDelPlayer = JsonData.DelPlayer.Left3;
					if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
						$(".CountClassDeletePlayerLeft>div:nth-child(3)>.Num").html(LineDelPlayer.Num);
						$(".CountClassDeletePlayerLeft>div:nth-child(3)>.Time").html(LineDelPlayer.Time);
						if (LineDelPlayer.Upd == 1) {
							$(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-none");
							$(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-block");
						}
						if (LineDelPlayer.Upd == 2) {
							$(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-block");
							$(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-none");
							
						}
					}
					LineDelPlayer = JsonData.DelPlayer.Right1;
					if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
						$(".CountClassDeletePlayerRight>div:nth-child(1)>.Num").html(LineDelPlayer.Num);
						$(".CountClassDeletePlayerRight>div:nth-child(1)>.Time").html(LineDelPlayer.Time);
						if (LineDelPlayer.Upd == 1) {
							$(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-none");
							$(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-block");
						}
						if (LineDelPlayer.Upd == 2) {
							$(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-block");
							$(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-none");
							
						}
					}
					LineDelPlayer = JsonData.DelPlayer.Right2;
					if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
						$(".CountClassDeletePlayerRight>div:nth-child(2)>.Num").html(LineDelPlayer.Num);
						$(".CountClassDeletePlayerRight>div:nth-child(2)>.Time").html(LineDelPlayer.Time);
						if (LineDelPlayer.Upd == 1) {
							$(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-none");
							$(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-block");
						}
						if (LineDelPlayer.Upd == 2) {
							$(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-block");
							$(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-none");
							
						}
					}
					LineDelPlayer = JsonData.DelPlayer.Right3;
					if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
						$(".CountClassDeletePlayerRight>div:nth-child(3)>.Num").html(LineDelPlayer.Num);
						$(".CountClassDeletePlayerRight>div:nth-child(3)>.Time").html(LineDelPlayer.Time);
						if (LineDelPlayer.Upd == 1) {
							$(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-none");
							$(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-block");
						}
						if (LineDelPlayer.Upd == 2) {
							$(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-block");
							$(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-none");
							
						}
					}
				}
				//Обновить время
				else if (JsonData.dAction == 'TimerUpdate' && boardOpen['Count']) {
					// Показать табло со временем
					$("#CountClassTime").html( JsonData.Value );
				}
				// Первые данные
				else if (JsonData.dAction == 'InitBoardCount') {
					EventDB['CountPlayerLeft']      = JsonData.CountPlayerLeft;
					EventDB['CountPlayerRight']     = JsonData.CountPlayerRight;
					EventDB['PlayerLeftShortName']  = JsonData.PlayerLeft.ShortName;
					EventDB['PlayerLeftFullName']   = JsonData.PlayerLeft.FullName;
					EventDB['PlayerRightShortName'] = JsonData.PlayerRight.ShortName;
					EventDB['PlayerRightFullName']  = JsonData.PlayerRight.FullName;
					EventDB['Period']       = JsonData.Period;
					EventDB['Timer']        = JsonData.Timer;
					EventDB['BoardCountStatus']   = JsonData.BoardCountStatus;
					if (EventDB['BoardCountStatus'] == 'active') {
						$("#CountClassCountPlayerLeft" ).html(EventDB['CountPlayerLeft']);
						$("#CountClassCountPlayerRight").html(EventDB['CountPlayerRight']);

						$("#CountClassPlayerLeftFullName"  ).html(EventDB['PlayerLeftFullName']);
						$("#CountClassPlayerLeftShortName" ).html(EventDB['PlayerLeftShortName']);
						$("#CountClassPlayerRightFullName" ).html(EventDB['PlayerRightFullName']);
						$("#CountClassPlayerRightShortName").html(EventDB['PlayerRightShortName']);
						$("#CountClassTime1"       ).html(EventDB['Timer']);
						$("#boardCount"            ).addClass("cl_boardIn");
						boardOpen['Count'] = true;
					}
				}
				// Счёт левой команды
				else if (JsonData.dAction == 'CountPlayerLeft') {
					$("#CountClassCountPlayerLeft" ).html(JsonData.Value);
				}
				// Счёт правой команды
				else if (JsonData.dAction == 'CountPlayerRight') {
					$("#CountClassCountPlayerRight" ).html(JsonData.Value);
				}
				// Период
				else if (JsonData.dAction == 'Period') {
					$("#CountIdPeriod" ).html(JsonData.Value);
				}
				else if (BoardType == 'Tablo') {
					// Перезагрузить табло
					if (JsonData.dAction == 'ReloadTablo') {
						window.location.href = window.location.href;
						document.location.reload();
					}
					//Очистить экран
					else if (JsonData.dAction == 'ClearTablo') {
						if (boardOpen['Count']) {
							cleanBoardPersonal();
						}
					}
					//Показать или обновить табло счёта
					else if (JsonData.dAction == 'ShowBoardTabloCount' || JsonData.dAction == 'UpdateBoardTabloCount') {
						showBoardCount(JsonData,'Count');
					}
					//Скрыть табло счёта
					else if (JsonData.dAction == 'HideBoardTabloCount') {
						hideBoard('Count');
					}
					//Показать Логотип №1
					else if (JsonData.dAction == 'ShowBoardTabloLogo1') {
						showBoardLogo1(JsonData,'Logo1');
					}
					//Скрыть Логотип №1
					else if (JsonData.dAction == 'HideBoardTabloLogo1') {
						hideBoard('Logo1');
					}
					//Показать Команды
					else if (JsonData.dAction == 'ShowBoardTabloStart') {
						showBoardStart(JsonData,'Start');
					}
					//Скрыть Команды
					else if (JsonData.dAction == 'HideBoardTabloStart') {
						hideBoard('Start');
					}
					//Показать список команды
					else if (JsonData.dAction == 'ShowBoardTabloListPlayerRight' || JsonData.dAction == 'ShowBoardTabloListPlayerLeft') {
						showBoardListPlayer(JsonData,'ListPlayer');
					}
					//Скрыть список команды
					else if (JsonData.dAction == 'HideBoardTabloListPlayer') {
						hideBoard('ListPlayer');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardTabloWelcome') {
						showBoardWelcome('Welcome');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardTabloWelcome') {
						hideBoard('Welcome');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardTabloJudges') {
						showBoardJudges('Judges');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardTabloJudges') {
						hideBoard('Judges');
					}
				}
				else if (BoardType == 'OBS') {
					// Перезагрузить титры
					if (JsonData.dAction == 'ReloadOBS') {
						window.location.href = window.location.href;
						document.location.reload();
					}
					// Открыть титры для Хоккея
					else if (JsonData.dAction == 'OpenOBSHK') {
						window.open("TV.html","_self")
					}
					// Открыть титры для Футбола
					else if (JsonData.dAction == 'OpenOBSFootball') {
						window.open("TV-Football.html","_self")
					}
					//Очистить экран
					else if (JsonData.dAction == 'ClearOBS') {
						if (boardOpen['Count']) {
							cleanBoardPersonal();
						}
					}
					//Показать или обновить табло счёта
					else if (JsonData.dAction == 'ShowBoardOBSCount' || JsonData.dAction == 'UpdateBoardOBSCount') {
						showBoardCount(JsonData,'Count');
					}
					//Скрыть табло счёта
					else if (JsonData.dAction == 'HideBoardOBSCount') {
						hideBoard('Count');
					}
					//Показать Логотип №1
					else if (JsonData.dAction == 'ShowBoardOBSLogo1') {
						showBoardLogo1(JsonData,'Logo1');
					}
					//Скрыть Логотип №1
					else if (JsonData.dAction == 'HideBoardOBSLogo1') {
						hideBoard('Logo1');
					}
					//Показать Команды
					else if (JsonData.dAction == 'ShowBoardOBSStart') {
						showBoardStart(JsonData,'Start');
					}
					//Скрыть Команды
					else if (JsonData.dAction == 'HideBoardOBSStart') {
						hideBoard('Start');
					}
					//Показать список команды
					else if (JsonData.dAction == 'ShowBoardOBSListPlayerRight' || JsonData.dAction == 'ShowBoardOBSListPlayerLeft') {
						showBoardListPlayer(JsonData,'ListPlayer');
					}
					//Скрыть список команды
					else if (JsonData.dAction == 'HideBoardOBSListPlayer') {
						hideBoard('ListPlayer');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardOBSWelcome') {
						showBoardWelcome('Welcome');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardOBSWelcome') {
						hideBoard('Welcome');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardOBSJudges') {
						showBoardJudges('Judges');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardOBSJudges') {
						hideBoard('Judges');
					}
				}
				else if (BoardType == 'TV') {
					// Перезагрузить титры
					if (JsonData.dAction == 'ReloadTV') {
						window.location.href = window.location.href;
						document.location.reload();
					}
					//Очистить экран
					else if (JsonData.dAction == 'ClearTV') {
						if (boardOpen['Count']) {
							cleanBoardPersonal();
						}
					}
					//Показать или обновить табло счёта
					else if (JsonData.dAction == 'ShowBoardTVCount' || JsonData.dAction == 'UpdateBoardTVCount') {
						showBoardCount(JsonData,'Count');
					}
					//Скрыть табло счёта
					else if (JsonData.dAction == 'HideBoardTVCount') {
						hideBoard('Count');
					}
					//Показать Логотип №1
					else if (JsonData.dAction == 'ShowBoardTVLogo1') {
						showBoardLogo1(JsonData,'Logo1');
					}
					//Скрыть Логотип №1
					else if (JsonData.dAction == 'HideBoardTVLogo1') {
						hideBoard('Logo1');
					}
					//Показать Команды
					else if (JsonData.dAction == 'ShowBoardTVStart') {
						showBoardStart(JsonData,'Start');
					}
					//Скрыть Команды
					else if (JsonData.dAction == 'HideBoardTVStart') {
						hideBoard('Start');
					}
					//Показать список команды
					else if (JsonData.dAction == 'ShowBoardTVListPlayerRight' || JsonData.dAction == 'ShowBoardTVListPlayerLeft') {
						showBoardListPlayer(JsonData,'ListPlayer');
					}
					//Скрыть список команды
					else if (JsonData.dAction == 'HideBoardTVListPlayer') {
						hideBoard('ListPlayer');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardTVWelcome') {
						showBoardWelcome('Welcome');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardTVWelcome') {
						hideBoard('Welcome');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardTVJudges') {
						showBoardJudges('Judges');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardTVJudges') {
						hideBoard('Judges');
					}
				}
				
				if (debuging != false) {console.log('Необходимо обновить данные ');};
			}
			else {
				if (debuging != false) {console.log('WebSocket empty messages');};
			}
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
	function showBoardCount(JsonData,Action) {
		if (debuging != false) {console.log('Action: ' + JsonData.dAction + ' board count');};
		if (!boardOpen[Action] || (boardOpen[Action] && (JsonData.dAction == 'UpdateBoardTVCount' || JsonData.dAction == 'UpdateBoardOBSCount' || JsonData.dAction == 'UpdateBoardTabloCount'))) {
			if (JsonData.TimerSecondes < 10 && JsonData.TimerSecondes != '00') {
				tempSec = "0" + JsonData.TimerSecondes;
			}
			else {
				tempSec = JsonData.TimerSecondes;
			}
			if (JsonData.dAction != 'UpdateBoardTVCount' && JsonData.dAction != 'UpdateBoardOBSCount' && JsonData.dAction != 'UpdateBoardTabloCount') {
				if (debuging != false) {console.log('Action: ' + JsonData.PlayerLeft.FullName);};
				$("#root_boardCount").html(FS_BoardCount({
					'CountPlayerLeft': JsonData.CountPlayerLeft.Count,
					'CountPlayerRight': JsonData.CountPlayerRight.Count,
					'PlayerLeftShortName': JsonData.PlayerLeft.ShortName,
					'PlayerLeftFullName' : JsonData.PlayerLeft.FullName,
					'PlayerRightShortName' : JsonData.PlayerRight.ShortName,
					'PlayerRightFullName' : JsonData.PlayerRight.FullName,
					'Period':       JsonData.Period.Count,
					'Timer':        JsonData.TimerMinutes + ':' + tempSec,
				}));
				$("#CountClassPlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
				$("#CountClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
				$( "#boardCount").removeClass("cl_boardOut");
				$( "#boardCount").addClass("cl_boardIn");
				const node1 = document.getElementById('boardCount');
				function handleAnimationEnd1() {
					if (debuging != false) {console.log('Action: Show board count END');};
					boardOpen[Action] = true;
				}
				node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
			}
			$("#CountClassCountPlayerLeft").html(JsonData.CountPlayerLeft.Count);
			$("#CountClassCountPlayerRight").html(JsonData.CountPlayerRight.Count);
			$("#CountClassPlayerLeftFullName"  ).html(JsonData.PlayerLeft.FullName);
			$("#CountClassPlayerLeftShortName" ).html(JsonData.PlayerLeft.ShortName);
			$("#CountClassPlayerRightFullName" ).html(JsonData.PlayerRight.FullName);
			$("#CountClassPlayerRightShortName").html(JsonData.PlayerRight.ShortName);
			$("#CountIdPeriod"         ).html(JsonData.Period.Count);
			$("#CountIdTimer"          ).html(JsonData.TimerMinutes + ':' + tempSec);
			if (JsonData.DelPlayer.Left1.Num > 0) {
				$(".CountClassDeletePlayerLeft>div:nth-child(1)>.Num").html(JsonData.DelPlayer.Left1.Num);
				$(".CountClassDeletePlayerLeft>div:nth-child(1)>.Time" ).html(JsonData.DelPlayer.Left1.Time);
				$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-none");
				$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-block");
			}
			if (JsonData.DelPlayer.Left2.Num > 0) {
				$(".CountClassDeletePlayerLeft>div:nth-child(2)>.Num").html(JsonData.DelPlayer.Left2.Num);
				$(".CountClassDeletePlayerLeft>div:nth-child(2)>.Time").html(JsonData.DelPlayer.Left2.Time);
				$(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-none");
				$(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-block");
			}
			if (JsonData.DelPlayer.Left3.Num > 0) {
				$(".CountClassDeletePlayerLeft>div:nth-child(3)>.Num").html(JsonData.DelPlayer.Left3.Num);
				$(".CountClassDeletePlayerLeft>div:nth-child(3)>.Time").html(JsonData.DelPlayer.Left3.Time);
				$(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-none");
				$(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-block");
			}
			if (JsonData.DelPlayer.Right1.Num > 0) {
				$(".CountClassDeletePlayerRight>div:nth-child(1)>.Num").html(JsonData.DelPlayer.Right1.Num);
				$(".CountClassDeletePlayerRight>div:nth-child(1)>.Time").html(JsonData.DelPlayer.Right1.Time);
				$(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-none");
				$(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-block");
			}
			if (JsonData.DelPlayer.Right2.Num > 0) {
				$(".CountClassDeletePlayerRight>div:nth-child(2)>.Num").html(JsonData.DelPlayer.Right2.Num);
				$(".CountClassDeletePlayerRight>div:nth-child(2)>.Time").html(JsonData.DelPlayer.Right2.Time);
				$(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-none");
				$(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-block");
			}
			if (JsonData.DelPlayer.Right3.Num > 0) {
				$(".CountClassDeletePlayerRight>div:nth-child(3)>.Num").html(JsonData.DelPlayer.Right3.Num);
				$(".CountClassDeletePlayerRight>div:nth-child(3)>.Time").html(JsonData.DelPlayer.Right3.Time);
				$(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-none");
				$(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-block");
			}
			if (JsonData.TimerType.Count == 2) {
				$("#CountClassPause").removeClass("d-none");
				$("#CountClassPause").addClass("d-block");
			}
		}
	}
	function showBoardLogo1(JsonData, Action) {
		if (debuging != false) {console.log('Action: ' + JsonData.dAction);};
		if (!boardOpen[Action]) {
			if (debuging != false) {console.log('Action: Show or Hide board Logo1');};
			$("#root_boardLogo1").html(FS_BoardLogo1());
			$("#boardLogo1").css('background-image',"url('LogoPlaceLocal/" + JsonData.Logo + ".png')");
			$("#boardLogo1").removeClass("cl_boardOut");
			$("#boardLogo1").addClass("cl_boardIn");
			const node1 = document.getElementById('boardLogo1');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Show board Logo1 END');};
				boardOpen[Action] = true;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		}
	}
	function showBoardStart(JsonData,Action) {
		if (debuging != false) {console.log('Action: ' + JsonData.dAction);};
		if (!boardOpen[Action]) {
			if (debuging != false) {console.log('Action: Show or Hide board Start');};
			$("#root_boardStart").html(FS_BoardStart({
				'PlayerLeftName':   JsonData.PlayerLeft.FullName,
				'PlayerLeftPlace':  JsonData.PlayerLeft.Place,
				'PlayerLeftIcon':   JsonData.PlayerLeft.Logo,
				'PlayerRightName':  JsonData.PlayerRight.FullName,
				'PlayerRightPlace': JsonData.PlayerRight.Place,
				'PlayerRightIcon':  JsonData.PlayerRight.Logo,
				'GameName':         JsonData.GameName.FullName,
				'GameDate':         JsonData.GameDate,
				'GameTime':         JsonData.GameTime,
				'GamePlace':        JsonData.GamePlace.FullName,

			}));
			$("#StartClassPlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
			$("#StartClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
			$("#boardStart").removeClass("cl_boardOut");
			$("#boardStart").addClass("cl_boardIn");
			const node1 = document.getElementById('boardStart');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Show board Start END');};
				boardOpen[Action] = true;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		}
	}
	function showBoardListPlayer(JsonData,Action) {
		if (debuging != false) {console.log('Action: ' + JsonData.dAction);};
		if (!boardOpen[Action]) {
			if (debuging != false) {console.log('Action: Show board ListPlayerLeft');};
			var PlayerVratari = "<table>";
			for (const [Key, Value] of Object.entries(JsonData.Player.Vratari)) {
				if (Value.Enable == 1) {
					PlayerVratari += "<tr><td>" + Key + "</td><td>" + Value.FullName + "</td></tr>";
				}
			}
			var PlayerSecurity = "<table>";
			for (const [Key, Value] of Object.entries(JsonData.Player.Security)) {
				if (Value.Enable == 1) {
					PlayerSecurity += "<tr><td>" + Key + "</td><td>" + Value.FullName + "</td></tr>";
				}
			}
			var PlayerNapadenie = "<table>";
			for (const [Key, Value] of Object.entries(JsonData.Player.Napadenie)) {
				if (Value.Enable == 1) {
					PlayerNapadenie += "<tr><td>" + Key + "</td><td>" + Value.FullName + "</td></tr>";
				}
			}

			$("#root_boardSostav").html(FS_BoardListPlayer({
				'PlayerFullName'     : JsonData.Player.FullName,
				'PlayerPlace'        : JsonData.Player.Place,
				'PlayerMiddleLet'    : JsonData.Player.MiddleLet,
				'PlayerBoss'         : JsonData.Player.Boss,
				'PlayerTrainer'      : JsonData.Player.Trainer,
				'PlayerAdministrator': JsonData.Player.Administrator,
				'PlayerVratari'      : PlayerVratari + '</table>',
				'PlayerSecurity'     : PlayerSecurity + '</table>',
				'PlayerNapadenie'    : PlayerNapadenie + '</table>',
			}));
			$("#ListPlayerClassLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Player.Logo + ".png')");
			$("#boardListPlayer").removeClass("cl_boardOut");
			$("#boardListPlayer").addClass("cl_boardIn");
			const node1 = document.getElementById('boardListPlayer');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Show board list END');};
				boardOpen[Action] = true;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		}
	}
	function showBoardWelcome(Action) {
		if (debuging != false) {console.log('Action: ' + Action);};
		if (!boardOpen[Action]) {
			var today = new Date();
			var time = ((today.getHours() < 10)?"0":"") + today.getHours() + ":" + ((today.getMinutes() < 10)?"0":"") + today.getMinutes();
			var date = ((today.getDate() < 10)?"0":"") + today.getDate()+'.'+(((today.getMonth()+1) < 10)?"0":"")+(today.getMonth()+1)+'.'+today.getFullYear();
			$('#root_board' + Action).html(FS_BoardWelcome({
				'ArenaName':       JsonData.ArenaName,
				'Place':           JsonData.Place,
				'Date':            date,
				'LocalTime':       time,
				'Weather':     JsonData.Weather,
				'Temperature': JsonData.Temperature,

			}));
			$('#board' + Action).removeClass("cl_boardOut");
			$('#board' + Action).addClass("cl_boardIn");
			if (debuging != false) {console.log('Action: Show ' + Action + ' END');};
			boardOpen[Action] = true;
		}
	}
	function showBoardJudges(Action) {
		if (debuging != false) {console.log('Action: ' + Action);};
		if (!boardOpen[Action]) {
			$('#root_board' + Action).html(FS_BoardJudges());
			$('#board' + Action).removeClass("cl_boardOut");
			$('#board' + Action).addClass("cl_boardIn");
			if (debuging != false) {console.log('Action: Show ' + Action + ' END');};
			boardOpen[Action] = true;
		}
	}
	function hideBoard(Action) {
		if (debuging != false) {console.log(boardOpen[Action]);};
		if (boardOpen[Action]) {
			if (debuging != false) {console.log('Action: Hide board ' + Action + ' START');};
			$('#board' + Action ).removeClass("cl_boardIn");
			$('#board' + Action ).addClass("cl_boardOut");
			window.onanimationend = e => {
				if (e.animationName === Action + 'AnimLastOut') {
					if (debuging != false) {console.log('Action: Hide board ' + Action + ' END');};
					const node1 = document.getElementById('board' + Action);
					node1.remove();
					boardOpen[Action] = false;
				}
			}
		}
	}
	connect();
});
