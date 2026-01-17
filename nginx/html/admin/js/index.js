
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
//Общие настройки
const debuging = true;
const AdminApp = {
	data() {
		return {
			connected: 1,
			
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
			EventSelectedUID: "",
			EventsList: {
				0: {
					Key: 0,
					Name: 'Выберите мероприятие'
				}
			},
			
			classButtonFlashChangeCurrentEvent: false,
		}
	},
    methods: {
		changeCurrentEvent () {
			this.SendData('ChangeCurrentEvent', this.EventSelectedUID);
			this.classButtonFlashChangeCurrentEvent = false;
		},
		
		// Подключаемся к серверу
		connectWebSocket () {
			var data = this;
			data.WebSocket = new WebSocket(WebSocketURL);
			data.WebSocket.onopen = function() {
				console.log('WebSocket connected');
				data.connected = 1;
				data.SendData("GetEventsList");
			};
			data.WebSocket.onmessage = function(evt) {
				console.log('Данные прилетели');
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListEvents") {
					data.EventsList = null;
					data.EventsList = JSONData.ListEvents;
					data.EventSelectedUID = JSONData.SelectEvent;
					data.EventLoad = 1;
				}
				else if (JSONData['dAction'] == "ChangeCurrentEvent") {
					console.log('WebSocket connected1');
					data.SendData("GetEventsList");
				}
			};
			data.WebSocket.onerror = function(err) {
				console.error('Socket encountered error: ', err.message, 'Closing socket');
				data.WebSocket.close();
				data.connected = 0;
				data.EventLoad = 0;
			};
			data.WebSocket.onclose = function(err) {
				console.log('Соединение закрыто');
				data.connected = 0;
				data.EventLoad = 0;
				setTimeout(function() {
					data.connectWebSocket();
				}, 1000);
			};
		},
		// Оправляем данные
		SendData(Action, Value=false, Board=false, TeamPosition=false) {
			if (!Action) {
				console.info('Отправка данных без действия');
				return;
			}
			console.info('Отправка данных');
			this.WebSocket.send(JSON.stringify({
				"Action": Action,
				"Board": Board ?  Board : "All",
				"TeamPosition": TeamPosition ?  TeamPosition : "Right",
				"Value": Value,
			}));
		},
	},
	mounted() {
		this.connectWebSocket();
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
