
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
 */
// Порт для Web Socket
const WebSocketPort = 8200;
var Participant = [];
var EventDB = [];
var JsonData;
var boardOpen = false;
var boardCountOpen = false;
var boardSegmentOpen = false;
var boardGroupOpen = false;
var timerBoardOpen = false;
var boardConfigure = false;

// Таймер закрытия панели
let timerCloseBoardCount;
// Таймер закрытия панели
let timerCloseBoardSegment;
// Таймер закрытия панели
let timerCloseBoardGroup;
// Таймер закрытия панели
let timerCloseBoardKissAndCry;
// Таймер переключения списка участников
let timerCaruselBoardGroup;

function connect() {
    var ws = new WebSocket('ws://' + window.location.hostname + ':' + WebSocketPort);
    ws.onopen = function() {
        if (debuging != false) {console.log('WebSocket connected');};
    };

    ws.onmessage = function(evt) {
        JsonData = JSON.parse(evt.data);
        if (JsonData) {
            //Обновить время
            if (JsonData.dAction == 'TimerUpdate' && boardCountOpen) {
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
                EventDB['CountPlayer1'] = JsonData.CountPlayer1;
                EventDB['CountPlayer2'] = JsonData.CountPlayer2;
                EventDB['NamePlayer1']  = JsonData.NamePlayer1;
                EventDB['NamePlayer2']  = JsonData.NamePlayer2;
                EventDB['Period']       = JsonData.Period;
                EventDB['Timer']        = JsonData.Timer;
                EventDB['BoardCountStatus']   = JsonData.BoardCountStatus;
                if (EventDB['BoardCountStatus'] == 'active') {
                    /*$("#root_boardCount").html(FS_BoardCount);*/
                    $("#CountClassCountPlayer1").html(EventDB['CountPlayer1']);
                    $("#CountClassCountPlayer2").html(EventDB['CountPlayer2']);
                    $("#CountClassNamePlayer1" ).html(EventDB['NamePlayer1']);
                    $("#CountClassNamePlayer2" ).html(EventDB['NamePlayer2']);
                    $("#CountClassTime1"       ).html(EventDB['Timer']);
                    $("#boardCount"            ).addClass("cl_boardIn");
                    boardCountOpen = true;
                }
            }
            // Прибавить гол первой команде
            else if (JsonData.dAction == 'CountPlayer1') {
                $("#CountClassCountPlayer1" ).html(JsonData.Value);
            }
            else if (JsonData.dAction == 'CountPlayer2') {
                $("#CountClassCountPlayer2" ).html(JsonData.Value);
            }
            else if (JsonData.dAction == 'Period') {
                $("#CountIdPeriod" ).html(JsonData.Value);
            }
            else if (JsonData.dAction == 'CountPlayerAll' && boardCountOpen) {
                $("#CountClassCountPlayer1" ).html(JsonData.CountPlayer1);
                $("#CountClassCountPlayer2" ).html(JsonData.CountPlayer2);
                $("#CountIdPeriod"          ).html(JsonData.Period);
            }
            //Очистить экран
            else if (JsonData.dAction == 'Clear') {
                if (boardKissAndCryOpen) {
                    cleanBoardKissAndCry();
                }
                if (boardSegmentOpen && !ConfigKissAndCry) {
                    cleanBoardSegment();
                }
                if (boardGroupOpen) {
                    cleanBoardGroup();
                }
                if (boardCountOpen) {
                    cleanBoardPersonal();
                }
            }
            //Очистить экран Табло
            else if (JsonData.dAction == 'ClearTablo' && ConfigShowTimer) {
                if (boardSegmentOpen) {
                    cleanBoardSegment();
                }
                if (boardGroupOpen) {
                    cleanBoardGroup();
                }
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
            // Очистить экран если панель открыта
            /*else if (boardOpen && !ConfigKissAndCry && JsonData.dAction != '1SC') {
                cleanBoard(1);
            }
            else {
                updateBoard();
            }*/
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
    if (debuging != false) {console.log('Action: Show or Update board count', JsonData.NamePlayer1);};
    EventDB['CountPlayer1'] = JsonData.CountPlayer1;
    EventDB['CountPlayer2'] = JsonData.CountPlayer2;
    EventDB['NamePlayer1']  = JsonData.NamePlayer1;
    EventDB['NamePlayer2']  = JsonData.NamePlayer2;
    EventDB['Period']       = JsonData.Period;
    EventDB['Timer']        = JsonData.Timer;
    if (JsonData.dAction != 'UpdateBoardCount') {
        $("#root_boardCount").html(FS_BoardCount({
            'CountPlayer1': JsonData.CountPlayer1,
            'CountPlayer2': JsonData.CountPlayer2,
            'NamePlayer1':  JsonData.NamePlayer1,
            'NamePlayer2':  JsonData.NamePlayer2,
            'Period':       JsonData.Period,
            'Timer':        JsonData.Timer
        }));
        $( "#boardCount"           ).removeClass("cl_boardOut");
        $( "#boardCount"           ).addClass("cl_boardIn");
        const node1 = document.getElementById('boardCount');
        function handleAnimationEnd1() {
            if (debuging != false) {console.log('Action: Show board count END');};
            boardCountOpen = true;
        }
        node1.addEventListener('animationend', handleAnimationEnd1, {once: true});
    }
    $("#CountClassCountPlayer1").html(JsonData.CountPlayer1);
    $("#CountClassCountPlayer2").html(JsonData.CountPlayer2);
    $("#CountClassNamePlayer1" ).html(JsonData.NamePlayer1);
    $("#CountClassNamePlayer2" ).html(JsonData.NamePlayer2);
    $("#CountIdPeriod"         ).html(JsonData.Period);
    $("#CountIdTimer"          ).html(JsonData.Timer);
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
function cleanBoardGroup() {
    if (debuging != false) {console.log('Action: Clear board Group');};
    $( "#boardGroup" ).removeClass("cl_boardIn");
    $( "#boardGroup" ).addClass("cl_boardOut");
    const node2 = document.querySelector( '#boardGroup' );
    function handleAnimationEnd2() {
        node2.remove();
        clearTimeout(timerCloseBoardGroup);
        clearInterval(timerCaruselBoardGroup);
        if (debuging != false) {console.log('Clear Interval');};
        boardGroupOpen = false;
    }
    node2.addEventListener('animationend', handleAnimationEnd2, {once: true});
}
function cleanBoardSegment() {
    if (debuging != false) {console.log('Action: Clear board Segment');};
    $( "#boardSegment" ).removeClass("cl_boardIn");
    $( "#boardSegment" ).addClass("cl_boardOut");
    const node3 = document.querySelector( '#boardSegment' );
    function handleAnimationEnd3() {
        node3.remove();
        clearTimeout(timerCloseBoardSegment);
        boardSegmentOpen = false;
    }
    node3.addEventListener('animationend', handleAnimationEnd3, {once: true});
}
function cleanBoardKissAndCry() {
    if (debuging != false) {console.log('Action: Clear board Kiss And Cry');};
    $("#boardKissAndCry").removeClass("cl_boardIn");
    $("#boardKissAndCry").addClass("cl_boardOut");
    const node4 = document.querySelector('#boardKissAndCry');
    function handleAnimationEnd() {
        node4.remove();
        clearTimeout(timerCloseBoardKissAndCry);
        boardKissAndCryOpen = false;
    }
    node4.addEventListener('animationend', handleAnimationEnd, {once: true});
}


function clearTimerBoard() {
    $( "#id_boardTimer" ).html( "" );
    var VoiceOneMinute = document.getElementById('RazminkaLastMinute').pause();
    var VoiceStop      = document.getElementById('RazminkaStop').pause();
    timerBoardOpen = false;
}

function updateTimerBoard(JsonData) {
    if (debuging != false) {console.log('TimerUpdate1: '+ JsonData.Value);};
    //$("#CountClassTime1").html( JsonData.Value );
    $("#CountClassTime1").html("dfsdfsdfsdf");
}
		
			
function updateBoard() {
    if (ConfigShowTimer && JsonData.dAction != '1SC') {
        if (boardCountOpen) {
            cleanBoardPersonal();
        }
        if (boardGroupOpen) {
            cleanBoardGroup();
        }
        if (boardSegmentOpen) {
            cleanBoardSegment();
        }
    }
    // Табло для KissAndCry
    if (ConfigKissAndCry) {
        if (JsonData.dAction == '1SC') {
            if (boardSegmentOpen) {
                cleanBoardSegment();
            }
            if (boardKissAndCryOpen) {
                cleanBoardKissAndCry();
            }
            if (debuging != false) {console.log('Action 1SC');};
            var ElementLine='';
            var DeductionLine='';
            var PlaceLine='';

            /*  Список участников  */
            if (JsonData.Participant != undefined) {
                var ListParticipantNumber = 1;
                Object.keys(JsonData.Participant).forEach( function(itemKey, index){
                    if (index == 0) {
                        PlaceLine += FS_KissAndCryLineWrapperFirst({
                            'IDContainer': ListParticipantNumber,
                        });
                    }
                    else if (index % LineCountWebParticipant === 0) {
                        ListParticipantNumber += 1;
                        PlaceLine += FS_KissAndCryLineWrapperSecond({
                            'IDContainer': ListParticipantNumber,
                        });
                    }
                    item = JsonData.Participant[itemKey];
                    PlaceLine +=  FS_KissAndCryLineParticipant({
                        'CurrentClass':  item["pCurrent"] == 1 ? "participantCurrent" : "",
                        'Sort':     item["TSort"],
                        'FullName': item["FullName"],
                        'Nation':   item["Nation"],
                        'Club':     item["Club"],
                        'City':     item["City"],
                        'Point':    item["TPoint"],
                    });
                });
                PlaceLine += "</div>";
            }            

            /*  Список элементов  */
            if (JsonData.Element != undefined) {
                Object.keys(JsonData.Element).forEach( function(itemKey){
                    item = JsonData.Element[itemKey];
                    ElementLine += FS_KissAndCryLineElement({'ElementName': item['Name'], 'ElementInfo':item["Info"],'ElementBV':item["BV"],'ElementGOE':item["GOE"],'ElementPoint':item["Points"]});
                });
            }
            /* Список нарушений */
            if (JsonData.Deduction != undefined) {
                Object.keys(JsonData.Deduction).forEach( function(itemKey){
                    item = JsonData.Deduction[itemKey];
                    DeductionLine += FS_KissAndCryLineDeduction({'DeductionName': item['Name'], 'DeductionCount': item["Value"]});
                });
            }
            $( "#root_boardKissAndCry").html(
                FS_KissAndCry({
                    'EventName': EventDB['EventName'],
                    'Category':  EventDB['CategoryName'],
                    'Segment':   EventDB['SegmentName'],
                    'FullName':  JsonData.pName,
                    'Nation':    JsonData.pNation,
                    'Club':      JsonData.pClub,
                    'City':      JsonData.pCity,
                    'TechnicPoint':   JsonData.pTES,
                    'ComponentPoint': JsonData.pTCS,
                    'DeductionPoint': JsonData.pDedSum == 0.00 ? '-' : `-${JsonData.pDedSum}`,
                    'BonusPoint':     JsonData.pBonus == 0.00 ? '-' : JsonData.pBonus,
                    'Points':         JsonData.pSeqPoints,
                    'TPoints':         JsonData.pTPoint,
                    'TRank':          JsonData.pTRank,
                    'PlaceLine':      PlaceLine,
                    'DeductionLine':  DeductionLine,
                    'ElementLine':    ElementLine,
                })
            );
            $( "#boardKissAndCry" ).addClass("cl_boardIn");
            boardKissAndCryOpen = true;
            /* Карусель списка участников */
            let activeItems = 2;
            if (KissAndCryAutoScrollParticipantList) {
                $( "#participantListContainer" ).prepend(FS_KissAndCryNextButtonDisable);
                timerCaruselBoardGroup = setInterval(
                    function () {
                        const root = document.querySelector('#participantListContainer');
                        const $itemList   = root.querySelectorAll('.participantListContainerItem');
                        if ($itemList.length > 1) {
                            for (let i = 0, length = $itemList.length; i < length; i++) {
                                const $item = $itemList[i];
                                const index = +$item.dataset.index;
                                if (activeItems == index) {
                                    $item.classList.add('active');
                                } else {
                                    $item.classList.remove('active');
                                }
                            }
                            if (activeItems >= $itemList.length)  {activeItems = 1;}
                            else {activeItems += 1;}
                        }
                    }, AutoCaruselBoardTime * 1000
                );
            }
            else {
                $( "#participantListContainer" ).prepend(FS_KissAndCryNextButton);
                const button = document.getElementById('ButtonNextParticipant');

                button.addEventListener('click', event => {
                    const root = document.querySelector('#participantListContainer');
                    const $itemList   = root.querySelectorAll('.participantListContainerItem');
                    if ($itemList.length > 1) {
                        for (let i = 0, length = $itemList.length; i < length; i++) {
                            const $item = $itemList[i];
                            const index = +$item.dataset.index;
                            if (activeItems == index) {
                                $item.classList.add('active');
                            } else {
                                $item.classList.remove('active');
                            }
                        }
                        if (activeItems >= $itemList.length)  {activeItems = 1;}
                        else {activeItems += 1;}
                    }
                });
            }
        }
        else if (JsonData.dAction == 'ReloadKissAndCry') {
            document.location.reload();
        }
    }
    // STL - Стартовый лист
    // WUP - Стартовый лист по группам
    // 3SC - Показать промежуточные результаты соревнования
    // IRS - Показать промежуточные результаты соревнования
    // RES - Показать промежуточные результаты соревнования
    // JudgeAll - Информация о всех судьях
    else if (JsonData.dAction == 'STL' || JsonData.dAction == 'WUP' || JsonData.dAction == '3SC' || JsonData.dAction == 'JudgeAll' || JsonData.dAction == 'IRS' || JsonData.dAction == 'RES') {
        if (boardGroupOpen && !ConfigShowTimer) {
            cleanBoardGroup();
        }
        var PlaceLine = '';
        Participant = JsonData.pParticipant;
        var LineCountWeb = LineCountWebParticipant;
        if (JsonData.dAction == 'JudgeAll') {LineCountWeb = LineCountWebOfficial;}
        var ListParticipantNumberAll = 1;
        Object.keys(Participant).forEach( function(itemKey, index){
            if (index != 0 && index % LineCountWeb === 0) {
                ListParticipantNumberAll += 1;
            }
        });

        var ListParticipantNumber = 1;
        Object.keys(Participant).forEach( function(itemKey, index){
            if (index == 0) {
                PlaceLine += FS_NameLineWrapperFirst({
                    'IDContainer': ListParticipantNumber,
                });
            }
            else if (index % LineCountWeb === 0 && JsonData.dAction != '3SC') {
                ListParticipantNumber += 1;
                PlaceLine += FS_NameLineWrapperSecond({
                    'IDContainer': ListParticipantNumber,
                });
            }
            item = Participant[itemKey];
            //Стартовый лист
            if (JsonData.dAction == 'STL' || JsonData.dAction == 'WUP') {
                var ParticipantStatus = '';
                if (item["pStatus"] == "WDR" && JsonData.dAction == 'WUP') {
                    //В начале планировал не выводить отсутствующих участников на разминке
                    //но после попросили выводить всех и даже тех кто отсутствует
                    //return;
                    ParticipantStatus = '';
                }
                if (item["pStatus"] == "WDR") {
                    ParticipantStatus = '(Отсутствует)';
                }
                else if  (item["pStatus"] == "WDR") {
                    ParticipantStatus = '';
                }
                PlaceLine +=  FS_NameLineParticipant({
                    'Sort':     item["pStartNumber"],
                    'FullName': item["pFullName"],
                    'Nation':   item["pNation"],
                    'Club':     item["pClub"],
                    'City':     item["pCity"],
                    'Status':   ParticipantStatus,
                });
                ParticipantStatus = '';
            }
            //Показать промежуточные результаты соревнования (краткий список)
            else if (JsonData.dAction == '3SC') {
                if (index <= 2 || item["pCurrent"] == 1) {
                    PlaceLine +=  FS_3SCLineParticipant({
                        'CurrentClass':  item["pCurrent"] == 1 ? "participantCurrent" : "",
                        'Sort':     item["pTSort"],
                        'FullName': item["pFullName"],
                        'Nation':   item["pNation"],
                        'Club':     item["pClub"],
                        'City':     item["pCity"],
                        'Point':    item["pTPoint"],
                    });
                    if (item["pCurrent"] == 1 && index >=3 && index + 1 < Object.keys(Participant).length) {
                        PlaceLine += FS_LineTextEmpty;
                    }
                }
                else if (index == 3 && Object.keys(Participant).length >= 4) {
                    PlaceLine += FS_LineTextEmpty;
                }
            }
            //Показать промежуточные результаты соревнования
            else if (JsonData.dAction == 'IRS') {
                PlaceLine +=  FS_IRSLineParticipant({
                    'CurrentClass':  item["pCurrent"] == 1 ? "participantCurrent" : "",
                    'Sort':     item["pTSort"],
                    'FullName': item["pFullName"],
                    'Nation':   item["pNation"],
                    'Club':     item["pClub"],
                    'City':     item["pCity"],
                    'Point':    item["pTPoint"],
                });
            }
            //Показать промежуточные результаты соревнования
            else if (JsonData.dAction == 'RES') {
                PlaceLine +=  FS_RESLineParticipant({
                    'CurrentClass':  item["pCurrent"] == 1 ? "participantCurrent" : "",
                    'Sort':     item["pTSort"],
                    'FullName': item["pFullName"],
                    'Nation':   item["pNation"],
                    'Club':     item["pClub"],
                    'City':     item["pCity"],
                    'Point':    item["pTPoint"],
                });
            }
            //Информация: Официальные лица
            else if (JsonData.dAction == 'JudgeAll') {
                if (debuging != false) {console.log('Action JudgeAll');};

                if (item['dFunction'] == "JDG") {
                    item["pProff"] = `${OfficialFunction['JDG']} ${item['pIndex']}`;
                }
                else {
                    item["pProff"] = OfficialFunction[item['dFunction']];
                }
                PlaceLine += FS_JudgeAllLine({'Sort': index + 1, 'FullName':item["pFullName"],'Nation':item["pNation"], "Proff":item["pProff"]});
            }           
        });
        PlaceLine += "</div>";
        if (JsonData.dAction == 'STL') {
            $( "#root_boardGroup").html( 
                FS_UsersList({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'SubName':   TitleSubNameStartList,
                    'PlaceLine': PlaceLine,
                })
            );
        }
        else if (JsonData.dAction == 'WUP') {
            $( "#root_boardGroup").html( 
                FS_UsersList({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'SubName':   TitleSubNameWup + " " + JsonData.pCurrentGroup,
                    'PlaceLine': PlaceLine,
                })
            );
        }
        else if (JsonData.dAction == '3SC') {
            $( "#root_boardGroup").html( 
                FS_ListResult({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'SubName':   TitleSubName3nd,
                    'PlaceLine': PlaceLine,
                })
            );
        }
        else if (JsonData.dAction == 'IRS') {
            $( "#root_boardGroup").html( 
                FS_UsersList({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'SubName':   TitleSubNameIRS,
                    'PlaceLine': PlaceLine,
                })
            );
        }
        else if (JsonData.dAction == 'RES') {
            $( "#root_boardGroup").html( 
                FS_UsersList({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'SubName':   TitleSubNameRES,
                    'PlaceLine': PlaceLine,
                })
            );
        }
        else if (JsonData.dAction == 'JudgeAll') {
            $( "#root_boardGroup").html( 
                FS_UsersList({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'SubName':   TitleSubNameJudgeAll,
                    'PlaceLine': PlaceLine,
                })
            );
        }
        PlaceLine = "";
        ListParticipantNumber = 1;
        $( "#boardGroup" ).addClass("cl_boardIn");
        boardGroupOpen = true;
        if (JsonData.dAction != '3SC') {
            let activeItems = 1;
            timerCaruselBoardGroup = setInterval(
                function () {
                    const root = document.querySelector('#participantListContainer');
                    const $itemList   = root.querySelectorAll('.participantListContainerItem');
                    if ($itemList.length > 1) {
                        for (let i = 0, length = $itemList.length; i < length; i++) {
                            const $item = $itemList[i];
                            const index = +$item.dataset.index;
                            if (activeItems == index) {
                                $item.classList.add('active');
                            } else {
                                $item.classList.remove('active');
                            }
                        }
                        if (activeItems >= $itemList.length)  {activeItems = 1;}
                        else {activeItems += 1;}
                    }
                }, AutoCaruselBoardTime * 1000
            );
        }
        
        if (!ConfigShowTimer && JsonData.dAction == '3SC') {
            timerCloseBoardGroup = setTimeout(function() {
                cleanBoardGroup();
            }, AutoCloseTV3SC * 1000);
        }
    }
    // NAM - Информация об участнике
    // 2SC - Показать индивидуальные результаты проката
    // JudgeOne - Информация об официальном лице
    else if (JsonData.dAction == 'NAM' || JsonData.dAction == '2SC' || JsonData.dAction == 'JudgeOne') {
        if (boardPersonalOpen && !ConfigShowTimer) {
            cleanBoardPersonal();
        }
        //Информация об участнике
        if (JsonData.dAction == 'NAM') {
            if (debuging != false) {console.log('Action NAM');};
            $("#root_boardPersonal").html(
                FS_UserInfo({
                   'EventName': JsonData.EventName,
                   'Category':  JsonData.pCategory,
                   'Segment':   JsonData.pSegment,
                   'Nation':    JsonData.pNation,
                   'Club':      JsonData.pClub,
                   'City':      JsonData.pCity,
                   'Fullname':  JsonData.pName,
                   'Coach':     JsonData.pCoach,
                   'Music':     JsonData.pMusic,
                })
            );
        }
        //Информация об официальном лице (Судьи)
        else if (JsonData.dAction == 'JudgeOne') {
            if (debuging != false) {console.log('Action JudgeOne');};
            var ProffLine = '';
            Object.keys(JsonData.pIndex).forEach( function(itemKey){
                if (JsonData.pIndex[itemKey] == "JDG") {
                    ProffLine += `${OfficialFunction['JDG']} ${itemKey}; `;
                }
                else {
                    ProffLine += `${OfficialFunction[JsonData.pIndex[itemKey]]}; `;
                }
            });
            $("#root_boardPersonal").html(
                FS_JudgeOne({
                   'EventName': JsonData.EventName,
                   'Category':  JsonData.pCategory,
                   'Segment':   JsonData.pSegment,
                   'Nation':    JsonData.pNation,
                   'Club':      JsonData.pClub,
                   'City':      JsonData.pCity,
                   'Fullname':  JsonData.pName,
                   'Proff':     ProffLine,
                })
            );
            
        }
        //Показать индивидуальные результаты проката
        else if (JsonData.dAction == '2SC') {
            if (debuging != false) {console.log('Action 2SC');};
            if (JsonData.pDedSum == '0.00') {
                JsonData.pDedSum = '-'
            }
            $("#root_boardPersonal").html(
                FS_UserResult({
                    'EventName': JsonData.EventName,
                    'Category':  JsonData.pCategory,
                    'Segment':   JsonData.pSegment,
                    'Nation':    JsonData.pNation,
                    'Club':      JsonData.pClub,
                    'City':      JsonData.pCity,
                    'Fullname':  JsonData.pName,
                    'TechnicPoint':   JsonData.pTES,
                    'ComponentPoint': JsonData.pTCS,
                    'DeductionPoint': JsonData.pDedSum,
                    'BonusPoint':     JsonData.pBonus,
                    'Points':         JsonData.pSeqPoints,
                    'Rank':           JsonData.pRank,
                })
            );
        }
        $( "#boardPersonal" ).addClass("cl_boardIn");
        boardPersonalOpen = true;
        if (!ConfigShowTimer) {
            timerCloseBoardPersonal = setTimeout(function() {
                cleanBoardPersonal();
            }, AutoCloseTVPersonal * 1000);
        }
    }
    // Приглашение на церемонию награждения
    else if (JsonData.dAction == 'VictoryStart') {
        if (boardSegmentOpen && !ConfigShowTimer) {
            cleanBoardSegment();
        }
        if (debuging != false) {console.log('Action VictoryStart');};
        $("#root_boardSegment").html( 
            FS_VictoryStart({
                'EventName': JsonData.EventName,
            })
        );
        $("#boardSegment").addClass("cl_boardIn");
        boardSegmentOpen = true;
        if (!ConfigShowTimer) {
            timerCloseBoardSegment = setTimeout(function() {
                cleanBoardSegment();
            }, AutoCloseTVVictoryStart * 1000);
        }
    }
    // Церемония награждения, места
    else if (JsonData.dAction == 'VictoryPlace') {
        if (boardPersonalOpen && !ConfigShowTimer) {
            cleanBoardPersonal();
        }
        if (debuging != false) {console.log('Action Victory' + JsonData.sAction);};
        var PlaceLine = {
            'EventName': JsonData.EventName,
            'Fullname':  JsonData.pFullName,
            'Nation':    JsonData.pNation,
            'Club':      JsonData.pClub,
            'City':      JsonData.pCity,
        };
        if (JsonData.sAction == "First") {
            PlaceLine['VictoryPlaсe'] = VictoryPlaceFirst;
        }
        else if (JsonData.sAction == "Second") {
            PlaceLine['VictoryPlaсe'] = VictoryPlaceSecond;
        }
        else if (JsonData.sAction == "Third") {
            PlaceLine['VictoryPlaсe'] = VictoryPlaceThird;
        }
        $("#root_boardPersonal").html(
            FS_VictoryPlace(PlaceLine)
        );
        $("#boardPersonal").addClass("cl_boardIn");
        boardPersonalOpen = true;
        if (!ConfigShowTimer) {
            timerCloseBoardPersonal = setTimeout(function() {
                cleanBoardPersonal();
            }, AutoCloseTVVictoryPlace * 1000);
        }
    }
    // Церемония награждения, все места
    else if (JsonData.dAction == 'VictoryAll') {
        if (boardGroupOpen && !ConfigShowTimer) {
            cleanBoardGroup();
        }
        if (debuging != false) {console.log('Action VictoryAll');};
        var PlaceLine = '';
        Object.keys(JsonData.pParticipant).forEach( function(itemKey){
            item = JsonData.pParticipant[itemKey];
            PlaceLine += FS_VictoryAllLine({'VictoryPlaсe': item["pTRank"],'FullName': item["pFullName"],'City':item["pCity"],'Club':item["pClub"],'Nation':item["pNation"]});
        });
        $("#root_boardGroup").html( 
            FS_VictoryAll({
                'EventName': JsonData.EventName,
                'Fullname':  JsonData.pFullName,
                'PlaceLine': PlaceLine,
            })
        );


        $("#boardGroup").addClass("cl_boardIn");
        boardGroupOpen = true;
        if (!ConfigShowTimer) {
            timerCloseBoardGroup = setTimeout(function() {
                cleanBoardGroup();
            }, AutoCloseTVVictoryAll * 1000);
        }
    }
    //Показать название программы выступления
    else if (JsonData.dAction == 'SEG') {
        if (boardSegmentOpen && !ConfigShowTimer) {
            cleanBoardSegment();
        }
        $( "#root_boardSegment").html(
            FS_EventName({
                'EventName': JsonData.EventName,
                'Category':  JsonData.pCategory,
                'Segment':   JsonData.pSegment,
            })
        );
        $( "#boardSegment"   ).addClass("cl_boardIn");
        boardSegmentOpen = true;
        if (!ConfigShowTimer) {
            timerCloseBoardSegment = setTimeout(function() {
                cleanBoardSegment();
            }, AutoCloseTVSegment * 1000);
        }
    }

    if (debuging != false) {console.log('Play') };
}
connect();
