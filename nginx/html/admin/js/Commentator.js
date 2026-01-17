
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
			CommentatorSelected: 0,
			Commentators: {},
			PhotoCommentators:[]
		}
	},
    methods: {
		saveCommentator() {
			this.SendOrGetData('SaveCommentator', {'Value': this.Commentators[this.CommentatorSelected]});
		},
		deleteCommentator() {
			this.SendOrGetData('DeleteCommentator', {'Value': this.CommentatorSelected});
			this.CommentatorSelected=0;
		},
		createCommentator() {
			this.SendOrGetData('CreateCommentator', {'Value': false});
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
				if (JSONData['dAction'] == "ListCommentators") {
					// Название игры
					data.Commentators = {};
					for (const [Key, Value] of Object.entries(JSONData.CommentatorsArray)) {
						data.Commentators[Key] = {
							Key: Key,
							ShortName: Value.ShortName,
							FullName: Value.FullName,
							Photo: Value.Photo,
							Desc: Value.Desc
						};
					}
					// Фотографии судей
					data.PhotoCommentators = JSONData.PhotoCommentators;
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
		this.SendOrGetData("GetCommentatorsList");
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
