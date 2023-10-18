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

BoardType = 'OBS';

/* ################################################################################################
    Переменные:
        1) ${data['ArenaName']}   - Название арены
        2) ${data['Place']}       - Место проведения матча
        3) ${data['Date']}        - Дата
        4) ${data['LocalTime']}   - Местное время
        5) ${data['Weather']}     - Погода
        6) ${data['Temperature']} - Температура
*/
const FS_BoardWelcome = (data) => `
<div id="boardWelcome" class="cl_boardWelcome">
	<div class="WelcomeClassDate">${data['Date']}</div>
	<div class="WelcomeClassLocalTime">${data['LocalTime']}</div>
	<div class="WelcomeClassPlace">${data['Place']}</div>
	<div class="WelcomeClassArenaName">${data['ArenaName']}</div>
	<div class="WelcomeClassWeather">${data['Weather']}</div>
	<div class="WelcomeClassTemperature">${data['Temperature']}</div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['JudgeFirst-FullName']}  - Первый главный судья
        2) ${data['JudgeSecond-FullName']} - Второй главный судья
        3) ${data['JudgeThird-FullName']}  - Линейный судья
        4) ${data['JudgeFourth-FullName']} - Линейный судья
		5) ${data['JudgeFirst-Number']}  - Первый главный судья
        6) ${data['JudgeSecond-Number']} - Второй главный судья
        7) ${data['JudgeThird-Number']}  - Линейный судья
        8) ${data['JudgeFourth-Number']} - Линейный судья
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
        <div id="CountClassPlayerLeftShortName">${data['PlayerLeftShortName']}</div>
        <div id="CountClassCountPlayerLeft">${data['CountPlayerLeft']}</div>
        <div id="CountClassCountPlayerRight">${data['CountPlayerRight']}</div>
        <div id="CountClassPlayerRightShortName">${data['PlayerRightShortName']}</div>
        <div id="CountClassTime">${data['Timer']}</div>
        <div id="CountClassTime2"><span id="CountIdPeriod">${data['Period']}</span><br>ПЕР</div>
		<div id="CountClassGoalBG"><div id="CountClassGoalTitle">ГОЛ!</div></div>
    </div>
</div>`;
/* ################################################################################################
    Переменных нет
*/
const FS_BoardLogo1 = (data) => `<div id="boardLogo1" class="cl_boardLogo1"></div>`;

/* ################################################################################################
    Переменные:
        1) ${data['PlayerLeftName']}   - Название первой команды
        2) ${data['PlayerRightName']}  - Название второй команды
        3) ${data['PlayerLeftPlace']}  - Счёт первой команды
        4) ${data['PlayerRightPlace']} - Счёт первой команды
        5) ${data['GameName']}         - Период
        6) ${data['GameDate']}         - Оставшееся время до окончания периода
        7) ${data['GamePlace']}        - 
        8) ${data['GameTime']}         - 
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

    <div id="ListPlayerClassFuncTrainer">Тренер</div>
    <div id="ListPlayerClassTrainer">${data['PlayerTrainer']}</div>
    <div id="ListPlayerClassAdministrator">${data['PlayerAdministrator']}</div>

    <div id="ListPlayerClassVratari">${data['PlayerVratari']}</div>
    <div id="ListPlayerClassSecurity">${data['PlayerSecurity']}</div>
    <div id="ListPlayerClassNapadenie">${data['PlayerNapadenie']}</div>
</div>`;
