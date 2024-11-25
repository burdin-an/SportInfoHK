
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
			connected: 1,
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
			Event: {
				PlayerLeft: {
					FullName: '',
					Logo: 'DEFAULT'
				},
				PlayerRight: {
					FullName: '',
					Logo: 'DEFAULT'
				}
			},
			EventLoad: 0,
			EventSelected: '',
			EventSelectedList: "",
			EventSelectedInfo: {},
			EventsList: {
				0: {
					Key: 0,
					Name: 'Выберите мероприятие'
				}
			},
			GameWeatherTemperature: 0,
			GameWeatherCloudiness: 0,
			GameWeatherPrecipitationType: 0,
			GameWeatherPrecipitationIntensity: 0,
			GameWeatherStorm: 0,
			classButtonFlashChangeCurrentEvent: false,
			classButtonFlashSendGameWeatherTemperature: false,
			classButtonFlashSendGameWeather:false,
			classButtonFlashSendCommentator1:false,
			classButtonFlashSendCommentator2:false,
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
			StyleSelectedCommentator1: {
				color: 'red'
			},
			StyleSelectedCommentator2: {
				color: 'red'
			}
		}
	},
    methods: {
		changeCurrentEvent () {
			this.SendData('ChangeCurrentEvent', this.EventSelectedList);
			this.classButtonFlashChangeCurrentEvent = false;
		},
		sendGameWeather () {
			var Weather = "z";
			/*switch (this.GameWeatherCloudiness) {
				case 0:
					Weather = "d";
					break;
				case 1:
				case 2:
					Weather = "d_c" + this.GameWeatherCloudiness;
					break;
				case 3:
					Weather = "c" + this.GameWeatherCloudiness;
					break;
			}
			switch (this.GameWeatherPrecipitationType) {
				case 1:
					Weather = Weather + "_r";
					break;
				case 2:
					Weather = Weather + "_s";
					break;
				case 3:
					Weather = Weather + "_rs";
					break;
			}*/
			if (this.GameWeatherCloudiness == 0) {
				Weather = "d";
			}
			else if (this.GameWeatherCloudiness == 1) {
				Weather = "d_c" + this.GameWeatherCloudiness;
			}
			else if (this.GameWeatherCloudiness == 2) {
				Weather = "d_c" + this.GameWeatherCloudiness;
			}
			else if (this.GameWeatherCloudiness == 3) {
				Weather = "c" + this.GameWeatherCloudiness;
			}


			if (this.GameWeatherPrecipitationType == 1) {
				Weather = Weather + "_r";
			}
			else if (this.GameWeatherPrecipitationType == 2) {
				Weather = Weather + "_s";
			}
			else if (this.GameWeatherPrecipitationType == 3) {
				Weather = Weather + "_rs";
			}
			if (this.GameWeatherPrecipitationType > 0) {
				Weather = Weather + this.GameWeatherPrecipitationIntensity;
			}
			if (this.GameWeatherStorm == 1) {
				Weather = Weather + "_st";
			}
			this.SendData('SendGameWeather', Weather);
			this.SendData('SendGameTemperature', this.GameWeatherTemperature == '' ? 0 : this.GameWeatherTemperature);
			this.classButtonFlashChangeCurrentEvent = false;
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
			this.SendData('SendCommentator', this.Event.Commentator1.UID, 1);
			this.classButtonFlashSendCommentator1 = false;
		},
		changeCommentatorSecond() {
			this.SendData('SendCommentator', this.Event.Commentator2.UID, 2);
			this.classButtonFlashSendCommentator2 = false;
		},
		// Подключаемся к серверу
		connectWebSocket () {
			var data = this;
			data.WebSocket = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			data.WebSocket.onopen = function() {
				if (debuging != false) {console.log('WebSocket connected');};
				data.connected = 1;
				data.SendData("GetEventsList");
				data.SendData("GetAllDBEvent","");
				data.SendData("GetCommentatorsDB");
				data.SendData("GetJudgesDB");
			};
			data.WebSocket.onmessage = function(evt) {
				if (debuging != false) {console.log('Данные прилетели');};
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListEvents") {
					data.EventsList = null;
					data.EventsList = JSONData.ListEvents;
					data.EventSelectedInfo = JSONData.SelectEvent;
					data.EventSelectedList = JSONData.SelectEvent.UID;
					
				}
				if (JSONData['dAction'] == "ListAllDBEvent") {
					data.Event = JSONData.Event;
					if (!data.Event.CommentatorFirst) {
						data.Event.CommentatorFirst = {};
					}
					if (!data.Event.CommentatorSecond) {
						data.Event.CommentatorSecond = {};
					}
					data.EventLoad = 1;
					data.GameWeatherTemperature = data.Event.GameTemperature;
					console.info(data.Event.GameWeather);
					if (data.Event.GameWeather == "d") {
						data.GameWeatherCloudiness = 0;
						data.GameWeatherPrecipitationType = 0;
						data.GameWeatherPrecipitationIntensity = 0;
						data.GameWeatherStorm = 0;
					}
					else {
						if (data.Event.GameWeather.match(/c1/g)) {
							data.GameWeatherCloudiness = 1;
						}
						else if (data.Event.GameWeather.match(/c2/g)) {
							data.GameWeatherCloudiness = 2;
						}
						else if (data.Event.GameWeather.match(/c3/g)) {
							data.GameWeatherCloudiness = 3;
						}
						if (data.Event.GameWeather.match(/rs/g)) {
							data.GameWeatherPrecipitationType = 3;
						}
						else if (data.Event.GameWeather.match(/s/g)) {
							data.GameWeatherPrecipitationType = 2;
						}
						else if (data.Event.GameWeather.match(/r/g)) {
							data.GameWeatherPrecipitationType = 1;
						}
						if (data.Event.GameWeather.match(/[rs]1/g)) {
							data.GameWeatherPrecipitationIntensity = 1;
						}
						else if (data.Event.GameWeather.match(/[rs]2/g)) {
							data.GameWeatherPrecipitationIntensity = 2;
						}
						else if (data.Event.GameWeather.match(/[rs]3/g)) {
							data.GameWeatherPrecipitationIntensity = 3;
						}
					}
					if (data.Event.GameWeather.search(/st/g) != -1) {
						data.GameWeatherStorm = 1;
					}
				}
				if (JSONData['dAction'] == "ListJudgesDB") {
					data.JudgesArray = JSONData.JudgesArray;
					data.PhotoJudges = JSONData.PhotoJudges;
					// Судьи
					data.Judges = JSONData.JudgesArray;
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
				}
				if (JSONData['dAction'] == "ListCommentatorsDB") {
					// Комментаторы
					data.CommentatorsArray = JSONData.CommentatorsArray;
					data.PhotoCommentators = JSONData.PhotoCommentators;
					
					if (data.Event.Commentator1.UID != "") {
						data.StyleSelectedCommentator1.color = "green";
					}
					else {
						data.StyleSelectedCommentator1.color  = "red";
					}
				}
			};
			data.WebSocket.onerror = function(err) {
				if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
				data.WebSocket.close();
				
			};
			data.WebSocket.onclose = function(err) {
				if (debuging != false) {console.info('Соединение закрыто');};
				data.connected = 0;
				setTimeout(function() {
					data.connectWebSocket();
				}, 1000);
			};
		},
		// Оправляем данные
		SendData(Action, Value=false, Board=false, TeamPosition=false) {
			if (!Action) {
				if (debuging != false) {console.info('Отправка данных без действия');};
				return;
			}

			this.WebSocket.send(JSON.stringify({
				"Action": Action,
				"Board": Board ?  Board : "All",
				"TeamPosition": TeamPosition ?  TeamPosition : "Right",
				"Value": Value,
			}));
		},
		SendOrGetData(Action,SendJson,JsonDataOut,returnData) {
			var data = this;
			let ws;
			ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			ws.onopen = function() {
				if (debuging != false) {console.log('WebSocket connected');};
				if (debuging != false) {console.log("Action " + Action);};
				data.connected = 1;
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
					if (!returnData) {
						ws.close();
					}
				}
			};
			ws.onmessage = function(evt) {
				
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListEvents") {
					data.EventsList = null;
					data.EventsList = JSONData.ListEvents;
					data.EventSelectedInfo = JSONData.SelectEvent;
					data.EventSelectedList = JSONData.SelectEvent.UID;
					console.info(data.EventSelectedList);
				}
				if (JSONData['dAction'] == "ListAllDBEvent") {
					data.Event = JSONData.Event;
					if (!data.Event.Commentator1) {
						data.Event.Commentator1 = {};
					}
					if (!data.Event.Commentator2) {
						data.Event.Commentator2 = {};
					}
				}
				if (JSONData['dAction'] == "ListJudgesDB") {
					data.JudgesArray = JSONData.JudgesArray;
					data.PhotoJudges = JSONData.PhotoJudges;
					// Судьи
					data.Judges = JSONData.JudgesArray;
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
				}
				if (JSONData['dAction'] == "ListCommentatorsDB") {
					data.CommentatorsArray = JSONData.CommentatorsArray;
					data.PhotoCommentators = JSONData.PhotoCommentators;
					
					// Комментаторы
					data.Commentators = JSONData.CommentatorsArray;
					if (data.Event.CommentatorFirst.UID != "") {
						data.StyleSelectedCommentatorFirst.color = "green";
					}
					else {
						data.StyleSelectedCommentatorFirst.color  = "red";
					}
				}

				ws.close();
			};
			ws.onerror = function(err) {
				if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
				//data.connected = 0;
				ws.close();
				
			};
			ws.onclose = function(err) {
				if (debuging != false) {console.info('Closing socket');};
				//data.connected = 0;
			};
		}
	},
	mounted() {
		this.connectWebSocket();
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
