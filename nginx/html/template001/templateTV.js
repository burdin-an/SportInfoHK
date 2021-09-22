/**
 * Проект "Информатор спортивных соревнований: фигурное катание на коньках"
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
Информационная панель:
    Кнопка: Name; - Информация об участнике
    Переменные:
        1) ${data['NamePlayer1']}  - Название первой команды
        2) ${data['NamePlayer2']}  - Название второй команды
        3) ${data['CountPlayer1']} - Счёт первой команды
        4) ${data['CountPlayer2']} - Счёт первой команды
        5) ${data['Period']}       - Период
        6) ${data['Timer']}        - Оставшееся время до окончания периода
*/
const FS_BoardCount = (data) => `
<div id="boardCount" class="cl_boardCount">
    <div id="CountClassTimer">${data['Timer']}</div>
    <div class="CountClassScores">
        <div id="CountClassNamePlayer1">${data['NamePlayer1']}</div>
        <div id="CountClassCountPlayer1">${data['CountPlayer1']}</div>
        <div class="CountClassPeriod"><span id="CountIdPeriod">${data['Period']}</span>&nbsp;пер</div>
        <div id="CountClassCountPlayer2">${data['CountPlayer2']}</div>
        <div id="CountClassNamePlayer2">${data['NamePlayer2']}</div>
    </div>
</div>`;
