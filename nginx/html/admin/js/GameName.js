
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
			jsonData: {},
			connected: 0,
			GameNameSelected: 0,
			GameName: {
				0: {
					Key: 0,
					ShortName: "Укажите название матча",
					FullName: "",
					Desc: ""
				}
			},
		}
	},
    methods: {
		saveGameName() {
			this.SendOrGetData('SaveGameName', {'Value': this.GameName[this.GameNameSelected]});
		},
		deleteGameName() {
			this.SendOrGetData('DeleteGameName', {'Value': this.GameNameSelected});
			this.GameNameSelected = 0;
		},
		createGameName() {
			this.SendOrGetData('CreateGameName', {'Value': false});
		},
		SendOrGetData(Action,JsonDataOut) {
			var data = this;
			let ws;
			ws = new WebSocket(WebSocketURL);
			ws.onopen = function() {
				console.log('WebSocket connected');
				data.connected = 1;
				var msg = {
					"Action": Action
				};
				if (JsonDataOut) {
					ws.send(JSON.stringify(Object.assign({},msg, JsonDataOut)));
				}
				else {
					ws.send(JSON.stringify(msg));
				}
			};
			ws.onmessage = function(evt) {
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListGameName") {
					// Название игры
					data.GameName = {
						0: {
							Key: 0,
							ShortName: "Выберите название матча",
							FullName: "",
							Desc: ""
						}
					};
					for (const [Key, Value] of Object.entries(JSONData.GameNameArray)) {
						data.GameName[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Desc: Value.Desc
						};
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
		this.SendOrGetData("GetGameNameList");
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
