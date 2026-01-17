
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
			disabledPlayerLeft: 0,
			disabledPlayerRight: 0,
			disabledGamePlace: 0,
			disabledGameName: 0,
			disabledGameDate: 0,
			disabledGameTime: 0,
			disabledWeather: 0,
			disabledJudge1: 0,
			disabledJudge2: 0,
			disabledJudge3: 0,
			disabledJudge4: 0,
			disabledCommentators1: 0,
			disabledCommentators2: 0,
			showPrecipitationIntensity: false,
			arrayPrecipitationIntensity: {
				"0":{
					"i1": "Небольшой дождь",
					"i2": "Дождь",
					"i3": "Сильный дождь",
				},
				"1":{
					"i1": "Небольшой дождь",
					"i2": "Дождь",
					"i3": "Сильный дождь",
				},
				"2":{
					"i1": "Небольшой снег",
					"i2": "Снег",
					"i3": "Сильный снег",
				},
				"3":{
					"i1": "Неб. дождь со снегом",
					"i2": "Дождь со снегом",
					"i3": "Сил. дождь со снегом",
				},
			},
			statusTrueValue: 1,
			statusFalseValue: 0,
			status: [
                { id: 0, value: 'Вкл' },
                { id: 1, value: 'Откл' }
            ],
			Event: {},
			EventSelected: 0,
			EventSelectedLoad: 0,
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
			SelectedTeamLeft: 0,
			SelectedTeamRight: 0,
			StyleSelectedTeamLeft:    {color:'red'},
			StyleSelectedTeamRight:   {color: 'red'},
			StyleSelectedGamePlace:   {color: 'red'},
			StyleSelectedGameName:    {color: 'red'},
			StyleSelectedJudge1:  {color: 'red'},
			StyleSelectedJudge2: {color: 'green'},
			StyleSelectedJudge3:  {color: 'green'},
			StyleSelectedJudge4: {color: 'green'},
			StyleSelectedCommentator1: {color: 'red'},
			StyleSelectedCommentator2: {color: 'red'},
			StyleSelectedCommentator: {
				1:{color: ''}
			},
			classButtonFlashSendGameWeatherTemperature: false,
			classButtonFlashSendGameWeather:false,
			GameDate: ""
		}
	},
    methods: {
		saveEvent() {
			if ((this.Event.JudgeSecond.UID != "" && this.Event.JudgeThird.UID == "") || (this.Event.JudgeSecond.UID != "" && this.Event.JudgeFourth.UID == "")) {
				var myModalSecondJudge = new bootstrap.Modal(document.getElementById('ModalSecondJudge'), {
					keyboard: false
				});
				myModalSecondJudge.show();
			}
			else if (this.Event.PlayerLeft.UID == "" ||
				this.Event.PlayerRight.UID == "" ||
				this.Event.JudgeFirst.UID == "" ||
				this.Event.Commentators[1].UID == "" ||
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
				console.log(this.Event.Commentators);
				this.SendOrGetData('SaveEvent', {'Value': {
					'Key': this.EventSelected,
					'ChangeTeamLeft': this.ChangeTeamLeft,
					'ChangeTeamRight': this.ChangeTeamRight,
					'Event': this.Event
				}});
			}
		},
		deleteEvent() {
			this.SendOrGetData('DeleteEvent', {'Value': this.EventSelected});
			this.EventSelected = 0;
			this.EventSelectedLoad = 0;
		},
		createEvent() {
			this.SendOrGetData('CreateEvent', {'Value': false});
		},
		getEvent(EventUID) {
			if (this.EventSelected != 0) {
				this.ChangeTeamLeft = 0;
				this.ChangeTeamRight = 0;
				this.SendOrGetData('GetAllDBEvent', {'Value': EventUID});
			}
			else {
				this.EventSelectedLoad = 0;
			}
		},
		changeTeamLeft() {
			this.ChangeTeamLeft = 1;
			this.StyleSelectedTeamLeft.color = "green";
			let LeftName = '';
			let RightName = '';
			if (this.Event.PlayerLeft.UID != "" && this.Event.PlayerLeft.UID != 0) {
				LeftName = this.Teams[this.Event.PlayerLeft.UID].Name;
			}
			if (this.Event.PlayerRight.UID != "" && this.Event.PlayerRight.UID != 0) {
				RightName = this.Teams[this.Event.PlayerRight.UID].Name;
			}
			let tempDate = this.Event.GameDate.split(".");
			this.Event.EventName = tempDate[2] + "." + tempDate[1] + "." + tempDate[0] + " " + this.Event.GameTime + " " + LeftName + " - " + RightName;
		},
		changeTeamRight() {
			this.ChangeTeamRight = 1;
			this.StyleSelectedTeamRight.color = "green";
			let LeftName = '';
			let RightName = '';
			if (this.Event.PlayerLeft.UID != "" && this.Event.PlayerLeft.UID != 0) {
				LeftName = this.Teams[this.Event.PlayerLeft.UID].Name;
			}
			if (this.Event.PlayerRight.UID != "" && this.Event.PlayerRight.UID != 0) {
				RightName = this.Teams[this.Event.PlayerRight.UID].Name;
			}
			let tempDate = this.Event.GameDate.split(".");
			this.Event.EventName = tempDate[2] + "." + tempDate[1] + "." + tempDate[0] + " " + this.Event.GameTime + " " + LeftName + " - " + RightName;
		},
		changeGameDate() {
			let LeftName = '';
			let RightName = '';
			if (this.Event.PlayerLeft.UID != "" && this.Event.PlayerLeft.UID != 0) {
				LeftName = this.Teams[this.Event.PlayerLeft.UID].Name;
			}
			if (this.Event.PlayerRight.UID != "" && this.Event.PlayerRight.UID != 0) {
				RightName = this.Teams[this.Event.PlayerRight.UID].Name;
			}
			let tempDate = this.Event.GameDate.split(".");
			this.Event.EventName = tempDate[2] + "." + tempDate[1] + "." + tempDate[0] + " " + this.Event.GameTime + " " + LeftName + " - " + RightName;
		},
		changeGameTime() {
			let LeftName = '';
			let RightName = '';
			if (this.Event.PlayerLeft.UID != "" && this.Event.PlayerLeft.UID != 0) {
				LeftName = this.Teams[this.Event.PlayerLeft.UID].Name;
			}
			if (this.Event.PlayerRight.UID != "" && this.Event.PlayerRight.UID != 0) {
				RightName = this.Teams[this.Event.PlayerRight.UID].Name;
			}
			let tempDate = this.Event.GameDate.split(".");
			this.Event.EventName = tempDate[2] + "." + tempDate[1] + "." + tempDate[0] + " " + this.Event.GameTime + " " + LeftName + " - " + RightName;
		},
		changeGamePlace() {
			this.StyleSelectedGamePlace.color = "green";
		},
		changeGameName() {
			this.StyleSelectedGameName.color = "green";	
		},
		changeGameWeather () {
			//this.SendData('SendGameWeather', Weather);
			//this.SendData('SendGameTemperature', this.GameWeatherTemperature == '' ? 0 : this.GameWeatherTemperature);
			this.classButtonFlashSendGameWeather = false;
		},
		changePrecipitationType () {
			this.classButtonFlashSendGameWeather = true;
			if (this.Event.GameWeather.PrecipitationType == 0) {
				this.showPrecipitationIntensity = false;
				this.Event.GameWeather.PrecipitationIntensity = 0;
			}
			else {
				this.showPrecipitationIntensity = true;
			}
		},
		changeJudgeFirst() {
			//this.SendData('ChangeJudge', this.Event.JudgeFirst.UID, 1);
		},
		changeJudgeSecond() {
			//this.SendData('ChangeJudge', this.Event.JudgeSecond.UID, 2);
		},
		changeJudgeThird() {
			//this.SendData('ChangeJudge', this.Event.JudgeThird.UID, 3);
		},
		changeJudgeFourth() {
			//this.SendData('ChangeJudge', this.Event.JudgeFourth.UID, 4);
		},
		changeCommentator(Index = 0) {
			if (Index == 1 && (this.Event.Commentators[1].UID == "" || this.Event.Commentators[1].UID == 0)) {
				this.StyleSelectedCommentator[1].color = "red";
				return false;
			}
			else {
				this.StyleSelectedCommentator[1].color = "green";
			}
			if (Index == 2 && this.Event.Commentators[1].UID == this.Event.Commentators[2].UID) {
				this.StyleSelectedCommentator[2].color = "red";
				return false;
			}
			else {
				this.StyleSelectedCommentator[2].color = "green";
			}
			//this.SendOrGetData('ChangeCommentatorEvent', {'Index': Index, "UID": this.Event.Commentators[Index].UID});
		},
		// Подключаемся к серверу
		SendOrGetData(Action,JsonDataOut=false) {
			var data = this;
			let ws;
			ws = new WebSocket(WebSocketURL);
			ws.onopen = function() {
				console.log('WebSocket connected');
				console.log("Action " + Action);
				var msg = {
					"Action": Action
				};
				if (JsonDataOut) {
					msg["EventUID"] = data.Event.UID;
					ws.send(JSON.stringify(Object.assign({},msg, JsonDataOut)));
				}
				else {
					ws.send(JSON.stringify(msg));
				}
			};
			ws.onmessage = function(evt) {
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListEvents") {
					data.EventsList = null;
					data.EventsList = JSONData.ListEvents;
					data.EventSelectedUID = JSONData.SelectEvent;
					data.EventLoad = 1;
				}
				else if (JSONData['dAction'] == "ListAllDBEvent") {
					data.Event = JSONData.Event;
					//console.log(data.Event);
					/*data.TeamLeftSelected  = data.Event.PlayerLeft.UID;
					data.TeamRightSelected = data.Event.PlayerRight.UID;
					data.GameNameSelected  = data.Event.GameName.UID;
					data.GamePlaceSelected = data.Event.GamePlace.UID;*/


					if (data.Event.PlayerLeft.UID == "" || data.Event.PlayerLeft.UID == 0) {
						data.TeamLeftSelected = 0;
					}
					else {
						data.TeamLeftSelected = 1;
					}
					if (data.Event.PlayerRight.UID == "" || data.Event.PlayerRight.UID == 0) {
						data.TeamRightSelected = 0;
					}
					else {
						data.TeamRightSelected = 1;
					}

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
					//Data
					//let tempDate = JSONData.Event.GameDate.split(".");
					//data.GameDate = tempDate[0] + "-" + tempDate[1] + "-" + tempDate[0];
					data.GameDate = JSONData.Event.GameDate;

					//Погода
					if (data.Event.GameWeather.PrecipitationType == 0) {
						data.showPrecipitationIntensity = false;
					}
					else {
						data.showPrecipitationIntensity = true;
					}
					
					data.StyleSelectedTeamLeft.color = data.Event.PlayerLeft.UID != "" ? "green" : "red";
					data.StyleSelectedTeamRight.color = data.Event.PlayerRight.UID != "" ? "green" : "red";
					data.StyleSelectedGameName.color = data.Event.GameName.UID != "" ? "green" : "red";

					data.StyleSelectedGamePlace.color = data.Event.GamePlace.UID != "" ? "green" : "red";
					data.StyleSelectedJudge1.color = data.Event.JudgeFirst.UID != "" ? "green" : "red";
					Object.keys(data.Event.Commentators).forEach(key => {
						if (key == 1) {
							data.StyleSelectedCommentator[key].color = data.Event.Commentators[key].UID != "" ? "green" : "red";
						}
						else {
							data.StyleSelectedCommentator[key] = {color: ''};
						}
					});
					
					if (data.Event.GameOver == 1) {
						data.disabledPlayerLeft  = 1;
						data.disabledPlayerRight = 1;
						data.disabledGamePlace = 1;
						data.disabledGameName = 1;
						data.disabledGameDate = 1;
						data.disabledGameTime = 1;
						data.disabledWeather = 1;
						data.disabledJudge1 = 1;
						data.disabledJudge2 = 1;
						data.disabledJudge3 = 1;
						data.disabledJudge4 = 1;
						data.disabledCommentators = 1;
					}

					data.EventSelectedLoad = 1;
				}
				ws.close();
			};
			ws.onerror = function(err) {
				console.error('Socket encountered error: ', err.message, 'Closing socket');
				ws.close();
			};
			ws.onclose = function(err) {
				console.info('Closing socket');
			};
		},
	},
	mounted() {
		this.SendOrGetData("GetEventsList");
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
