
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
let EventDBLocal = {
	'Count': {
		'Left': -1,
		'Right': -1,
	},
	'Period': -1,
	'Timer': {
		'Status': -1,
		'Type': -1,
		'Min': -1,
		'Sec': -1,
		'MSec': -1,
	},
	'DelPlayer': {
		'Left' : {
			
		},
		'Right': {
			'l1': {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'l2': {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'l3': {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			}
		},
	},
	'PowerPlay': {
		'Left': {
			'Line1' : {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'Line2' : {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'Line3' : {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'Min': 0,
			'Sec': 0,
			'Count': 0,
		},
		'Right': {
			'Line1': {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'Line2': {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'Line3': {
				'Num': 0,
				'Min': 0,
				'Sec': 0,
			},
			'Min': 0,
			'Sec': 0,
			'Count': 0,
		},
		'Position': 'Left', // Left, Right, Both 
		'Min': 0,
		'Sec': 0
	},
};
let EventDB = [];
let JsonData;
let boardOpen = {
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
	'Timer': false,
	'Start5LeftAndRight': false,
	'EmptyNet': false,
	'PenaltyShot': false,
	'DelayedPenalty': false,
	'PullGoalie': false,
	'PlayerGoal': false,
	'PlayerEjection': false,
	'Pause': false,
	'Finish': false,
};
let boardConfigure = false;
let RolePlayer = {
	'FF': 'Нападающий',
	'GT': 'Вратарь',
	'DD': 'Защитник'
};
let RolePlayer_en = {
	'FF': 'FORWARD',
	'GT': 'GOALTENDER',
	'DD': 'DEFENSEMEN'
};

const ConfigShowTimer = false;

// Таймер закрытия панели
let timerCloseBoardCount;
let timerWelcome;

window.addEventListener("load", (event) => {

	function connect() {
		var ws = new WebSocket(WebSocketURL);
		ws.onopen = function() {
			if (debuging != false) {console.log('WebSocket connected');};
		};

		ws.onmessage = function(evt) {
			JsonData = JSON.parse(evt.data);
			if (JsonData) {
				//Обновить табло
				if (JsonData.dAction == 'Update' && (boardOpen['Count'] || boardOpen['Timer'] || boardOpen['Pause'])) {
					showBoardPause('Pause');
					if (JsonData.Count.Left != EventDBLocal.Count.Left) {
						$("#CountClassPlayerLeftCount" ).html(JsonData.Count.Left);
					}
					if (JsonData.Count.Right != EventDBLocal.Count.Right) {
						$("#CountClassPlayerRightCount").html(JsonData.Count.Right);
					}
					if (JsonData.Period != EventDBLocal.Period) {
						if (JsonData.Period == 1) {
							$("#CountENPeriod" ).html(JsonData.Period + "<span class='CountPeriodUP'>ST</span>");
							$("#CountIdPeriod" ).html(JsonData.Period);
						}
						else if (JsonData.Period == 2) {
							$("#CountENPeriod" ).html(JsonData.Period + "<span class='CountPeriodUP'>ND</span>");
							$("#CountIdPeriod" ).html(JsonData.Period);
						}
						else if (JsonData.Period == 3) {
							$("#CountENPeriod" ).html(JsonData.Period + "<span class='CountPeriodUP'>RD</span>");
							$("#CountIdPeriod" ).html(JsonData.Period);
						}
						else if (JsonData.Period == 4) {
							$("#CountENPeriod" ).html('OT');
							$("#CountIdPeriod" ).html('Доп. время');
						}
						else if (JsonData.Period == 5) {
							$("#CountENPeriod" ).html('SO');
							$("#CountIdPeriod" ).html('Булиты');
						}
						else {
							$("#CountENPeriod" ).html(JsonData.Period);
						}
						if (JsonData.Period == 0) {
							$("#CountClassPeriodBlock").removeClass("d-blockinline");
							$("#CountClassPeriodBlock").addClass("d-none");
						}
						else {
							$("#CountClassPeriodBlock").removeClass("d-none");
							$("#CountClassPeriodBlock").addClass("d-blockinline");
						}
					}
					
					if (JsonData.Timer.Min != EventDBLocal.Timer.Min || JsonData.Timer.Sec != EventDBLocal.Timer.Sec || JsonData.Timer.MSec != EventDBLocal.Timer.MSec) {
						if (JsonData.Timer.Sec < 10) {
							tempSec = "0" + JsonData.Timer.Sec;
						}
						else {
							tempSec = JsonData.Timer.Sec;
						}
						if (JsonData.Timer.Min == 0 && JsonData.Timer.Type == 1) {
							if (boardOpen['Timer']) {
								$("#CountClassTime").html(JsonData.Period + "  0:" + tempSec + "." + JsonData.Timer.MSec);
							} else {
								$("#CountClassTime").html("0:" + tempSec + "." + JsonData.Timer.MSec);
							}
						}
						else {
							if (boardOpen['Timer']) {
								$("#CountClassTime").html(JsonData.Period + '  ' + JsonData.Timer.Min + ":" + tempSec);
							} else {
								$("#CountClassTime").html(JsonData.Timer.Min + ":" + tempSec);
							}
						}
					}
					if (JsonData.Timer.Type != EventDBLocal.Timer.Type) {
						if (JsonData.Timer.Type == 2) {
							$("#CountClassTimeOut").removeClass("d-blockinline");
							$("#CountClassTimeOut").addClass("d-none");
							if (JsonData.Period == 0) {
								$("#CountClassPause").removeClass("d-blockinline");
								$("#CountClassPause").addClass("d-none");
								$("#CountClassWarmUp").removeClass("d-none");
								$("#CountClassWarmUp").addClass("d-blockinline");
							}
							else {
								$("#CountClassPause").removeClass("d-none");
								$("#CountClassPause").addClass("d-blockinline");
								$("#CountClassWarmUp").removeClass("d-blockinline");
								$("#CountClassWarmUp").addClass("d-none");
							}
						}
						else if (JsonData.Timer.Type == 3 || JsonData.Timer.Type == 4) {
							$("#CountClassPause").removeClass("d-blockinline");
							$("#CountClassPause").addClass("d-none");
							$("#CountClassTimeOut").removeClass("d-none");
							$("#CountClassTimeOut").addClass("d-blockinline");
							// на заставке ГОЛ делаем Таймаут
							$('.CountClassLayer_Goal').addClass("CountClassGoalAnimation");
							$('.CountClassLayer_TimeOut_Text').removeClass("d-none");
							$('.CountClassLayer_TimeOut_Text').addClass("d-block");
							console.log(JsonData);
							if (JsonData.Timer.Type == 4) {
								$('#CountClassLayer_Goal_LeftLogo').addClass("CountClassGoalAnimation");
								$("#CountClassTimeOutRight").removeClass("d-none");
								$("#CountClassTimeOutRight").addClass("d-blockinline");
							}
							else {
								$('#CountClassLayer_Goal_RightLogo').addClass("CountClassGoalAnimation");
								$("#CountClassTimeOutLeft").removeClass("d-none");
								$("#CountClassTimeOutLeft").addClass("d-blockinline");
							}
							setTimeout(function() {
								$('.CountClassLayer_Goal').removeClass("CountClassGoalAnimation");
								$('.CountClassLayer_TimeOut_Text').removeClass("d-block");
								$('.CountClassLayer_TimeOut_Text').addClass("d-none");
								$('#CountClassLayer_Goal_LeftLogo').removeClass("CountClassGoalAnimation");
								$('#CountClassLayer_Goal_RightLogo').removeClass("CountClassGoalAnimation");
							}, 5000);
						}
						else {
							$("#CountClassPause").removeClass("d-blockinline");
							$("#CountClassPause").addClass("d-none");
							$("#CountClassTimeOut").removeClass("d-blockinline");
							$("#CountClassTimeOut").addClass("d-none");
							$("#CountClassTimeOutLeft").removeClass("d-blockinline");
							$("#CountClassTimeOutLeft").addClass("d-none");
							$("#CountClassTimeOutRight").removeClass("d-blockinline");
							$("#CountClassTimeOutRight").addClass("d-none");
							$("#CountClassWarmUp").removeClass("d-blockinline");
							$("#CountClassWarmUp").addClass("d-none");
						}
					}

					for (const Colum of ['Left','Right']) {
						let NewCol = JsonData['PowerPlay'][Colum];
						let OldCol = EventDBLocal['PowerPlay'][Colum];
						for (const Line of ['Line1','Line2','Line3']) {
							let LineNumber = Line.slice(-1);
							let NewValue = NewCol[Line];
							let OldValue = OldCol[Line];
							// Добавляем информацию об удаленном игроке
							if (NewValue.Num > 0 && OldValue.Num == 0) {
								console.info('Add ');
								//Задаем номер удаленного игрока
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Number").html(NewValue.Num);
								//Задаем время удаления игрока
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Time" ).html(NewValue.Min + ":" + (NewValue.Sec < 10 ? '0'+NewValue.Sec : NewValue.Sec));
								// Наибольшее время удаления левая и правая команда
								$("#DeletePlayer" + Colum +"Time").html(NewCol['Min'] + ":" + (NewCol['Sec'] < 10 ? '0'+NewCol['Sec'] : NewCol['Sec']));
								// Наибольшее время удаления всех
								$("#DeletePlayerOneLineTime").html(JsonData['PowerPlay']['Min'] + ":" + (JsonData['PowerPlay']['Sec'] < 10 ? '0'+JsonData['PowerPlay']['Sec'] : JsonData['PowerPlay']['Sec']));
								
								// Показываем блок линии
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Block" ).removeClass("d-none");
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Block" ).addClass("d-block");
								// Если это первый удалённый
								if (LineNumber == 1) {
									$("#DeletePlayer" + Colum +"Block" ).removeClass("d-none");
									$("#DeletePlayer" + Colum +"Block" ).addClass("d-block");
								}
							}
							// Удаляем информацию об удаленном игроке
							else if (NewValue.Num == 0 && OldValue.Num > 0) {
								// Скрываем блок линии
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Block" ).removeClass("d-block");
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Block" ).addClass("d-none");

								// Если это последний удалённый для каждой команды
								if (LineNumber == 1) {
									$("#DeletePlayer" + Colum +"Block" ).removeClass("d-block");
									$("#DeletePlayer" + Colum +"Block" ).addClass("d-none");
								}
							}
							// Обновляем информацию об удаленном игроке
							else if (NewValue.Num != OldValue.Num || NewValue.Min != OldValue.Min || NewValue.Sec != OldValue.Sec) {
								//Задаем номер удаленного игрока
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Number").html(NewValue.Num);
								//Задаем время удаления игрока
								$("#DeletePlayer" + Colum +"Line" + LineNumber + "Time" ).html(NewValue.Min + ":" + (NewValue.Sec < 10 ? '0'+NewValue.Sec : NewValue.Sec));
								// Наибольшее время удаления левая и правая команда
								$("#DeletePlayer" + Colum +"Time").html(NewCol['Min'] + ":" + (NewCol['Sec'] < 10 ? '0'+NewCol['Sec'] : NewCol['Sec']));
								// Наибольшее время удаления всех
								$("#DeletePlayerOneLineTime").html(JsonData['PowerPlay']['Min'] + ":" + (JsonData['PowerPlay']['Sec'] < 10 ? '0'+JsonData['PowerPlay']['Sec'] : JsonData['PowerPlay']['Sec']));
							}
						}
					}

					// Скрываем блок всех удаленных
					if (JsonData['PowerPlay']['Left']['Line1']['Num'] == 0 && JsonData['PowerPlay']['Right']['Line1']['Num'] == 0) {
						$("#DeletePlayerOneLineBlock" ).removeClass("d-block");
						$("#DeletePlayerOneLineBlock" ).addClass("d-none");
					}
					// Показываем блок всех удаленных (Add)
					else if (JsonData['PowerPlay']['Left']['Line1']['Num'] == 0 && JsonData['PowerPlay']['Right']['Line1']['Num'] > 0) {
						$("#DeletePlayerOneLineBlock" ).removeClass("d-none");
						$("#DeletePlayerOneLineBlock" ).addClass("d-block");
					}
					else if (JsonData['PowerPlay']['Left']['Line1']['Num'] > 0  && JsonData['PowerPlay']['Right']['Line1']['Num'] == 0) {
						$("#DeletePlayerOneLineBlock" ).removeClass("d-none");
						$("#DeletePlayerOneLineBlock" ).addClass("d-block");
					}
					else if (JsonData['PowerPlay']['Left']['Line1']['Num'] > 0  && JsonData['PowerPlay']['Right']['Line1']['Num'] > 0) {
						$("#DeletePlayerOneLineBlock" ).removeClass("d-none");
						$("#DeletePlayerOneLineBlock" ).addClass("d-block");
					}

					// Выделяем Правую команду
					if (JsonData['PowerPlay']['Left']['Count'] > 0 && JsonData['PowerPlay']['Right']['Count'] == 0) {
						$(".CountClassLinePlayerRight").addClass("select");
						$("#CountClassCountPowerPlayScores_Text_PowerPlay").removeClass("d-none");
						$("#CountClassCountPowerPlayScores_Text_PowerPlay").addClass("d-block");
						$("#CountClassCountPowerPlayScores_Text_Both").removeClass("d-block");
						$("#CountClassCountPowerPlayScores_Text_Both").addClass("d-none");
					}
					// Выделяем Левую команду
					else if (JsonData['PowerPlay']['Left']['Count'] == 0 && JsonData['PowerPlay']['Right']['Count'] > 0) {
						$(".CountClassLinePlayerLeft").addClass("select");
						$("#CountClassCountPowerPlayScores_Text_PowerPlay").removeClass("d-none");
						$("#CountClassCountPowerPlayScores_Text_PowerPlay").addClass("d-block");
						$("#CountClassCountPowerPlayScores_Text_Both").removeClass("d-block");
						$("#CountClassCountPowerPlayScores_Text_Both").addClass("d-none");
					}
					else if (JsonData['PowerPlay']['Left']['Count'] > 0 && JsonData['PowerPlay']['Right']['Count'] > 0) {
						$(".CountClassLinePlayerLeft").removeClass("select");
						$(".CountClassLinePlayerRight").removeClass("select");
						if (JsonData['PowerPlay']['Left']['Count'] > 0 && JsonData['PowerPlay']['Right']['Count'] > 0) {
							$("#CountClassCountPowerPlayScores_Text_PowerPlay").removeClass("d-block");
							$("#CountClassCountPowerPlayScores_Text_PowerPlay").addClass("d-none");
							$("#CountClassCountPowerPlayScores_Text_Left").html((5-JsonData['PowerPlay']['Left']['Count']));
							$("#CountClassCountPowerPlayScores_Text_Right").html((5-JsonData['PowerPlay']['Right']['Count']));
							$("#CountClassCountPowerPlayScores_Text_Both").removeClass("d-none");
							$("#CountClassCountPowerPlayScores_Text_Both").addClass("d-block");
						}
					}
					else {
						$(".CountClassLinePlayerLeft").removeClass("select");
						$(".CountClassLinePlayerRight").removeClass("select");
					}
					EventDBLocal = JsonData;
				}
				// Первые данные
				else if (JsonData.dAction == 'InitBoardCount') {
					EventDB['CountPlayerLeft']      = JsonData.CountPlayerLeft;
					EventDB['CountPlayerRight']     = JsonData.CountPlayerRight;
					EventDB['PlayerLeftShortName']  = JsonData.PlayerLeft.ShortName;
					EventDB['PlayerLeftFullName']   = JsonData.PlayerLeft.FullName;
					EventDB['PlayerRightShortName'] = JsonData.PlayerRight.ShortName;
					EventDB['PlayerRightFullName']  = JsonData.PlayerRight.FullName;
					EventDB['Period']               = JsonData.Period;
					EventDB['Timer']                = JsonData.Timer;
					EventDB['BoardCountStatus']     = JsonData.BoardCountStatus;
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
				else if (BoardType == JsonData.Board || JsonData.Board == 'All') {
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
					switch (JsonData.dAction) {
						// Перезагрузить титры
						case 'Reload':
							window.location.href = window.location.href;
							document.location.reload();
							break;
						//Очистить экран --------------------------------------------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!
						case 'Clear':
							if (boardOpen['Count']) {
								cleanBoardPersonal();
							}
							break;
						//Показать: Счёт
						case 'ShowBoardCount':
						//Обновить: Счёт
						case 'UpdateBoardCount':
							showBoardCount(JsonData,'Count');
							break;
						//Скрыть: Счёт
						case 'HideCount':
							hideBoard('Count');
							break;
						//Показать: Логотип №1
						case 'ShowBoardLogo1':
							showBoardLogo1(JsonData,'Logo1');
							break;
						//Скрыть: Логотип №1
						case 'HideLogo1':
							hideBoard('Logo1');
							break;
						//Показать: Команды
						case 'ShowBoardStart':
							showBoardStart(JsonData,'Start');
							break;
						//Скрыть: Команды
						case 'HideStart':
							hideBoard('Start');
							break;
						//Показать: Стартовый состав команды
						case 'ShowBoardListPlayer':
							showBoardListPlayer(JsonData,'ListPlayer');
							break;
						//Скрыть: Стартовый состав команды
						case 'HideListPlayer':
							hideBoard('ListPlayer');
							break;
						//Показать: Стартовые пятерки команды
						case 'ShowBoardStart5Player':
							showBoardStart5Player(JsonData,'Start5Player');
							break;
						//Скрыть: Стартовые пятерки команды
						case 'HideStart5Player':
							hideBoard('Start5Player');
							break;
						//Показать: Стартовые пятерки обеих команд
						case 'ShowBoardStart5LeftAndRight':
							showBoardStart5LeftAndRight(JsonData,'Start5LeftAndRight');
							break;
						//Скрыть: Стартовые пятерки обеих команд
						case 'HideStart5LeftAndRight':
							hideBoard('Start5LeftAndRight');
							break;
						//Показать: Гео 
						case 'ShowBoardWelcome':
							showBoardWelcome('Welcome');
							break;
						//Скрыть: Гео
						case 'HideWelcome':
							hideBoard('Welcome');
							break;
						//Показать: Судейская бригада
						case 'ShowBoardJudges':
							showBoardJudges('Judges');
							break;
						//Скрыть: Судейская бригада
						case 'HideJudges':
							hideBoard('Judges');
							break;
						//Показать: Комментаторы
						case 'ShowBoardCommentators':
							showBoardCommentators('Commentators');
							break;
						//Скрыть: Комментаторы
						case 'HideCommentators':
							hideBoard('Commentators');
							break;
						//Показать: Тренер
						case 'ShowBoardTrainerTeam':
							showBoardTrainerTeam('TrainerTeam');
							break;
						//Скрыть: Тренер
						case 'HideTrainerTeam':
							hideBoard('TrainerTeam');
							break;
						//Показать: Игрок
						case 'ShowBoardPlayerTeam':
							showBoardPlayerTeam('PlayerTeam');
							break;
						//Скрыть: Игрок
						case 'HidePlayerTeam':
							hideBoard('PlayerTeam');
							break;
						//Показать: Хоккеист, забивший гол
						case 'ShowBoardPlayerGoal':
							showBoardPlayerGoal('PlayerGoal');
							break;
						//Скрыть: Хоккеист, забивший гол
						case 'HidePlayerGoal':
							hideBoard('PlayerGoal');
							break;
						//Показать карточку оштрафованного игрока
						case 'ShowBoardPlayerEjection':
							showBoardPlayerEjection('PlayerEjection');
							break;
						//Скрыть карточку оштрафованного игрока
						case 'HidePlayerEjection':
							hideBoard('PlayerEjection');
							break;
						//Гол
						case 'ShowBoardGoal':
							ShowBoardGoal();
							break;
						//Гол2
						case 'ShowBoardGoal2':
							ShowBoardGoal2('Goal2');
							break;
						//Скрыть гол2
						case 'HideGoal2':
							hideBoard('Goal2');
							break;
						//Показать счёт в конце периода
						case 'ShowBoardEndPeriod':
							showBoardEndPeriod('EndPeriod');
							break;
						//Скрыть счёт в конце периода
						case 'HideEndPeriod':
							hideBoard('EndPeriod');
							break;
						//Показать счёт в начале периода
						case 'ShowBoardStartPeriod':
							showBoardStartPeriod('StartPeriod');
							break;
						//Скрыть счёт в начале периода
						case 'HideStartPeriod':
							hideBoard('StartPeriod');
							break;
						//Показать раздевалку команды
						case 'ShowBoardTeamRoom':
							showBoardTeamRoom('TeamRoom');
							break;
						//Скрыть раздевалку команды
						case 'HideTeamRoom':
							hideBoard('TeamRoom');
							break;
						//Показать команду без вратаря, 6 человек на поле
						case 'ShowBoardEmptyNet':
							showBoardEmptyNet('EmptyNet');
							break;
						//Скрыть команду без вратаря, 6 человек на поле
						case 'HideEmptyNet':
							hideBoard('EmptyNet');
							break;
						//Показать Штрафной бросок (Пенальти)
						case 'ShowBoardPenaltyShot':
							showBoardPenaltyShot('PenaltyShot');
							break;
						//Скрыть Штрафной бросок (Пенальти)
						case 'HidePenaltyShot':
							hideBoard('PenaltyShot');
							break;
						//Показать Отложеный штраф
						case 'ShowBoardDelayedPenalty':
							showBoardDelayedPenalty('DelayedPenalty');
							break;
						//Скрыть Отложеный штраф
						case 'HideDelayedPenalty':
							hideBoard('DelayedPenalty');
							break;
						//Показать 
						case 'ShowBoardPullGoalie':
							showBoardPullGoalie('PullGoalie');
							break;
						//Скрыть 
						case 'HidePullGoalie':
							hideBoard('PullGoalie');
							break;
						//Показать: Послематчевые буллиты от 1 до 5 бросков
						case 'ShowBoardShootout_1_5':
							showBoardShootout(JsonData,'Shootout_1_5');
							break;
						//Скрыть: Послематчевые буллиты от 1 до 5 бросков
						case 'HideShootout_1_5':
							hideBoard('Shootout_1_5');
							break;
						//Показать: Послематчевые буллиты от 6 до 10 бросков
						case 'ShowBoardShootout_6_10':
							showBoardShootout(JsonData,'Shootout_6_10');
							break;
						//Скрыть: Послематчевые буллиты от 6 до 10 бросков
						case 'HideShootout_6_10':
							hideBoard('Shootout_6_10');
							break;
						//Показать: Послематчевые буллиты от 11 до 15 бросков
						case 'ShowBoardShootout_11_15':
							showBoardShootout(JsonData,'Shootout_11_15');
							break;
						//Скрыть: Послематчевые буллиты от 11 до 15 бросков
						case 'HideShootout_11_15':
							hideBoard('Shootout_11_15');
							break;
						//Обновить: Послематчевые буллиты
						case 'ShowBoardShootoutUpdate':
							showBoardShootoutUpdate(JsonData, 'ShootoutUpdate');
							break;
						//Показать: Перерыв
						case 'ShowBoardPause':
							showBoardPause('Pause');
							break;
						//Скрыть: перерыва
						case 'HidePause':
							hideBoard('Pause');
							break;
						//Показать: Финальный счёт
						case 'ShowBoardFinalResultBottom':
							showBoardFinalResultBottom('FinalResultBottom');
							break;
						//Скрыть: Финальный счёт
						case 'HideFinalResultBottom':
							hideBoard('FinalResultBottom');
							break;
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
	function showBoardTimer(JsonData,Action) {
		$("#root_boardTimer").html(FS_BoardTimer({
			'Timer':        '0  00:00'
		}));
		setInterval(currentTime, 1);
		showBoardAnimation("Timer");
	}
	function showBoardCount(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action] || (!boardOpen[Action] && JsonData.dAction == 'UpdateBoardCount')) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		let tempSec = '00';
		let tempMSec = '00';
		if (JsonData.TimerSecondes < 10) {
			tempSec = "0" + JsonData.TimerSecondes;
		}
		else {
			tempSec = JsonData.TimerSecondes;
		}
		if (JsonData.TimerMSeconds == null) {
			tempMSec = JsonData.TimerMSeconds;
		}
		else {
			tempMSec = JsonData.TimerMSeconds;
		}
		let tempPeriodEN = '0';
		let tempPeriod = '0';
		if (JsonData.Period.Count == 1) {
			tempPeriodEN = JsonData.Period.Count + "<span class='CountPeriodUP'>ST</span>";
			tempPeriod = JsonData.Period.Count;
		}
		else if (JsonData.Period.Count == 2) {
			tempPeriodEN = JsonData.Period.Count + "<span class='CountPeriodUP'>ND</span>";
			tempPeriod = JsonData.Period.Count;
		}
		else if (JsonData.Period.Count == 3) {
			tempPeriodEN = JsonData.Period.Count + "<span class='CountPeriodUP'>RD</span>";
			tempPeriod = JsonData.Period.Count;
		}
		else if (JsonData.Period.Count == 4) {
			tempPeriodEN = 'OT';
			tempPeriod = 'OT';
		}
		else if (JsonData.Period.Count == 5) {
			tempPeriodEN = 'SO';
			tempPeriod = 'SO';
		}
		else {
			tempPeriodEN = JsonData.Period.Count;
			tempPeriod = JsonData.Period.Count;
		}
		if (JsonData.dAction != 'UpdateBoardCount') {
			if (debuging != false) {console.log('Action: ' + JsonData.dAction);};
			$("#root_boardCount").html(FS_BoardCount({
				'CountPlayerLeft':      JsonData.CountPlayerLeft.Count,
				'CountPlayerRight':     JsonData.CountPlayerRight.Count,
				'PlayerLeftShortName':  JsonData.PlayerLeft.ShortName,
				'PlayerLeftFullName' :  JsonData.PlayerLeft.FullName,
				'PlayerLeftPlace':      JsonData.PlayerRight.Place,
				'PlayerRightShortName': JsonData.PlayerRight.ShortName,
				'PlayerRightFullName':  JsonData.PlayerRight.FullName,
				'PlayerRightPlace':     JsonData.PlayerRight.Place,
				'Period':               tempPeriod,
				'PeriodEN':             tempPeriodEN,
				'Timer':                '00:00',
			}));
			$("#CountClassPlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
			$("#CountClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
			$("#CountClassLayer_Goal_LeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
			$("#CountClassLayer_Goal_RightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
		}
		$("#CountClassCountPlayerLeft").html(JsonData.CountPlayerLeft.Count);
		$("#CountClassCountPlayerRight").html(JsonData.CountPlayerRight.Count);
		$("#CountClassPlayerLeftFullName"  ).html(JsonData.PlayerLeft.FullName);
		$("#CountClassPlayerLeftShortName" ).html(JsonData.PlayerLeft.ShortName);
		$("#CountClassPlayerLeftPlace" ).html(JsonData.PlayerLeft.Place);
		$("#CountClassPlayerRightFullName" ).html(JsonData.PlayerRight.FullName);
		$("#CountClassPlayerRightShortName").html(JsonData.PlayerRight.ShortName);
		$("#CountClassPlayerRightPlace").html(JsonData.PlayerRight.Place);
		$("#CountIdPeriod").html(JsonData.Period.Count);
		$("#CountENPeriod").html(tempPeriodEN);
		if (JsonData.TimerMinutes == 0 && JsonData.TimerType.Count == 1) {
			$("#CountClassTime").html("0:" + tempSec + "." + tempMSec);
		}
		else {
			$("#CountClassTime").html(JsonData.TimerMinutes + ":" + tempSec);
		}

		if (JsonData.DelPlayer.Left1.Num > 0) {
			$(".CountClassDeletePlayerLeft>div:nth-child(1)>.Num").html(JsonData.DelPlayer.Left1.Num);
			$(".CountClassDeletePlayerLeft>div:nth-child(1)>.Time" ).html(JsonData.DelPlayer.Left1.Min + ":" + (JsonData.DelPlayer.Left1.Sec < 10 ? '0'+JsonData.DelPlayer.Left1.Sec : JsonData.DelPlayer.Left1.Sec));
			$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-none");
			$(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-block");
		}
		if (JsonData.DelPlayer.Left2.Num > 0) {
			$(".CountClassDeletePlayerLeft>div:nth-child(2)>.Num").html(JsonData.DelPlayer.Left2.Num);
			$(".CountClassDeletePlayerLeft>div:nth-child(2)>.Time").html(JsonData.DelPlayer.Left2.Min + ":" + (JsonData.DelPlayer.Left2.Sec < 10 ? '0'+JsonData.DelPlayer.Left2.Sec : JsonData.DelPlayer.Left2.Sec));
			$(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-none");
			$(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-block");
		}
		if (JsonData.DelPlayer.Left3.Num > 0) {
			$(".CountClassDeletePlayerLeft>div:nth-child(3)>.Num").html(JsonData.DelPlayer.Left3.Num);
			$(".CountClassDeletePlayerLeft>div:nth-child(3)>.Time").html(JsonData.DelPlayer.Left3.Min + ":" + (JsonData.DelPlayer.Left3.Sec < 10 ? '0'+JsonData.DelPlayer.Left3.Sec : JsonData.DelPlayer.Left3.Sec));
			$(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-none");
			$(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-block");
		}
		if (JsonData.DelPlayer.Right1.Num > 0) {
			$(".CountClassDeletePlayerRight>div:nth-child(1)>.Num").html(JsonData.DelPlayer.Right1.Num);
			$(".CountClassDeletePlayerRight>div:nth-child(1)>.Time").html(JsonData.DelPlayer.Right1.Min + ":" + (JsonData.DelPlayer.Right1.Sec < 10 ? '0'+JsonData.DelPlayer.Right1.Sec : JsonData.DelPlayer.Right1.Sec));
			$(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-none");
			$(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-block");
		}
		if (JsonData.DelPlayer.Right2.Num > 0) {
			$(".CountClassDeletePlayerRight>div:nth-child(2)>.Num").html(JsonData.DelPlayer.Right2.Num);
			$(".CountClassDeletePlayerRight>div:nth-child(2)>.Time").html(JsonData.DelPlayer.Right2.Min + ":" + (JsonData.DelPlayer.Right2.Sec < 10 ? '0'+JsonData.DelPlayer.Right2.Sec : JsonData.DelPlayer.Right2.Sec));
			$(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-none");
			$(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-block");
		}
		if (JsonData.DelPlayer.Right3.Num > 0) {
			$(".CountClassDeletePlayerRight>div:nth-child(3)>.Num").html(JsonData.DelPlayer.Right3.Num);
			$(".CountClassDeletePlayerRight>div:nth-child(3)>.Time").html(JsonData.DelPlayer.Right3.Min + ":" + (JsonData.DelPlayer.Right3.Sec < 10 ? '0'+JsonData.DelPlayer.Right3.Sec : JsonData.DelPlayer.Right3.Sec));
			$(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-none");
			$(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-block");
		}
		if (JsonData.Period.Count == 0) {
			$("#CountClassPeriodBlock").removeClass("d-blockinline");
			$("#CountClassPeriodBlock").addClass("d-none");
		}
		else {
			$("#CountClassPeriodBlock").removeClass("d-none");
			$("#CountClassPeriodBlock").addClass("d-blockinline");
		}
		if (JsonData.TimerType.Count == 2) {
			$("#CountClassTimeOut").removeClass("d-blockinline");
			$("#CountClassTimeOut").addClass("d-none");
			if (JsonData.Period.Count == 0) {
				$("#CountClassPause").removeClass("d-blockinline");
				$("#CountClassPause").addClass("d-none");
				$("#CountClassWarmUp").removeClass("d-none");
				$("#CountClassWarmUp").addClass("d-blockinline");
			}
			else {
				$("#CountClassPause").removeClass("d-none");
				$("#CountClassPause").addClass("d-blockinline");
				$("#CountClassWarmUp").removeClass("d-blockinline");
				$("#CountClassWarmUp").addClass("d-none");
			}
		}
		else if (JsonData.TimerType.Count == 3 || JsonData.TimerType.Count == 4) {
			$("#CountClassPause").removeClass("d-blockinline");
			$("#CountClassPause").addClass("d-none");
			$("#CountClassTimeOut").removeClass("d-none");
			$("#CountClassTimeOut").addClass("d-blockinline");
			if (JsonData.TimerType.Count == 4) {
				$("#CountClassTimeOutLeft").removeClass("d-none");
				$("#CountClassTimeOutLeft").addClass("d-blockinline");
			}
			else {
				$("#CountClassTimeOutRight").removeClass("d-none");
				$("#CountClassTimeOutRight").addClass("d-blockinline");
			}
		}
		else {
			$("#CountClassPause").removeClass("d-blockinline");
			$("#CountClassPause").addClass("d-none");
			$("#CountClassTimeOut").removeClass("d-blockinline");
			$("#CountClassTimeOut").addClass("d-none");
			$("#CountClassWarmUp").removeClass("d-blockinline");
			$("#CountClassWarmUp").addClass("d-none");
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
		let i = 1;
		JsonData.Player.Security.forEach(function(Value){
			if (Value.Enable == 1 && i <= 8) {
				PlayerSecurity += "<tr><td>" + Value.Key + "</td><td>" + Value.FullName + "</td></tr>";
				i++;
			}
		});
		var PlayerNapadenie = "<table>";
		i = 1;
		JsonData.Player.Napadenie.forEach(function(Value){
			if (Value.Enable == 1 && i <= 13) {
				PlayerNapadenie += "<tr><td>" + Value.Key + "</td><td>" + Value.FullName + "</td></tr>";
				i++;
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
			'TeamPlayer-LF-Number' : JsonData.Player.LF.Number,
			'TeamPlayer-LF-FullName' : JsonData.Player.LF.FullName,
			'TeamPlayer-RF-Number' : JsonData.Player.RF.Number,
			'TeamPlayer-RF-FullName' : JsonData.Player.RF.FullName,
			'TeamPlayer-CF-Number' : JsonData.Player.CF.Number,
			'TeamPlayer-CF-FullName' : JsonData.Player.CF.FullName,
			'TeamPlayer-RD-Number' : JsonData.Player.RD.Number,
			'TeamPlayer-RD-FullName' : JsonData.Player.RD.FullName,
			'TeamPlayer-LD-Number' : JsonData.Player.LD.Number,
			'TeamPlayer-LD-FullName' : JsonData.Player.LD.FullName,
			'TeamPlayer-GT-Number' : JsonData.Player.GT.Number,
			'TeamPlayer-GT-FullName' : JsonData.Player.GT.FullName,
		}));		
		$("#TeamLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Player.Logo + ".png')");
		$("#TeamRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Player.Logo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardStart5LeftAndRight(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		console.log(JsonData.Team);
		$("#root_boardStart5LeftAndRight").html(FS_BoardStart5LeftAndRight({
			'TeamLeft-LF-Number' : JsonData.Team.Left.LF.Number,
			'TeamLeft-LF-FullName' : JsonData.Team.Left.LF.FullName,
			'TeamLeft-RF-Number' : JsonData.Team.Left.RF.Number,
			'TeamLeft-RF-FullName' : JsonData.Team.Left.RF.FullName,
			'TeamLeft-CF-Number' : JsonData.Team.Left.CF.Number,
			'TeamLeft-CF-FullName' : JsonData.Team.Left.CF.FullName,
			'TeamLeft-RD-Number' : JsonData.Team.Left.RD.Number,
			'TeamLeft-RD-FullName' : JsonData.Team.Left.RD.FullName,
			'TeamLeft-LD-Number' : JsonData.Team.Left.LD.Number,
			'TeamLeft-LD-FullName' : JsonData.Team.Left.LD.FullName,
			'TeamLeft-GT-Number' : JsonData.Team.Left.GT.Number,
			'TeamLeft-GT-FullName' : JsonData.Team.Left.GT.FullName,
			'TeamRight-LF-Number' : JsonData.Team.Right.LF.Number,
			'TeamRight-LF-FullName' : JsonData.Team.Right.LF.FullName,
			'TeamRight-RF-Number' : JsonData.Team.Right.RF.Number,
			'TeamRight-RF-FullName' : JsonData.Team.Right.RF.FullName,
			'TeamRight-CF-Number' : JsonData.Team.Right.CF.Number,
			'TeamRight-CF-FullName' : JsonData.Team.Right.CF.FullName,
			'TeamRight-RD-Number' : JsonData.Team.Right.RD.Number,
			'TeamRight-RD-FullName' : JsonData.Team.Right.RD.FullName,
			'TeamRight-LD-Number' : JsonData.Team.Right.LD.Number,
			'TeamRight-LD-FullName' : JsonData.Team.Right.LD.FullName,
			'TeamRight-GT-Number' : JsonData.Team.Right.GT.Number,
			'TeamRight-GT-FullName' : JsonData.Team.Right.GT.FullName,
		}));
		$("#TeamLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Team.Left.Logo + ".png')");
		$("#TeamRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Team.Right.Logo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardWelcome(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		var today = new Date();
		var time = ((today.getHours() < 10)?"0":"") + today.getHours() + ":" + ((today.getMinutes() < 10)?"0":"") + today.getMinutes();
		var date = ((today.getDate() < 10)?"0":"") + today.getDate()+'.'+(((today.getMonth()+1) < 10)?"0":"")+(today.getMonth()+1)+'.'+today.getFullYear();

		var Weather = "z";
		// Ясно
		if (JsonData.Weather.Cloudiness == 0) {
			Weather = "d";
		}
		// Малооблачно
		else if (JsonData.Weather.Cloudiness == 1) {
			Weather = "d_c" + JsonData.Weather.Cloudiness;
		}
		// Облачно
		else if (JsonData.Weather.Cloudiness == 2) {
			Weather = "d_c" + JsonData.Weather.Cloudiness;
		}
		// Пасмурно
		else if (JsonData.Weather.Cloudiness == 3) {
			Weather = "c" + JsonData.Weather.Cloudiness;
		}

		if (JsonData.Weather.Cloudiness >= 1) {

			if (JsonData.Weather.PrecipitationType == 1) {
				Weather = Weather + "_r";
			}
			else if (JsonData.Weather.PrecipitationType == 2) {
				Weather = Weather + "_s";
			}
			else if (JsonData.Weather.PrecipitationType == 3) {
				Weather = Weather + "_rs";
			}
			if (JsonData.Weather.PrecipitationType > 0 && JsonData.Weather.PrecipitationIntensity > 0) {
				Weather = Weather + JsonData.Weather.PrecipitationIntensity;
			}
		}
		else {
			// GameWeatherPrecipitationIntensity disable
		}
		if (JsonData.Weather.Storm == 1) {
			Weather = Weather + "_st";
		}

		$('#root_board' + Action).html(FS_BoardWelcome({
			'ArenaName':       JsonData.ArenaName,
			'Place':           JsonData.Place,
			'Date':            date,
			'LocalTime':       time,
			'Weather':     Weather,
			'Temperature': JsonData.Weather.Temperature,
		}));
		timerWelcome = setInterval(function() {
			let today = new Date();
			let time = ((today.getHours() < 10)?"0":"") + today.getHours() + ":" + ((today.getMinutes() < 10)?"0":"") + today.getMinutes();
			$('#LocalTime').html(time);
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
				//$('.JudgesClassLinesTitle').html("Линейный судья");
				$('.JudgesClassFourth').addClass("JudgesClassLinesHide");
			}
			else {
				//$('.JudgesClassLinesTitle').html("Линейные судьи");
			}

			if (JsonData.JudgeSecond.UID == "") {
				//$('.JudgesClassBossTitle').html("Главный судья");
				$('.JudgesClassSecond').addClass("JudgesClassLinesHide");
			}
			else {
				//$('.JudgesClassBossTitle').html("Главные судьи");
			}
			showBoardAnimation(Action);
		}
	}
	function showBoardCommentators(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		if (JsonData.Commentators[2] == null) {
			JsonData.Commentators[2] = {
				'FullName': ''
			};
		}
		$('#root_board' + Action).html(FS_BoardCommentators({
			'CommentatorFirst':  JsonData.Commentators[1]['FullName'],
			'CommentatorSecond': JsonData.Commentators[2]['FullName']
		}));
		if (JsonData.Commentators[2]['FullName'] != "") {
			$('#Commentators_One').addClass("d-none");
			$('#Commentators_Two').removeClass("d-none");
		}
		else {
			$('#Commentators_One').removeClass("d-none");
			$('#Commentators_Two').addClass("d-none");
		}
		showBoardAnimation(Action);
	}
	function ShowBoardGoal() {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (debuging != false) {console.log('Action: Show Goal');};
		$('.CountClassLayer_Goal').addClass("CountClassGoalAnimation");
		$('.CountClassLayer_Goal_Text').removeClass("d-none");
		$('.CountClassLayer_Goal_Text').addClass("d-block");
		if (JsonData.TeamPosition == 'Left') {
			$('#CountClassLayer_Goal_LeftLogo').addClass("CountClassGoalAnimation");
		}
		else {
			$('#CountClassLayer_Goal_RightLogo').addClass("CountClassGoalAnimation");
		}
		setTimeout(function() {
			$('.CountClassLayer_Goal').removeClass("CountClassGoalAnimation");
			$('.CountClassLayer_Goal_Text').removeClass("d-block");
			$('.CountClassLayer_Goal_Text').addClass("d-none");
			$('#CountClassLayer_Goal_LeftLogo').removeClass("CountClassGoalAnimation");
			$('#CountClassLayer_Goal_RightLogo').removeClass("CountClassGoalAnimation");
		}, 5000);
	}
	function ShowBoardGoal2(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (debuging != false) {console.log('Action: Show Goal');};
		$('#root_board' + Action).html(FS_BoardGoal2());
		$("#Goal2ClassLayer_Logo").css('background-image',"url('LogoTeamLocal/" + JsonData.Logo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardTrainerTeam(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardTrainerTeam({
			'Title':    JsonData.TrainerTitle,
			'FullName': JsonData.TrainerFullName
		}));
		$("#TeamLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.TeamLogo + ".png')");
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
			'RoleEN': RolePlayer_en[JsonData.Value.Role],
			'Position': JsonData.Value.Position
		}));
		$("#PlayerTeamPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Value.Photo + ".png')");
		$("#TeamLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Value.TeamLogo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardPlayerGoal(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardPlayerGoal({
			'Number':  JsonData.Value.Key,
			'ShortName':  JsonData.Value.ShortName,
			'FullName': JsonData.Value.FullName,
			'Role': RolePlayer[JsonData.Value.Role],
			'RoleEN': RolePlayer_en[JsonData.Value.Role],
			'Position': JsonData.Value.Position
		}));
		$("#PlayerTeamPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Value.Photo + ".png')");
		$("#TeamLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Value.TeamLogo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardPlayerEjection(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardPlayerEjection({
			'Number':  JsonData.Value.Key,
			'ShortName':  JsonData.Value.ShortName,
			'FullName': JsonData.Value.FullName,
			'Role': RolePlayer[JsonData.Value.Role],
			'RoleEN': RolePlayer_en[JsonData.Value.Role],
			'Position': JsonData.Value.Position
		}));
		$("#PlayerTeamPhoto").css('background-image',"url('PhotoPlayersLocal/" + JsonData.Value.Photo + ".png')");
		$("#TeamLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Value.TeamLogo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardEndPeriod(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardEndPeriod(JsonData));
		$("#PlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
		$("#PlayerRightLogo").css('background-image','url("LogoTeamLocal/' + JsonData.PlayerRight.Logo + '.png")');
		showBoardAnimation(Action);
	}
	function showBoardStartPeriod(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardStartPeriod(JsonData));
		$("#PlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
		$("#PlayerRightLogo").css('background-image','url("LogoTeamLocal/' + JsonData.PlayerRight.Logo + '.png")');
		showBoardAnimation(Action);
	}
	function showBoardTeamRoom(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		$('#root_board' + Action).html(FS_BoardTeamRoom({
			'TeamName':  JsonData.TeamName
		}));
		$("#TeamRoomLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.TeamLogo + ".png')");
		showBoardAnimation(Action);
	}
	function showBoardShootout(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action] || (!boardOpen[Action] && JsonData.dAction == 'UpdateBoardShootout')) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};

		if (JsonData.dAction != 'UpdateBoardShootout') {
			if (debuging != false) {console.log(JsonData);};
			$("#root_boardShootout_1_5").html(FS_BoardShootout_1_5({
				'Shootout':           JsonData.Shootout,
				'TeamLeftShortName':  JsonData.Left.ShortName,
				'TeamRightShortName': JsonData.Right.ShortName,
			}));
			$("#ShootoutTeamLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Left.Logo + ".png')");
			$("#ShootoutTeamRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.Right.Logo + ".png')");
		}

		if (JsonData.dAction != 'UpdateBoardShootout') {
			showBoardAnimation(Action);
		}
	}
	function showBoardShootoutUpdate(JsonData,Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		//if (!boardOpen[Action]) {return;}
		Object.entries(JsonData.Value).forEach(([key, value]) => {
			let LineNumber = Number(key)+1;
			if (key != 'Result') {
				let BoardIDHintLeft  = document.getElementById('ShootoutLayer' + LineNumber + '_Left_Hit');
				let BoardIDPastLeft  = document.getElementById('ShootoutLayer' + LineNumber + '_Left_Past');
				let BoardIDEmptyLeft = document.getElementById('ShootoutLayer' + LineNumber + '_Left_Empty');
				let BoardIDHintRight  = document.getElementById('ShootoutLayer' + LineNumber + '_Right_Hit');
				let BoardIDPastRight  = document.getElementById('ShootoutLayer' + LineNumber + '_Right_Past');
				let BoardIDEmptyRight = document.getElementById('ShootoutLayer' + LineNumber + '_Right_Empty');
				console.log('ShootoutLayer' + LineNumber + '_Left_Hit');
				if (key > 0 && key < 16 && value['Left'] == 2) {
					BoardIDHintLeft.classList.add("d-none");
					BoardIDPastLeft.classList.remove("d-none");
					BoardIDEmptyLeft.classList.add("d-none");
				}
				else if (key > 0 && key < 16 && value['Left'] == 1) {
					BoardIDHintLeft.classList.remove("d-none");
					BoardIDPastLeft.classList.add("d-none");
					BoardIDEmptyLeft.classList.add("d-none");
				}
				else if (key > 0 && key < 16 && value['Left'] == 0) {
					BoardIDHintLeft.classList.add("d-none");
					BoardIDPastLeft.classList.add("d-none");
					BoardIDEmptyLeft.classList.remove("d-none");
				}
				if (key > 0 && key < 16 && value['Right'] == 2) {
					BoardIDHintRight.classList.add("d-none");
					BoardIDPastRight.classList.remove("d-none");
					BoardIDEmptyRight.classList.add("d-none");
				}
				else if (key > 0 && key < 16 && value['Right'] == 1) {
					BoardIDHintRight.classList.remove("d-none");
					BoardIDPastRight.classList.add("d-none");
					BoardIDEmptyRight.classList.add("d-none");
				}
				else if (key > 0 && key < 16 && value['Right'] == 0) {
					BoardIDHintRight.classList.add("d-none");
					BoardIDPastRight.classList.add("d-none");
					BoardIDEmptyRight.classList.remove("d-none");
				}
			}
			if (key == 'Result') {
				$("#Shootout_Result_Left").html(value['Left']);
				$("#Shootout_Result_Right").html(value['Right']);
			}
		});
	}
	function showBoardFinalResultBottom(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		$('#root_board' + Action).html(FS_BoardFinalResultBottom({
			'PlayerLeft':  JsonData.PlayerLeft,
			'PlayerRight': JsonData.PlayerRight,
			'CountLeft':  JsonData.CountLeft,
			'CountRight': JsonData.CountRight
		}));
		$("#PlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
		$("#PlayerRightLogo").css('background-image','url("LogoTeamLocal/' + JsonData.PlayerRight.Logo + '.png")');
		showBoardAnimation(Action);
	}
	function showBoardPause(Action) {
		if (LocationIsStatic && JsonData.dAction != LocationStaticAction) {return;}
		if (boardOpen[Action] && JsonData.dAction == 'Update') {}
		else if (boardOpen[Action]) {return;}
		if (debuging != false) {console.log('Action: ' + Action);};
		let tempSec = '00';
		
		
		if (JsonData.dAction != 'Update') {
			if (debuging != false) {console.log('Action: ' + JsonData.dAction);};
			if (JsonData.TimerSecondes < 10) {
				tempSec = "0" + JsonData.TimerSecondes;
			}
			else {
				tempSec = JsonData.TimerSecondes;
			}
			$("#root_boardPause").html(FS_BoardPause({
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
				'Time':             JsonData.TimerMinutes + ":" + tempSec,
			}));
			$("#PauseClassPlayerLeftLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerLeft.Logo + ".png')");
			$("#PauseClassPlayerRightLogo").css('background-image',"url('LogoTeamLocal/" + JsonData.PlayerRight.Logo + ".png')");
		}
		else {
			if (JsonData.Timer.Sec < 10) {
				tempSec = "0" + JsonData.Timer.Sec;
			}
			else {
				tempSec = JsonData.Timer.Sec;
			}
			$("#PauseIDTime").html(JsonData.Timer.Min + ":" + tempSec);
		}
		

		if (JsonData.dAction != 'Update') {
			showBoardAnimation(Action);
		}
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
		if (LocationIsStatic) {
			boardOpen[Action] = true;
		}
	}
	function hideBoard(Action) {
		if (boardOpen[Action]) {
			if (debuging != false) {console.log('Animation: Hide board ' + Action + ' START');};
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
	function currentTime() {
		let now = new Date();
		let msec = now.getMilliseconds(),
			sec = now.getSeconds(),
			min = now.getMinutes(),
			hour = now.getHours(),
			month = now.getMonth(),
			day = now.getDate(),
			year = now.getFullYear();
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + (month+1) : (month+1);
		hour = hour < 10 ? "0" + hour : hour;
		min  = min < 10 ? "0" + min : min;
		sec  = sec < 10 ? "0" + sec : sec;
		msec  = msec < 100 ? "0" + msec : msec;
		msec  = msec < 10 ? "00" + msec : msec;

		// Displaying the time
		document.getElementById("CurrentTime").innerHTML = day + "." + month + "." + year +"   " + hour + ":" + min + ":" + sec +":" + msec.toString().substr(0, 1);
	}
	connect();
	
	if (LocationIsStatic) {
		if (LocationStaticAction == 'ShowBoardTimer') {
			
			showBoardTimer(null,'Timer');
		}
	}
});
