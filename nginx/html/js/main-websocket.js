
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
// Порт для Web Socket
//const WebSocketPort = 8200;
var EventDB = [];
var JsonData;
var boardOpen = false;
var boardCountOpen = false;
var boardLogo1Open = false;
var boardListPlayerOpen = false;
var boardStartOpen = false;
var timerBoardOpen = false;
var boardConfigure = false;

const ConfigShowTimer = false;

// Таймер закрытия панели
let timerCloseBoardCount;

function connect() {
    var ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
    ws.onopen = function() {
        if (debuging != false) {console.log('WebSocket connected');};
    };

    ws.onmessage = function(evt) {
        JsonData = JSON.parse(evt.data);
        if (JsonData) {
            //Обновить табло
            if (boardCountOpen && JsonData.dAction == 'Update') {
                if (JsonData.CountPlayerLeft.Upd == 1) {
                    $("#CountClassCountPlayer1").html(JsonData.CountPlayerLeft.Count);
                }
                if (JsonData.CountPlayerRight.Upd == 1) {
                    $("#CountClassCountPlayer2").html(JsonData.CountPlayerRight.Count);
                }
                if (JsonData.Period.Upd == 1) {
                    $("#CountIdPeriod" ).html(JsonData.Period.Count);
                }
                if (JsonData.Period.Upd == 1) {
                    $("#CountIdPeriod" ).html(JsonData.Period.Count);
                }
                if (JsonData.TimerUpdate == 1) {

                    if (JsonData.TimerSecondes < 10) {
                        tempSec = "0" + JsonData.TimerSecondes;
                    }
                    else {
                        tempSec = JsonData.TimerSecondes;
                    }
                    $("#CountClassTime").html(JsonData.TimerMinutes + ":" + tempSec);
                }
                if (JsonData.TimerType.Upd == 1) {
                    if (JsonData.TimerType.Count == 2) {
                        $("#CountClassPause").removeClass("d-none");
                        $("#CountClassPause").addClass("d-block");
                    }
                    else {
                        $("#CountClassPause").removeClass("d-block");
                        $("#CountClassPause").addClass("d-none");
                    }
                }
                LineDelPlayer = JsonData.DelPlayer.Left1;
                if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
                    $(".CountClassDeletePlayerLeft>div:nth-child(1)>.Num").html(LineDelPlayer.Num);
                    $(".CountClassDeletePlayerLeft>div:nth-child(1)>.Time" ).html(LineDelPlayer.Time);
                    if (LineDelPlayer.Upd == 1) {
                        $(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-none");
                        $(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-block");
                    }
                    if (LineDelPlayer.Upd == 2) {
                        $(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-block");
                        $(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-none");
                        
                    }
                }
                LineDelPlayer = JsonData.DelPlayer.Left2;
                if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
                    $(".CountClassDeletePlayerLeft>div:nth-child(2)>.Num").html(LineDelPlayer.Num);
                    $(".CountClassDeletePlayerLeft>div:nth-child(2)>.Time").html(LineDelPlayer.Time);
                    if (LineDelPlayer.Upd == 1) {
                        $(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-none");
                        $(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-block");
                    }
                    if (LineDelPlayer.Upd == 2) {
                        $(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-block");
                        $(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-none");
                    }
                }
                LineDelPlayer = JsonData.DelPlayer.Left3;
                if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
                    $(".CountClassDeletePlayerLeft>div:nth-child(3)>.Num").html(LineDelPlayer.Num);
                    $(".CountClassDeletePlayerLeft>div:nth-child(3)>.Time").html(LineDelPlayer.Time);
                    if (LineDelPlayer.Upd == 1) {
                        $(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-none");
                        $(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-block");
                    }
                    if (LineDelPlayer.Upd == 2) {
                        $(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-block");
                        $(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-none");
                        
                    }
                }
                LineDelPlayer = JsonData.DelPlayer.Right1;
                if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
                    $(".CountClassDeletePlayerRight>div:nth-child(1)>.Num").html(LineDelPlayer.Num);
                    $(".CountClassDeletePlayerRight>div:nth-child(1)>.Time").html(LineDelPlayer.Time);
                    if (LineDelPlayer.Upd == 1) {
                        $(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-none");
                        $(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-block");
                    }
                    if (LineDelPlayer.Upd == 2) {
                        $(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-block");
                        $(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-none");
                        
                    }
                }
                LineDelPlayer = JsonData.DelPlayer.Right2;
                if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
                    $(".CountClassDeletePlayerRight>div:nth-child(2)>.Num").html(LineDelPlayer.Num);
                    $(".CountClassDeletePlayerRight>div:nth-child(2)>.Time").html(LineDelPlayer.Time);
                    if (LineDelPlayer.Upd == 1) {
                        $(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-none");
                        $(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-block");
                    }
                    if (LineDelPlayer.Upd == 2) {
                        $(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-block");
                        $(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-none");
                        
                    }
                }
                LineDelPlayer = JsonData.DelPlayer.Right3;
                if (LineDelPlayer.Upd >= 1 && LineDelPlayer.Upd <= 3) {
                    $(".CountClassDeletePlayerRight>div:nth-child(3)>.Num").html(LineDelPlayer.Num);
                    $(".CountClassDeletePlayerRight>div:nth-child(3)>.Time").html(LineDelPlayer.Time);
                    if (LineDelPlayer.Upd == 1) {
                        $(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-none");
                        $(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-block");
                    }
                    if (LineDelPlayer.Upd == 2) {
                        $(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-block");
                        $(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-none");
                        
                    }
                }
            }
            //Обновить время
            else if (JsonData.dAction == 'TimerUpdate' && boardCountOpen) {
                // Показать табло со временем
                $("#CountClassTime").html( JsonData.Value );
            }
            // Перезагрузить табло
            else if (JsonData.dAction == 'ReloadTablo' && ConfigShowTimer) {
                window.location.href = window.location.href;
                document.location.reload();
            }
            // Перезагрузить титры
            else if (JsonData.dAction == 'ReloadTV' && !ConfigShowTimer) {
                window.location.href = window.location.href;
                document.location.reload();
            }
            // Открыть титры для Хоккея
            else if (JsonData.dAction == 'OpenTVHK') {
                window.open("TV.html","_self")
            }
            // Открыть титры для Футбола
            else if (JsonData.dAction == 'OpenTVFootball') {
                window.open("TV-Football.html","_self")
            }
            // Первые данные
            else if (JsonData.dAction == 'InitBoardCount') {
                EventDB['CountPlayerLeft']      = JsonData.CountPlayerLeft;
                EventDB['CountPlayerRight']     = JsonData.CountPlayerRight;
                EventDB['PlayerLeftShortName']  = JsonData.PlayerLeft.ShortName;
                EventDB['PlayerLeftFullName']   = JsonData.PlayerLeft.FullName;
                EventDB['PlayerRightShortName'] = JsonData.PlayerRight.ShortName;
                EventDB['PlayerRightFullName']  = JsonData.PlayerRight.FullName;
                EventDB['Period']       = JsonData.Period;
                EventDB['Timer']        = JsonData.Timer;
                EventDB['BoardCountStatus']   = JsonData.BoardCountStatus;
                if (EventDB['BoardCountStatus'] == 'active') {
                    /*$("#root_boardCount").html(FS_BoardCount);*/
                    $("#CountClassCountPlayerLeft" ).html(EventDB['CountPlayerLeft']);
                    $("#CountClassCountPlayerRight").html(EventDB['CountPlayerRight']);

                    $("#CountClassPlayerLeftFullName"  ).html(EventDB['PlayerLeftFullName']);
                    $("#CountClassPlayerLeftShortName" ).html(EventDB['PlayerLeftShortName']);
                    $("#CountClassPlayerRightFullName" ).html(EventDB['PlayerRightFullName']);
                    $("#CountClassPlayerRightShortName").html(EventDB['PlayerRightShortName']);
                    $("#CountClassTime1"       ).html(EventDB['Timer']);
                    $("#boardCount"            ).addClass("cl_boardIn");
                    boardCountOpen = true;
                }
            }
            // Счёт левой команды
            else if (JsonData.dAction == 'CountPlayerLeft') {
                $("#CountClassCountPlayerLeft" ).html(JsonData.Value);
            }
            // Счёт правой команды
            else if (JsonData.dAction == 'CountPlayerRight') {
                $("#CountClassCountPlayerRight" ).html(JsonData.Value);
            }
            // Период
            else if (JsonData.dAction == 'Period') {
                $("#CountIdPeriod" ).html(JsonData.Value);
            }
            //Очистить экран
            else if (JsonData.dAction == 'Clear') {
                if (boardCountOpen) {
                    cleanBoardPersonal();
                }
            }
            //Показать или обновить табло счёта
            else if (JsonData.dAction == 'ShowBoardCount' || JsonData.dAction == 'UpdateBoardCount') {
                if (debuging != false) {console.log('ShowBoardCount');};
                if (!boardCountOpen || (boardCountOpen && JsonData.dAction == 'UpdateBoardCount')) {
                    showBoardCount(JsonData);
                }
            }
            //Скрыть табло счёта
            else if (JsonData.dAction == 'HideBoardCount') {
                if (debuging != false) {console.log('HideBoardCount');};
                if (boardCountOpen) {
                    hideBoardCount();
                }
            }
            //Показать Логотип №1
            else if (JsonData.dAction == 'ShowBoardLogo1') {
                if (debuging != false) {console.log('ShowBoardLogo1');};
                if (!boardLogo1Open) {
                    showBoardLogo1(JsonData);
                }
            }
            //Скрыть Логотип №1
            else if (JsonData.dAction == 'HideBoardLogo1') {
                if (debuging != false) {console.log('HideBoardLogo1');};
                if (boardLogo1Open) {
                    hideBoardLogo1();
                }
            }
            //Показать Команды
            else if (JsonData.dAction == 'ShowBoardStart') {
                if (debuging != false) {console.log('ShowBoardStart');};
                if (!boardStartOpen) {
                    showBoardStart(JsonData);
                }
            }
            //Скрыть Команды
            else if (JsonData.dAction == 'HideBoardStart') {
                if (debuging != false) {console.log('HideBoardStart');};
                if (boardStartOpen) {
                    hideBoardStart();
                }
            }
            //Показать список команды
            else if (JsonData.dAction == 'ShowBoardListPlayer') {
                if (debuging != false) {console.log('ShowBoardListPlayer');};
                if (!boardListPlayerOpen) {
                    showBoardListPlayer(JsonData);
                }
            }
            //Скрыть список команды
            else if (JsonData.dAction == 'HideBoardListPlayer') {
                if (debuging != false) {console.log('HideBoardListPlayer');};
                if (boardListPlayerOpen) {
                    hideBoardListPlayer();
                }
            }
        if (debuging != false) {console.log('Необходимо обновить данные ');};
        }
        else {
            if (debuging != false) {console.log('WebSocket empty messages');};
        }
    };

    ws.onclose = function(e) {
        EventDB = [];
        if (debuging != false) {console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);};
        setTimeout(function() {
            connect();
        }, 1000);
    };

    ws.onerror = function(err) {
        if (debuging != false) {console.error('Socket encountered error: ', err.message, 'Closing socket');};
        ws.close();
    };
}
function showBoardCount(JsonData) {
    if (debuging != false) {console.log('Action: Show or Update board count');};
    if (JsonData.TimerSecondes < 10 && JsonData.TimerSecondes != '00') {
        tempSec = "0" + JsonData.TimerSecondes;
    }
    else {
        tempSec = JsonData.TimerSecondes;
    }
    if (JsonData.dAction != 'UpdateBoardCount') {

        $("#root_boardCount").html(FS_BoardCount({
            'CountPlayerLeft': JsonData.CountPlayerLeft.Count,
            'CountPlayerRight': JsonData.CountPlayerRight.Count,
            'PlayerLeftShortName': JsonData.PlayerLeft.ShortName,
            'PlayerLeftFullName' : JsonData.PlayerLeft.FullName,
            'PlayerRightShortName' : JsonData.PlayerRight.ShortName,
            'PlayerRightFullName' : JsonData.PlayerRight.FullName,
            'Period':       JsonData.Period.Count,
            'Timer':        JsonData.TimerMinutes + ':' + tempSec,
        }));
        $("#CountClassPlayerLeftLogo").css('background-image',"url('LogoTeam/" + JsonData.PlayerLeft.Logo + "')");
        $("#CountClassPlayerRightLogo").css('background-image',"url('LogoTeam/" + JsonData.PlayerRight.Logo + "')");
        $( "#boardCount").removeClass("cl_boardOut");
        $( "#boardCount").addClass("cl_boardIn");
        const node1 = document.getElementById('boardCount');
        function handleAnimationEnd1() {
            if (debuging != false) {console.log('Action: Show board count END');};
            boardCountOpen = true;
        }
        node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
    }
    $("#CountClassCountPlayerLeft").html(JsonData.CountPlayerLeft.Count);
    $("#CountClassCountPlayerRight").html(JsonData.CountPlayerRight.Count);
    $("#CountClassPlayerLeftFullName"  ).html(JsonData.PlayerLeft.FullName);
    $("#CountClassPlayerLeftShortName" ).html(JsonData.PlayerLeft.ShortName);
    $("#CountClassPlayerRightFullName" ).html(JsonData.PlayerRight.FullName);
    $("#CountClassPlayerRightShortName").html(JsonData.PlayerRight.ShortName);
    $("#CountIdPeriod"         ).html(JsonData.Period.Count);
    $("#CountIdTimer"          ).html(JsonData.TimerMinutes + ':' + tempSec);
    if (JsonData.DelPlayer.Left1.Num > 0) {
        $(".CountClassDeletePlayerLeft>div:nth-child(1)>.Num").html(JsonData.DelPlayer.Left1.Num);
        $(".CountClassDeletePlayerLeft>div:nth-child(1)>.Time" ).html(JsonData.DelPlayer.Left1.Time);
        $(".CountClassDeletePlayerLeft>div:nth-child(1)" ).removeClass("d-none");
        $(".CountClassDeletePlayerLeft>div:nth-child(1)" ).addClass("d-block");
    }
    if (JsonData.DelPlayer.Left2.Num > 0) {
        $(".CountClassDeletePlayerLeft>div:nth-child(2)>.Num").html(JsonData.DelPlayer.Left2.Num);
        $(".CountClassDeletePlayerLeft>div:nth-child(2)>.Time").html(JsonData.DelPlayer.Left2.Time);
        $(".CountClassDeletePlayerLeft>div:nth-child(2)").removeClass("d-none");
        $(".CountClassDeletePlayerLeft>div:nth-child(2)").addClass("d-block");
    }
    if (JsonData.DelPlayer.Left3.Num > 0) {
        $(".CountClassDeletePlayerLeft>div:nth-child(3)>.Num").html(JsonData.DelPlayer.Left3.Num);
        $(".CountClassDeletePlayerLeft>div:nth-child(3)>.Time").html(JsonData.DelPlayer.Left3.Time);
        $(".CountClassDeletePlayerLeft>div:nth-child(3)").removeClass("d-none");
        $(".CountClassDeletePlayerLeft>div:nth-child(3)").addClass("d-block");
    }
    if (JsonData.DelPlayer.Right1.Num > 0) {
        $(".CountClassDeletePlayerRight>div:nth-child(1)>.Num").html(JsonData.DelPlayer.Right1.Num);
        $(".CountClassDeletePlayerRight>div:nth-child(1)>.Time").html(JsonData.DelPlayer.Right1.Time);
        $(".CountClassDeletePlayerRight>div:nth-child(1)").removeClass("d-none");
        $(".CountClassDeletePlayerRight>div:nth-child(1)").addClass("d-block");
    }
    if (JsonData.DelPlayer.Right2.Num > 0) {
        $(".CountClassDeletePlayerRight>div:nth-child(2)>.Num").html(JsonData.DelPlayer.Right2.Num);
        $(".CountClassDeletePlayerRight>div:nth-child(2)>.Time").html(JsonData.DelPlayer.Right2.Time);
        $(".CountClassDeletePlayerRight>div:nth-child(2)").removeClass("d-none");
        $(".CountClassDeletePlayerRight>div:nth-child(2)").addClass("d-block");
    }
    if (JsonData.DelPlayer.Right3.Num > 0) {
        $(".CountClassDeletePlayerRight>div:nth-child(3)>.Num").html(JsonData.DelPlayer.Right3.Num);
        $(".CountClassDeletePlayerRight>div:nth-child(3)>.Time").html(JsonData.DelPlayer.Right3.Time);
        $(".CountClassDeletePlayerRight>div:nth-child(3)").removeClass("d-none");
        $(".CountClassDeletePlayerRight>div:nth-child(3)").addClass("d-block");
    }
    if (debuging != false) {console.log(JsonData.TimerType.Count);};
    if (JsonData.TimerType.Count == 2) {
        $("#CountClassPause").removeClass("d-none");
        $("#CountClassPause").addClass("d-block");
    }
}
function hideBoardCount() {
    if (debuging != false) {console.log('Action: Clear board count++');};
    $( "#boardCount" ).removeClass("cl_boardIn");
    $( "#boardCount" ).addClass("cl_boardOut");
    const node1 = document.getElementById('boardCount');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Clear board count END');};
        node1.remove();
        boardCountOpen = false;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}

function clearTimerBoard() {
    $( "#id_boardTimer" ).html( "" );
    var VoiceOneMinute = document.getElementById('RazminkaLastMinute').pause();
    var VoiceStop      = document.getElementById('RazminkaStop').pause();
    timerBoardOpen = false;
}
function showBoardLogo1(JsonData) {
    if (debuging != false) {console.log('Action: Show or Hide board Logo1');};
    $("#root_boardLogo1").html(FS_BoardLogo1());
    $("#boardLogo1").css('background-image',"url('LogoPlace/" + JsonData.Logo + "')");
    $( "#boardLogo1").removeClass("cl_boardOut");
    $( "#boardLogo1").addClass("cl_boardIn");
    const node1 = document.getElementById('boardLogo1');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Show board Logo1 END');};
        boardLogo1Open = true;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}
function hideBoardLogo1() {
    if (debuging != false) {console.log('Action: Hide board Logo1');};
    $( "#boardLogo1" ).removeClass("cl_boardIn");
    $( "#boardLogo1" ).addClass("cl_boardOut");
    const node1 = document.getElementById('boardLogo1');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Hide board Logo1 END');};
        node1.remove();
        boardLogo1Open = false;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}
function showBoardStart(JsonData) {
    
    if (debuging != false) {console.log('Action: Show or Hide board Start');};
    $("#root_boardStart").html(FS_BoardStart({
        'PlayerLeftName':   JsonData.PlayerLeft.FullName,
        'PlayerLeftPlace':  JsonData.PlayerLeft.Place,
        'PlayerLeftIcon':   JsonData.PlayerLeft.Logo,
        'PlayerRightName':  JsonData.PlayerRight.FullName,
        'PlayerRightPlace': JsonData.PlayerRight.Place,
        'PlayerRightIcon':  JsonData.PlayerRight.Logo,
        'GameName':         JsonData.GameName.FullName,
        'GameDate':         JsonData.GameDate,
        'GameTime':         JsonData.GameTime,
        'GamePlace':        JsonData.GamePlace.FullName,

    }));
    $("#StartClassPlayerLeftLogo").css('background-image',"url('LogoTeam/" + JsonData.PlayerLeft.Logo + "')");
    $("#StartClassPlayerRightLogo").css('background-image',"url('LogoTeam/" + JsonData.PlayerRight.Logo + "')");
    $( "#boardStart").removeClass("cl_boardOut");
    $( "#boardStart").addClass("cl_boardIn");
    const node1 = document.getElementById('boardStart');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Show board Start END');};
        boardStartOpen = true;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}
function hideBoardStart() {
    if (debuging != false) {console.log('Action: Hide board Start');};
    $( "#boardStart" ).removeClass("cl_boardIn");
    $( "#boardStart" ).addClass("cl_boardOut");
    const node1 = document.getElementById('boardStart');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Hide board Start END');};
        node1.remove();
        boardStartOpen = false;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}
function showBoardListPlayer(JsonData) {
    if (debuging != false) {console.log('Action: Show board ListPlayerLeft');};
    var PlayerVratari = "<table>";
    for (const [Key, Value] of Object.entries(JsonData.Player.Vratari)) {
        if (Value.Enable == 1) {
            PlayerVratari += "<tr><td>" + Key + "</td><td>" + Value.FullName + "</td></tr>";
        }
    }
    var PlayerSecurity = "<table>";
    for (const [Key, Value] of Object.entries(JsonData.Player.Security)) {
        if (Value.Enable == 1) {
            PlayerSecurity += "<tr><td>" + Key + "</td><td>" + Value.FullName + "</td></tr>";
        }
    }
    var PlayerNapadenie = "<table>";
    for (const [Key, Value] of Object.entries(JsonData.Player.Napadenie)) {
        if (Value.Enable == 1) {
            PlayerNapadenie += "<tr><td>" + Key + "</td><td>" + Value.FullName + "</td></tr>";
        }
    }

    $("#root_boardSostav").html(FS_BoardListPlayer({
        'PlayerFullName'     : JsonData.Player.FullName,
        'PlayerPlace'        : JsonData.Player.Place,
        'PlayerMiddleLet'    : JsonData.Player.MiddleLet,
        'PlayerBoss'         : JsonData.Player.Boss,
        'PlayerTrainer'      : JsonData.Player.Trainer,
        'PlayerAdministrator': JsonData.Player.Administrator,
        'PlayerVratari'      : PlayerVratari + '</table>',
        'PlayerSecurity'     : PlayerSecurity + '</table>',
        'PlayerNapadenie'    : PlayerNapadenie + '</table>',
    }));
    $("#ListPlayerClassLogo").css('background-image',"url('LogoTeam/" + JsonData.Player.Logo + "')");
    $( "#boardListPlayer").removeClass("cl_boardOut");
    $( "#boardListPlayer").addClass("cl_boardIn");
    const node1 = document.getElementById('boardListPlayer');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Show board list END');};
        boardListPlayerOpen = true;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}
function hideBoardListPlayer() {
    if (debuging != false) {console.log('Action: Hide board ListPlayer');};
    $( "#boardListPlayer" ).removeClass("cl_boardIn");
    $( "#boardListPlayer" ).addClass("cl_boardOut");
    const node1 = document.getElementById('boardListPlayer');
    function handleAnimationEnd1() {
        if (debuging != false) {console.log('Action: Hide board ListPlayer END');};
        node1.remove();
        boardListPlayerOpen = false;
    }
    node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
}
connect();
