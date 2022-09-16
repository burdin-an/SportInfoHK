
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
			Players: {},
			statusTrueValue: 0,
			statusFalseValue: 1,
			status: [
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
		getTeamPlayers(TeamUID) {
			this.SendOrGetData('GetTeamPlayers', true, {'Value': TeamUID}, true);
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
					// Команды
					data.Teams = {
						0: {
							Key: 0,
							ShortName: "",
        					FullName: "Выберите команду",
        					Desc: ""
						}
					};
					for (const [Key, Value] of Object.entries(JSONData.Player)) {
						data.Teams[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Desc: Value.Desc
						};
					}
				}
				else if (JSONData['dAction'] == "ListTeamPlayers") {
					// Игроки
					data.Players = {};
					for (const [Key, Value] of Object.entries(JSONData.Players)) {
						data.Players[Key] = {
							Key: Key,
							Enable: Value.Enable,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Role: Value.Role,
							Position: Value.Position
						};
					}
					console.log(data.Players);
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
