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
 * @version   1.0.5
 */

const AdminApp = {
	data() {
		return {
			jsonData: {},
			enableDisable: false,
			BoardTypeList: TypeList, 
			BoardTemplateSelected: "",
			BoardTemplateURL: "",
			BoardTemplateList: TemplateList,
			BoardKeySelected: "",
			BoardKeyURL: "",
			BoardKeyList: [
				{id:"ChromaGreen",color:"green",value:"Зеленый фон"},
				{id:"ChromaRed",  color:"red",  value:"Красный фон"},
				{id:"ChromaBlue", color:"blue", value:"Синий фон"},
				{id:"Luma",       color:"black",value:"Черный"},
				{id:"Alpha",      color:"white",value:"Прозрачный"}
			],
			BoardStaticSelected: "",
			BoardStaticURL: "",
			BoardStaticList: [
				{id:"Count",        color:"",value:"Счёт"},
				{id:"Logo1",        color:"",value:"Логотип"},
				{id:"Start",        color:"",value:"Стартовая страница"},
				{id:"Judges",       color:"",value:"Судейская бригада"},
				{id:"Start5",       color:"",value:"Первая пятерка"},
				{id:"TrainerTeam",  color:"",value:"Тренер команды"},
				{id:"Welcome",      color:"",value:"Первая заставка"},
				{id:"PlayerTeam",   color:"",value:"Игрок команды"},
				{id:"Commentators", color:"",value:"Комментаторы"},
				{id:"EndPeriod",    color:"",value:"Конец периода"},
				{id:"StartPeriod",  color:"",value:"Начало периода"},
				{id:"Timer",        color:"",value:"Таймер"},
			],
		}
	},
    methods: {
		BoardTemplate() {
			if (this.BoardTemplateSelected != "") {
				this.BoardTemplateURL = "&Template="+ this.BoardTemplateSelected
			}
			else {
				this.BoardKeyURL = ""
			}
			
		},
		BoardKey() {
			if (this.BoardKeySelected != "") {
				this.BoardKeyURL = "&Key="+ this.BoardKeySelected
			}
			else {
				this.BoardKeyURL = ""
			}
			
		},
		BoardStatic() {
			if (this.BoardStaticSelected != "") {
				this.BoardStaticURL = "&Static="+ this.BoardStaticSelected
			}
			else {
				this.BoardStaticURL = ""
			}
			
		}
	},
	mounted() {
		
	}
};
Vue.createApp(AdminApp).mount('#AdminApp');

