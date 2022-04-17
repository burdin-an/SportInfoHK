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
const FS_BoardCount = (data) => `
<div id="boardCount" class="cl_boardCount">
    <div class="CountClassScores">
        <div id="CountClassPlayerLeftLogo"></div>
        <div id="CountClassPlayerLeftShortName">${data['PlayerLeftShortName']}</div>
        <div id="CountClassCountPlayerLeft">${data['CountPlayerLeft']}</div>
        <div id="CountClassPlayerRightLogo"></div>
        <div id="CountClassCountPlayerRight">${data['CountPlayerRight']}</div>
        <div id="CountClassPlayerRightShortName">${data['PlayerRightShortName']}</div>
        <div id="CountClassTime">${data['Timer']}</div>
        <div id="CountClassTime2">ПЕР<br><span id="CountIdPeriod">${data['Period']}</span></div>
        <div id="CountClassPause" class="d-none">Перерыв</div>
        <div class="CountClassDeletePlayerLeft">
            <div class="Line1 d-none">
                <div class="Num">77</div>
                <div class="Time">5:00</div>
            </div>
            <div class="Line2 d-none">
                <div class="Num">78</div>
                <div class="Time">5:00</div>
            </div>
            <div class="Line3 d-none">
                <div class="Num">33</div>
                <div class="Time">5:00</div>
            </div>
        </div>
        <div class="CountClassDeletePlayerRight">
            <div class="Line1 d-none">
                <div class="Num">77</div>
                <div class="Time">5:00</div>
            </div>
            <div class="Line2 d-none">
                <div class="Num">78</div>
                <div class="Time">5:00</div>
            </div>
            <div class="Line3 d-none">
                <div class="Num">33</div>
                <div class="Time">5:00</div>
            </div>
        </div>
    </div>
</div>`;
/* ################################################################################################
    Переменных нет
*/
const FS_BoardLogo1 = (data) => `<div id="boardLogo1" class="cl_boardLogo1"></div>`;

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
const FS_BoardStart = (data) => `
<div id="boardStart" class="cl_boardStart">
    <div id="StartClassPlayerLeftName">${data['PlayerLeftName']}</div>
    <div id="StartClassPlayerLeftPlace">${data['PlayerLeftPlace']}</div>
    <div id="StartClassPlayerLeftLogo"></div>
    <div id="StartClassPlayerRightName">${data['PlayerRightName']}</div>
    <div id="StartClassPlayerRightPlace">${data['PlayerRightPlace']}</div>
    <div id="StartClassPlayerRightLogo"></div>
    <div id="StartClassGameName">${data['GameName']}</div>
    <div id="StartClassGameDate">${data['GameDate']}</div>
    <div id="StartClassGameTime">${data['GameTime']}</div>
    <div id="StartClassGamePlace">${data['GamePlace']}</div>
</div>`;

/* ################################################################################################
    Переменные:
        1) ${data['PlayerFullName']}  - Название первой команды
        2) ${data['PlayerPlace']}  - Название второй команды
        3) ${data['PlayerPlace']} - Счёт первой команды
        4) ${data['PlayerMiddleLet']} - Счёт первой команды
        5) ${data['PlayerBoss']}       - Период
        6) ${data['PlayerTrainer']}        - Оставшееся время до окончания периода
        7) ${data['PlayerAdministrator']} - 
        8) ${data['PlayerVratari']}  - 
*/
const FS_BoardListPlayer = (data) => `
<div id="boardListPlayer" class="cl_boardListPlayer">
    <div id="ListPlayerClassName">${data['PlayerFullName']}</div>
    <div id="ListPlayerClassPlace">${data['PlayerPlace']}</div>
    <div id="ListPlayerClassLogo"></div>
    <div id="ListPlayerClassMiddleLet">${data['PlayerMiddleLet']}</div>

    <div id="ListPlayerClassBoss">${data['PlayerBoss']}</div>
    <div id="ListPlayerClassTrainer">${data['PlayerTrainer']}</div>
    <div id="ListPlayerClassAdministrator">${data['PlayerAdministrator']}</div>

    <div id="ListPlayerClassVratari">${data['PlayerVratari']}</div>
    <div id="ListPlayerClassSecurity">${data['PlayerSecurity']}</div>
    <div id="ListPlayerClassNapadenie">${data['PlayerNapadenie']}</div>
</div>`;