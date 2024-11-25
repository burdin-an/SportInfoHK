
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
	'Judges': false,
	'Start5': false,
	'TrainerTeam': false,
	'Welcome': false,
	'PlayerTeam': false,
	'Commentators': false,
	'EndPeriod': false,
	'StartPeriod': false,
};
var boardConfigure = false;
var RolePlayer = {
	'FF': 'Нападающий',
	'GT': 'Вратарь',
	'DD': 'Защитник'
};

const ConfigShowTimer = false;

// Таймер закрытия панели
let timerCloseBoardCount;
let timerWelcome;

$(document).ready(function(){
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
				else if (BoardType == JsonData.Board || JsonData.Board == 'All') {
					console.log(BoardType);
					//const LocationStatic = window.location.search.slice(1).split("&")[0];

					//if (LocationStatic.split("=")[0] == 'staticAction') {
					//	LocationIsStatic = true;
					//	LocationStaticAction = LocationStatic.split("=")[1];
					//}
					// Открыть титры с шаблонами для:
					// OBS - титры для интернета
					// TV - титры для телевизионщиков
					// Tablo - титры для куба
					// ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,, надо разобраться с директорией и шаблонами !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					// TemplateFile может быть любой
					// NL - Ночная лига
					// FHR - ФХР
					// Football - Футбол
					if (JsonData.dAction == 'OpenTemplate' && !LocationIsStatic) {
						window.open("TV-" + JsonData.TemplateFile + ".html","_self");
					}
					// Перезагрузить титры
					else if (JsonData.dAction == 'Reload') {
						window.location.href = window.location.href;
						document.location.reload();
					}
					//Очистить экран --------------------------------------------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!
					else if (JsonData.dAction == 'Clear') {
						if (boardOpen['Count']) {
							cleanBoardPersonal();
						}
					}
					//Показать табло счёта
					else if (JsonData.dAction == 'ShowBoardCount') {
						showBoardCount(JsonData,'Count');
					}
					//обновить табло счёта
					else if (JsonData.dAction == 'UpdateBoardCount') {
						showBoardCount(JsonData,'Count');
					}
					//Скрыть табло счёта
					else if (JsonData.dAction == 'HideBoardCount') {
						hideBoard('Count');
					}
					//Показать Логотип №1
					else if (JsonData.dAction == 'ShowBoardLogo1') {
						showBoardLogo1(JsonData,'Logo1');
					}
					//Скрыть Логотип №1
					else if (JsonData.dAction == 'HideBoardLogo1') {
						hideBoard('Logo1');
					}
					//Показать Команды
					else if (JsonData.dAction == 'ShowBoardStart') {
						showBoardStart(JsonData,'Start');
					}
					//Скрыть Команды
					else if (JsonData.dAction == 'HideBoardStart') {
						hideBoard('Start');
					}
					//Показать список команды
					else if (JsonData.dAction == 'ShowBoardListPlayer') {
						showBoardListPlayer(JsonData,'ListPlayer');
					}
					//Скрыть список команды
					else if (JsonData.dAction == 'HideBoardListPlayer') {
						hideBoard('ListPlayer');
					}
					//Показать список команды
					else if (JsonData.dAction == 'ShowBoardStart5Player') {
						showBoardStart5Player(JsonData,'Start5Player');
					}
					//Скрыть список команды
					else if (JsonData.dAction == 'HideBoardStart5Player') {
						hideBoard('Start5Player');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardWelcome') {
						showBoardWelcome('Welcome');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardWelcome') {
						hideBoard('Welcome');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardJudges') {
						showBoardJudges('Judges');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardJudges') {
						hideBoard('Judges');
					}
					//Показать 
					else if (JsonData.dAction == 'ShowBoardCommentators') {
						showBoardCommentators('Commentators');
					}
					//Скрыть 
					else if (JsonData.dAction == 'HideBoardCommentators') {
						hideBoard('Commentators');
					}
					//Показать тренера
					else if (JsonData.dAction == 'ShowBoardTrainerTeam') {
						showBoardTrainerTeam('TrainerTeam');
					}
					//Скрыть тренера
					else if (JsonData.dAction == 'HideBoardTrainerTeam') {
						hideBoard('TrainerTeam');
					}
					//Показать игрока
					else if (JsonData.dAction == 'ShowBoardPlayerTeam') {
						showBoardPlayerTeam('PlayerTeam');
					}
					//Скрыть игрока
					else if (JsonData.dAction == 'HideBoardPlayerTeam') {
						hideBoard('PlayerTeam');
					}
					//Гол
					else if (JsonData.dAction == 'ShowBoardGoal') {
						ShowBoardGoal();
					}
					//Показать счёт в конце периода
					else if (JsonData.dAction == 'ShowBoardEndPeriod') {
						showBoardEndPeriod('EndPeriod');
					}
					//Скрыть счёт в конце периода
					else if (JsonData.dAction == 'HideBoardEndPeriod') {
						hideBoard('EndPeriod');
					}
					//Показать счёт в начале периода
					else if (JsonData.dAction == 'ShowBoardStartPeriod') {
						showBoardStartPeriod('StartPeriod');
					}
					//Скрыть счёт в начале периода
					else if (JsonData.dAction == 'HideBoardStartPeriod') {
						hideBoard('StartPeriod');
					}
				}
				
				if (debuging != false) {console.log('Необходимо обновить данные ' + JsonData.dAction + ':' + window.location.search.slice(1));};
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
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action] || (!boardOpen[Action] && JsonData.dAction == 'UpdateBoardCount')) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		
		if (JsonData.TimerSecondes < 10 && JsonData.TimerSecondes != '00') {
			tempSec = "0" + JsonData.TimerSecondes;
		}
		else {
			tempSec = JsonData.TimerSecondes;
		}
		if (JsonData.dAction != 'UpdateBoardCount') {
			if (debuging != false) {console.log('Action: ' + JsonData.dAction);};
			$("#root_boardCount").html(FS_BoardCount({
				'CountPlayerLeft': JsonData.CountPlayerLeft.Count,
				'CountPlayerRight': JsonData.CountPlayerRight.Count,
				'PlayerLeftShortName':  JsonData.PlayerLeft.ShortName,
				'PlayerLeftFullName' :  JsonData.PlayerLeft.FullName,
				'PlayerLeftPlace':      JsonData.PlayerRight.Place,
				'PlayerRightShortName': JsonData.PlayerRight.ShortName,
				'PlayerRightFullName':  JsonData.PlayerRight.FullName,
				'PlayerRightPlace':     JsonData.PlayerRight.Place,
				'Period':       JsonData.Period.Count,
				'Timer':        JsonData.TimerMinutes + ':' + tempSec,
			}));
			$("#CountClassPlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
			$("#CountClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
		}
		$("#CountClassCountPlayerLeft").html(JsonData.CountPlayerLeft.Count);
		$("#CountClassCountPlayerRight").html(JsonData.CountPlayerRight.Count);
		$("#CountClassPlayerLeftFullName"  ).html(JsonData.PlayerLeft.FullName);
		$("#CountClassPlayerLeftShortName" ).html(JsonData.PlayerLeft.ShortName);
		$("#CountClassPlayerLeftPlace" ).html(JsonData.PlayerLeft.Place);
		$("#CountClassPlayerRightFullName" ).html(JsonData.PlayerRight.FullName);
		$("#CountClassPlayerRightShortName").html(JsonData.PlayerRight.ShortName);
		$("#CountClassPlayerRightPlace").html(JsonData.PlayerRight.Place);
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
		if (JsonData.dAction != 'UpdateBoardCount') {
			showBoardAnimation(Action);
		}
	}
	function showBoardLogo1(JsonData, Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		
		$("#root_boardLogo1").html(FS_BoardLogo1());
		$("#boardLogo1").css('background-image',"url('LogoPlaceLocal/" + JsonData.Logo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardStart(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		
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
			'GameCity':         JsonData.GamePlace.Place,
		}));
		$("#StartClassPlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
		$("#StartClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardListPlayer(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		
		var PlayerVratari = "<table>";
		JsonData.Player.Vratari.forEach(function(Value){
			if (Value.Enable == 1) {
				PlayerVratari += "<tr><td>" + Value.Key + "</td><td>" + Value.FullName + "</td></tr>";
			}
		});
		var PlayerSecurity = "<table>";
		JsonData.Player.Security.forEach(function(Value){
			if (Value.Enable == 1) {
				PlayerSecurity += "<tr><td>" + Value.Key + "</td><td>" + Value.FullName + "</td></tr>";
			}
		});
		var PlayerNapadenie = "<table>";
		JsonData.Player.Napadenie.forEach(function(Value){
			if (Value.Enable == 1) {
				PlayerNapadenie += "<tr><td>" + Value.Key + "</td><td>" + Value.FullName + "</td></tr>";
			}
		});
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
		showBoardAnimation(Action);
	}
	function showBoardStart5Player(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		
		$("#root_boardStart5Player").html(FS_BoardStart5Player({
			'FullName'   : JsonData.Player.FullName,
			'Place'   : JsonData.Player.Place,
			'LFFullName' : JsonData.Player.LF.FullName,
			'RFFullName' : JsonData.Player.RF.FullName,
			'CFFullName' : JsonData.Player.CF.FullName,
			'RDFullName' : JsonData.Player.RD.FullName,
			'LDFullName' : JsonData.Player.LD.FullName,
			'GTFullName' : JsonData.Player.GT.FullName,
		}));
		$("#Start5PlayerClassLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Player.Logo + ".png')");
		$("#Start5PlayerClassLFPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Player.LF.Photo + ".png')");
		$("#Start5PlayerClassRFPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Player.RF.Photo + ".png')");
		$("#Start5PlayerClassCFPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Player.CF.Photo + ".png')");
		$("#Start5PlayerClassLDPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Player.LD.Photo + ".png')");
		$("#Start5PlayerClassRDPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Player.RD.Photo + ".png')");
		$("#Start5PlayerClassGTPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Player.GT.Photo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardWelcome(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		
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
		timerWelcome = setInterval(function() {
			let today = new Date();
			let time = ((today.getHours() < 10)?"0":"") + today.getHours() + ":" + ((today.getMinutes() < 10)?"0":"") + today.getMinutes();
			$('.WelcomeClassLocalTime').html(time);
		}, 1000);
		showBoardAnimation(Action);
	}
	function showBoardJudges(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		if (!boardOpen[Action]) {
			/*if (JsonData.JudgeThird.Number == "" || JsonData.JudgeThird.FullName == "") {
				JsonData.JudgeThird.UID = 0;
				JsonData.JudgeThird.Number = 0;
				JsonData.JudgeThird.FullName = "";
			}*/
			$('#root_board' + Action).html(FS_BoardJudges({
				'JudgeFirst-Number':  JsonData.JudgeFirst.Number,
				'JudgeFirst-FullName':  JsonData.JudgeFirst.FullName,
				'JudgeSecond-Number': JsonData.JudgeSecond.Number,
				'JudgeSecond-FullName': JsonData.JudgeSecond.FullName,
				'JudgeThird-Number':  JsonData.JudgeThird.Number,
				'JudgeThird-FullName':  JsonData.JudgeThird.FullName,
				'JudgeFourth-Number': JsonData.JudgeFourth.Number,
				'JudgeFourth-FullName': JsonData.JudgeFourth.FullName
			}));
			if (JsonData.JudgeThird.UID == "") {
				$('.JudgesClassLines').addClass("JudgesClassLinesHide");
				$('.JudgesClassBoss').addClass("JudgesClassBossOne");
				
			}
			if (JsonData.JudgeFourth.UID == "") {
				$('.JudgesClassLinesTitle').html("Линейный судья");
				$('.JudgesClassFourth').addClass("JudgesClassLinesHide");
			}
			else {
				$('.JudgesClassLinesTitle').html("Линейные судьи");
			}

			if (JsonData.JudgeSecond.UID == "") {
				$('.JudgesClassBossTitle').html("Главный судья");
				$('.JudgesClassSecond').addClass("JudgesClassLinesHide");
			}
			else {
				$('.JudgesClassBossTitle').html("Главные судьи");
			}
			showBoardAnimation(Action);
		}
	}
	function showBoardCommentators(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		if (JsonData.CommentatorSecond == null) {
			JsonData.CommentatorSecond = "";
		}
		$('#root_board' + Action).html(FS_BoardCommentators({	
			'CommentatorFirst':  JsonData.CommentatorFirst,
			'CommentatorSecond': JsonData.CommentatorSecond
		}));
		if (JsonData.CommentatorSecond == "") {
			$('.CommentatorsClassTitle').html("Комментатор");
			$('.CommentatorsClassSecond').addClass("CommentatorClassHide");
		}
		else {
			$('.CommentatorsClassTitle').html("Комментаторы");
		}
		showBoardAnimation(Action);
	}
	function ShowBoardGoal() {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (debuging != false) {console.log('Action: Show Goal');};
		$('#CountClassGoalTitle').addClass("CountClassGoalAnimation");
		setTimeout(function() {
			$('#CountClassGoalTitle').removeClass("CountClassGoalAnimation");
		}, 4500);
	}
	function showBoardTrainerTeam(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardTrainerTeam({
			'TrainerTitle':  JsonData.TrainerTitle,
			'TrainerFullName': JsonData.TrainerFullName
		}));
		showBoardAnimation(Action);
	}
	function showBoardPlayerTeam(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardPlayerTeam({
			'Number':  JsonData.Value.Key,
			'ShortName':  JsonData.Value.ShortName,
			'FullName': JsonData.Value.FullName,
			'Role': RolePlayer[JsonData.Value.Role],
			'Position': JsonData.Value.Position
		}));
		$("#PlayerTeamPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Value.Photo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardEndPeriod(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardEndPeriod(JsonData));
		$("#boardEndPeriod__PlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
		$("#boardEndPeriod__PlayerRightLogo").css('background-image','url("LogoTeamLocal/' + JsonData.PlayerRight.Logo + '.png")');
		showBoardAnimation(Action);
	}
	function showBoardStartPeriod(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardStartPeriod(JsonData));
		$("#boardStartPeriod__PlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
		$("#boardStartPeriod__PlayerRightLogo").css('background-image','url("LogoTeamLocal/' + JsonData.PlayerRight.Logo + '.png")');
		showBoardAnimation(Action);
	}
	function showBoardAnimation(Action) {
		if (debuging != false) {console.log('Animation: Show board ' + Action + ' START');};
		//$('#board' + Action).removeClass("cl_boardOut");
		//$('#board' + Action).addClass("cl_boardIn");
		const BoardID = document.getElementById('board' + Action);
		BoardID.classList.remove("cl_boardOut");
		if (window.location.hash.slice(1) == "static_animation") {
			BoardID.classList.add("cl_boardStaticAnimation");
		}
		else {
			BoardID.classList.remove("cl_boardStaticAnimation");
		}
		BoardID.classList.add("cl_boardIn");

		BoardID.addEventListener('animationend', () => {
			if (debuging != false) {console.log('Animation: Show board ' + Action + ' END');};
			//BoardID.classList.remove("cl_boardStaticAnimation");
			boardOpen[Action] = true;
		}, {once: true});
	}
	function hideBoard(Action) {
		if (boardOpen[Action]) {
			if (debuging != false) {console.log('Animation: Hide board ' + window.location.hash + ' START');};
			//$('#board' + Action ).removeClass("cl_boardIn");
			//$('#board' + Action ).addClass("cl_boardOut");
			const BoardID = document.getElementById('board' + Action);
			BoardID.classList.remove("cl_boardIn");
			if (window.location.hash.slice(1) == "static_animation") {
				BoardID.classList.add("cl_boardStaticAnimation");
			}
			else {
				BoardID.classList.remove("cl_boardStaticAnimation");
			}
			BoardID.classList.add("cl_boardOut");
			
			window.onanimationend = e => {
				if (e.animationName === Action + 'AnimLastOut') {
					if (debuging != false) {console.log('Animation: Hide board ' + Action + ' END');};
					BoardID.remove();
					boardOpen[Action] = false;
				}
			}
			if (Action == 'Welcome') {
				clearInterval(timerWelcome);
			}
		}
	}
	connect();
});
