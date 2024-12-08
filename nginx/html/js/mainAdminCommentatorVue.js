
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
			CommentatorSelected: 0,
			Commentators: {},
			PhotoCommentators:[]
		}
	},
    methods: {
		saveCommentator() {
			this.SendOrGetData('SaveCommentator', true, {'Value': this.Commentators[this.CommentatorSelected]}, true);
		},
		deleteCommentator() {
			this.SendOrGetData('DeleteCommentator', true, {'Value': this.CommentatorSelected}, true);
			this.CommentatorSelected=0;
		},
		createCommentator() {
			this.SendOrGetData('CreateCommentator', true, {'Value': false}, true);
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
				if (JSONData['dAction'] == "ListCommentatorsDB") {
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
		this.SendOrGetData("GetCommentatorsDB",false,false,true);
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');
