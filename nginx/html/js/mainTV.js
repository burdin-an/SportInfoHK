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

//Общие настройки
let debuging = false,
BoardType = "Default",
BoardTemplate = "Default",
BoardKey = "Default", //ChromaGreen, ChromaRed, ChromaBlue, Luma (black), Alpha (transparent)
LocationIsStatic = false,
LocationStaticAction = '',
BoardTemplatePath = 'templateDefault';

/*function getAnchor() {
    var currentUrl = (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : '',
	retParts = (currentUrl.search(/^[A-Za-z0-9]{1,}$/g) == 0) ? currentUrl : 'Default';
	//console.log(retParts);
    return retParts;
}*/

const ArrayUrlConfig = window.location.search.slice(1).split("&");

ArrayUrlConfig.forEach(UrlConfig => {
	let ConfigLine = UrlConfig.split("=");
	if (Array.isArray(ConfigLine) && ConfigLine[0] != "" &&  ConfigLine[1] != "") {
		let name =  ConfigLine[0], value =  ConfigLine[1];
		if (name == 'Debuging') {
			debuging = true;
			console.log('Debuging: true');
			console.log(debuging);
		}
		if (name == 'Type' && value.search(/^[A-Za-z0-9]{1,15}$/g) == 0) {
			BoardType = value;
			if (debuging) {console.log('Type: ' + value);};
		}
		if (name == 'Template' && value.search(/^[A-Za-z0-9]{1,25}$/g) == 0) {
			BoardTemplate = value;
			if (debuging) {console.log('Template: ' + value);};
		}
		if (name == 'Key' && value.search(/^[A-Za-z0-9]{4,12}$/g) == 0) {
			BoardKey = value;
			if (debuging) {console.log('Key: ' + value);};
		}
		if (name == 'Static' && value.search(/^[A-Za-z0-9]{1,25}$/g) == 0) {
			LocationIsStatic = true;
			LocationStaticAction = value;
			if (debuging) {console.log('StaticAction: ' + value);};
		}
	}	

});

if (BoardTemplate != 'Default' && BoardTemplate != 'OBS' && BoardTemplate != 'Tablo' && BoardTemplate != 'NL' && BoardTemplate != 'FHR' && BoardTemplate != 'Football') {
	BoardTemplatePath = "templateLocal";
}

//Общие настройки
/*
fetch('/config/board/' + BoardType + '.json')
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Something went wrong on api server!');
        }
    })
    .then(response => {
              // Отладочная информация
        // Значение: true  - Включено
        // Значение: false - Выключено
        if (json.debug && json.debug == "y") {
            debuging = true;
        }
        // Порт для Web Socket
		if (json.WebSocketPort != WebSocketPort) {
            WebSocketPort = json.WebSocketPort;
        }
        else {
            WebSocketPort = 8200;
        }
        const ConfigLoad = true;
        console.log(response);
        console.log(WebSocketPort);
        // ...
    }).catch(error => {
        console.error(error);
    }
);
*/


// Create new link Element
let TemplateStyle = document.createElement('link');
TemplateStyle.rel = 'stylesheet';
TemplateStyle.type = 'text/css';
TemplateStyle.href = BoardTemplatePath + '/' +  BoardTemplate + '/template.css';
// Append link element to HTML head
document.getElementsByTagName('HEAD')[0].appendChild(TemplateStyle);

if (BoardKey != 'Default') {
	let styleBackground = document.createElement('style');
	let KeyTypeColor;
	if (BoardKey == 'ChromaGreen') {
		KeyTypeColor = 'rgb(0, 255, 0)';
	}
	if (BoardKey == 'ChromaBlue') {
		KeyTypeColor = 'rgb(0, 0, 255)';
	}
	else if (BoardKey == 'ChromaRed') {
		KeyTypeColor = 'rgb(255, 0, 0)';
	}
	else if (BoardKey == 'Luma') {
		KeyTypeColor = 'rgb(0, 0, 0)';
	}
	else if (BoardKey == 'Alpha') {
		KeyTypeColor = 'transparent';
	}
	styleBackground.appendChild(document.createTextNode('html,body,#id_board {background-color: ' + KeyTypeColor + ' !important;}'));
	document.getElementsByTagName('HEAD')[0].appendChild(styleBackground);
}


// Create new link Element
let TemplateScript = document.createElement('script');
TemplateScript.type = 'text/javascript';
TemplateScript.src =  BoardTemplatePath + '/' +  BoardTemplate + '/template.js';
// Append link element to HTML head
document.getElementsByTagName('HEAD')[0].appendChild(TemplateScript);
