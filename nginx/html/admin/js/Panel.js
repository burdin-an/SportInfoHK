
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
			connected: 0,
			TypeSelected: 0,
			TypeList: TypeList,
			PlayerLeft: [],
			PlayerRight: [],
			PlayerLeftName: '',
			PlayerRightName: ''
		}
	},
    methods: {
		// Оправляем данные
		SendData(Action, TeamPosition=false, Value=false) {
			var data = this;
			if (!Action) {
				console.log('Отправка данных без действия');
				return;
			}
			let ws;
			ws = new WebSocket(WebSocketURL);
			ws.onopen = function() {
				console.log('WebSocket подключен');
				let msg = {
					"Action": Action,
					"Board": data.TypeList[data.TypeSelected].Key,
					"TeamPosition": TeamPosition ?  TeamPosition : "Right",
					"Value": Value,
				};
				if (Action != "GetCurrentEvent" && data.TypeSelected == 0) {
					alert('Укажите какие титры!');
				}
				else {
					ws.send(JSON.stringify(msg));
				}
			};
			ws.onmessage = function(evt) {
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListCurrentEvent") {
					data.PlayerLeft = JSONData['Event']['PlayerLeft'];
					if (data.PlayerLeft['Players'].length < 2) {
						data.PlayerLeft['Players'] = [];
					}
					data.PlayerRight = JSONData['Event']['PlayerRight'];
					if (data.PlayerRight['Players'].length < 2) {
						data.PlayerRight['Players'] = [];
					}
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
		}
	},
	mounted() {
		this.SendData('GetCurrentEvent');
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
