
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
			role2: {
                'FF': 'Нападающий',
                'DD': 'Защитник',
				'GT': 'Вратарь'
            },
			position2: {
                'LF': 'Левый нападающий',
                'RF': 'Правый нападающий',
				'CF': 'Центральный нападающий',
				'GT': 'Вратарь',
				'FF': 'Нападающий',
				'DD': 'Защитник',
				'LD': 'Левый защитник',
                'RD': 'Правый защитник'
            },
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
			EventSelected: 0,
			PlayersLeft: {},
			PlayersRight: {}
		}
	},
    methods: {
		saveCurrentTeamPlayers(Position) {
			this.SendOrGetData('SaveCurrentTeamPlayers', true, {'Position': Position,'Value': {
				'EventUID':    this.EventSelected.UID,
				'TeamUID':     this['Players'+ Position]['UID'],
				'TeamPlayers': this['Players'+ Position]['Players']
			}}, true);
		},
		getEvent(EventUID) {
			if (this.EventSelected != 0) {
				this.ChangeTeamLeft = 0;
				this.ChangeTeamRight = 0;
				this.SendOrGetData('GetAllDBEvent', true, {'Value': EventUID}, true);
			}
		},
		SendOrGetData(Action,SendJson,JsonDataOut,returnData) {
			var data = this;
			let ws;
			ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
			ws.onopen = function() {
				if (debuging != false) {console.log('WebSocket connected');};
				if (debuging != false) {console.log("Action " + Action);};
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
				if (JSONData['dAction'] == "ListTeamsPlayers") {
					//Мероприятие
					data.EventSelected  = JSONData.EventSelected;
					// Игроки левой команды
					data.PlayersLeft = JSONData.PlayersLeft;
					// Игроки правой команды
					data.PlayersRight = JSONData.PlayersRight;
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
		this.SendOrGetData("GetTeamsPlayers",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
