
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
 const AdminApp = {
	data() {
		return {
			status: [
                { id: 0, value: 'Вкл' },
                { id: 1, value: 'Откл' }
            ],
			start5: [
                { id: 0, value: 'Вкл' },
                { id: 1, value: 'Откл' }
            ],
			role: [
                { id: 'FF', value: 'Нападающий', position: ['FF','LF','RF','CF'] },
                { id: 'DD', value: 'Защитник', position: ['DD','LD','RD'] },
				{ id: 'GT', value: 'Вратарь', position: ['GT'] }
            ],
			position: [
                { id: 'LF', value: 'Левый нападающий' },
                { id: 'RF', value: 'Правый нападающий' },
				{ id: 'CF', value: 'Центральный нападающий' },
				{ id: 'GT', value: 'Вратарь' },
				{ id: 'FF', value: 'Нападающий' },
				{ id: 'DD', value: 'Защитник' },
				{ id: 'LD', value: 'Левый защитник' },
                { id: 'RD', value: 'Правый защитник' }
            ],
			disabled: 0,
			statusTrueValue: 1,
			statusFalseValue: 0,
			status: [
                { id: 0, value: 'Вкл' },
                { id: 1, value: 'Откл' }
            ],
			Event: {},
			EventSelected: 0,
			EventSelectedInfo: {},
			EventsList: {
				0: {
					Key: 0,
					Name: 'Выберите мероприятие'
				}
			},
			GameName: {},
			GamePlace: {},
			Teams: {},
			ChangeTeamLeft: 0,
			ChangeTeamRight: 0,
			StyleSelectedTeamLeft: {
				color: 'red'
			},
			StyleSelectedTeamRight: {
				color: 'red'
			},
			StyleSelectedGamePlace: {
				color: 'red'
			},
			StyleSelectedGameName: {
				color: 'red'
			},
			StyleSelectedJudgeFirst: {
				color: 'red'
			},
			StyleSelectedJudgeSecond: {
				color: 'green'
			},
			StyleSelectedJudgeThird: {
				color: 'green'
			},
			StyleSelectedJudgeFourth: {
				color: 'green'
			},
			StyleSelectedCommentatorFirst: {
				color: 'red'
			},
			StyleSelectedCommentatorSecond: {
				color: 'red'
			}
		}
	},
    methods: {
		saveEventList() {
			if ((this.Event.JudgeSecond.UID != "" && this.Event.JudgeThird.UID == "") || (this.Event.JudgeSecond.UID != "" && this.Event.JudgeFourth.UID == "")) {
				var myModalSecondJudge = new bootstrap.Modal(document.getElementById('ModalSecondJudge'), {
					keyboard: false
				});
				myModalSecondJudge.show();
			}
			else if (this.Event.PlayerLeft.UID == "" ||
				this.Event.PlayerRight.UID == "" ||
				this.Event.JudgeFirst.UID == "" ||
				this.Event.CommentatorFirst.UID == "" ||
				this.Event.GameName.UID == "" || 
				this.Event.GamePlace.UID == "" || 
				this.Event.GameDate == "" || 
				this.Event.GameTime == "" ) {
				var myModal = new bootstrap.Modal(document.getElementById('ModalEmpty'), {
					keyboard: false
				});
				myModal.show();
			}
			else {
				this.SendOrGetData('SaveEventList', true, {'Value': {
					'Key': this.EventSelected,
					'ChangeTeamLeft': this.ChangeTeamLeft,
					'ChangeTeamRight': this.ChangeTeamRight,
					'Event': this.Event
				}}, true);
			}
		},
		deleteEventList() {
			this.SendOrGetData('DeleteEventList', true, {'Value': this.EventSelected}, true);
			this.EventSelected = 0;
		},
		createEventList() {
			this.SendOrGetData('CreateEventList', true, {'Value': false}, true);
		},
		getEvent(EventUID) {
			if (this.EventSelected != 0) {
				this.ChangeTeamLeft = 0;
				this.ChangeTeamRight = 0;
				this.SendOrGetData('GetAllDBEvent', true, {'Value': EventUID}, true);
			}
		},
		changeTeamLeft() {
			this.ChangeTeamLeft = 1;
			this.StyleSelectedTeamLeft.color = "green";
		},
		changeTeamRight() {
			this.ChangeTeamRight = 1;
			this.StyleSelectedTeamRight.color = "green";	
		},
		changeGamePlace() {
			this.StyleSelectedGamePlace.color = "green";
		},
		changeGameName() {
			this.StyleSelectedGameName.color = "green";	
		},
		changeJudgeFirst() {
			this.StyleSelectedJudgeFirst.color = "green";	
		},
		changeJudgeSecond() {
			this.StyleSelectedJudgeSecond.color = "green";	
		},
		changeJudgeThird() {
			this.StyleSelectedJudgeThird.color = "green";	
		},
		changeJudgeFourth() {
			this.StyleSelectedJudgeFourth.color = "green";	
		},
		changeCommentatorFirst() {
			this.StyleSelectedCommentatorFirst.color = "green";	
		},
		changeCommentatorSecond() {
			this.StyleSelectedCommentatorSecond.color = "green";	
		},
		SendOrGetData(Action,SendJson,JsonDataOut,returnData) {
			var data = this;
			let ws;
			ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			ws.onopen = function() {
				console.log('WebSocket connected');
				console.log("Action " + Action);
				var msg = {
					"Action": Action
				};
				if (SendJson && JsonDataOut) {
					ws.send(JSON.stringify(Object.assign({},msg, JsonDataOut)));
				}
				else {
					ws.send(JSON.stringify(msg));
				}
				if (!returnData) {
					ws.close();
				}
				
			};
			ws.onmessage = function(evt) {
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListEvents") {
					data.EventsList = null;
					data.EventsList = JSONData.ListEvents;
					data.EventSelectedInfo = JSONData.SelectEvent;
				}
				else if (JSONData['dAction'] == "ListAllDBEvent") {
					data.Event = JSONData.Event;
					if (!data.Event.CommentatorFirst) {
						data.Event.CommentatorFirst = {};
					}
					if (!data.Event.CommentatorSecond) {
						data.Event.CommentatorSecond = {};
					}
					//console.log(data.Event);
					/*data.TeamLeftSelected  = data.Event.PlayerLeft.UID;
					data.TeamRightSelected = data.Event.PlayerRight.UID;
					data.GameNameSelected  = data.Event.GameName.UID;
					data.GamePlaceSelected = data.Event.GamePlace.UID;*/
					// Команды
					data.Teams = JSONData.TeamArray;
					// Название игры
					data.GameName = JSONData.GameNameArray;
					// Место проведения игры
					data.GamePlace = JSONData.GamePlaceArray;
					// Судьи
					data.Judges = JSONData.JudgesArray;
					// Комментаторы
					data.Commentators = JSONData.CommentatorsArray;
					
					if (data.Event.PlayerLeft.UID != "") {
						data.StyleSelectedTeamLeft.color  = "green";
					}
					else {
						data.StyleSelectedTeamLeft.color  = "red";
					}
					if (data.Event.PlayerRight.UID != "") {
						data.StyleSelectedTeamRight.color = "green";
					}
					else {
						data.StyleSelectedTeamRight.color  = "red";
					}
					if (data.Event.GameName.UID != "") {
						data.StyleSelectedGameName.color  = "green";
					}
					else {
						data.StyleSelectedGameName.color  = "red";
					}
					if (data.Event.GamePlace.UID != "") {
						data.StyleSelectedGamePlace.color = "green";
					}
					else {
						data.StyleSelectedGamePlace.color  = "red";
					}
					if (data.Event.JudgeFirst.UID != "") {
						data.StyleSelectedJudgeFirst.color = "green";
					}
					else {
						data.StyleSelectedJudgeFirst.color  = "red";
					}
					/*if (data.Event.JudgeSecond.UID != "") {
						data.StyleSelectedJudgeSecond.color = "green";
					}
					else {
						data.StyleSelectedJudgeSecond.color  = "red";
					}
					if (data.Event.JudgeThird.UID != "") {
						data.StyleSelectedJudgeThird.color = "green";
					}
					else {
						data.StyleSelectedJudgeThird.color  = "red";
					}
					if (data.Event.JudgeFourth.UID != "") {
						data.StyleSelectedJudgeFourth.color = "green";
					}
					else {
						data.StyleSelectedJudgeFourth.color  = "red";
					}*/

					if (data.Event.CommentatorFirst.UID != "") {
						data.StyleSelectedCommentatorFirst.color = "green";
					}
					else {
						data.StyleSelectedCommentatorFirst.color  = "red";
					}
					/*if (data.Event.CommentatorSecond.UID != "") {
						data.StyleSelectedCommentatorSecond.color = "green";
					}
					else {
						data.StyleSelectedCommentatorSecond.color  = "red";
					}*/
				}
				ws.close();
			};
			ws.onerror = function(err) {
				console.error('Socket encountered error: ', err.message, 'Closing socket');
				ws.close();
				var tagBlockContext = document.createElement("div");
				tagBlockContext.setAttribute("id","BlockContext");
				var textBlockContext = document.createTextNode("Нет подключения");
				tagBlockContext.appendChild(textBlockContext);
				document.body.insertBefore(tagBlockContext, document.body.firstChild);
			};
			ws.onclose = function(err) {
				console.info('Closing socket');
			};
		}
	},
	mounted() {
		this.SendOrGetData("GetEventsList",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
