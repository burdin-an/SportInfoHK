
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
				'CF': 'Центральный нападающий',
				'RF': 'Правый нападающий',
				'LD': 'Левый защитник',
                'RD': 'Правый защитник',
				'GT': 'Вратарь',
				'FF': 'Нападающий',
				'DD': 'Защитник',
				''  : 'Пусто'
            },
			position: [
                { id: 'LF', value: 'Левый нападающий' },
				{ id: 'CF', value: 'Центральный нападающий' },
                { id: 'RF', value: 'Правый нападающий' },
				{ id: 'LD', value: 'Левый защитник' },
                { id: 'RD', value: 'Правый защитник' },
				{ id: 'GT', value: 'Вратарь' },
				{ id: 'FF', value: 'Нападающий' },
				{ id: 'DD', value: 'Защитник' },
				{ id: ''  , value: 'Пусто' },
            ],
			disabled: 0,
			statusTrueValue: 1,
			statusFalseValue: 0,
			EventSelected: 0,
			EventLoad: 0,
			PlayersLeft: {},
			PlayersRight: {}
		}
	},
    methods: {
		saveCurrentTeamPlayers(Position) {
			this.SendOrGetData('SaveCurrentTeamPlayers', true, {'Position': Position,'Value': {
				'EventUID':    this.EventSelected,
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
			ws = new WebSocket(WebSocketURL);
			ws.onopen = function() {
				console.log('WebSocket connected');
				console.log("Action " + Action);
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
					//Список мероприятий
					data.ListEvents = JSONData.ListEvents;
					//Номер текущего мероприятия
					data.EventSelected  = JSONData.EventSelected;
					// Игроки левой команды
					data.PlayersLeft = JSONData.PlayersLeft;
					// Игроки правой команды
					data.PlayersRight = JSONData.PlayersRight;
					console.log(data.PlayersLeft.Players);
					data.PlayersLeft.Players.sort((a,b) => a.Key - b.Key);
					data.PlayersLeft.Players.sort((a, b) => b.Role.localeCompare(a.Role));
					data.PlayersRight.Players.sort((a,b) => a.Key - b.Key);
					data.PlayersRight.Players.sort((a, b) => b.Role.localeCompare(a.Role));

					data.EventLoad = 1;
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
		},
		sortPlayers(ListPlayers) {
			console.log(ListPlayers);
			let PlayersDD = '';
			ListPlayers.Players.forEach(function(Value){
				if (Value.Role == "DD") {
					PlayerVratari += "<tr><td>" + Value.Key + "</td><td>" + Value.FullName + "</td></tr>";
				}
			});
			
			return ListPlayers;
		},
		compare( a, b ) {
			if ( a.last_nom < b.last_nom ){
				return -1;
			}
			if ( a.last_nom > b.last_nom ){
				return 1;
			}
			return 0;
		}
	},
	mounted() {
		this.SendOrGetData("GetTeamsPlayers",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
