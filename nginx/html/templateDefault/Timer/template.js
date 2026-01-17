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
 * @version   1.0.4
 */

//Шаблоны для титров

/* ################################################################################################
    Переменные:
        1) ${data['NamePlayer1']}  - Название первой команды
        2) ${data['NamePlayer2']}  - Название второй команды
        3) ${data['CountPlayer1']} - Счёт первой команды
        4) ${data['CountPlayer2']} - Счёт первой команды
        5) ${data['Period']}       - Период
        6) ${data['Timer']}        - Оставшееся время до окончания периода
        7) ${data['DeletePlayerLeft1Count']} - 
        8) ${data['DeletePlayerLeft1Time']}  - 
*/
const FS_BoardTimer = (data) => `
<div id="boardTimer" class="cl_boardTimer">
	<span id="CountClassTime">${data['Timer']}</span>  //  <span id="CurrentTime"> </span>
</div>`;
