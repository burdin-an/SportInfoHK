
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
			Players: {},
			PhotoPlayers:[],
			LogoTeams:[],
			statusTrueValue: 1,
			statusFalseValue: 0,
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
			TeamSelected: 0,
			TeamsList: {},
			Team: {},
		}
	},
    methods: {
		saveTeamList() {
			this.SendOrGetData('SaveTeamList', true, {'Value': {
				'Key': this.TeamSelected,
				'Team': this.Team
			}}, true);
		},
		deleteTeamList() {
			this.SendOrGetData('DeleteTeamList', true, {'Value': this.TeamSelected}, true);
			this.TeamSelected = 0;
		},
		createTeamList() {
			this.SendOrGetData('CreateTeamList', true, {'Value': false}, true);
		},
		getTeam(TeamUID) {
			if (this.TeamSelected != 0) {
				this.SendOrGetData('GetTeam', true, {'Value': TeamUID}, true);
			}
			
		},
		SendOrGetData(Action,SendJson,JsonDataOut,returnData) {
			var data = this;
			let ws;
			ws = new WebSocket(WebSocketURL);
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
				if (JSONData['dAction'] == "ListTeams") {

					// Команды
					data.TeamsList = null;
					data.TeamsList = JSONData.ListTeams;
				}
				else if (JSONData['dAction'] == "TeamInfo") {
					// Фотографии игроков
					data.PhotoPlayers = JSONData.PhotoPlayers;
					// Логотипы команд
					data.LogoTeams = JSONData.LogoTeams;
					// Команда
					data.Team = JSONData.Team;
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
		this.SendOrGetData("GetTeamsList",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
