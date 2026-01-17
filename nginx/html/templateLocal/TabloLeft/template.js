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

const FS_BoardWelcome = (data) => ``;
const FS_BoardJudges = (data) => ``;
const FS_BoardCommentators = (data) => ``;
const FS_BoardTrainerTeam = (data) => ``;
const FS_BoardCount = (data) => `
<div id="boardCount" class="cl_boardCount">
	<div class="CountClassScores">
		<div id="CountClassPlayerLeftLogo"></div>
		<!-- <div id="CountClassPlayerLeftFullName">${data['PlayerLeftFullName']}</div> 
		<div id="CountClassPlayerLeftPlace">${data['PlayerLeftPlace']}</div>-->
		<div id="CountClassPlayerLeftCount">${data['CountPlayerLeft']}</div><div class="CountClassCountMinus">:</div><div id="CountClassPlayerRightLogo"></div>
		<div id="CountClassPlayerRightCount">${data['CountPlayerRight']}</div>
		<!--<div id="CountClassPlayerRightFullName">${data['PlayerRightFullName']}</div>
		<div id="CountClassPlayerRightPlace">${data['PlayerRightPlace']}</div>-->
		<div class="CountClassPauseWrap">
			<div id="CountClassPause" class="d-none">Перерыв</div>
			<div id="CountClassTimeOut" class="d-none">ТАЙМАУТ</div>
			<div id="CountClassTimeOutLeft"  class="d-none">ТАЙМАУТ</div>
			<div id="CountClassTimeOutRight" class="d-none">ТАЙМАУТ</div>
		</div>
		<div id="CountClassVs">Против</div>
		<div id="CountClassTime">${data['Timer']}</div>
        <div id="CountClassTime2"><span id="CountIdPeriod">${data['Period']}</span> ПЕРИОД</div>
		<div class="CountClassDeletePlayerLeft">
            <div id="DeletePlayerLeftLine1Block" class="Line1 d-none">
                <div id="DeletePlayerLeftLine1Number" class="Num">77</div>
                <div id="DeletePlayerLeftLine1Time" class="Time">5:00</div>
            </div>
            <div id="DeletePlayerLeftLine2Block" class="Line2 d-none">
                <div id="DeletePlayerLeftLine2Number" class="Num">78</div>
                <div id="DeletePlayerLeftLine2Time" class="Time">5:00</div>
            </div>
            <div id="DeletePlayerLeftLine3Block" class="Line3 d-none">
                <div id="DeletePlayerLeftLine3Number" class="Num">33</div>
                <div id="DeletePlayerLeftLine3Time" class="Time">5:00</div>
            </div>
        </div>
        <div class="CountClassDeletePlayerRight">
            <div id="DeletePlayerRightLine1Block" class="Line1 d-none">
                <div id="DeletePlayerRightLine1Number" class="Num">77</div>
                <div id="DeletePlayerRightLine1Time" class="Time">5:00</div>
            </div>
            <div id="DeletePlayerRightLine2Block" class="Line2 d-none">
                <div id="DeletePlayerRightLine2Number" class="Num">78</div>
                <div id="DeletePlayerRightLine2Time" class="Time">5:00</div>
            </div>
            <div id="DeletePlayerRightLine3Block" class="Line3 d-none">
                <div id="DeletePlayerRightLine3Number" class="Num">33</div>
                <div id="DeletePlayerRightLine3Time" class="Time">5:00</div>
            </div>
        </div>
	</div>
</div>`;
const FS_BoardLogo1 = (data) => ``;
const FS_BoardStart = (data) => ``;
const FS_BoardListPlayer = (data) => ``;
const FS_BoardStart5Player = (data) => ``;
const FS_BoardTimer = (data) => ``;
