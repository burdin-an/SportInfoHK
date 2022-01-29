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

//Общие настройки

/* ################################################################################################
Информационная панель:
    Кнопка: Name; - Информация об участнике
*/
//var FS_UserInfo = '';
/* ################################################################################################
Информационная панель:
    Кнопка: 2nd Score;  - Показать индивидуальные результаты выступления
*/
//var FS_UserResult = '';
/* ################################################################################################
Информационная панель:
    Кнопка: Judge -> Send; - Информация об официальном лице (судья)
*/
//var FS_JudgeOne = '';
/* ################################################################################################
Информационная панель:
    Кнопка: Start List; - Стартовый лист (Полный)
    Кнопка: WarmG;      - Стартовый лист (По группам разминки)
    Кнопка: Judge -> Send All Judges; - Информация обо всех судьях
*/
//var FS_UsersList = '';
/* ################################################################################################
Информационная панель:
    Кнопка: 3nd Score; - Промежуточные результаты соревнования
*/
//var FS_ListResult = '';
/* ################################################################################################
Информационная панель:
    Кнопка: Segment; - Название соревнования, группа и сегмент
*/
//var FS_EventName = '';
 
/* ################################################################################################
Информационная панель:
    Кнопка: 1nd Score; - Показать индивидуальные результаты проката "Уголок слёз и поцелуев"
*/
//var FS_KissAndCry = '';

/* ################################################################################################
Информационная панель:
    Кнопка: Time+ или Time-; - Таймер внизу экрана
*/
//var FS_Timer = '';
/* ################################################################################################
Информационная панель:
    Кнопка: V.Cerem -> Send Victory Ceremony; - Приглашение на церемонию награждения
*/
//var FS_VictoryStart = '';
/* ################################################################################################
Информационная панель:
    Кнопка: V.Cerem -> Send Podium; - Показать все призовые места
*/
//var FS_VictoryAll = '';
/* ################################################################################################
Информационная панель:
    Кнопка: V.Cerem -> Send Gold, Silver, Bronze; - Показать призовое место: Золото, Серебро или Бронза
*/
//var FS_VictoryPlace = '';


// Количество строк участников
var LineCountWebParticipant = 8;
// Количество строк официальных представителей
var LineCountWebOfficial = 8;
// Табло "Куб" или "Экран"на льду
// Значение: true  - Включено
// Значение: false - Выключено
var ConfigShowTimer = false;
// Табло "Уголок слёз и поцелуев"
// Значение: true  - Включено
// Значение: false - Выключено
var ConfigKissAndCry = false;
// Отладочная информация
// Значение: true  - Включено
// Значение: false - Выключено
var debuging = true;
//Автоматически разворачивать во весь экран
// Значение: true  - Включено
// Значение: false - Выключено
var AllowFullScreen = false;
// Автоматически закрывать результаты на экране "Уголок слёз и поцелуев"
// Значение: true  - Включено
// Значение: false - Выключено
var AutoCloseKissAndCry = false;
// На сколько минут показываем результаты на экране "Уголок слёз и поцелуев"
var AutoCloseKissAndCryTime = 6;
// Автоматически переключать списки участников на экране "Уголок слёз и поцелуев"
let KissAndCryAutoScrollParticipantList = true;
// Через сколько секунд переключать списки участников
let AutoCaruselBoardTime = 10;
//На сколько секунд показываем титры:Промежуточные результаты (Кнопка: 3ndScore)
let AutoCloseTV3SC = 10;
//На сколько секунд показываем персональные титры (Кнопки: Name,2ndScore,Judge,...)
let AutoCloseTVPersonal = 10;
//На сколько секунд показываем титры: Показать приглашение на награждение (Кнопка: V.Cerem -> Send Victory)
let AutoCloseTVVictoryStart = 10;
//На сколько секунд показываем титры: Показать призовое место (Кнопка: V.Cerem -> Send Gold, Send Silver, Send Bronze)
let AutoCloseTVVictoryPlace = 10;
//На сколько секунд показываем титры: Показать все призовые места (Кнопка: V.Cerem -> Send Podium)
let AutoCloseTVVictoryAll = 10;
//На сколько секунд показываем титры: Название соревнования (Кнопка: Segment)
let AutoCloseTVSegment = 10;

// Заголовок для кнопки: 
var TitleSubNameJudgeAll = "Официальные лица:";
// Заголовок для кнопки: 3dScore
var TitleSubName3nd = "Промежуточные результаты:";
// Заголовок для кнопки: Result
var TitleSubNameIRS = "Промежуточные результаты:";
// Заголовок для кнопки: I.Result
var TitleSubNameRES = "Окончательные результаты:";
// Заголовок для кнопки: WarmUP
var TitleSubNameWup = "Разминка, группа №:";
// Заголовок для кнопки: StartList
var TitleSubNameStartList = "Стартовый лист:";
//Первое место
var VictoryPlaceFirst  = "ПЕРВОЕ МЕСТО";
//Второе место
var VictoryPlaceSecond = "ВТОРОЕ МЕСТО";
//Третье место
var VictoryPlaceThird  = "ТРЕТЬЕ МЕСТО";

//Официальные лица
var OfficialFunction = [];
//Судья №1...99
OfficialFunction['JDG'] = "Судья №";
//Помощник технического специалиста
OfficialFunction['STS'] = "Ассистент технического специалиста";
//Технический специалист
OfficialFunction['TSP'] = "Технический специалист";
//Технический контролёр
OfficialFunction['TCO'] = "Технический контролёр";
// Старший судья
OfficialFunction['ERF'] = "Старший судья";
//Оператор ввода данных или видео оператор
OfficialFunction['DOP'] = "Оператор ввода данных";
//Пока не знаю кто это
OfficialFunction['REP'] = "Representative";
//Пока не знаю кто это
OfficialFunction['TDG'] = "Технический делегат";
