
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
			this.SendOrGetData('SaveGamePlace', true, {'Value': this.GamePlace[this.GamePlaceSelected]}, true);
		},
		deleteGamePlace() {
			this.SendOrGetData('DeleteGamePlace', true, {'Value': this.GamePlaceSelected}, true);
			this.GamePlaceSelected = 0;
		},
		createGamePlace() {
			this.SendOrGetData('CreateGamePlace', true, {'Value': false}, true);
		},
		SendOrGetData(Action,SendJson,JsonDataOut,returnData) {
			var data = this;
			let ws;
			ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			ws.onopen = function() {
				console.log('WebSocket connected');
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
				var tagBlockContext = document.getElementById('BlockContext');
				if (tagBlockContext) {
					tagBlockContext.remove();
				}
			};
			ws.onmessage = function(evt) {
				JSONData = JSON.parse(evt.data);
				if (JSONData['dAction'] == "ListAllDB") {
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
		this.SendOrGetData("GetAllDB",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
