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

BoardType = 'Tablo';

/* ################################################################################################
    Переменные:
        1) ${data['ArenaName']}   - Название арены
        2) ${data['Place']}       - Место проведения матча
        3) ${data['Date']}        - Дата
        4) ${data['LocalTime']}   - Местное время
        5) ${data['Weather']}     - Имя файла погоды
        6) ${data['Temperature']} - Температура
*/
const FS_BoardWelcome = (data) => `
<div id="boardWelcome" class="cl_boardWelcome">
	<div class="WelcomeClassDate">${data['Date']}</div>
	<div class="WelcomeClassLocalTime">${data['LocalTime']}</div>
	<div class="WelcomeClassPlace">${data['Place']}</div>
	<div class="WelcomeClassArenaName">${data['ArenaName']}</div>
	<div class="WelcomeClassWeather"><img src="/images/WeatherIcon/${data['Weather']}.svg" width="55px" height="55px"></div>
	<div class="WelcomeClassTemperature">${data['Temperature']}</div>
</div>
`;
/* ################################################################################################
    Переменные:
        1) ${data['JudgeFirst']}  - Первый главный судья
        2) ${data['JudgeSecond']} - Второй главный судья
        3) ${data['JudgeThird']}  - Линейный судья
        4) ${data['JudgeFourth']} - Линейный судья
*/
const FS_BoardJudges = (data) => `
<div id="boardJudges" class="cl_boardJudges">
	<div class="JudgesClassBoss">
		<div class="JudgesClassBossTitle"></div>
		<div class="JudgesClassFirst"><!--<span>${data['JudgeFirst-Number']}</span>-->${data['JudgeFirst-FullName']}</div>
		<div class="JudgesClassSecond"><!--<span>${data['JudgeSecond-Number']}</span>-->${data['JudgeSecond-FullName']}</div>
	</div>
	<div class="JudgesClassLines">
		<div class="JudgesClassLinesTitle">Линейные судьи</div>
		<div class="JudgesClassThird"><!--<span>${data['JudgeThird-Number']}</span>-->${data['JudgeThird-FullName']}</div>
		<div class="JudgesClassFourth"><!--<span>${data['JudgeFourth-Number']}</span>-->${data['JudgeFourth-FullName']}</div>
	</div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['CommentatorFirst']}  - Первый комментатор
        2) ${data['CommentatorSecond']} - Второй комментатор
*/
const FS_BoardCommentators = (data) => `
<div id="boardCommentators" class="cl_boardCommentators">
	<div class="CommentatorsClass">
		<div class="CommentatorsClassTitle"></div>
		<div class="CommentatorsClassFirst">${data['CommentatorFirst']}</div>
		<div class="CommentatorsClassSecond">${data['CommentatorSecond']}</div>
	</div>
</div>
`;
/* ################################################################################################
    Переменные:
        1) ${data['TrainerTitle']}  - 
        2) ${data['TrainerFullName']} - 
*/
const FS_BoardTrainerTeam = (data) => `
<div id="boardTrainerTeam" class="cl_boardTrainerTeam">
	<div class="TrainerTeamClass">
		<div class="TrainerTeamClassTitle">${data['TrainerTitle']}</div>
		<div class="TrainerTeamClassFullName">${data['TrainerFullName']}</div>
	</div>
</div>
`;
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
		<div id="CountClassPlayerLeftFullName">${data['PlayerLeftFullName']}</div>
		<div id="CountClassPlayerLeftPlace">${data['PlayerLeftPlace']}</div>
		<div id="CountClassCountPlayerLeft">${data['CountPlayerLeft']}</div><div class="CountClassCountMinus">-</div>
		<div id="CountClassPlayerRightLogo"></div>
		<div id="CountClassCountPlayerRight">${data['CountPlayerRight']}</div>
		<div id="CountClassPlayerRightFullName">${data['PlayerRightFullName']}</div>
		<div id="CountClassPlayerRightPlace">${data['PlayerRightPlace']}</div>
		<div class="CountClassPauseWrap">
			<div id="CountClassPause" class="d-none">Перерыв</div>
		</div>
		<div id="CountClassVs">Против</div>
		<div id="CountClassTime">${data['Timer']}</div>
        <div id="CountClassTime2">ПЕРИОД<br><span id="CountIdPeriod">${data['Period']}</span></div>
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
        8) ${data['GamePlace']} - Полное название арены
		8) ${data['GameCity']}  - Город хоккейной арены

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
    <div id="StartClassGamePlace">${data['GamePlace']}<br>${data['GameCity']}</div>
</div>`;

/* ################################################################################################
    Переменные:
        1) ${data['PlayerFullName']}      - Название первой команды
        2) ${data['PlayerPlace']}         - Название второй команды
        3) ${data['PlayerPlace']}         - Счёт первой команды
        4) ${data['PlayerMiddleLet']}     - Счёт первой команды
        5) ${data['PlayerBoss']}          - Период
        6) ${data['PlayerTrainer']}       - Оставшееся время до окончания периода
        7) ${data['PlayerAdministrator']} - 
        8) ${data['PlayerVratari']}       - 
*/
const FS_BoardListPlayer = (data) => `
<div id="boardListPlayer" class="cl_boardListPlayer">
    <div id="ListPlayerClassName">${data['PlayerFullName']}</div>
    <div id="ListPlayerClassPlace">${data['PlayerPlace']}</div>
    <div id="ListPlayerClassLogo"></div>

    <div id="ListPlayerClassFuncTrainer">Тренер</div>
    <div id="ListPlayerClassTrainer">${data['PlayerTrainer']}</div>
    <div id="ListPlayerClassAdministrator">${data['PlayerAdministrator']}</div>

    <div id="ListPlayerClassVratari"><div class="title">Вратари</div>${data['PlayerVratari']}</div>
    <div id="ListPlayerClassSecurity"><div class="title">Защитники</div>${data['PlayerSecurity']}</div>
    <div id="ListPlayerClassNapadenie"><div class="title">Нападающие</div>${data['PlayerNapadenie']}</div>
</div>`;
/* ################################################################################################
    Переменные:
        1) ${data['PlayerFullName']}  - Название первой команды
*/
const FS_BoardStart5Player = (data) => `
<div id="boardStart5Player" class="cl_boardStart5Player">
    <div id="Start5PlayerClassLF">
        <div id="Start5PlayerClassLFPhoto"></div>
        <div class="Start5PlayerClassLFTitle">
            <div>Нападающий</div>
            <div id="Start5PlayerClassLFFullName">${data['LFFullName']}</div>
        </div>
    </div>
    <div id="Start5PlayerClassRF">
        <div id="Start5PlayerClassRFPhoto"></div>
        <div class="Start5PlayerClassRFTitle">
            <div>Нападающий</div>
            <div id="Start5PlayerClassRFFullName">${data['RFFullName']}</div>
        </div>
    </div>
    <div id="Start5PlayerClassCF">
        <div id="Start5PlayerClassCFPhoto"></div>
        <div class="Start5PlayerClassCFTitle">
            <div>Нападающий</div>
            <div id="Start5PlayerClassCFFullName">${data['CFFullName']}</div>
        </div>
    </div>
    <div id="Start5PlayerClassLD">
        <div id="Start5PlayerClassLDPhoto"></div>
        <div class="Start5PlayerClassRDTitle">
            <div>Защитник</div>
            <div id="Start5PlayerClassLDFullName">${data['LDFullName']}</div>
        </div>
    </div>
    <div id="Start5PlayerClassRD">
        <div id="Start5PlayerClassRDPhoto"></div>
        <div class="Start5PlayerClassRDTitle">
            <div>Защитник</div>
            <div id="Start5PlayerClassRDFullName">${data['RDFullName']}</div>
        </div>
    </div>
    <div id="Start5PlayerClassGT">
        <div id="Start5PlayerClassGTPhoto"></div>
        <div class="Start5PlayerClassCFTitle">
            <div>Вратарь</div>
            <div id="Start5PlayerClassGTFullName">${data['GTFullName']}</div>
        </div>
    </div>
</div>`;
