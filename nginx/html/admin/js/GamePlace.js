
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
			GamePlaceSelected: 0,
			GamePlace: {
				0: {
					Key: 0,
					ShortName: "Укажите место проведения матча",
					FullName: "",
					Place: "",
					Desc: "",
					Logo: ""
				}
			}
		}
	},
    methods: {
		saveGamePlace() {
			this.SendOrGetData('SaveGamePlace', {'Value': this.GamePlace[this.GamePlaceSelected]});
		},
		deleteGamePlace() {
			this.SendOrGetData('DeleteGamePlace', {'Value': this.GamePlaceSelected});
			this.GamePlaceSelected = 0;
		},
		createGamePlace() {
			this.SendOrGetData('CreateGamePlace', {'Value': false});
		},
		SendOrGetData(Action,JsonDataOut=false) {
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
				if (JSONData['dAction'] == "ListGamePlace") {
					// Место проведения игры
					data.GamePlace = {
						0: {
							Key: 0,
							ShortName: "Выберите место проведения игры",
							FullName: "",
							Place: "",
							Desc: "",
							Logo: ""
						}
					};
					for (const [Key, Value] of Object.entries(JSONData.GamePlaceArray)) {
						data.GamePlace[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Place: Value.Place,
							Desc: Value.Desc,
							Logo: Value.Logo
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
		this.SendOrGetData("GetGamePlaceList");
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
