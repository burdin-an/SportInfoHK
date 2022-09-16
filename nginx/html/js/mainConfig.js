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
// Отладочная информация
// Значение: true  - Включено
// Значение: false - Выключено
//var debuging = true;
// Порт для Web Socket
const WebSocketPort = 8200;
// Отладочная информация
const debuging = true;

var BoardType = 'OBS';


//Общие настройки
/* fetch('/config/config-default.json')
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
        if (json.debug == "y") {
            const debuging = true;
        }
        else {
            const debuging = false;
        }
        // Порт для Web Socket
        if (json.WebSocketPort != WebSocketPort) {
            const WebSocketPort = json.WebSocketPort;
        }
        else {
            const WebSocketPort = 8200;
        }
        const ConfigLoad = true;
        console.log(response);
        console.log(WebSocketPort);
        // ...
    }).catch(error => {
        console.error(error);
    }
); */

