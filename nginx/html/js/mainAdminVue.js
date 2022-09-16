
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
			LogoTeams:[],
			LogoGamePlace:[],
			GameNameSelected: 0,
			GameName: {
				0: {
					Key: 0,
					ShortName: "Укажите название матча",
					FullName: "",
					Desc: ""
				}
			},
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
			},
			TeamSelected: 0,
			Teams: {
				0: {
					Key: 0,
					ShortName: "",
					FullName: "Выберите команду",
					Desc: "",
					Logo: "",
					Place: "",
					Boss: "",
					Trainer: "",
					Administrator: "",
					MiddleLet: ""
				}
			}
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
		SendOrGetData(Action,SendJson,JsonDataOut,returnData) {
			var data = this;
			let ws;
			ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			ws.onopen = function() {
				if (debuging != false) {console.log('WebSocket connected');};
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
				if (JSONData['dAction'] == "ListPlayer") {
					// Логотипы
					data.LogoTeams = JSONData.LogoTeams;
					// Логотипы
					data.LogoGamePlace = JSONData.LogoGamePlace;
					// Команды
					data.Teams = {
						0: {
							Key: 0,
							ShortName: "",
        					FullName: "Выберите команду",
        					Desc: "",
        					Logo: "",
        					Place: "",
        					Boss: "",
        					Trainer: "",
        					Administrator: "",
        					MiddleLet: ""
						}
					};
					for (const [Key, Value] of Object.entries(JSONData.Player)) {
						//data.Teams.push({id: Key, value: Value.ShortName + " (" + Value.Desc + ")"});
						data.Teams[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Desc: Value.Desc,
        					Logo: Value.Logo,
        					Place: Value.Place,
        					Boss: Value.Boss,
        					Trainer: Value.Trainer,
        					Administrator: Value.Administrator,
        					MiddleLet: Value.MiddleLet
						};
					}
					// Название игры
					data.GameName = {
						0: {
							Key: 0,
							ShortName: "Выберите название матча",
							FullName: "",
							Desc: ""
						}
					};
					for (const [Key, Value] of Object.entries(JSONData.GameName)) {
						data.GameName[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Desc: Value.Desc
						};
					}
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
					for (const [Key, Value] of Object.entries(JSONData.GamePlace)) {
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
				if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
				ws.close();
				var tagBlockContext = document.createElement("div");
				tagBlockContext.setAttribute("id","BlockContext");
				var textBlockContext = document.createTextNode("Нет подключения");
				tagBlockContext.appendChild(textBlockContext);
				document.body.insertBefore(tagBlockContext, document.body.firstChild);
			};
			ws.onclose = function(err) {
				if (debuging != false) {console.info('Closing socket');};
			};
		}
	},
	mounted() {
		this.SendOrGetData("GetPlayer",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
