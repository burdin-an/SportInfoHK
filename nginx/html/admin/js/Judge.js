
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
			JudgeSelected: 0,
			Judges: {},
			PhotoJudges:[]
		}
	},
    methods: {
		saveJudge() {
			this.SendOrGetData('SaveJudge', {'Value': this.Judges[this.JudgeSelected]});
		},
		deleteJudge() {
			this.SendOrGetData('DeleteJudge', {'Value': this.JudgeSelected});
			this.JudgeSelected=0;
		},
		createJudge() {
			this.SendOrGetData('CreateJudge', {'Value': false});
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
				if (JSONData['dAction'] == "ListJudges") {
					// Название игры
					data.Judges = {};
					for (const [Key, Value] of Object.entries(JSONData.JudgesArray)) {
						data.Judges[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Number: Value.Number,
							Photo: Value.Photo,
							Desc: Value.Desc
						};
					}
					// Фотографии судей
					data.PhotoJudges = JSONData.PhotoJudges;
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
		this.SendOrGetData("GetJudgesList");
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
