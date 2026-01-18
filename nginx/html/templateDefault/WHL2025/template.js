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
        1) ${data['ArenaName']}   - Название арены
        2) ${data['Place']}       - Место проведения матча
        3) ${data['Date']}        - Дата
        4) ${data['LocalTime']}   - Местное время
        5) ${data['Weather']}     - Имя файла погоды
        6) ${data['Temperature']} - Температура
*/
const FS_BoardWelcome = (data) => `
<div id="boardWelcome" class="cl_boardWelcomeWrap">
    <div class="cl_boardWelcome">
        <div class="cl_WelcomeLayer2"></div>
        <div class="cl_WelcomeLayer2_1"></div>
        <div class="cl_WelcomeLayer2_2"></div>
        <div class="cl_WelcomeLayer3_Weather"><img src="/images/WeatherIcon/${data['Weather']}.svg" width="100px" height="100px"></div>
        <div class="cl_WelcomeLayer3_Date">${data['Date']}</div>
        <div class="cl_WelcomeLayer3_LocalTime" id="LocalTime">${data['LocalTime']}</div>
        <div class="cl_WelcomeLayer3_ArenaName">${data['ArenaName']}</div>
        <div class="cl_WelcomeLayer3_Place">${data['Place']}</div>
        <div class="cl_WelcomeLayer3_Temperature">${data['Temperature']}</div>
    </div>
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
	<div class="JudgesLeft">
		<div class="JudgesClassBoss">
			<div class="JudgesBossLayer2"></div>
			<div class="JudgesBossLayer2_1"></div>
			<div class="JudgesBossLayer2_2"></div>
			<div class="JudgesBoss_Layer3_First"><span class="JudgesNumber">${data['JudgeFirst-Number']}</span>${data['JudgeFirst-FullName']}</div>
			<div class="JudgesBoss_Layer3_Second"><span class="JudgesNumber">${data['JudgeSecond-Number']}</span>${data['JudgeSecond-FullName']}</div>
			<div class="JudgesBoss_Layer3_Title"><span>ГЛАВНЫЕ СУДЬИ</span></div>
		</div>
	</div>
	<div class="JudgesRight">
		<div class="JudgesClassLines">
			<div class="JudgesBossLayer2"></div>
			<div class="JudgesBossLayer2_1"></div>
			<div class="JudgesBossLayer2_2"></div>
			<div class="JudgesBoss_Layer3_First"><span class="JudgesNumber">${data['JudgeThird-Number']}</span>${data['JudgeThird-FullName']}</div>
			<div class="JudgesBoss_Layer3_Second"><span class="JudgesNumber">${data['JudgeFourth-Number']}</span>${data['JudgeFourth-FullName']}</div>
			<div class="JudgesBoss_Layer3_Title"><span>ЛИНЕЙНЫЕ СУДЬИ</span></div>
		</div>
	</div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['CommentatorFirst']}  - Первый комментатор
        2) ${data['CommentatorSecond']} - Второй комментатор
*/
const FS_BoardCommentators = (data) => `
<div id="boardCommentators" class="cl_CommentatorsWrap">
	<div class="cl_Commentators">
        <div class="cl_Commentators_Layer2"></div>
        <div class="cl_Commentators_Layer2_1"></div>
        <div class="cl_Commentators_Layer2_2"></div>
		<div class="cl_Commentators_Layer3_First"><span>${data['CommentatorFirst']}</span></div>
		<div class="cl_Commentators_Layer3_Second"><span>${data['CommentatorSecond']}</span></div>
        <div class="cl_Commentators_Layer3_Title"><span id="Commentators_One" class="">КОММЕНТАТОР</span><span id="Commentators_Two" class="d-none">КОММЕНТАТОРЫ</span></div>
	</div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['Title']}  - 
        2) ${data['FullName']} - 
*/
const FS_BoardTrainerTeam = (data) => `
<div id="boardTrainerTeam" class="cl_boardTrainerTeamWrap">
    <div class="cl_boardTrainerTeam">
        <div class="cl_TrainerTeamLayer2_0">
            <div class="cl_TrainerTeamLayer2_0_1">
                <div class="cl_TrainerTeamLayer2_0_1_1">ГЛАВНЫЙ ТРЕНЕР</div>
                <div class="cl_TrainerTeamLayer2_0_1_2"></div>
            </div>
        </div>
        <div class="cl_TrainerTeamLayer2_1"></div>
        <div class="cl_TrainerTeamLayer2_2"></div>
        <div class="cl_TrainerTeamLayer3_1">
            <div class="cl_TrainerTeamLayer3_1_FullName">${data['FullName']}</div>
        </div>
        <div class="cl_TrainerTeamLayer3_Place"></div>
        <div class="cl_TrainerTeamLayer3_Logo"><div id="TeamLogo"></div></div>
    </div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['Number']}  - Номер игрока
        2) ${data['FullName']} - ФИО
		3) ${data['FullName']} - Фамилия инициалы
		4) ${data['Role']} - Роль
		5) ${data['Position']} - Позиция
*/
const FS_BoardPlayerEjection = (data) => `
<div id="boardPlayerEjection" class="cl_boardPlayerEjectionWrap">
    <div class="cl_boardPlayerEjection">
        <div class="cl_PlayerEjectionLayer2_0">
            <div class="cl_PlayerEjectionLayer2_0_1">
                <div class="cl_PlayerEjectionLayer2_0_1_1">УДАЛЕНИЕ</div>
                <div class="cl_PlayerEjectionLayer2_0_1_2"></div>
            </div>
        </div>
        <div class="cl_PlayerEjectionLayer2_1"></div>
        <div class="cl_PlayerEjectionLayer2_2"></div>
        <div class="cl_PlayerEjectionLayer3_1">
            <div class="cl_PlayerEjectionLayer3_1_FullName"><span class="cl_boardPlayerEjection_Number">${data['Number']}</span>${data['FullName']}</div>
        </div>
        <div class="cl_PlayerEjectionLayer3_Place"></div>
        <div class="cl_PlayerEjectionLayer3_Logo"><div id="TeamLogo"></div></div>
    </div>
</div>
`;
/* ################################################################################################
    Переменные:
        1) ${data['Number']}  - Номер игрока
        2) ${data['FullName']} - ФИО
		3) ${data['FullName']} - Фамилия инициалы
		4) ${data['Role']} - Роль
		5) ${data['Position']} - Позиция
*/
const FS_BoardPlayerGoal = (data) => `
<div id="boardPlayerGoal" class="cl_boardPlayerGoalWrap">
    <div class="cl_boardPlayerGoal">
        <div class="cl_PlayerGoalLayer2_0">
            <div class="cl_PlayerGoalLayer2_0_1">
                <div class="cl_PlayerGoalLayer2_0_1_1">${data['Role']}</div>
                <div class="cl_PlayerGoalLayer2_0_1_2"></div>
            </div>
        </div>
        <div class="cl_PlayerGoalLayer2_1"></div>
        <div class="cl_PlayerGoalLayer2_2"></div>
        <div class="cl_PlayerGoalLayer3_1">
            <div class="cl_PlayerGoalLayer3_1_FullName"><span class="cl_boardPlayerGoal_Number">${data['Number']}</span>${data['FullName']}</div>
        </div>
        <div class="cl_PlayerGoalLayer3_Place"></div>
        <div class="cl_PlayerGoalLayer3_Logo"><div id="TeamLogo"></div></div>
    </div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['Number']}  - Номер игрока
        2) ${data['FullName']} - ФИО
		3) ${data['FullName']} - Фамилия инициалы
		4) ${data['Role']} - Роль
		5) ${data['Position']} - Позиция
*/
const FS_BoardPlayerTeam = (data) => `
<div id="boardPlayerTeam" class="cl_boardPlayerTeamWrap">
    <div class="cl_boardPlayerTeam">
        <div class="cl_PlayerTeamLayer2_0">
            <div class="cl_PlayerTeamLayer2_0_1">
                <div class="cl_PlayerTeamLayer2_0_1_1">${data['Role']}</div>
                <div class="cl_PlayerTeamLayer2_0_1_2"></div>
            </div>
        </div>
        <div class="cl_PlayerTeamLayer2_1"></div>
        <div class="cl_PlayerTeamLayer2_2"></div>
        <div class="cl_PlayerTeamLayer3_1">
            <div class="cl_PlayerTeamLayer3_1_FullName"><span class="cl_boardPlayerTeam_Number">${data['Number']}</span>${data['FullName']}</div>
        </div>
        <div class="cl_PlayerTeamLayer3_Place"></div>
        <div class="cl_PlayerTeamLayer3_Logo"><div id="TeamLogo"></div></div>
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
	<div id="DeletePlayerOneLineBlock" class="cl_boardCountPowerPlay d-none">
		<div class="CountClassCountPowerPlayScores">
			<div class="CountClassCountPowerPlayScores_Time"><span id="DeletePlayerOneLineTime">00:00</span></div><div class="CountClassCountPowerPlayScores_Text"><span id="CountClassCountPowerPlayScores_Text_PowerPlay" class="d-none">POWER PLAY</span><span id="CountClassCountPowerPlayScores_Text_Both" class="d-none"><span id="CountClassCountPowerPlayScores_Text_Left"></span> ON <span id="CountClassCountPowerPlayScores_Text_Right"></span></span></div>
		</div>
	</div>
	<div class="cl_boardCountWrap">
		<div class="CountScores">
			<div class="CountScores_Layer1">
				<div class="CountScores_Layer1_Left">&nbsp;</div>
				<div class="CountScores_Layer1_Right">&nbsp;</div>
				<div class="CountScores_Layer1_Bottom">&nbsp;</div>
			</div>
			<div class="CountClassLayer1">
				<div class="CountClassLinePlayerLeft">
					<div id="CountClassPlayerLeftLogo">&nbsp;</div><div id="CountClassPlayerLeftShortName">${data['PlayerLeftShortName']}</div><div id="CountClassPlayerLeftCount">${data['CountPlayerLeft']}</div>
				</div>
				<div class="CountClassLinePlayerRight">
					<div id="CountClassPlayerRightLogo">&nbsp;</div><div id="CountClassPlayerRightShortName">${data['PlayerRightShortName']}</div><div id="CountClassPlayerRightCount">${data['CountPlayerRight']}</div><div>&nbsp;</div>
				</div>
				<div class="CountClassLineCount">
					<div id="CountClassTime">${data['Timer']}</div><div id="CountClassTimeHR"><div id="CountClassPause" class="d-none">ПЕРЕРЫВ</div><div id="CountClassWarmUp" class="d-none"></div></div><div id="CountClassPeriodBlock" class="d-blockinline"><span id="CountENPeriod">${data['Period']}</span><span class="CountClassPeriodPost"></span></div>
				</div>
			</div>
			<div class="CountScores_Layer2">
				<div class="CountScores_Layer2_Left">&nbsp;</div>
				<div class="CountScores_Layer2_Right">&nbsp;</div>
				<div class="CountScores_Layer2_Bottom">&nbsp;</div>
			</div>
			<div class="CountClassLayer_Goal">
				<div class="CountClassLayer_Goal_Text d-none">ГООООЛ!</div>
				<div class="CountClassLayer_TimeOut_Text d-none">ТАЙМАУТ</div>
				<div id="CountClassLayer_Goal_LeftLogo">&nbsp;</div>
				<div id="CountClassLayer_Goal_RightLogo">&nbsp;</div>
			</div>
		</div>
	</div>
</div>`;
/* ################################################################################################
    Переменные:

*/
const FS_BoardGoal2 = () => `
<div id="boardGoal2" class="cl_boardGoal2">
	<div class="cl_boardGoal2Wrap">
		<div class="Goal2ClassScores">
			<div class="Goal2ClassLayer">
				<div class="Goal2ClassLayer_Text">ГООООЛ!</div>
				<div id="Goal2ClassLayer_Logo">&nbsp;</div>
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
<div id="boardStart" class="cl_StartWrap">
    <div class="cl_Start">
        <div class="cl_Start_Layer1">
            <div class="cl_Start_Layer2_1"></div>
            <div class="cl_Start_Layer2_2"></div>
            <div class="cl_Start_Layer2_3"></div>
            <div class="cl_Start_Layer3"></div>
            <div class="cl_Start_Layer6">
                <div id="StartClassPlayerLeftLogo" class="cl_Start_Layer6_1"></div>
                <div id="StartClassPlayerRightLogo" class="cl_Start_Layer6_2"></div>
            </div>
            <div class="cl_Start_Layer10"></div>
            <div class="cl_Start_Layer7">
                <div class="cl_Start_Layer7_Left">
                    <div id="StartClassPlayerLeftName">${data['PlayerLeftName']}</div>
                </div>
                <div class="cl_Start_Layer7_Right">
                    <div id="StartClassPlayerRightName">${data['PlayerRightName']}</div>
                </div>
            </div>
            
            <div class="cl_Start_Layer8">${data['GameName']}</div>
            <div class="cl_Start_Layer9">${data['GamePlace']}, ${data['GameCity']}</div>
			<div class="cl_Start_Layer11"></div>
        </div>
        <div class="cl_Start_Layer4_1"></div>
        <div class="cl_Start_Layer4_2"></div>
    </div>
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
<div id="boardListPlayer" class="cl_ListPlayerWrap">
    <div class="cl_ListPlayer">
        <div class="cl_ListPlayer_Layer1">
            <div class="cl_ListPlayer_Layer2_1"></div>
            <div class="cl_ListPlayer_Layer2_2"></div>
            <div class="cl_ListPlayer_Layer2_3"></div>
            <div class="cl_ListPlayer_Layer3"></div>
            <div class="cl_ListPlayer_Layer6">
                <div id="ListPlayerClassLogo" class="cl_ListPlayer_Layer6_1"></div>
            </div>
            <div class="cl_ListPlayer_Layer7">
                <div class="cl_ListPlayer_Layer7_Left">
                    <div id="ListPlayerClassPlayerLeftName">${data['PlayerFullName']}</div>
                </div>
            </div>
            <div class="cl_ListPlayer_Layer11"></div>
            <div class="cl_ListPlayer_Layer8">${data['PlayerTrainer']}</div>
			<div class="cl_ListPlayer_Layer10">ГЛАВНЫЙ ТРЕНЕР</div>
            <div class="cl_ListPlayer_Layer9">${data['PlayerPlace']}</div>
			<div id="ListPlayerClassVratari"><div class="title">ВРАТАРИ</div>${data['PlayerVratari']}</div>
    		<div id="ListPlayerClassSecurity"><div class="title">ЗАЩИТНИКИ</div>${data['PlayerSecurity']}</div>
    		<div id="ListPlayerClassNapadenie"><div class="title">НАПАДАЮЩИЕ</div>${data['PlayerNapadenie']}</div>
        </div>
        <div class="cl_ListPlayer_Layer4_1"></div>
        <div class="cl_ListPlayer_Layer4_2"></div>
    </div>
</div>
`;

/* ################################################################################################
    Переменные:
        1) ${data['PlayerFullName']}  - Название первой команды
*/
const FS_BoardStart5Player = (data) => `
<div id="boardStart5Player" class="cl_boardStart5Player">
	<div class="Start5Player_Left">
		<div class="Start5Player_Boss">
			<div class="Start5Player_Boss_Layer2_1"></div>
			<div class="Start5Player_Boss_Layer2_2"></div>
            <div class="Start5Player_Boss_Logo">
                <div id="TeamLeftLogo"></div>
            </div>
            <div class="Start5Player_Boss_Layer3">
                <div class="Start5Player_Boss_Layer3_1"><span class="Start5Player_Number">Н${data['TeamPlayer-LF-Number']}</span>${data['TeamPlayer-LF-FullName']}</div>
                <div class="Start5Player_Boss_Layer3_2"><span class="Start5Player_Number">Н${data['TeamPlayer-CF-Number']}</span>${data['TeamPlayer-CF-FullName']}</div>
                <div class="Start5Player_Boss_Layer3_3"><span class="Start5Player_Number">Н${data['TeamPlayer-RF-Number']}</span>${data['TeamPlayer-RF-FullName']}</div>
                <div class="Start5Player_Boss_Layer3_4"><span class="Start5Player_Number">З${data['TeamPlayer-LD-Number']}</span>${data['TeamPlayer-LD-FullName']}</div>
                <div class="Start5Player_Boss_Layer3_5"><span class="Start5Player_Number">З${data['TeamPlayer-RD-Number']}</span>${data['TeamPlayer-RD-FullName']}</div>
            </div>
		</div>
	</div>
</div>`;

/* ################################################################################################
    Переменные:
        1) ${data['']} - Название первой команды
        2) ${data['']} - Название второй команды
        3) ${data['']} - Счёт первой команды
        4) ${data['']} - Счёт первой команды
        5) ${data['']} - Период
        6) ${data['']} - Оставшееся время до окончания периода
        7) ${data['']} - 
        8) ${data['']} - 
*/
const FS_BoardEndPeriod = (data) => `
<div id="boardEndPeriod" class="cl_EndPeriodWrap">
	<div class="cl_EndPeriod_Layer2_1"></div>
	<div class="cl_EndPeriod_Layer2_2"></div>
	<div class="cl_EndPeriod_Layer2_3">
		<div class="cl_EndPeriod_Layer2_3_1">
			<div class="cl_boardEndPeriod__PlayerLeftLogo" id="PlayerLeftLogo"></div>
			<div class="cl_boardEndPeriod__PlayerLeftName">${data['PlayerLeft']['FullName']}</div>
			<div class="cl_boardEndPeriod__PlayerLeftPlace">${data['PlayerLeft']['Place']}</div>
			<div class="cl_boardEndPeriod__PlayerRightLogo" id="PlayerRightLogo"></div>
			<div class="cl_boardEndPeriod__PlayerRightName">${data['PlayerRight']['FullName']}</div>
			<div class="cl_boardEndPeriod__PlayerRightPlace">${data['PlayerRight']['Place']}</div>
		</div>
		<div class="cl_EndPeriod_Layer2_3_2">
			<div class="cl_boardEndPeriod__PeriodNumber">
				<div class="cl_boardEndPeriod__PeriodNumber__Top">
					<div class="cl_boardEndPeriod__PlayerLeftCount">${data['CountPeriodLeft']}</div>
					<div class="cl_boardEndPeriod__PlayerCountRazdel"></div>
					<div class="cl_boardEndPeriod__PlayerRightCount">${data['CountPeriodRight']}</div>
				</div>
				<div class="cl_boardEndPeriod__PeriodNumber__Bottom">ПОСЛЕ ${data['NumberPeriod']} ПЕРИОДА</div>
			</div>
		</div>
	</div>
</div>`;
/* ################################################################################################
    Переменные:
        1) ${data['']} - Название первой команды
        2) ${data['']} - Название второй команды
        3) ${data['']} - Счёт первой команды
        4) ${data['']} - Счёт первой команды
        5) ${data['']} - Период
        6) ${data['']} - Оставшееся время до окончания периода
        7) ${data['']} - 
        8) ${data['']} - 
*/
const FS_BoardStartPeriod = (data) => `
<div id="boardStartPeriod" class="cl_StartPeriodWrap">
	<div class="cl_StartPeriod_Layer2_1"></div>
	<div class="cl_StartPeriod_Layer2_2"></div>
	<div class="cl_StartPeriod_Layer2_3">
		<div class="cl_StartPeriod_Layer2_3_1">
			<div class="cl_boardStartPeriod__PlayerLeftLogo" id="PlayerLeftLogo"></div>
			<div class="cl_boardStartPeriod__PlayerLeftName">${data['PlayerLeft']['FullName']}</div>
			<div class="cl_boardStartPeriod__PlayerLeftPlace">${data['PlayerLeft']['Place']}</div>
			<div class="cl_boardStartPeriod__PlayerRightLogo" id="PlayerRightLogo"></div>
			<div class="cl_boardStartPeriod__PlayerRightName">${data['PlayerRight']['FullName']}</div>
			<div class="cl_boardStartPeriod__PlayerRightPlace">${data['PlayerRight']['Place']}</div>
		</div>
		<div class="cl_StartPeriod_Layer2_3_2">
			<div class="cl_boardStartPeriod__PeriodNumber">
				<div class="cl_boardStartPeriod__PeriodNumber__Top">
					<div class="cl_boardStartPeriod__PlayerLeftCount">${data['CountPeriodLeft']}</div>
					<div class="cl_boardStartPeriod__PlayerCountRazdel"></div>
					<div class="cl_boardStartPeriod__PlayerRightCount">${data['CountPeriodRight']}</div>
				</div>
				<div class="cl_boardStartPeriod__PeriodNumber__Bottom">${data['NumberPeriod']} ПЕРИОД</div>
			</div>
		</div>
	</div>
</div>`;
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
const FS_BoardTeamRoom = (data) => `
<div id="boardTeamRoom" class="cl_boardTeamRoom">
	<div class="TeamRoomLeft">
		<div class="TeamRoomClassBoss">
			<div class="TeamRoomBossLayer2"></div>
			<div class="TeamRoomBossLayer2_1"></div>
			<div class="TeamRoomBossLayer2_2"></div>
			<div class="TeamRoomBoss_Layer3_First">
                <div class="TeamRoomBoss_Layer3_First_1">${data['TeamName']}</div>
            </div>
			<div class="TeamRoomBoss_Layer3_Second">
                <div id="TeamRoomLogo" class="TeamRoomBoss_Layer3_Second_1"></div>
            </div>
			<div class="TeamRoomBoss_Layer3_Title"><span>КОМНАТА КОМАНДЫ</span></div>
		</div>
	</div>
</div>
`;
/* ################################################################################################
    Переменные:
        1) 
        2) 
        3) 
        4) 
		5) 
        6) 
        7) 
        8) 
*/
const FS_BoardStart5LeftAndRight = (data) => `
<div id="boardStart5LeftAndRight" class="cl_boardStart5LeftAndRight">
	<div class="Start5LeftAndRight_Left">
		<div class="Start5LeftAndRight_Boss">

			<div class="Start5LeftAndRight_Boss_Layer2_1"></div>
			<div class="Start5LeftAndRight_Boss_Layer2_2"></div>
            <div class="Start5LeftAndRight_Boss_Logo">
                <div id="TeamLeftLogo"></div>
            </div>
            <div class="Start5LeftAndRight_Boss_Layer3">
                <div class="Start5LeftAndRight_Boss_Layer3_1"><span class="Start5LeftAndRight_Number">F${data['TeamLeft-LF-Number']}</span>${data['TeamLeft-LF-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_2"><span class="Start5LeftAndRight_Number">F${data['TeamLeft-CF-Number']}</span>${data['TeamLeft-CF-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_3"><span class="Start5LeftAndRight_Number">F${data['TeamLeft-RF-Number']}</span>${data['TeamLeft-RF-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_4"><span class="Start5LeftAndRight_Number">D${data['TeamLeft-LD-Number']}</span>${data['TeamLeft-LD-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_5"><span class="Start5LeftAndRight_Number">D${data['TeamLeft-RD-Number']}</span>${data['TeamLeft-RD-FullName']}</div>
            </div>
		</div>
	</div>
	<div class="Start5LeftAndRight_Right">
		<div class="Start5LeftAndRight_Lines">
			<div class="Start5LeftAndRight_Boss_Layer2_1"></div>
			<div class="Start5LeftAndRight_Boss_Layer2_2"></div>
            <div class="Start5LeftAndRight_Boss_Logo">
                <div id="TeamRightLogo"></div>
            </div>
            <div class="Start5LeftAndRight_Boss_Layer3">
                <div class="Start5LeftAndRight_Boss_Layer3_1"><span class="Start5LeftAndRight_Number">F${data['TeamRight-LF-Number']}</span>${data['TeamRight-LF-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_2"><span class="Start5LeftAndRight_Number">F${data['TeamRight-CF-Number']}</span>${data['TeamRight-CF-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_3"><span class="Start5LeftAndRight_Number">F${data['TeamRight-RF-Number']}</span>${data['TeamRight-RF-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_4"><span class="Start5LeftAndRight_Number">D${data['TeamRight-LD-Number']}</span>${data['TeamRight-LD-FullName']}</div>
                <div class="Start5LeftAndRight_Boss_Layer3_5"><span class="Start5LeftAndRight_Number">D${data['TeamRight-RD-Number']}</span>${data['TeamRight-RD-FullName']}</div>
            </div>
		</div>
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
const FS_BoardShootout_1_5 = (data) => `
<div id="boardShootout_1_5" class="cl_boardShootout_1_5">
    <div id="DeletePlayerOneLineBlock" class="cl_boardShootoutPowerPlay">
        <div class="ShootoutShootoutPowerPlayScores">
            <div class="ShootoutShootoutPowerPlayScores_Text"><span id="ShootoutShootoutPowerPlayScores_Text_PowerPlay">БУЛЛИТЫ</span></div>
        </div>
    </div>
	<div class="ShootoutScores">
		<div class="ShootoutLayer1">
			<div class="ShootoutLinePlayerLeft">
				<div id="ShootoutTeamLeftLogo">&nbsp;</div><div id="ShootoutTeamLeftShortName">${data['TeamLeftShortName']}</div>
			</div>
			<div class="ShootoutLinePlayerRight">
				<div id="ShootoutTeamRightLogo">&nbsp;</div><div id="ShootoutTeamRightShortName">${data['TeamRightShortName']}</div>
			</div>
		</div>
	</div>
	<div class="ShootoutLayer2">
		<div class="ShootoutLayer2_0">
			<div class="ShootoutLayer2_0_1">
				1
			</div>
		</div>
		<div class="ShootoutLayer2_1">
			<div class="ShootoutLayer2_1_1">
				<div class="ShootoutLayer2_Left">
					<span id="ShootoutLayer2_Left_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer2_Left_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer2_Left_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
				<div class="ShootoutLayer2_Center">
					<hr>
				</div>
				<div class="ShootoutLayer2_Right">
					<span id="ShootoutLayer2_Right_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer2_Right_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer2_Right_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div class="ShootoutLayer3">
		<div class="ShootoutLayer3_0">
			<div class="ShootoutLayer3_0_1">
				2
			</div>
		</div>
		<div class="ShootoutLayer3_1">
			<div class="ShootoutLayer3_1_1">
				<div class="ShootoutLayer3_Left">
					<span id="ShootoutLayer3_Left_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer3_Left_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer3_Left_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
				<div class="ShootoutLayer3_Center">
					<hr>
				</div>
				<div class="ShootoutLayer3_Right">
					<span id="ShootoutLayer3_Right_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer3_Right_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer3_Right_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div class="ShootoutLayer4">
		<div class="ShootoutLayer4_0">
			<div class="ShootoutLayer4_0_1">
				3
			</div>
		</div>
		<div class="ShootoutLayer4_1">
			<div class="ShootoutLayer4_1_1">
				<div class="ShootoutLayer4_Left">
					<span id="ShootoutLayer4_Left_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer4_Left_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer4_Left_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
				<div class="ShootoutLayer4_Center">
					<hr>
				</div>
				<div class="ShootoutLayer4_Right">
					<span id="ShootoutLayer4_Right_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer4_Right_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer4_Right_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div class="ShootoutLayer5">
		<div class="ShootoutLayer5_0">
			<div class="ShootoutLayer5_0_1">
				4
			</div>
		</div>
		<div class="ShootoutLayer5_1">
			<div class="ShootoutLayer5_1_1">
				<div class="ShootoutLayer5_Left">
					<span id="ShootoutLayer5_Left_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer5_Left_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer5_Left_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
				<div class="ShootoutLayer5_Center">
					<hr>
				</div>
				<div class="ShootoutLayer5_Right">
					<span id="ShootoutLayer5_Right_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer5_Right_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer5_Right_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div class="ShootoutLayer6">
		<div class="ShootoutLayer6_0">
			<div class="ShootoutLayer6_0_1">
				5
			</div>
		</div>
		<div class="ShootoutLayer6_1">
			<div class="ShootoutLayer6_1_1">
				<div class="ShootoutLayer6_Left">
					<span id="ShootoutLayer6_Left_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer6_Left_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer6_Left_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
				<div class="ShootoutLayer6_Center">
					<hr>
				</div>
				<div class="ShootoutLayer6_Right">
					<span id="ShootoutLayer6_Right_Hit" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/></svg>
					</span>
					<span id="ShootoutLayer6_Right_Past" class="d-none">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
					</span>
					<span id="ShootoutLayer6_Right_Empty" class="">
						<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z"/></svg>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div class="ShootoutLayer7">
		<div class="ShootoutLayer7_0">
			<div class="ShootoutLayer7_0_1">
				ВСЕГО
			</div>
		</div>
		<div class="ShootoutLayer7_1">
			<div class="ShootoutLayer7_1_1">
				<div id="Shootout_Result_Left" class="ShootoutLayer7_Left">
					0
				</div>
				<div class="ShootoutLayer7_Center">
					<hr>
				</div>
				<div id="Shootout_Result_Right" class="ShootoutLayer7_Right">
					0
				</div>
			</div>
		</div>
	</div>
</div>`;
/* ################################################################################################
    Переменные:
        1) ${data['']} - Название первой команды
        2) ${data['']} - Название второй команды
        3) ${data['']} - Счёт первой команды
        4) ${data['']} - Счёт первой команды
        5) ${data['']} - Период
        6) ${data['']} - Оставшееся время до окончания периода
        7) ${data['']} - 
        8) ${data['']} - 
*/
const FS_BoardFinalResultBottom = (data) => `
<div id="boardFinalResultBottom" class="cl_FinalResultBottomWrap">
	<div class="cl_FinalResultBottom_Layer2_1"></div>
	<div class="cl_FinalResultBottom_Layer2_2"></div>
	<div class="cl_FinalResultBottom_Layer2_3">
		<div class="cl_FinalResultBottom_Layer2_3_1">
			<div class="cl_boardFinalResultBottom__PlayerLeftLogo" id="PlayerLeftLogo"></div>
			<div class="cl_boardFinalResultBottom__PlayerLeftName">${data['PlayerLeft']['FullName']}</div>
			<div class="cl_boardFinalResultBottom__PlayerLeftPlace">${data['PlayerLeft']['Place']}</div>
			<div class="cl_boardFinalResultBottom__PlayerRightLogo" id="PlayerRightLogo"></div>
			<div class="cl_boardFinalResultBottom__PlayerRightName">${data['PlayerRight']['FullName']}</div>
			<div class="cl_boardFinalResultBottom__PlayerRightPlace">${data['PlayerRight']['Place']}</div>
		</div>
		<div class="cl_FinalResultBottom_Layer2_3_2">
			<div class="cl_boardFinalResultBottom__PeriodNumber">
				<div class="cl_boardFinalResultBottom__PeriodNumber__Top">
					<div class="cl_boardFinalResultBottom__PlayerLeftCount">${data['CountLeft']}</div>
					<div class="cl_boardFinalResultBottom__PlayerCountRazdel"></div>
					<div class="cl_boardFinalResultBottom__PlayerRightCount">${data['CountRight']}</div>
				</div>
				<div class="cl_boardFinalResultBottom__PeriodNumber__Bottom">Final Result</div>
			</div>
		</div>
	</div>
</div>`;
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
const FS_BoardPause = (data) => `
<div id="boardPause" class="cl_PauseWrap">
    <div class="cl_Pause">
        <div class="cl_Pause_Layer1">
            <div class="cl_Pause_Layer2_1"></div>
            <div class="cl_Pause_Layer2_2"></div>
            <div class="cl_Pause_Layer2_3"></div>
            <div class="cl_Pause_Layer3"></div>
            <div class="cl_Pause_Layer6">
                <div id="PauseClassPlayerLeftLogo" class="cl_Pause_Layer6_1"></div>
                <div id="PauseClassPlayerRightLogo" class="cl_Pause_Layer6_2"></div>
            </div>
            <div class="cl_Pause_Layer10">Перерыв<br><div id="PauseIDTime">${data['Time']}</div></div>
            <div class="cl_Pause_Layer7">
                <div class="cl_Pause_Layer7_Left">
                    <div id="PauseClassPlayerLeftName">${data['PlayerLeftName']}</div>
                </div>
                <div class="cl_Pause_Layer7_Right">
                    <div id="PauseClassPlayerRightName">${data['PlayerRightName']}</div>
                </div>
            </div>
            
            <div class="cl_Pause_Layer8">${data['GameName']}</div>
            <div class="cl_Pause_Layer9">${data['GamePlace']}, ${data['GameCity']}</div>
			<div class="cl_Pause_Layer11"></div>
        </div>
        <div class="cl_Pause_Layer4_1"></div>
        <div class="cl_Pause_Layer4_2"></div>
    </div>
</div>`;
