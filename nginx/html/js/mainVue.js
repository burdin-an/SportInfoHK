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
**/

var boardOpen = false;
var boardCountOpen = false;
var boardLogo1Open = false;
var boardListPlayerOpen = false;
var boardStartOpen = false;
var timerBoardOpen = false;
var boardConfigure = false;

const ConfigShowTimer = false;

// Таймер закрытия панели
let timerCloseBoardCount;

import { FS_BoardCount, FS_BoardLogo1, FS_BoardStart, FS_BoardListPlayer} from "templateDefault/Default/templateTablo.mjs"


const AppBoard = {
	data() {
		return {
			jsonData: {},
			boardOpen: false,
			boardCountOpen: false,
			boardLogo1Open: false,
			boardListPlayerOpen: false,
			boardStartOpen: false,
			timerBoardOpen: false,
			boardConfigure: false,
			ConfigShowTimer: false,
			// Таймер закрытия панели
			timerCloseBoardCount: null
		}
	},
    methods: {
		saveTeam() {
			this.SendOrGetData('SaveTeam', true, {'Value': this.Teams[this.TeamSelected]}, true);
		},
		deleteTeam() {
			this.SendOrGetData('DeleteTeam', true, {'Value': this.TeamSelected}, true);
		},
		createTeam() {
			this.SendOrGetData('CreateTeam', true, {'Value': false}, true);
		},
		saveGameName() {
			this.SendOrGetData('SaveGameName', true, {'Value': this.GameName[this.GameNameSelected]}, true);
		},
		deleteGameName() {
			this.SendOrGetData('DeleteGameName', true, {'Value': this.GameNameSelected}, true);
		},
		createGameName() {
			this.SendOrGetData('CreateGameName', true, {'Value': false}, true);
		},
		saveGamePlace() {
			this.SendOrGetData('SaveGamePlace', true, {'Value': this.GamePlace[this.GamePlaceSelected]}, true);
		},
		deleteGamePlace() {
			this.SendOrGetData('DeleteGamePlace', true, {'Value': this.GamePlaceSelected}, true);
		},
		createGamePlace() {
			this.SendOrGetData('CreateGamePlace', true, {'Value': false}, true);
		},
		showBoardCount(JsonData) {
			if (debuging != false) {console.log('Action: Show or Update board count');};
			if (JsonData.TimerSecondes < 10 && JsonData.TimerSecondes != '00') {
				tempSec = "0" + JsonData.TimerSecondes;
			}
			else {
				tempSec = JsonData.TimerSecondes;
			}
			if (JsonData.dAction != 'UpdateBoardCount') {
		
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
					boardCountOpen = true;
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
			if (debuging != false) {console.log(JsonData.TimerType.Count);};
			if (JsonData.TimerType.Count == 2) {
				$("#CountClassPause").removeClass("d-none");
				$("#CountClassPause").addClass("d-block");
			}
		},
		hideBoardCount() {
			if (debuging != false) {console.log('Action: Clear board count++');};
			$( "#boardCount" ).removeClass("cl_boardIn");
			$( "#boardCount" ).addClass("cl_boardOut");
			const node1 = document.getElementById('boardCount');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Clear board count END');};
				node1.remove();
				boardCountOpen = false;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		clearTimerBoard() {
			$( "#id_boardTimer" ).html( "" );
			var VoiceOneMinute = document.getElementById('RazminkaLastMinute').pause();
			var VoiceStop      = document.getElementById('RazminkaStop').pause();
			timerBoardOpen = false;
		},
		showBoardLogo1(JsonData) {
			if (debuging != false) {console.log('Action: Show or Hide board Logo1');};
			$("#root_boardLogo1").html(FS_BoardLogo1());
			$("#boardLogo1").css('background-image',"url('LogoPlaceLocal/" + JsonData.Logo + ".png')");
			$( "#boardLogo1").removeClass("cl_boardOut");
			$( "#boardLogo1").addClass("cl_boardIn");
			const node1 = document.getElementById('boardLogo1');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Show board Logo1 END');};
				boardLogo1Open = true;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		hideBoardLogo1() {
			if (debuging != false) {console.log('Action: Hide board Logo1');};
			$( "#boardLogo1" ).removeClass("cl_boardIn");
			$( "#boardLogo1" ).addClass("cl_boardOut");
			const node1 = document.getElementById('boardLogo1');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Hide board Logo1 END');};
				node1.remove();
				boardLogo1Open = false;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		showBoardStart(JsonData) {
			
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
			$( "#boardStart").removeClass("cl_boardOut");
			$( "#boardStart").addClass("cl_boardIn");
			const node1 = document.getElementById('boardStart');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Show board Start END');};
				boardStartOpen = true;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		hideBoardStart() {
			if (debuging != false) {console.log('Action: Hide board Start');};
			$( "#boardStart" ).removeClass("cl_boardIn");
			$( "#boardStart" ).addClass("cl_boardOut");
			const node1 = document.getElementById('boardStart');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Hide board Start END');};
				node1.remove();
				boardStartOpen = false;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		showBoardListPlayer(JsonData) {
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
			$( "#boardListPlayer").removeClass("cl_boardOut");
			$( "#boardListPlayer").addClass("cl_boardIn");
			const node1 = document.getElementById('boardListPlayer');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Show board list END');};
				boardListPlayerOpen = true;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		hideBoardListPlayer() {
			if (debuging != false) {console.log('Action: Hide board ListPlayer');};
			$( "#boardListPlayer" ).removeClass("cl_boardIn");
			$( "#boardListPlayer" ).addClass("cl_boardOut");
			const node1 = document.getElementById('boardListPlayer');
			function handleAnimationEnd1() {
				if (debuging != false) {console.log('Action: Hide board ListPlayer END');};
				node1.remove();
				boardListPlayerOpen = false;
			}
			node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
		},
		WebSocket() {
			var dataThis = this;
			let ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			ws.onopen = function() {
				if (debuging != false) {console.log('WebSocket connected');};
			};
			ws.onmessage = function(evt) {
				JsonData = JSON.parse(evt.data);
				if (JsonData) {
					//Обновить табло
					if (dataThis.boardCountOpen && JsonData.dAction == 'Update') {
						if (JsonData.CountPlayerLeft.Upd == 1) {
							dataThis.JsonData['CountPlayerLeft'] = JsonData.CountPlayerLeft.Count;
						}
						if (JsonData.CountPlayerRight.Upd == 1) {
							dataThis.JsonData['CountPlayerRight'] = JsonData.CountPlayerRight.Count;
						}
						if (JsonData.Period.Upd == 1) {
							dataThis.JsonData['Period'] = JsonData.Period.Count;
						}
						if (JsonData.TimerUpdate == 1) {
							if (JsonData.TimerSecondes < 10) {
								tempSec = "0" + JsonData.TimerSecondes;
							}
							else {
								tempSec = JsonData.TimerSecondes;
							}
							dataThis.JsonData['Time'] = JsonData.TimerMinutes + ":" + tempSec;
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
					else if (JsonData.dAction == 'TimerUpdate' && dataThis.boardCountOpen) {
						dataThis.JsonData['Timer'] = JsonData.Value;
					}
					// Перезагрузить табло
					else if (JsonData.dAction == 'ReloadTablo' && dataThis.ConfigShowTimer) {
						window.location.href = window.location.href;
						document.location.reload();
					}
					// Перезагрузить титры
					else if (JsonData.dAction == 'ReloadTV' && !dataThis.ConfigShowTimer) {
						window.location.href = window.location.href;
						document.location.reload();
					}
					// Открыть титры для Хоккея
					else if (JsonData.dAction == 'OpenTVHK') {
						window.open("TV.html","_self")
					}
					// Открыть титры для Футбола
					else if (JsonData.dAction == 'OpenTVFootball') {
						window.open("TV-Football.html","_self")
					}
					// Первые данные
					else if (JsonData.dAction == 'InitBoardCount') {
						dataThis.JsonData['CountPlayerLeft']      = JsonData.CountPlayerLeft;
						dataThis.JsonData['CountPlayerRight']     = JsonData.CountPlayerRight;
						dataThis.JsonData['PlayerLeftShortName']  = JsonData.PlayerLeft.ShortName;
						dataThis.JsonData['PlayerLeftFullName']   = JsonData.PlayerLeft.FullName;
						dataThis.JsonData['PlayerRightShortName'] = JsonData.PlayerRight.ShortName;
						dataThis.JsonData['PlayerRightFullName']  = JsonData.PlayerRight.FullName;
						dataThis.JsonData['Period']               = JsonData.Period;
						dataThis.JsonData['Timer']                = JsonData.Timer;
						dataThis.JsonData['BoardCountStatus']     = JsonData.BoardCountStatus;
						if (dataThis.JsonData['BoardCountStatus'] == 'active') {
							$("#CountClassTime1"       ).html(EventDB['Timer']);
							$("#boardCount"            ).addClass("cl_boardIn");
							boardCountOpen = true;
						}
					}
					// Счёт левой команды
					else if (JsonData.dAction == 'CountPlayerLeft') {
						dataThis.JsonData['CountPlayerLeft'] = JsonData.Value;
					}
					// Счёт правой команды
					else if (JsonData.dAction == 'CountPlayerRight') {
						dataThis.JsonData['CountPlayerRight'] = JsonData.Value;
					}
					// Период
					else if (JsonData.dAction == 'Period') {
						dataThis.JsonData['Period'] = JsonData.Value;
					}
					//Очистить экран
					else if (JsonData.dAction == 'Clear') {
						if (boardCountOpen) {
							cleanBoardPersonal();
						}
					}
					//Показать или обновить табло счёта
					else if (JsonData.dAction == 'ShowBoardCount' || JsonData.dAction == 'UpdateBoardCount') {
						if (debuging != false) {console.log('ShowBoardCount');};
						if (!dataThis.boardCountOpen || (dataThis.boardCountOpen && JsonData.dAction == 'UpdateBoardCount')) {
							dataThis.showBoardCount();
						}
					}
					//Скрыть табло счёта
					else if (JsonData.dAction == 'HideBoardCount') {
						if (debuging != false) {console.log('HideBoardCount');};
						if (dataThis.boardCountOpen) {
							dataThis.hideBoardCount();
						}
					}
					//Показать Логотип №1
					else if (JsonData.dAction == 'ShowBoardLogo1') {
						if (debuging != false) {console.log('ShowBoardLogo1');};
						if (!dataThis.boardLogo1Open) {
							dataThis.showBoardLogo1(JsonData);
						}
					}
					//Скрыть Логотип №1
					else if (JsonData.dAction == 'HideBoardLogo1') {
						if (debuging != false) {console.log('HideBoardLogo1');};
						if (dataThis.boardLogo1Open) {
							dataThis.hideBoardLogo1();
						}
					}
					//Показать Команды
					else if (JsonData.dAction == 'ShowBoardStart') {
						if (debuging != false) {console.log('ShowBoardStart');};
						if (!dataThis.boardStartOpen) {
							dataThis.showBoardStart();
						}
					}
					//Скрыть Команды
					else if (JsonData.dAction == 'HideBoardStart') {
						if (debuging != false) {console.log('HideBoardStart');};
						if (dataThis.boardStartOpen) {
							dataThis.hideBoardStart();
						}
					}
					//Показать список команды
					else if (JsonData.dAction == 'ShowBoardListPlayer') {
						if (debuging != false) {console.log('ShowBoardListPlayer');};
						if (!dataThis.boardListPlayerOpen) {
							dataThis.showBoardListPlayer();
						}
					}
					//Скрыть список команды
					else if (JsonData.dAction == 'HideBoardListPlayer') {
						if (debuging != false) {console.log('HideBoardListPlayer');};
						if (dataThis.boardListPlayerOpen) {
							dataThis.hideBoardListPlayer();
						}
					}
					if (debuging != false) {console.log('Необходимо обновить данные ');};
				}
				else {
					if (debuging != false) {console.log('WebSocket empty messages');};
				}
			};
			ws.onerror = function(err) {
				if (debuging != false) {console.error('Socket error');};
				ws.close();
			};
			ws.onclose = function(err) {
				if (debuging != false) {console.log('Socket is closed. Reconnect will be attempted in 1 second.');};
				setTimeout(function() {
					dataThis.WebSocket();
				}, 1000);
			};
		}
	},
	mounted() {
		this.WebSocket()
	}
};
Vue.createApp(AppBoard).mount('#AppBoard');

