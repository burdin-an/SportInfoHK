<?php
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
 * @link      https://github.com/burdin-an/SportInfoHK
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 * @version   1.0.5
 */

setlocale(LC_CTYPE, 'ru_RU.UTF-8');
error_reporting(E_ALL ^ E_WARNING);

require_once __DIR__ . '/vendor/autoload.php';
use Workerman\Worker;
use Workerman\Lib\Timer;
use Workerman\Connection\AsyncTcpConnection;

$ini             = [];
$EventSelect     = 0;
$Start_time      = 1;
// Планировщик
$EventsTimer     = [];
$EventsType      = ['min','sec','period','status','type'];
//Структура базы мероприятия
$EventDB         = [];
//Список мероприятий
$EventDBList     = [];
//Структура базы мероприятия по умолчанию.
$EventDBDefault = [
	'DBVersion'   => 13,
	'dAction'     => 'None',
	'GameOver'    => 0,
	'GameOverTemp' => 0,
	'GameName'    => [
		'UID' => '',
		'FullName' => '',
		'ShortName' => '',
		'Desc' => '',
		'Template' => '',
	],
	'GameDate'    => '',
	'GameTime'    => '',
	'GameWeather' => [
		'Temperature' => 10,
		'Cloudiness'  => 0,
		'PrecipitationType' => 0,
		'PrecipitationIntensity' => 0,
		'Storm' => 0
	],
	'GamePlace'   => [
		'UID' => '',
		'FullName' => '',
		'ShortName' => '',
		'FullNameOneLine' => '',
		'Place' => '',
		'Desc' => '',
		'Logo' => '',
	],
	'PlayerLeft' => [
		'UID' => '',
		'FullName' => '',
		'ShortName' => '',
		'Desc' => '',
		'Logo' => '',
		'Place' => '',
		'Boss' => '',
		'Trainer' => '',
		'Administrator' => '',
		'Players' => [
			[
				"PID" => 0,
				"Enable" => 0,
				"Starting5Enable" => 0,
				"Position" => "",
				"Role" => "",
				"Photo" => "",
				"FullName" => ""
			]
		]
	],
	'PlayerRight' => [
		'UID' => '',
		'FullName' => '',
		'ShortName' => '',
		'Desc' => '',
		'Logo' => '',
		'Place' => '',
		'Boss' => '',
		'Trainer' => '',
		'Administrator' => '',
		'Players' => [
			[
				"PID" => 0,
				"Enable" => 0,
				"Starting5Enable" => 0,
				"Position" => "",
				"Role" => "",
				"Photo" => "",
				"FullName" => ""
			]
		]
	],
	'BoardStatus' => [
		'Welcome' => 0,
		'Count' => 0,
		'Logo1' => 0,
		'Start' => 0,
		'Judges' => 0,
		'Commentators' => 0,
		'ListPlayerLeft' => 0,
		'ListPlayerRight' => 0,
		'Start5PlayerLeft' => 0,
		'Start5PlayerRight' => 0,
		'TrainerTeam' => 0,
		'PlayerTeam' => 0,
		'EndPeriod' => 0,
		'Start5LeftAndRight' => 0,
		'TeamRoom' => 0,
	],
	'BoardWelcomeStatus' => 'disable',
	'BoardCountStatus' => 'disable',
	'BoardLogo1Status' => 'disable',
	'BoardStartStatus' => 'disable',
	'BoardJudgesStatus' => 'disable',
	'BoardCommentatorsStatus' => 'disable',
	'BoardListPlayerLeftStatus' => 'disable',
	'BoardListPlayerRightStatus' => 'disable',
	'BoardStart5PlayerLeftStatus' => 'disable',
	'BoardStart5PlayerRightStatus' => 'disable',
	'BoardTrainerTeamStatus' => 'disable',
	'BoardPlayerTeamStatus' => 'disable',
	'BoardEndPeriod' => 'disable',
	'BoardTeamRoomStatus' => 'disable',
	'BoardStart5LeftAndRightStatus' => 'disable',
	'CountPlayerLeft' => [
		'Upd'   => 0,
		'Count' => -1,
	],
	'CountPlayerRight' => [
		'Upd'   => 0,
		'Count' => -1,
	],
	'Period' => [
		'Upd'   => 0,
		'Count' => -1,
	],
	'TimerUpdate'   => 0,
	'TimerMinutes'  => -1,
	'TimerSecondes' => 0,
	'TimerMSeconds' => 0,
	'TimerStatus'   => [
		'Upd'   => 0,
		'Count' => -1,
	],
	'TimerType' => [
		'Upd'   => 0,
		'Count' => -1,
	],
	'CountFixPeriod' =>  [
		1 => [
			'Left'  => -1,
			'Right' => -1
		],
		2 => [
			'Left'  => -1,
			'Right' => -1
		],
		3 => [
			'Left'  => -1,
			'Right' => -1
		],
		4 => [
			'Left'  => -1,
			'Right' => -1
		],
		5 => [
			'Left'  => -1,
			'Right' => -1
		]
	],
	'JudgeFirst' => [
		'UID'      => "",
		'Number'   => 0,
		'FullName' => ""
	],
	'JudgeSecond' => [
		'UID'      => "",
		'Number'   => 0,
		'FullName' => ""
	],
	'JudgeThird' => [
		'UID'      => "",
		'Number'   => 0,
		'FullName' => ""
	],
	'JudgeFourth' => [
		'UID'      => "",
		'Number'   => 0,
		'FullName' => ""
	],
	'Commentators' => [
		"1" => [
			'UID'      => "",
			'FullName' => ""
		],
		'2' => [
			'UID'      => "",
			'FullName' => ""
		],
	],
	'DelPlayer' => [
		'Left1'  => [
			'Upd' => 0,  // 0 - нет удаления, 1 - добавлен, 2 - удален, 3 - обновить
			'Num' => 0,
			'Min' => 0,
			'Sec' => 0,
		],
		'Left2'  => [
			'Upd' => 0,
			'Num' => 0,
			'Min' => 0,
			'Sec' => 0,
		],
		'Left3'  => [
			'Upd' => 0,
			'Num' => 0,
			'Min' => 0,
			'Sec' => 0,
		],
		'Right1' => [
			'Upd' => 0,
			'Num' => 0,
			'Min' => 0,
			'Sec' => 0,
		],
		'Right2' => [
			'Upd' => 0,
			'Num' => 0,
			'Min' => 0,
			'Sec' => 0,
		],
		'Right3' => [
			'Upd' => 0,
			'Num' => 0,
			'Min' => 0,
			'Sec' => 0,
		],
	],
	'PowerPlay' => [
		'Left' => [
			'Count' => 0,
			'Min' => 0,
			'Sec' => 0
		],
		'Right' => [
			'Count' => 0,
			'Min' => 0,
			'Sec' => 0
		],
		'OneLine' => [
			'Position' => 'Left', // Left, Right, Both 
			'Min' => 0,
			'Sec' => 0
		]
	],
	'Shootout' => [
		1 => [
			'Left' => 0,
			'Right' => 0
		],
		2 => [
			'Left' => 0,
			'Right' => 0
		],
		3 => [
			'Left' => 0,
			'Right' => 0
		],
		4 => [
			'Left' => 0,
			'Right' => 0
		],
		5 => [
			'Left' => 0,
			'Right' => 0
		],
		6 => [
			'Left' => 0,
			'Right' => 0
		],
		7 => [
			'Left' => 0,
			'Right' => 0
		]
	],
];

$DBDefaultArrayCommentator = [
	0 => [
		"ShortName" => '',
		"FullName"  => '',
		"Photo"     => '',
		"Desc"      => ''
	]
];
$DBDefaultArrayJudge = [
	0 => [
		"Number"    => 0,
		"ShortName" => '',
		"FullName"  => '',
		'Photo'     => '',
		"Desc"      => ''
	]
];
$DBDefaultArrayGamePlace = [
	'ShortName' => '',
	'FullName'  => '',
	'Place'     => '',
	'Desc'      => '',
	'Logo'      => ''
];
$DBDefaultArrayGameName = [
	'ShortName' => '',
	'FullName'  => '',
	'Desc'      => ''
];

define("CONFIG_FILE_DEFAULT", "config-default.ini");
define("CONFIG_FILE_LOCAL",   "config-local.ini");

function ReadConfigFile () {
	global $ini;
	// Обрабатываем конфигурационный файл по умолчанию.
	if (file_exists(__DIR__ . '/' . CONFIG_FILE_DEFAULT)) {
		$configDefault = parse_ini_file(__DIR__ . '/' . CONFIG_FILE_DEFAULT);
	}
	else {
		echo "Не удалось прочитать конфигурационный файл.\n";
		exit;
	}
	// Обрабатываем локальный конфигурационный файл
	if (file_exists(__DIR__ . '/' . CONFIG_FILE_LOCAL)) {
		$configLocal = parse_ini_file(__DIR__ . '/' . CONFIG_FILE_LOCAL);
		$ini = array_merge($configDefault, $configLocal);
		unset($configLocal);
	}
	unset($configDefault);

	if (!is_array($ini)) {
		print_r($ini);
		echo "Не удалось прочитать конфигурационный файл1.\n";
		exit;
	}
}
function ReadTriggerFile () {
	global $ini;
	global $EventsTimer;
	global $EventsType;
	//---------------------------------
	// Обрабатываем файл событий: events.ini
	$EventsTimer = parse_ini_file(__DIR__ . "/Events.ini", true);
	if (!is_array($EventsTimer)) {
		print_r($EventsTimer);
		echo "Файл событий отсутствует.\n";
	}
	foreach($EventsTimer as $key => $value) {
		if (!is_array($value)) {
			echo "Файл событий неправильный.\n";
			exit;
		}
		else {
			foreach($EventsType as $check) {
				if (array_key_exists($check, $value)) {
					if ((int)$value[$check] >= 0) {
						//Значит всё пучком!!!
						if (!array_key_exists('COUNT', $EventsTimer[$key])) {
							$EventsTimer[$key]['COUNT']=0;
						}
						$EventsTimer[$key]['COUNT']++;
					}
					else {
						echo "Файл событий неправильный: " . $check . ".\n";
						exit;
					}
				}
			}
		}
	}
}
function ReadEventSelect () {
	global $ini;
	global $EventSelect;
	// Если базы нет, то мы ее создаем!
	if (!file_exists(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL'])) {
		$EventSelect = 0;
		return;
	}
	// Смотрим какой номер выбранного мероприятия
	if ($ini["PrintConsoleInfo"] == "y") {echo "Смотрим какой номер выбранного мероприятия\n";}
	$EventSelect = file_get_contents(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL']);
	
	if (!$EventSelect) {
		$EventSelect = 0;
		return;
	}
	if (!preg_match('/[a-zA-Z0-9]/', $EventSelect)) {
		$EventSelect = 0;
	}
}
function WriteEventSelect ($EventUID  = false)  {
	global $ini;
	$DBFile = fopen(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL'], 'w');
	fwrite($DBFile, $EventUID);
	fclose($DBFile);
}
function ReadEventsList () {
	global $ini;
	global $EventDBList;
	empty($EventDBList);
	$EventDBList = [];
	$EventDBList[0]  = [
		"Name" => "Мероприятий нет",
		"File" => null,
		"GameOver" => 0
	];
	$filesList = array_diff(scandir(__DIR__ . '/DB/Events/'), array('.', '..'));
	// Количество созданных мероприятий
	if (count($filesList) < 1) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Нет мероприятий!!!\n";}
		return;
	}

	//Читаем локальный файл cо списком мероприятий
	if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем директорию с файлами мероприятий\n";}
	foreach ($filesList as $item) {
		// Обрабатываем локальный конфигурационный файл c названием игр.
		$tempEventDBListItem = json_decode( file_get_contents(__DIR__ . '/DB/Events/' . $item) , true );
		if (json_last_error() === JSON_ERROR_NONE && !is_array($tempEventDBListItem)) {
			//var_dump("Empty Name");
		}
		else {
			if (array_key_exists("EventName", $tempEventDBListItem)) {
				$EventDBList[$tempEventDBListItem['UID']] = [
					"Name" => $tempEventDBListItem['EventName'],
					"UID" => $tempEventDBListItem['UID'],
					"GameOver" => array_key_exists("GameOver", $tempEventDBListItem) ? $tempEventDBListItem['GameOver'] : 0,
					"File" => preg_replace('/\.json$/', '', $item),
					"GameDate" => "",
					"GameTime" => "",
					"PlayerLeft"  => [
						"FullName" => $tempEventDBListItem['PlayerLeft']['FullName'],
						"Logo" => $tempEventDBListItem['PlayerLeft']['Logo'],
					],
					"PlayerRight" => [
						"FullName" => $tempEventDBListItem['PlayerRight']['FullName'],
						"Logo" => $tempEventDBListItem['PlayerRight']['Logo'],
					],
				];
			}
		}
	}
	
	$arraySort = [];
	foreach ($EventDBList as $key => $row) {
		$arraySort[$key] = $row['Name'];
	}
	array_multisort($arraySort, SORT_DESC, $EventDBList);
	$arraySort = null;
	unset($arraySort);
	return;
}
//Читаем файл с настройками
ReadConfigFile();
//События, действия
ReadTriggerFile();
//Собираем информацию по всем мероприятиям
ReadEventsList();
//Читаем файл с данными о выбранном мероприятии
ReadEventSelect();
//Надо проверить нахрена я это сделал
function ReadDBEvent($EventUID  = false) {
	global $ini;
	global $EventSelect;
	global $EventDB;
	global $EventDBList;
	global $EventDBDefault;
	$FileName = $EventSelect;
	if ($EventUID) {
		if (array_key_exists($EventUID, $EventDBList) && $EventDBList[$EventUID]) {
			$FileName = $EventDBList[$EventUID]['File'];
		}
	}
	// Проверяем наличие файла
	if (!file_exists(__DIR__ . '/DB/Events/' . $FileName . '.json')) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "1Файла с базой мероприятия нет!!!\n";}
		return false;
	}
	// Читаем файл
	if ($ini["PrintConsoleInfo"] == "y") {echo "2Читаем файл с мероприятием\n";}
	$tempEventDB = json_decode( file_get_contents(__DIR__ . '/DB/Events/' . $FileName . '.json') , true );

	if (!is_array($tempEventDB) || (is_array($tempEventDB) && !array_key_exists('DBVersion',$tempEventDB))) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не корректная база!!!\n";}
		if ($EventUID) {
			return false;
		}
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не корректная база. Загружаем базу по умолчанию!!!!\n";}
		$EventDB = $EventDBDefault;
		return false;
	}
	// если запрашивали конкретную базу, то возвращаем её
	if ($EventUID) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Возвращаем запрошенную базу!!!!\n";}
		return $tempEventDB;
	}
	// Загрузка базы в память
	if ($tempEventDB['DBVersion'] == $EventDBDefault['DBVersion']) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "База актуальной версии!\n";}
		$EventDB = $tempEventDB;
		return true;
	}
	else {
		if ($ini["PrintConsoleInfo"] == "y") {echo "База старой версии. Загружаем базу по умолчанию!!!!\n";}
		$EventDB = $EventDBDefault;
		return true;
	}
}
//Надо проверить нахрена я это сделал
function WriteDBEvent($EventUID  = false,$EventData  = []) {
	global $ini;
	global $EventSelect;
	global $EventDB;
	if ($EventDB['GameOverTemp'] == 1 && $EventDB['GameOver'] == 1) {
		echo "--------------\n";
		echo "Мероприятие завершено, вносить изменения нельзя!!!\n";
		echo "--------------\n";
		return false;
	}
	$FileName = $EventSelect;
	if ($EventUID) {
		if (array_key_exists($EventUID, $EventDBList) && $EventDBList[$EventUID]['File']) {
			$FileName = $EventDBList[$EventUID]['File'];
		}
	}

	if (!file_exists(__DIR__ . '/DB/Events/' . $FileName . '.json')) {
		echo "Файла с базой мероприятия нет.!!!!\n";
		return false;
	}
	if ($EventDB['GameOverTemp'] == 1 && $EventDB['GameOver'] == 0) {
		echo "Мероприятие завершено!!!\n";
		$EventDB['GameOver'] = 1;
	}
	$DBFile = fopen(__DIR__ . '/DB/Events/' . $FileName . '.json', 'w');
	fwrite($DBFile, json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
	fclose($DBFile);

}
function DBEvent ($Action = false, $EventUID  = false, $Json = false) {
	global $ini;
	global $EventDBDefault;
	global $EventDBList;
	global $EventDB;
	global $EventSelect;

	if ($Action == 'DeleteEvent') {
		unlink(__DIR__ . '/DB/Events/' . $EventDBList[$Json]['File']. ".json");
		if (!file_exists(__DIR__ . '/DB/Events/' . $EventDBList[$Json]['File']. ".json")) {
			ReadEventsList();
		}
	}
	elseif ($Action == 'CreateEvent') {
		$UniqFileName = uniqid();

		$tempEventDB = $EventDBDefault;
		$tempEventDB['UID'] = $UniqFileName;
		$tempEventDB['EventName'] = "9000.00.00 00:00 Новое мероприятие";
		$tempEventDB['GameDate'] = date('d.m.Y');
		$tempEventDB['GameTime'] = date('H:i');
		$tempEventDB['PlayerLeft']['FullName'] = 'ХК Левые';
		$tempEventDB['PlayerLeft']['Logo'] = 'LOGO_Default_Left';
		$tempEventDB['PlayerRight']['FullName'] = 'ХК Правые';
		$tempEventDB['PlayerRight']['Logo'] = 'LOGO_Default_Right';
		$WriteEventFile = fopen(__DIR__ . '/DB/Events/' . $UniqFileName . '.json', 'w');
		fwrite($WriteEventFile, json_encode($tempEventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteEventFile);
		unset($tempEventDB);
		ReadEventsList();
	}
	elseif ($Action == 'SaveEvent') {
		//Комментаторы
		//$Json['Event']['Commentators']["1"]['UID'] = "";
		//$Json['Event']['Commentators']["2"]['UID'] = "";
		$tempCommentators = DBCommentators();
		
		foreach ($Json['Event']['Commentators']  as $key => $value) {
			$tempUID  = $value['UID'];
			if ($tempUID != "" && array_key_exists($tempUID, $tempCommentators) && is_array($tempCommentators[$tempUID])) {
				$Json['Event']['Commentators'][$key] = $tempCommentators[$tempUID];
				$Json['Event']['Commentators'][$key]['UID'] = $tempUID;
			}
		}

		//Судейская бригада
		$tempJudges = DBJudges();
		foreach (['JudgeFirst','JudgeSecond','JudgeThird','JudgeFourth']  as $value) {
			$tempUID  = $Json['Event'][$value]['UID'];
			if ($tempUID != "" && array_key_exists($tempUID, $tempJudges) && is_array($tempJudges[$tempUID])) {
				$Json['Event'][$value] = $tempJudges[$tempUID];
				$Json['Event'][$value]['UID'] = $tempUID;
			}
			else {
				$Json['Event'][$value] = [];
				$Json['Event'][$value]['UID'] = "";
			}
		}

		$tempGamePlaceUID = $Json['Event']['GamePlace']['UID'];
		$tempGameNameUID  = $Json['Event']['GameName']['UID'];
		$tempTeamLeftUID  = $Json['Event']['PlayerLeft']['UID'];
		$tempTeamRightUID = $Json['Event']['PlayerRight']['UID'];
		$tempTeamLeft   = ReadDBTeam($tempTeamLeftUID);
		$tempTeamRight  = ReadDBTeam($tempTeamRightUID);
		$GamePlaceArray = DBGamePlace();
		$GameNameArray  = DBGameName();
		if (!is_array($GamePlaceArray[$tempGamePlaceUID])) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти данные1!!!\n";}
			return false;
		}
		if (!is_array($GameNameArray[$tempGameNameUID])) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти данные2!!!\n";}
			return false;
		}
		if (!is_array($tempTeamLeft)) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти данные3!!!\n";}
			return false;
		}
		if (!is_array($tempTeamRight)) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти данные4!!!\n";}
			return false;
		}
		if (!file_exists(__DIR__ . '/DB/Events/' . $EventDBList[$Json['Key']]['File']. ".json")) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти файл базы мероприятий!!!\n";}
			return false;
		}
		//$Json['Event']['EventName'] = date("Y.m.d H:i", strtotime($Json['Event']['GameDate'] . " " . $Json['Event']['GameTime'])) . " " . $tempTeamLeft['FullName'] . " - " . $tempTeamRight['FullName'];
		$Json['Event']['GamePlace'] = $GamePlaceArray[$tempGamePlaceUID];
		$Json['Event']['GamePlace']['UID'] = $tempGamePlaceUID;
		$Json['Event']['GamePlace']['FullName'] = str_replace("\n", "<br>", $GamePlaceArray[$tempGamePlaceUID]["FullName"]);
		$Json['Event']['GamePlace']['FullNameOneLine'] = str_replace("\n", " ", $GamePlaceArray[$tempGamePlaceUID]["FullName"]);
		$Json['Event']['GameName'] = $GameNameArray[$tempGameNameUID];
		$Json['Event']['GameName']['UID'] = $tempGameNameUID;
		if ($Json['ChangeTeamLeft'] == 1) {
			$Json['Event']['PlayerLeft'] = $tempTeamLeft;
			$Json['Event']['PlayerLeft']['UID'] = $tempTeamLeftUID;
		}
		if ($Json['ChangeTeamRight'] == 1) {
			$Json['Event']['PlayerRight'] = $tempTeamRight;
			$Json['Event']['PlayerRight']['UID'] = $tempTeamRightUID;
		}
		
		$WriteEventFile = fopen(__DIR__ . '/DB/Events/' . $EventDBList[$Json['Key']]['File']. ".json", 'w');
		fwrite($WriteEventFile, json_encode($Json['Event'], JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteEventFile);
		ReadEventsList();
	}
	// Возвращаем текущую базу
	elseif ($Action == 'Current') {
		return $EventDB;
	}
	// По умолчанию поиск:
	// true - найдена
	// false - не найдена
	else {
		if (!$EventUID || $EventUID == "" || $EventUID == 0) {
			return false;
		}
		if (array_key_exists($EventUID, $EventDBList) && $EventDBList[$EventUID]) {
			$FileName = $EventDBList[$EventUID]['File'];
		}
		
		// Проверяем наличие файла
		if (!file_exists(__DIR__ . '/DB/Events/' . $FileName . '.json')) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "1Файла с базой мероприятия нет!!!\n";}
			return false;
		}
		// Читаем файл
		if ($ini["PrintConsoleInfo"] == "y") {echo "2Читаем файл с мероприятием\n";}
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/DB/Events/' . $FileName . '.json') , true );
		empty($FileName);
		if (!is_array($tempEventDB) || (is_array($tempEventDB) && !array_key_exists('DBVersion',$tempEventDB))) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не корректная база. Загружаем базу по умолчанию!!!!\n";}
			return false;
		}
		empty($tempEventDB);
		return true;
	}
	return false;
}
//Функция по работе с командами
function DBTeamsList ($action = false, $Json = false) {
	global $ini;
	$tempTeamsDBList[0] = [
		"Name" => "Мероприятий нет",
		"Desc" => "",
		"File" => null
	];
	// Проверяем существование файла.
	if (!file_exists(__DIR__ . '/' . $ini['DB_TEAMS_LIST'])) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл cо списком команд.\n";}
		return $tempTeamsDBList;
	}
	// Обрабатываем файл cо списком судей.
	$tempTeamsDBList = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAMS_LIST']) , true );
	if (!is_array($tempTeamsDBList)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось понять базу со списком команд!!!\n";}
		return [
			0 => [
				"Name" => "Мероприятий нет",
				"Desc" => "",
				"File" => null
			]
		];
	}

	if ($action == 'CreateTeamList') {
		$UniqFileName = uniqid();
		$tempTeamsDBList[base64_encode(random_bytes(8))] = [
			"Name" => "0 Новая команда",
			"Desc" => "",
			"File" => $UniqFileName
		];
		$tempTeamDB = [];
		$tempTeamDB['ShortName'] = "";
		$tempTeamDB['FullName']  = "0 Новая команда";
		$tempTeamDB['Desc']      = "";
		$tempTeamDB['Logo']      = "LOGO_DEFAULT";
		$tempTeamDB['Place']     = "";
		$tempTeamDB['Boss']      = "";
		$tempTeamDB['Trainer']   = "";
		$tempTeamDB['Administrator'] = "";
		$tempTeamDB['MiddleLet'] = "";
		$tempTeamDB['Players']   = [];
		$WriteTeamFile = fopen(__DIR__ . '/DB/Teams/' . $UniqFileName . '.json', 'w');
		fwrite($WriteTeamFile, json_encode($tempTeamDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteTeamFile);
		unset($tempTeamDB);
		unset($UniqFileName);
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_TEAMS_LIST'], 'w');
		fwrite($WriteFile, json_encode($tempTeamsDBList, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}
	elseif ($action == 'DeleteTeamList') {
		unlink(__DIR__ . '/DB/Teams/' . $tempTeamsDBList[$Json]['File']. ".json");
		if (!file_exists(__DIR__ . '/DB/Teams/' . $tempTeamsDBList[$Json]['File']. ".json")) {
			unset($tempTeamsDBList[$Json]);
		}
	}
	elseif ($action == 'SaveTeamList') {
		$tempTeamsDBList[$Json['Key']]["Name"] = $Json['Team']['FullName'];
		$tempTeamsDBList[$Json['Key']]["Desc"] = $Json['Team']['Desc'];
		if (file_exists(__DIR__ . '/DB/Teams/' . $tempTeamsDBList[$Json['Key']]['File']. ".json")) {
			$WriteEventFile = fopen(__DIR__ . '/DB/Teams/' . $tempTeamsDBList[$Json['Key']]['File']. ".json", 'w');
			fwrite($WriteEventFile, json_encode($Json['Team'], JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteEventFile);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти файл базы команд!!!\n";}
		}
	}
	if ($action != false) {
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_TEAMS_LIST'], 'w');
		fwrite($WriteFile, json_encode($tempTeamsDBList, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}

	// Сортировка
	$arraySort = [];
	foreach ($tempTeamsDBList as $key => $row) {
		$arraySort[$key] = $row['Name'];
	}
	array_multisort($arraySort, SORT_ASC, $tempTeamsDBList);
	$arraySort = null;
	unset($arraySort);
	return $tempTeamsDBList;
}
function ReadDBTeam($TeamUID  = false) {
	global $ini;
	$FileName = "Empty";
	if ($TeamUID) {
		$tempDBTeamsList = DBTeamsList();
		if (array_key_exists($TeamUID, $tempDBTeamsList) && $tempDBTeamsList[$TeamUID]) {
			$FileName = $tempDBTeamsList[$TeamUID]['File'];
			// Обрабатываем базу данных
			if (file_exists(__DIR__ . '/DB/Teams/' . $FileName . '.json')) {
				$tempTeamDB = json_decode( file_get_contents(__DIR__ . '/DB/Teams/' . $FileName . '.json') , true );
				if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем базу \n";}
				if (is_array($tempTeamDB)) {
					$tempTeamDB['Key'] = $TeamUID;
					return $tempTeamDB;
				}
				else {
					if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка2!!!!\n";}
					return false;
				}
			}
			else {
				if ($ini["PrintConsoleInfo"] == "y") {echo "Файла с базой команд нет.!!!!\n";}
				return false;
			}
		}
		unset($tempDBTeamsList);
	}
	else {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Файла с базой команд нет.!!!!\n";}
		return false;
	}
	
}
function DBGameName ($action = false, $Json = false) {
	global $ini;
	// Проверяем существование файла.
	if (!file_exists(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL'])) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл c названием матчей.\n";}
		return $DBDefaultArrayGameName;
	}
	// Обрабатываем файл cо списком .
	$tempGameNameArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL']) , true );
	if (!is_array($tempGameNameArray)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось понять базу с названием матчей!!!\n";}
		return $DBDefaultArrayNamePlace;
	}

	if ($action == 'CreateGameName') {
		$tempGameNameArray[base64_encode(random_bytes(8))] = [
			'ShortName' => time() . 'Новая запись',
			'FullName' => 'Новая запись',
			'Desc' => 'Новая запись'
		];
	}
	else if ($action == 'DeleteGameName') {
		unset($tempGameNameArray[$Json]);
	}
	else if ($action == 'SaveGameName') {
		$tempGameNameArray[$Json['Key']] = [
			"ShortName" => $Json['ShortName'],
			"FullName"  => $Json['FullName'],
			"Desc"      => $Json['Desc']
		];
	}

	if ($action != false) {
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL'], 'w');
		fwrite($WriteFile, json_encode($tempGameNameArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}

	// Сортировка
	$arraySort = [];
	foreach ($tempGameNameArray as $key => $row) {
		$arraySort[$key] = $row['ShortName'];
	}
	array_multisort($arraySort, SORT_ASC, $tempGameNameArray);
	$arraySort = null;
	unset($arraySort);

	return $tempGameNameArray;
}
function DBGamePlace ($action = false, $Json = false) {
	global $ini;
	// Проверяем существование файла.
	if (!file_exists(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL'])) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл c местами проведения хоккейных матчей.\n";}
		return $DBDefaultArrayGamePlace;
	}
	// Обрабатываем файл cо списком судей.
	$tempGamePlaceArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL']) , true );
	if (!is_array($tempGamePlaceArray)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось понять базу с местами проведения хоккейных матчей!!!\n";}
		return $DBDefaultArrayGamePlace;
	}

	if ($action == 'CreateGamePlace') {
		$tempGamePlaceArray[base64_encode(random_bytes(8))] = [
			'ShortName' => time() . 'Новая запись',
			'FullName' => 'Новая запись',
			'Place' => '',
			'Desc' => 'Новая запись',
			'Logo' => 'Default.png'
		];
	}
	else if ($action == 'DeleteGamePlace') {
		unset($tempGamePlaceArray[$Json]);
	}
	else if ($action == 'SaveGamePlace') {
		$tempGamePlaceArray[$Json['Key']] = [
			"ShortName" => $Json['ShortName'],
			"FullName"  => $Json['FullName'],
			"Place"     => $Json['Place'],
			"Desc"      => $Json['Desc'],
			"Logo"      => $Json['Logo']
		];
	}
	if ($action != false) {
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL'], 'w');
		fwrite($WriteFile, json_encode($tempGamePlaceArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}
	// Сортировка
	$arraySort = [];
	foreach ($tempGamePlaceArray as $key => $row) {
		$arraySort[$key] = $row['ShortName'];
	}
	array_multisort($arraySort, SORT_ASC, $tempGamePlaceArray);
	$arraySort = null;
	unset($arraySort);

	return $tempGamePlaceArray;
}
function DBJudges ($action = false, $Json = false) {
	global $ini;
	// Проверяем существование файла.
	if (!file_exists(__DIR__ . '/' . $ini['DB_JUDGES'])) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл cо списком судей.\n";}
		return $DBDefaultArrayJudge;
	}
	// Обрабатываем файл cо списком судей.
	$tempJudgesArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_JUDGES']) , true );
	if (!is_array($tempJudgesArray)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось понять базу со списком судей!!!\n";}
		return $DBDefaultArrayJudge;
	}
	if ($action == 'CreateJudge') {
		$tempJudgesArray[base64_encode(random_bytes(8))] = [
			"Number"    => 0,
			"ShortName" => time() . " Новый судья",
			"FullName"  => "",
			'Photo'     => "PHOTO_JUDGE_DEFAULT",
			"Desc"      => ""
		];
	}
	elseif ($action == 'DeleteJudge') {
		unset($tempJudgesArray[$Json]);
	}
	elseif ($action == 'SaveJudge') {
		$tempJudgesArray[$Json['Key']] = [
			"ShortName" => $Json['ShortName'],
			"FullName"  => $Json['FullName'],
			"Number"    => $Json['Number'],
			"Photo"     => $Json['Photo'],
			"Desc"      => $Json['Desc']
		];
	}
	if ($action != false) {
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_JUDGES'], 'w');
		fwrite($WriteFile, json_encode($tempJudgesArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}
	// Сортировка
	$arraySort = [];
	foreach ($tempJudgesArray as $key => $row) {
		$arraySort[$key] = $row['ShortName'];
	}
	array_multisort($arraySort, SORT_ASC, $tempJudgesArray);
	$arraySort = null;
	unset($arraySort);

	return $tempJudgesArray;
}
function DBCommentators ($action = false, $Json = false) {
	global $ini;
	// Проверяем существование файла.
	if (!file_exists(__DIR__ . '/' . $ini['DB_COMMENTATORS'])) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл cо списком комментаторов.\n";}
		return $DBDefaultArrayCommentator;
	}
	// Обрабатываем файл cо списком комментаторов.
	$tempCommentatorsArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_COMMENTATORS']) , true );
	if (!is_array($tempCommentatorsArray)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось понять базу со списком комментаторов!!!\n";}
		return $DBDefaultArrayCommentator;
	}
	if ($action == 'CreateCommentator') {
		$tempCommentatorsArray[base64_encode(random_bytes(8))] = [
			"ShortName" => time() . " Новый комментатор",
			"FullName"  => "",
			'Photo'     => "PHOTO_JUDGE_DEFAULT",
			"Desc"      => ""
		];
	}
	elseif ($action == 'DeleteCommentator') {
		unset($tempCommentatorsArray[$Json]);
	}
	elseif ($action == 'SaveCommentator') {
		$tempCommentatorsArray[$Json['Key']] = [
			"ShortName" => $Json['ShortName'],
			"FullName"  => $Json['FullName'],
			"Photo"     => $Json['Photo'],
			"Desc"      => $Json['Desc']
		];
	}
	if ($action != false) {
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_COMMENTATORS'], 'w');
		fwrite($WriteFile, json_encode($tempCommentatorsArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}

	// Сортировка
	$arraySort = [];
	foreach ($tempCommentatorsArray as $key => $row) {
		$arraySort[$key] = $row['ShortName'];
	}
	array_multisort($arraySort, SORT_ASC, $tempCommentatorsArray);
	$arraySort = null;
	unset($arraySort);

	return $tempCommentatorsArray;
}
function DBEventsList1 ($action = false, $Json = false) {
	global $ini;
	global $EventDBDefault;
	global $EventDBList;
	$tempEventDBList[0] = [
		"Name" => "Мероприятий нет",
		"File" => null,
		"GameOver" => 0
	];
	$filesList = array_diff(scandir(__DIR__ . '/DB/Events/'), array('.', '..'));
	// Количество созданных мероприятий
	if (count($filesList) < 1) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Нет мероприятий!!!\n";}
		return $EventDBList;
	}

	//Читаем локальный файл cо списком мероприятий
	if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем директорию с файлами мероприятий\n";}
	foreach ($filesList as $item) {
		// Обрабатываем локальный конфигурационный файл c названием игр.
		/*if (!file_exists(__DIR__ . '/' . $ini['DB_EVENTS_LIST'])) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти локальный файл со списком мероприятий!!!\n";}
			return $tempEventDBList;
		}*/
		
		$tempEventDBListItem = json_decode( file_get_contents(__DIR__ . '/DB/Events/' . $item) , true );
		if (json_last_error() === JSON_ERROR_NONE && !is_array($tempEventDBListItem)) {
			//var_dump("Empty Name");
		}
		else {
			if (array_key_exists("EventName", $tempEventDBListItem)) {
				$EventDBList[$tempEventDBListItem['UID']] = [
					"Name" => $tempEventDBListItem['EventName'],
					"UID" => $tempEventDBListItem['UID'],
					"GameOver" => array_key_exists("GameOver", $tempEventDBListItem) ? $tempEventDBListItem['GameOver'] : 0,
					"File" => preg_replace('/\.json$/', '', $item)
				];
			}
		}
	}
	
	if (!is_array($tempEventDBList)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось создать локальный файл со списком мероприятий!!!\n";}
		return $tempEventDBList;
	}

	if ($action == 'DeleteEventList') {
		unlink(__DIR__ . '/DB/Events/' . $tempEventDBList[$Json]['File']. ".json");
		if (!file_exists(__DIR__ . '/DB/Events/' . $tempEventDBList[$Json]['File']. ".json")) {
			unset($tempEventDBList[$Json]);
		}
	}
	elseif ($action == 'CreateEventList') {
		$UniqFileName = uniqid();
		$tempEventDBList[base64_encode(random_bytes(8))] = [
			"Name" => "9000.00.00 00:00 Новое мероприятие",
			"File" => $UniqFileName
		];
		$tempEventDB = $EventDBDefault;
		$tempEventDB['GameDate'] = date('d.m.Y');
		$tempEventDB['GameTime'] = date('H:i');
		$tempEventDB['PlayerLeft']['FullName'] = 'ХК Левые';
		$tempEventDB['PlayerLeft']['Logo'] = 'LOGO_Default_Left';
		$tempEventDB['PlayerRight']['FullName'] = 'ХК Правые';
		$tempEventDB['PlayerRight']['Logo'] = 'LOGO_Default_Right';
		$WriteEventFile = fopen(__DIR__ . '/DB/Events/' . $UniqFileName . '.json', 'w');
		fwrite($WriteEventFile, json_encode($tempEventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteEventFile);
		unset($tempEventDB);
	}
	elseif ($action == 'SaveEventList') {
		//Комментаторы
		$Json['Event']['Commentator1']['UID'] = "";
		$Json['Event']['Commentator2']['UID'] = "";
		/*$tempCommentators = DBCommentators();
		foreach (['Commentator1','Commentator2']  as $value) {
			$tempUID  = $Json['Event'][$value]['UID'];
			if ($tempUID != "" && array_key_exists($tempUID, $tempCommentators) && is_array($tempCommentators[$tempUID])) {
				$Json['Event'][$value] = $tempCommentators[$tempUID];
				$Json['Event'][$value]['UID'] = $tempUID;
			}
			else {
				$Json['Event'][$value] = [];
				$Json['Event'][$value]['UID'] = "";
			}
		}*/

		//Судейская бригада
		$tempJudges = DBJudges();
		foreach (['JudgeFirst','JudgeSecond','JudgeThird','JudgeFourth']  as $value) {
			$tempUID  = $Json['Event'][$value]['UID'];
			if ($tempUID != "" && array_key_exists($tempUID, $tempJudges) && is_array($tempJudges[$tempUID])) {
				$Json['Event'][$value] = $tempJudges[$tempUID];
				$Json['Event'][$value]['UID'] = $tempUID;
			}
			else {
				$Json['Event'][$value] = [];
				$Json['Event'][$value]['UID'] = "";
			}
		}

		$tempGamePlaceUID = $Json['Event']['GamePlace']['UID'];
		$tempGameNameUID  = $Json['Event']['GameName']['UID'];
		$tempTeamLeftUID  = $Json['Event']['PlayerLeft']['UID'];
		$tempTeamRightUID = $Json['Event']['PlayerRight']['UID'];
		$tempTeamLeft   = ReadDBTeam($tempTeamLeftUID);
		$tempTeamRight  = ReadDBTeam($tempTeamRightUID);
		$GamePlaceArray = DBGamePlace();
		$GameNameArray  = DBGameName();
		if (is_array($GamePlaceArray[$tempGamePlaceUID]) && 
			is_array($GameNameArray[$tempGameNameUID]) && 
			is_array($tempTeamLeft) && 
			is_array($tempTeamRight)
		) {
			$tempEventDBList[$Json['Key']]["Name"] = date("Y.m.d H:i", strtotime($Json['Event']['GameDate'] . " " . $Json['Event']['GameTime'])) . " " . $tempTeamLeft['FullName'] . " - " . $tempTeamRight['FullName'];
			if (file_exists(__DIR__ . '/DB/Events/' . $tempEventDBList[$Json['Key']]['File']. ".json")) {
				$Json['Event']['GamePlace'] = $GamePlaceArray[$tempGamePlaceUID];
				$Json['Event']['GamePlace']['UID'] = $tempGamePlaceUID;
				$Json['Event']['GamePlace']['FullName'] = str_replace("\n", "<br>", $GamePlaceArray[$tempGamePlaceUID]["FullName"]);
				$Json['Event']['GamePlace']['FullNameOneLine'] = str_replace("\n", " ", $GamePlaceArray[$tempGamePlaceUID]["FullName"]);
				$Json['Event']['GameName'] = $GameNameArray[$tempGameNameUID];
				$Json['Event']['GameName']['UID'] = $tempGameNameUID;
				if ($Json['ChangeTeamLeft'] == 1) {
					$Json['Event']['PlayerLeft'] = $tempTeamLeft;
					$Json['Event']['PlayerLeft']['UID'] = $tempTeamLeftUID;
				}
				if ($Json['ChangeTeamRight'] == 1) {
					$Json['Event']['PlayerRight'] = $tempTeamRight;
					$Json['Event']['PlayerRight']['UID'] = $tempTeamRightUID;
				}
				
				$WriteEventFile = fopen(__DIR__ . '/DB/Events/' . $tempEventDBList[$Json['Key']]['File']. ".json", 'w');
				fwrite($WriteEventFile, json_encode($Json['Event'], JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
				fclose($WriteEventFile);
			}
			else {
				if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти файл базы мероприятий!!!\n";}
			}
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти данные!!!\n";}
		}
	}
	/*if ($action != false) {
		$WriteFile = fopen(__DIR__ . '/' . $ini['DB_EVENTS_LIST'], 'w');
		fwrite($WriteFile, json_encode($tempEventDBList, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($WriteFile);
	}*/

	$arraySort = [];
	foreach ($tempEventDBList as $key => $row) {
		$arraySort[$key] = $row['Name'];
	}
	array_multisort($arraySort, SORT_DESC, $tempEventDBList);
	$arraySort = null;
	unset($arraySort);
	return $tempEventDBList;
}
function ReadLogo ($dir) {
	$Return = ['LOGO_DEFAULT'];
	$files = array_diff(scandir(__DIR__ . '/' . $dir), array('.', '..'));
	foreach ($files as $file) {
		$parts=explode(".", $file);
		if ($parts[count($parts)-1] == 'png') {
			$Return[] = $parts[count($parts)-2];
		}
	}
	return $Return;
}
function ReadPhotoPlayers ($dir) {
	$Return = ['PHOTO_DEFAULT'];
	$files = array_diff(scandir(__DIR__ . '/' . $dir), array('.', '..'));
	foreach ($files as $file) {
		$parts=explode(".", $file);
		if ($parts[count($parts)-1] == 'png') {
			$Return[] = $parts[count($parts)-2];
		}
	}
	return $Return;
}
function PowerPlay() {
	global $ini;
	global $EventDB;

	foreach(['Left','Right'] as $Position) {
		$Min = 0;
		$Sec = 0;
		$Count = 0;
		if ($EventDB['DelPlayer'][$Position.'1']['Num'] > 0) {
			for ($i=1; $i <= 3; $i++) {
				if ($EventDB['DelPlayer'][$Position.$i]['Num'] > 0) {
					if ($Min < $EventDB['DelPlayer'][$Position.$i]['Min']) {
						$Min = $EventDB['DelPlayer'][$Position.$i]['Min'];
						$Sec = $EventDB['DelPlayer'][$Position.$i]['Sec'];
					}
					if ($Min == $EventDB['DelPlayer'][$Position.$i]['Min']) {
						if ($Sec <= $EventDB['DelPlayer'][$Position.$i]['Sec']) {
							$Sec = $EventDB['DelPlayer'][$Position.$i]['Sec'];
						}						
					}

					$Count = $i;
				}
			}
		}
		$EventDB['PowerPlay'][$Position]['Min'] = $Min;
		$EventDB['PowerPlay'][$Position]['Sec'] = $Sec;
		$EventDB['PowerPlay'][$Position]['Count'] = $Count;

		if ($i == 3 && $EventDB['PowerPlay'][$Position]['Count'] > 0 && $ini["PrintConsoleInfo"] == "y") {
			echo "[Update PowerPlay " . $Position . "] => min:" . $EventDB['PowerPlay'][$Position]['Min'] . " Sec:"  . $EventDB['PowerPlay'][$Position]['Sec'] . "\n";
		}
	}
	$Position = NULL;
	$Min = 0;
	$Sec = 0;
	$Pos = 'Both';
	if ($EventDB['PowerPlay']['Left']['Min'] < $EventDB['PowerPlay']['Right']['Min']) {
		$Min = $EventDB['PowerPlay']['Right']['Min'];
		$Sec = $EventDB['PowerPlay']['Right']['Sec'];
		$Pos = 'Right';
	}
	elseif ($EventDB['PowerPlay']['Left']['Min'] == $EventDB['PowerPlay']['Right']['Min']) {
		if ($EventDB['PowerPlay']['Left']['Sec'] < $EventDB['PowerPlay']['Right']['Sec']) {
			$Min = $EventDB['PowerPlay']['Right']['Min'];
			$Sec = $EventDB['PowerPlay']['Right']['Sec'];
			$Pos = 'Right';
		}
		elseif ($EventDB['PowerPlay']['Left']['Sec'] > $EventDB['PowerPlay']['Right']['Sec']) {
			$Min = $EventDB['PowerPlay']['Left']['Min'];
			$Sec = $EventDB['PowerPlay']['Left']['Sec'];
			$Pos = 'Left';
		}
		else {
			$Min = $EventDB['PowerPlay']['Left']['Min'];
			$Sec = $EventDB['PowerPlay']['Left']['Sec'];
			$Pos = 'Both';
		}
	}
	else {
		$Min = $EventDB['PowerPlay']['Left']['Min'];
		$Sec = $EventDB['PowerPlay']['Left']['Sec'];
		$Pos = 'Left';
		
	}

	$EventDB['PowerPlay']['OneLine']['Position'] = $Pos;

	if ($EventDB['PowerPlay']['OneLine']['Min'] == 0 && $EventDB['PowerPlay']['OneLine']['Sec'] == 0 && ($Min > 0 || $Sec > 0)) {
		$EventDB['PowerPlay']['OneLine']['Min'] = $Min;
		$EventDB['PowerPlay']['OneLine']['Sec'] = $Sec;
		$EventDB['PowerPlay']['OneLine']['Upd'] = 1;
		if ($ini["PrintConsoleInfo"] == "y") {
			echo "[Add PowerPlay OneLine ] => min:" . $Min . " Sec:"  . $Sec . " Pos:" . $Pos . "\n";
		}
	}
	elseif (($EventDB['PowerPlay']['OneLine']['Min'] > 0 || $EventDB['PowerPlay']['OneLine']['Sec'] > 0) && $Min == 0 && $Sec == 0) {
		$EventDB['PowerPlay']['OneLine']['Min'] = $Min;
		$EventDB['PowerPlay']['OneLine']['Sec'] = $Sec;
		$EventDB['PowerPlay']['OneLine']['Upd'] = 2;
		if ($ini["PrintConsoleInfo"] == "y") {
			echo "[Delete PowerPlay OneLine ] => min:" . $Min . " Sec:"  . $Sec . " Pos:" . $Pos . "\n";
		}
	}
	elseif ($EventDB['PowerPlay']['OneLine']['Min'] != $Min || $EventDB['PowerPlay']['OneLine']['Sec'] != $Sec) {
		$EventDB['PowerPlay']['OneLine']['Min'] = $Min;
		$EventDB['PowerPlay']['OneLine']['Sec'] = $Sec;
		$EventDB['PowerPlay']['OneLine']['Upd'] = 3;
		if ($ini["PrintConsoleInfo"] == "y") {
			echo "[Update PowerPlay OneLine ] => min:" . $Min . " Sec:"  . $Sec . " Pos:" . $Pos . "\n";
		}
	}
}
function EditCurrentEvent($Action = 'None', $Input = []) {
	global $ini;
	global $EventDB;
	if ($Action == 'DelPlayer') {
		$numDelPlayer = $Input['numDelPlayer'];
		$minDelPlayer = $Input['minDelPlayer'];
		$secDelPlayer = $Input['secDelPlayer'];
		if ($Input['DeleteLinePlayer'] == 'Left1') {
			$DeleteLinePlayer = 'Left1';
		}
		elseif ($Input['DeleteLinePlayer'] == 'Left2') {
			$DeleteLinePlayer = 'Left2';
		}
		elseif ($Input['DeleteLinePlayer'] == 'Left3') {
			$DeleteLinePlayer = 'Left3';
		}
		elseif ($Input['DeleteLinePlayer'] == 'Right1') {
			$DeleteLinePlayer = 'Right1';
		}
		elseif ($Input['DeleteLinePlayer'] == 'Right2') {
			$DeleteLinePlayer = 'Right2';
		}
		elseif ($Input['DeleteLinePlayer'] == 'Right3') {
			$DeleteLinePlayer = 'Right3';
		}

		// Добавляем информацию об удаленном игроке
		if ($numDelPlayer > 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] == 0) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Add PowerPlay " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
			}
			$EventDB['DelPlayer'][$DeleteLinePlayer] = [
				'Upd' => 1,
				'Num' => $numDelPlayer,
				'Min' => $minDelPlayer,
				'Sec' => $secDelPlayer
			];
			return 1;
		}
		// Удаляем информацию об удаленном игроке
		elseif ($numDelPlayer == 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != 0) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Remove PowerPlay " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
			}
			$EventDB['DelPlayer'][$DeleteLinePlayer] = [
				'Upd' => 2,
				'Num' => $numDelPlayer,
				'Min' => $minDelPlayer,
				'Sec' => $secDelPlayer
			];
			return 1;
		}
		// Обновляем информацию об удаленном игроке
		elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Min'] != $minDelPlayer || $EventDB['DelPlayer'][$DeleteLinePlayer]['Sec'] != $secDelPlayer) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Update PowerPlay " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
			}
			$EventDB['DelPlayer'][$DeleteLinePlayer] = [
				'Upd' => 3,
				'Num' => $numDelPlayer,
				'Min' => $minDelPlayer,
				'Sec' => $secDelPlayer
			];
			return 1;
		}
	}
	else if ($Action == 'Type') {
		// Флаги таймеров:
		// 1 - игра
		// 2 - перерыв
		// 3 - правый таймаут
		// 4 - левый таймаут

		if (     $Input["Count"] == 'Play')         {$TimerType = 1;}
		else if ($Input["Count"] == 'Pause')        {$TimerType = 2;}
		else if ($Input["Count"] == 'RightTimeOut') {$TimerType = 3;}
		else if ($Input["Count"] == 'LeftTimeOut')  {$TimerType = 4;}

		if ($EventDB['TimerType']['Count'] != $TimerType) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Timer Type] => " . $Input["Count"] . "\n";
			}
			$EventDB['TimerType']['Count'] = $TimerType;
			$EventDB['TimerType']['Upd']   = 1;
			return 1;
		}
	}
	else if ($Action == 'Min') {
		if ($EventDB['TimerMinutes'] != $Input['Count']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Timer Min] => ${Input['Count']}\n";
			}
			$EventDB['TimerMinutes'] = $Input['Count'];
			$EventDB['TimerUpdate'] = 1;
			return 1;
		}
	}
	else if ($Action == 'Sec') {
		if ($EventDB['TimerSecondes'] != $Input['Count']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Timer Sec] => ${Input['Count']}\n";
			}
			$EventDB['TimerSecondes'] = $Input['Count'];
			$EventDB['TimerUpdate'] = 1;
			return 1;
		}
	}
	else if ($Action == 'MSec') {
		if ($EventDB['TimerMinutes'] == 0 && $EventDB['TimerMSecondes'] != $Input['Count']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Timer MSec] => ${Input['Count']}\n";
			}
			$EventDB['TimerMSecondes'] = $Input['Count'];
			$EventDB['TimerUpdate'] = 1;
			return 1;
		}
	}
	else if ($Action == 'Status') {
		// 1 - таймер идет
		// 0 - таймер остановлен
		if ($Input["Status"] == 'Play') {$Status = 1;}
		if ($Input["Status"] == 'Stop') {$Status = 0;}

		if ($EventDB['TimerStatus']['Count'] != $Status) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Timer Status] => " . ($Status == 1 ? "Play" : "Stop") . "\n";
			}
			$EventDB['TimerStatus']['Count'] = $Status;
			$EventDB['TimerStatus']['Upd'] = 1;
			return 1;
		}
	}
	else if ($Action == 'CountPlayerLeft') {
		if ($EventDB['CountPlayerLeft']['Count'] != $Input['Count']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Count Left] => ${Input['Count']}\n";
			}
			$EventDB['CountPlayerLeft']['Count'] = $Input['Count'];
			$EventDB['CountPlayerLeft']['Upd'] = 1;
			return 1;
		}
	}
	else if ($Action == 'CountPlayerRight') {
		if ($EventDB['CountPlayerRight']['Count'] != $Input['Count']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Count Right] => ${Input['Count']}\n";
			}
			$EventDB['CountPlayerRight']['Count'] = $Input['Count'];
			$EventDB['CountPlayerRight']['Upd'] = 1;
			return 1;
		}
	}
	else if ($Action == 'Period') {
		if ($EventDB['Period']['Count'] != $Input['Count']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "[Period] => ${Input['Count']}\n";
			}
			$EventDB['Period']['Count']  = $Input['Count'];
			$EventDB['Period']['Upd']  = 1;
			return 1;
		}
	}

	return 0;
}
function SchedulerEvent() {
	global $ini;
	global $EventDB;
	global $EventsTimer;
	global $EventsType;

	$EventsExecute = [
		"Execute" => 0,
		"Address" => 0
	];
	foreach($EventsTimer as $key => $value) {
		foreach($EventsType as $check) {
			if ($check == "min" && array_key_exists($check, $value) && $value[$check] == $EventDB['TimerMinutes']) {
				$EventsExecute['Execute']++;
				if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events min >>>>>>>>>>>\n";*/}
			}
			if ($check == "sec" && array_key_exists($check, $value) && $value[$check] == $EventDB['TimerSecondes']) {
				$EventsExecute['Execute']++;
				if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events sec >>>>>>>>>>>\n";*/}
			}
			if ($check == "period" && array_key_exists($check, $value)) {
				if (array_key_exists("periodOnlyChange", $value)) {
					if ($EventDB['Period']['Upd'] == 1 && $value[$check] == $EventDB['Period']['Count']) {
						$EventsExecute['Execute']++;
						if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events period1 >>>>>>>>>>>\n";*/}
					}
				}
				else if ($value[$check] == $EventDB['Period']['Count']) {
					$EventsExecute['Execute']++;
					if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events period2 >>>>>>>>>>>\n"; */}
				}
			}
			if ($check == "status" && array_key_exists($check, $value)) {
				if (array_key_exists("statusOnlyChange", $value)) {
					if ($EventDB['TimerStatus']['Upd'] == 1 && $value[$check] == $EventDB['TimerStatus']['Count']) {
						$EventsExecute['Execute']++;
						if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events status >>>>>>>>>>>\n";*/}
					}
				}
				else if ($value[$check] == $EventDB['TimerStatus']['Count']) {
					$EventsExecute['Execute']++;
					if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events status >>>>>>>>>>>\n";*/}
				}
			}
			if ($check == "type" && array_key_exists($check, $value)) {
				if (array_key_exists("typeOnlyChange", $value)) {
					if ($EventDB['TimerType']['Upd'] == 1 && $value[$check] == $EventDB['TimerType']['Count']) {
						$EventsExecute['Execute']++;
						if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events type1 >>>>>>>>>>>\n";*/}
					}
				}
				else if ($value[$check] == $EventDB['TimerType']['Count']) {
					$EventsExecute['Execute']++;
					if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events type2 >>>>>>>>>>>\n";*/}
				}
			}
			if ($EventsExecute['Execute'] >= 1) {
				$EventsExecute['Address'] = $value['address'];
			}
		}
		if ($EventsExecute['Execute'] == $EventsTimer[$key]['COUNT']) {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "Events >>>>>>>>>>>\n";
			}
			$fp = stream_socket_client($ini['COMPANION_ADDRESS']);
			if ($fp) {
				fwrite($fp, "LOCATION " . $EventsExecute['Address'] . " PRESS\n");
				fclose($fp);
			}
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "PRESS ".$EventsExecute['Address']. "  >>>>>>>>>>>\n";
			}
		}
		if ($ini["PrintConsoleInfo"] == "y") {
			//echo "Events  ".$EventsExecute['Execute']. " == " . $EventsTimer[$key]['COUNT'] ."  >>>>>>>>>>>\n";
		}
		$EventsExecute = [
			"Execute" => 0,
			"Address" => 0
		];
	}
	$EventDB['CountPlayerLeft']['Upd'] = 0;
	$EventDB['CountPlayerRight']['Upd'] = 0;
	$EventDB['Period']['Upd'] = 0;
	$EventDB['TimerStatus']['Upd'] = 0;
	$EventDB['TimerUpdate'] = 0;
	$EventDB['TimerType']['Upd'] = 0;
	$EventDB['DelPlayer']['Left1']['Upd'] = 0;
	$EventDB['DelPlayer']['Left2']['Upd'] = 0;
	$EventDB['DelPlayer']['Left3']['Upd'] = 0;
	$EventDB['DelPlayer']['Right1']['Upd'] = 0;
	$EventDB['DelPlayer']['Right2']['Upd'] = 0;
	$EventDB['DelPlayer']['Right3']['Upd'] = 0;
	$EventDB['dAction'] = 'None';
}


function FuncWorks($data, $connection) {
	global $EventDB;
	global $EventDBList;
	global $users;
	global $TimerID;
	global $Start_time;
	global $ini;
	global $EventSelect;

	if (!empty($data)) {
		/**************** Наполняем базу 2 убрали счёт ********************************/
		$ReturnJsonToWeb = [];
		$data = rtrim($data);
		$dataJson = json_decode($data, true);
		// Данные в JSON формате
		if (json_last_error() === JSON_ERROR_NONE && $dataJson['Action'] != "") {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "Action Json: " . $dataJson['Action'] .  "; Board: " . $dataJson['Board'] . "; TeamPosition: " . (empty($dataJson['TeamPosition']) ? "" : $dataJson['TeamPosition']) . ";\n";
				if (empty($dataJson['TeamPosition'])) {echo "TeamPosition указан пустым!\n";}
				elseif ($dataJson['TeamPosition'] != 'Left' && $dataJson['TeamPosition'] != 'Right') {echo "TeamPosition должен быть Right или Left\n";}
			}
			if (empty($dataJson['TeamPosition'])) {$dataJson['TeamPosition'] = 'Left';}
			elseif ($dataJson['TeamPosition'] != 'Left' && $dataJson['TeamPosition'] != 'Right') {$dataJson['TeamPosition'] = 'Left';}

			switch ($dataJson['Action']) {
				// Получить все данные
				case "GetAllDBEvent":
					$ReturnJsonToWeb = [
						"timestamp"         => time(),
						"dAction"           => "ListAllDBEvent",
						"Event"             => ReadDBEvent(($dataJson['Value'] && $dataJson['Value'] != "") ? $dataJson['Value'] : $EventSelect),
						"TeamArray"         => DBTeamsList(),
						"GameNameArray"     => DBGameName(),
						"GamePlaceArray"    => DBGamePlace(),
						"JudgesArray"        => DBJudges(),
						"CommentatorsArray" => DBCommentators()
					];
					break;
				// Получить базу текущего мероприятия
				case "GetCurrentEvent":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListCurrentEvent",
						"Event"     => $EventDB
					];
					break;
				//Получить список мест проведений матчей
				case "GetGamePlaceList":
					$ReturnJsonToWeb = [
						"timestamp"      => time(),
						"dAction"        => "ListGamePlace",
						"GamePlaceArray" => DBGamePlace(),
						"GamePlaceLogo" => ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL'])
					];
					break;
				//Получить список названий матчей
				case "GetGameNameList":
					$ReturnJsonToWeb = [
						"timestamp"      => time(),
						"dAction"        => "ListGameName",
						"GameNameArray"  => DBGameName()
					];
					break;
				//Получить список судейской бригады
				case "GetJudgesList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListJudges",
						"JudgesArray" => DBJudges(),
						"PhotoJudges" => ['PHOTO_JUDGE_DEFAULT']
					];
					break;
				//Получить список комментаторов
				case "GetCommentatorsList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListCommentators",
						"CommentatorsArray" => DBCommentators(),
						"PhotoCommentators" => ['PHOTO_COMMENTATOR_DEFAULT'],
					];
					break;
				//Получить список игроков команды
				case "GetTeamsPlayers":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListTeamsPlayers",
						"ListEvents"    => $EventDBList,
						"EventSelected" => $EventSelect,
						"PlayersLeft"   => $EventDB['PlayerLeft'],
						"PlayersRight"  => $EventDB['PlayerRight']
					];
					break;
				//Получить информацию по команде
				case "GetTeam":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "TeamInfo",
						"Team"      => ReadDBTeam($dataJson['Value']),
						"PhotoPlayers" => ReadPhotoPlayers($ini['DIR_PHOTO_PLAYERS_LOCAL']),
						"LogoTeams"    => ReadLogo($ini['DIR_LOGO_TEAMS_LOCAL'])
					];
					unset($PhotoPlayers);
					break;
				//Получить список команд
				case "GetTeamsList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListTeams",
						"ListTeams" => DBTeamsList()
					];
					break;
				//Получить список мероприятий
				case "GetEventsList":
					$ReturnJsonToWeb = [
						"timestamp"   => time(),
						"dAction"     => "ListEvents",
						"ListEvents"  => $EventDBList,
						"SelectEvent" => $EventDB['UID'],
					];
					break;
				//
				case "ChangeCurrentEvent":
					$TempEventsList = false;
					$TempEventsList = ReadDBEvent($dataJson['Value']);
					if (!is_array($TempEventsList)) {
						echo "В списке мероприятий нет такого мероприятия.\n";
						$ReturnJsonToWeb = false;
						break;
					}
					
					//Записываем данные из памяти в файл
					WriteDBEvent();
					
					//ту мы меняем файл с выбранным мероприятием
					WriteEventSelect($dataJson['Value']);
					
					ReadEventSelect();
					
					//Читаем базу нового мероприятия из файла
					$EventDB = null;
					unset($EventDB);
					ReadDBEvent();
					
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ChangeCurrentEvent"
					];
					break;
				//
				case "SendTimer":
					if ($EventDB['GameOver'] == 1) {
						$EventDB['Timer'] = "99:99";
						break;
					}
					list($minutes, $second) = explode(":", $dataJson['Value']);
					if ($minutes < 1) {$minutes = 0;}
					if ($second < 1) {$second = 0;}
					if ($minutes >= 45) {$minutes = $minutes-45;}
					$minutes = $minutes * 60;
					$Start_time = $minutes + $second;
					$EventDB['Timer'] = $dataJson['Value'];
					break;
				//Текущая погода
				case "SendGameWeather":
					$EventDB['GameWeather'] = $dataJson['Value'];
					break;
				//Текущая температура
				case "SendGameTemperature":
					$EventDB['GameTemperature'] = $dataJson['Value'];
					break;
				//Изменить комментатора
				case "SendCommentator":
					if ($dataJson['Board'] < 1 && $dataJson['Board'] > 9) {
						break;
					}
					$tempCommentators = DBCommentators();
					if (!array_key_exists($dataJson['Value'], $tempCommentators)) {
						echo "Такого комментатора нет!\n";
						break;
					}
					for ($i = 1; $i <= 9; $i++) {
						echo "The number is: $i <br>";
						if ($dataJson['Board'] == $i) {
							$EventDB['Commentators'][$i] = $tempCommentators[$dataJson['Value']];
							$EventDB['Commentators'][$i]['UID'] = $dataJson['Value'];		
						}
					}
					empty($tempCommentators);
					break;
				//Изменить комментатора на мероприятии
				case "ChangeCommentator":
					if ($dataJson['Index'] < 1 && $dataJson['Index'] > 9) {
						break;
					}
					if ($dataJson['UID'] != 0) {
						$tempCommentators = DBCommentators();
						if (!array_key_exists($dataJson['UID'], $tempCommentators)) {
							//echo "Такого комментатора нет!\n";
							empty($tempCommentators);
							break;
						}
					}
					
					if ($EventDB['UID'] == $dataJson['EventUID']) {
						if ($dataJson['Index'] > 1 && $dataJson['UID'] == 0) {
							unset($EventDB['Commentators'][$dataJson['Index']]);
							echo "Комментатор удален в текущей базе\n";
						}
						else {
							$EventDB['Commentators'][$dataJson['Index']] = $tempCommentators[$dataJson['UID']];
							$EventDB['Commentators'][$dataJson['Index']]['UID'] = $dataJson['UID'];
							echo "Комментаторы в текущей базе\n";
						}
					}
					else {
						$EventDBtemp = ReadDBEvent($dataJson['EventUID']);
						if ($dataJson['Index'] > 1 && $dataJson['UID'] == 0) {
							unset($EventDBtemp['Commentators'][$dataJson['Index']]);
							echo "Комментатор удален в базе\n";
						}
						else {
							$EventDBtemp['Commentators'][$dataJson['Index']] = $tempCommentators[$dataJson['UID']];
							$EventDBtemp['Commentators'][$dataJson['Index']]['UID'] = $dataJson['UID'];
							echo "Комментаторы в другой базе\n".$EventDB['UID'] . " - " . $dataJson['EventUID'];
						}
					}
					//DBEvent('ChangeCommentator', $dataJson['EventUID'], $EventDBtemp);
					empty($EventDBtemp);
					empty($tempCommentators);
					break;
				//Изменить судью на поле
				case "ChangeJudge":
					if ($dataJson['Board'] < 1 && $dataJson['Board'] > 4) {
						break;
					}
					$JudgeNameID[1] = 'First';
					$JudgeNameID[2] = 'Second';
					$JudgeNameID[3] = 'Third';
					$JudgeNameID[4] = 'Fourth';

					if ($dataJson['Value'] == 0 && $dataJson['Board'] != 1) {
						$tempJudge[0] = [
							'UID'      => "",
							'Number'   => 0,
							'FullName' => ""
						];
					}
					else {
						$tempJudge = DBJudges();
						if (!array_key_exists($dataJson['Value'], $tempJudge)) {
							echo "Такого судьи нет!\n";
							break;
						}
					}
					

					for ($i = 1; $i <= 4; $i++) {
						echo "The number is: $i <br>";
						if ($dataJson['Board'] == $i) {
							$EventDB['Judge'.$JudgeNameID[$i]] = $tempJudge[$dataJson['Value']];
							$EventDB['Judge'.$JudgeNameID[$i]]['UID'] = $dataJson['Value'];
						}
					}
					empty($tempJudge);
					break;
				// Название матча: Создать, сохранить и удалить
				case "DeleteGameName":
				case "SaveGameName":
				case "CreateGameName":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListGameName",
						"GameNameArray"  => DBGameName($dataJson['Action'], $dataJson['Value'])
					];
					break;
				// Место проведения матча: Создать, сохранить и удалить
				case "DeleteGamePlace":
				case "SaveGamePlace":
				case "CreateGamePlace":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListGamePlace",
						"GamePlaceArray" => DBGamePlace($dataJson['Action'], $dataJson['Value']),
						"GamePlaceLogo"  => ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL'])
					];
					break;
				// Судейская бригада: Создать, сохранить и удалить
				case "DeleteJudge":
				case "SaveJudge":
				case "CreateJudge":
					$ReturnJsonToWeb = [
						"timestamp"   => time(),
						"dAction"     => "ListJudges",
						"JudgesArray" => DBJudges($dataJson['Action'], $dataJson['Value']),
						"PhotoJudges" => ['PHOTO_JUDGE_DEFAULT']
					];
					break;
				// Комментаторы: Создать, сохранить и удалить
				case "DeleteCommentator":
				case "SaveCommentator":
				case "CreateCommentator":
					$ReturnJsonToWeb = [
						"timestamp"   => time(),
						"dAction"     => "ListCommentators",
						"CommentatorsArray" => DBCommentators($dataJson['Action'], $dataJson['Value']),
						"PhotoCommentators" => ['PHOTO_COMMENTATOR_DEFAULT'],
					];
					break;
				// 
				case "DeleteTeamList":
				case "SaveTeamList":
				case "CreateTeamList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListTeams",
						"ListTeams" => DBTeamsList($dataJson['Action'], $dataJson['Value'])
					];
					break;
				//
				case "DeleteEvent":
				case "SaveEventName":
				case "SaveEvent":
				case "CreateEvent":
					DBEvent($dataJson['Action'], $dataJson['EventUID'], $dataJson['Value']);
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListEvents",
						"ListEvents" => $EventDBList,
						"Event" => $EventDB,
					];
					break;
				//
				case "SaveCurrentTeamPlayers":
					if ($EventSelect == $dataJson['Value']['EventUID']) {
						/*echo "EventUID: " . $dataJson['Value']['EventUID'] .  ";\n";*/
						if ($EventDB['Player' . $dataJson['Position']]['UID'] == $dataJson['Value']['TeamUID']) {
							/*echo "TeamUID: " . $dataJson['Value']['TeamUID'] .  ";\n";*/
							$EventDB['Player' . $dataJson['Position']]['Players'] = $dataJson['Value']['TeamPlayers'];
						}
						else {
							echo "Комментатор: Команды не совпадают! \n";
						}
					}
					else {
						echo "Комментатор: Базы не совпадают! \n";
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListTeamsPlayers",
						"ListEvents"    => $EventDBList,
						"EventSelected" => $EventSelect,
						"PlayersLeft"  => $EventDB['PlayerLeft'],
						"PlayersRight" => $EventDB['PlayerRight']
					];
					break;
				// Обновить список игроков левой команды на StreamDeck
				case "UpdateFPL":
					$tempArrayPlayers = [];
					foreach($EventDB['PlayerLeft']['Players'] as $value) {
						if ($value['Enable'] == 1) {
							$tempArrayPlayers[] = $value['Key'];
						}
					}
					sort($tempArrayPlayers);
					$fps = stream_socket_client($ini['COMPANION_ADDRESS']);
					if ($fps) {
						for ($i=1; $i<=24 ; $i++) {
							if (isset($tempArrayPlayers[$i-1])) {
								$tempUIDPlayer = $tempArrayPlayers[$i-1];
							}
							else {
								$tempUIDPlayer = "";
							}
							fwrite($fps, "CUSTOM-VARIABLE TPL" . $i . " SET-VALUE " . $tempUIDPlayer . "\n");
						}
						fclose($fps);
					}
					$tempArrayPlayers = null;
					unset($tempArrayPlayers);
					break;
				// Обновить список игроков правой команды на StreamDeck
				case "UpdateFPR":
					$tempArrayPlayers = [];
					foreach($EventDB['PlayerRight']['Players'] as $value) {
						if ($value['Enable'] == 1) {
							$tempArrayPlayers[] = $value['Key'];
						}
					}
					sort($tempArrayPlayers);
					$fps = stream_socket_client($ini['COMPANION_ADDRESS']);
					if ($fps) {
						for ($i=1; $i<=24 ; $i++) {
							if (isset($tempArrayPlayers[$i-1])) {
								$tempUIDPlayer = $tempArrayPlayers[$i-1];
							}
							else {
								$tempUIDPlayer = "";
							}
							fwrite($fps, "CUSTOM-VARIABLE TPR" . $i . " SET-VALUE " . $tempUIDPlayer . "\n");
						}
						fclose($fps);
					}
					$tempArrayPlayers = null;
					unset($tempArrayPlayers);
					break;
				// Добавить или удалить счет левой команде
				case "CountPlayerLeftPlus":
				case "CountPlayerLeftMinus":
					if ($dataJson['Action'] == "CountPlayerLeftPlus") {
						$EventDB['CountPlayerLeft']['Count']++;
					}
					elseif ($dataJson['Action'] == "CountPlayerLeftMinus") {
						$EventDB['CountPlayerLeft']['Count']--;
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "CountPlayerLeft",
						"Value"     => $EventDB['CountPlayerLeft']['Count'],
					];
					break;
				// Добавить или удалить счет правой команде
				case "CountPlayerPlus":
				case "CountPlayerMinus":
					if ($dataJson['Action'] == "CountPlayerPlus") {
						$EventDB['CountPlayer'.$dataJson['TeamPosition']]['Count']++;
					}
					elseif ($dataJson['Action'] == "CountPlayerMinus") {
						$EventDB['CountPlayer'.$dataJson['TeamPosition']]['Count']--;
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "CountPlayer".$dataJson['TeamPosition'],
						"Value"     => $EventDB['CountPlayer'.$dataJson['TeamPosition']]['Count'],
					];
					break;
				// Добавить или удалить счет правой команде
				case "CountPlayerRightPlus":
				case "CountPlayerRightMinus":
					if ($dataJson['Action'] == "CountPlayerRightPlus") {
						$EventDB['CountPlayerRight']['Count']++;
					}
					elseif ($dataJson['Action'] == "CountPlayerRightMinus") {
						$EventDB['CountPlayerRight']['Count']--;
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "CountPlayerRight",
						"Value"     => $EventDB['CountPlayerRight']['Count'],
					];
					break;
				//
				case "PeriodPlus":
				case "PeriodMinus":
					if ($dataJson['Action'] == "PeriodPlus") {
						$EventDB['Period']['Count']++;
					}
					elseif ($dataJson['Action'] == "PeriodMinus") {
						$EventDB['Period']['Count']--;
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "Period",
						"Value"     => $EventDB['Period']['Count'],
					];
					break;
				//Перезагрузка титров
				case "Reload":
					//echo "Перезагрузить: Титры\n";
					$ReturnJsonToWeb = [
						"timestamp"    => time(),
						"dAction"      => $dataJson['Action'],
						"Board"        => $dataJson['Board']
					];
					break;
				//Очистить Титры
				case "Clear":
					$ReturnJsonToWeb = [
						"timestamp"    => time(),
						"dAction"      => $dataJson['Action'],
						"Board"        => $dataJson['Board']
					];
					break;
				// Показать комментаторов
				case "ShowBoardCommentators":
					$EventDB['BoardCommentatorsStatus'] = 'active';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Commentators" => $EventDB['Commentators']
					];
					break;

				
				// Показать судейский состав
				case "ShowBoardJudges":
					$EventDB['BoardJudgesStatus'] = 'active';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"JudgeFirst"  => $EventDB['JudgeFirst'],
						"JudgeSecond" => $EventDB['JudgeSecond'],
						"JudgeThird"  => $EventDB['JudgeThird'],
						"JudgeFourth" => $EventDB['JudgeFourth'],
					];
					break;
				// Показать информацию по месту проведения матча (Название арены, дата, погода)
				case "ShowBoardWelcome":
					$EventDB['BoardWelcomeStatus'] = 'active';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"ArenaName"   => $EventDB['GamePlace']['FullNameOneLine'],
						"Place"       => $EventDB['GamePlace']['Place'],
						"Weather"     => $EventDB['GameWeather'],
						"Temperature" => $EventDB['GameTemperature']
					];
					break;

				//
				case "ShowBoardCount":
					$EventDB['BoardCountStatus'] = 'active';
					$ReturnJsonToWeb = $EventDB;
					$ReturnJsonToWeb["timestamp"] = time();
					$ReturnJsonToWeb["dAction"]   = $dataJson['Action'];
					$ReturnJsonToWeb["Board"]     = $dataJson['Board'];
					break;

				// Показать стартовую заставку
				case "ShowBoardStart":
				case "UpdateBoardCount":
				case "ShowBoardPause":
					$ReturnJsonToWeb = $EventDB;
					$ReturnJsonToWeb["timestamp"] = time();
					$ReturnJsonToWeb["dAction"]   = $dataJson['Action'];
					$ReturnJsonToWeb["Board"]     = $dataJson['Board'];
					break;
				// Показать Логотип №1
				case "ShowBoardLogo1":
					$EventDB['BoardLogo1Status'] = 'active';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Logo"      => $EventDB['GamePlace']['Logo'],
					];
					break;
				// Показать стартовый состав команды
				case "ShowBoardListPlayer":
					$EventDB['BoardListPlayer' . $dataJson['TeamPosition'] . 'Status'] = 'active';
					$PlayerTemp = [
						"Napadenie" => [],
						"Security"  => [],
						"Vratari"   => []
					];
					if (is_array($EventDB['Player' . $dataJson['TeamPosition']]['Players'])) {
						foreach($EventDB['Player' . $dataJson['TeamPosition']]['Players'] as $value) {
							if ($value['Enable'] == 1) {
								// Нападающий
								if ($value['Role'] == "FF") {
									$PlayerTemp['Napadenie'][] = $value;
								}
								// Защитник
								elseif ($value['Role'] == "DD") {
									$PlayerTemp['Security'][] = $value;
								}
								// Вратарь
								elseif ($value['Role'] == "GT") {
									$PlayerTemp['Vratari'][] = $value;
								}
							}
						}
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Player"    => array_merge($EventDB['Player' . $dataJson['TeamPosition']], $PlayerTemp, ["Players"=> '']),
					];
					unset($PlayerTemp);
					break;

				// Показать первую пятерку команды
				case "ShowBoardStart5Player":
					$EventDB['BoardStart5Player' . $dataJson['TeamPosition'] . 'Status'] = 'active';
					$tempStart5 = [
						"Logo" => $EventDB['Player' . $dataJson['TeamPosition']]['Logo'],
						"FullName" => $EventDB['Player' . $dataJson['TeamPosition']]['FullName'],
						"Place" => $EventDB['Player' . $dataJson['TeamPosition']]['Place'],
						"LF" => [
							'Number'   => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"RF" => [
							'Number'   => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"CF" => [
							'Number'   => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"LD" => [
							'Number'   => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"RD" => [
							'Number'   => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"GT" => [
							'Number'   => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
					];
					if (is_array($EventDB['Player' . $dataJson['TeamPosition']]['Players'])) {
						foreach($EventDB['Player' . $dataJson['TeamPosition']]['Players'] as $key => $value) {
							if ($value['Enable'] == 1 && $value['Start5'] == 1) {
								$positionArray = ['LF', 'RF', 'CF', 'GT', 'LD', 'RD'];
								foreach ($positionArray as $key) {
									if ($value['Position'] == $key) {
										$tempStart5[$key]['Number']   = $value['Key'];
										$tempStart5[$key]['FullName'] = $value['FullName'];
										$tempStart5[$key]['Photo']    = ($value['Photo'] == "" ? "PHOTO_DEFAULT" : $value['Photo']);
									}
								}
							}
						}
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Player"    => $tempStart5
					];
					unset($tempStart5);
					break;

				// Показать первую пятерку команд
				case "ShowBoardStart5LeftAndRight":
					unset($tempStart5LeftAndRight);
					$tempStart5LeftAndRight = [];
					foreach(['Left','Right'] as $TeamPosition) {
						$tempStart5LeftAndRight[$TeamPosition] = [
							"Logo" => $EventDB['Player' . $TeamPosition]['Logo'],
							"FullName" => $EventDB['Player' . $TeamPosition]['FullName'],
							"Place" => $EventDB['Player' . $TeamPosition]['Place'],
							"LF" => [
								'Number'      => '0',
								'FullName' => 'Пусто',
							],
							"RF" => [
								'Number'      => '0',
								'FullName' => 'Пусто',
							],
							"CF" => [
								'Number'      => '0',
								'FullName' => 'Пусто',
							],
							"LD" => [
								'Number'      => '0',
								'FullName' => 'Пусто',
							],
							"RD" => [
								'Number'      => '0',
								'FullName' => 'Пусто',
							],
							"GT" => [
								'Number'      => '0',
								'FullName' => 'Пусто',
							],
						];
						if (is_array($EventDB['Player' . $TeamPosition]['Players'])) {
							foreach($EventDB['Player' . $TeamPosition]['Players'] as $key => $value) {
								if ($value['Enable'] == 1 && $value['Start5'] == 1) {
									$positionArray = ['LF', 'RF', 'CF', 'GT', 'LD', 'RD'];
									foreach ($positionArray as $key) {
										if ($value['Position'] == $key) {
											$tempStart5LeftAndRight[$TeamPosition][$key]['Number']   = $value['Key'];
											$tempStart5LeftAndRight[$TeamPosition][$key]['FullName'] = $value['FullName'];
										}
									}
								}
							}
						}
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Team"    => $tempStart5LeftAndRight
					];
					unset($tempStart5LeftAndRight);
					break;
				// Гол
				case "ShowBoardGoal":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamPosition" => $dataJson['TeamPosition']
					];
					break;
				// Гол
				case "ShowBoardGoal2":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamPosition" => $dataJson['TeamPosition'],
						"Logo"      => $EventDB['Player' . $dataJson['TeamPosition']]['Logo']
					];
					break;
				// Команда без воратаря 6 человек на поле
				case "ShowBoardEmptyNet":
					$EventDB['BoardStatus']['EmptyNet'] = 1;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamPosition" => $dataJson['TeamPosition']
					];
					break;
				// Штрафной бросок (Пенальти)
				case "ShowBoardPenaltyShot":
					$EventDB['BoardStatus']['PenaltyShot'] = 1;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamPosition" => $dataJson['TeamPosition']
					];
					break;
				// Отложеный штраф
				case "ShowBoardDelayedPenalty":
					$EventDB['BoardStatus']['DelayedPenalty'] = 1;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamPosition" => $dataJson['TeamPosition']
					];
					break;
				// Отложеный штраф
				case "ShowBoardPullGoalie":
					$EventDB['BoardStatus']['PullGoalie'] = 1;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamPosition" => $dataJson['TeamPosition']
					];
					break;
				// Показать карточку игрока забившего гол
				case "ShowBoardPlayerGoal":
				// Показать карточку оштрафованного игрока
				case "ShowBoardPlayerEjection":
				// Показать карточку игрока
				case "ShowBoardPlayerTeam":
					echo "Action Value: " . $dataJson['Value'] .  ";\n";
					echo "Action Team position: " . $dataJson['TeamPosition'] .  ";\n";
					if ($dataJson['Value'] > 0 && $dataJson['Value'] < 999) {
						$tempTeamPlayerDB = null;
						foreach ($EventDB['Player'.$dataJson['TeamPosition']]['Players'] as $tempPlayerInfo) {
							if ($tempPlayerInfo["Key"] == $dataJson['Value']) {
								$tempTeamPlayerDB = $tempPlayerInfo;
							}
						}
						if (is_array($tempTeamPlayerDB)) {
							$tempTeamPlayerDB["TeamLogo"] = $EventDB['Player'.$dataJson['TeamPosition']]['Logo'];
							
							if ($dataJson['Action'] == "ShowBoardPlayerTeam") {
								$EventDB['BoardStatus']['PlayerTeam'] = 1;
							}
							else if ($dataJson['Action'] == "ShowBoardPlayerGoal") {
								$EventDB['BoardStatus']['PlayerGoal'] = 1;
							}
							else if ($dataJson['Action'] == "ShowBoardPlayerEjection") {
								$EventDB['BoardStatus']['PlayerEjection'] = 1;
							}
							$ReturnJsonToWeb = [
								"timestamp" => time(),
								"dAction"   => $dataJson['Action'],
								"Board"     => $dataJson['Board'],
								"Value"     => $tempTeamPlayerDB
							];
						}
						$tempTeamPlayerDB = null;
					}
					break;

				// Показать тренера команды
				case "ShowBoardTrainerTeam":
					$EventDB['BoardStatus']['TrainerTeam'] = 1;
					$tempTrainer = [
						"TrainerTitle"    => "Тренер",
						"TrainerFullName" => $EventDB['Player'.$dataJson['TeamPosition']]['Trainer'],
						"TeamLogo"        => $EventDB['Player'.$dataJson['TeamPosition']]['Logo']
					];
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TrainerTitle"    => $tempTrainer['TrainerTitle'],
						"TrainerFullName" => $tempTrainer['TrainerFullName'],
						"TeamLogo"        => $tempTrainer['TeamLogo']
					];
					unset($tempTrainer);
					break;

				// Показать: Конец периода
				case "FixEndPeriod":
					$EventDB['CountFixPeriod'][$EventDB['Period']['Count']] = [
						'Left'  => (int)$EventDB['CountPlayerLeft']['Count'],
						'Right' => (int)$EventDB['CountPlayerRight']['Count']
					];
					break;
				// Показать: Конец матча
				case "GameOver":
					$EventDB['CountFixPeriod'][6] = [
						'Left'  => (int)$EventDB['CountPlayerLeft']['Count'],
						'Right' => (int)$EventDB['CountPlayerRight']['Count'],
						'Period' => $EventDB['Period']['Count']
					];
					//$EventDB['GameOverTemp'] = 1;
					break;
				// Показать: Счёт на конец периода
				case "ShowBoardEndPeriod":
					$EventDB['BoardEndPeriod'] = 'active';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"NumberPeriod" => (int)$dataJson['Value'],
						"CountPeriodLeft"  => (int)$EventDB['CountFixPeriod'][(int)$dataJson['Value']]['Left'],
						"CountPeriodRight" => (int)$EventDB['CountFixPeriod'][(int)$dataJson['Value']]['Right'],
						"PlayerLeft"  => $EventDB['PlayerLeft'],
						"PlayerRight" => $EventDB['PlayerRight']
					];
					break;

				// Показать: Счёт на начало периода
				case "ShowBoardStartPeriod":
					$EventDB['BoardStartPeriod'] = 'active';
					$tempNumberPeriod = (int)$dataJson['Value'];
					if ($tempNumberPeriod > 1) {
						$tempCountPeriodLeft  = (int)$EventDB['CountFixPeriod'][($tempNumberPeriod - 1)]['Left'];
						$tempCountPeriodRight = (int)$EventDB['CountFixPeriod'][($tempNumberPeriod - 1)]['Right'];
					}
					else {
						$tempCountPeriodLeft  = 0;
						$tempCountPeriodRight = 0;
					}
					$ReturnJsonToWeb = [
						"timestamp"        => time(),
						"dAction"          => $dataJson['Action'],
						"Board"            => $dataJson['Board'],
						"NumberPeriod"     => $tempNumberPeriod,
						"CountPeriodLeft"  => $tempCountPeriodLeft,
						"CountPeriodRight" => $tempCountPeriodRight,
						"PlayerLeft"       => $EventDB['PlayerLeft'],
						"PlayerRight"      => $EventDB['PlayerRight']
					];
					$tempNumberPeriod = 1;
					break;
				// Показать раздевалку команды
				case "ShowBoardTeamRoom":
					$EventDB['BoardTeamRoomStatus'] = 'active';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TeamName"  => $EventDB['Player'.$dataJson['TeamPosition']]['FullName'],
						"TeamLogo"  => $EventDB['Player'.$dataJson['TeamPosition']]['Logo'],
					];
					break;
				// Показать: Послематчевые буллиты
				case "ShowBoardShootout_1_5":
				case "ShowBoardShootout_6_6":
				case "ShowBoardShootout_6_7":
					$EventDB['BoardShootout'] = 'active';
					unset($tempShootout);
					$tempShootout = [];
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Shootout"  => $EventDB['Shootout'],
						"Left"      => [
							"Logo"      => $EventDB['PlayerLeft']['Logo'],
							"ShortName" => $EventDB['PlayerLeft']['ShortName']
						],
						"Right"      => [
							"Logo"      => $EventDB['PlayerRight']['Logo'],
							"ShortName" => $EventDB['PlayerRight']['ShortName']
						],
					];
					break;
				// Показать: Послематчевые буллиты
				case "ShowBoardShootoutUpdate":
					$ShootoutNumber = 1;
					$ShootoutCount = 0;
					foreach ($EventDB['Shootout'] as $key => $value) {  
						if (($key < 1 && $key > 15) && $key !="Rezult") {
							unset($EventDB['Shootout'][$key]);
						}
						$ShootoutNumber++;
					}
					$ShootoutNumber = 1;
					for ($i = 1; $i <= 15; $i++) {
						list($ShootoutNumber, $ShootoutCount) = explode('-', $dataJson['Value']);
						$ShootoutNumber = (int)$ShootoutNumber;
						$ShootoutCount = (int)$ShootoutCount;
						if ($ShootoutCount != 1 && $ShootoutCount != 2) {
							$ShootoutCount = 0;
						}
						if ($ShootoutNumber == $i) {
							if (!is_object($EventDB['Shootout'][$i])) {
								#$EventDB['Shootout'][$i]['Left']  = 0;
								#$EventDB['Shootout'][$i]['Right'] = 0;
							}
							$EventDB['Shootout'][$i][$dataJson['TeamPosition']] = $ShootoutCount;
						}
					}
					$ShootoutNumber = 0;
					$ShootoutCount  = 0;
					# Булиты левой команды
					$tempShootoutSummaryLeft  = 0;
					$tempShootoutSummaryRight = 0;
					foreach($EventDB['Shootout'] as $key => $value) {
						#echo $key ."=\n";
						if ($key != "Result" && $value['Left'] == 1) {
							$tempShootoutSummaryLeft = $tempShootoutSummaryLeft+1;
						}
						if ($key != "Result" && $value['Right'] == 1) {
							$tempShootoutSummaryRight = $tempShootoutSummaryRight+1;
						}
						#echo "L=" . $value['Left'] ."\n";
						#echo "R=" . $value['Right'] ."\n";
					}
					$EventDB['Shootout']["Result"]['Left'] = $tempShootoutSummaryLeft;
					$EventDB['Shootout']["Result"]['Right'] = $tempShootoutSummaryRight;
					$tempShootoutSummaryLeft  = 0;
					$tempShootoutSummaryRight = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['Shootout']
					];
					break;

				// Показать: Финальный счет
				case "ShowBoardFinalResultBottom":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"CountLeft"  => $EventDB['CountFixPeriod'][6]['Left'],
						"CountRight" => $EventDB['CountFixPeriod'][6]['Right'],
						"PlayerLeft"  => $EventDB['PlayerLeft'],
						"PlayerRight" => $EventDB['PlayerRight']
					];
					break;
				// Скрыть комментаторов
				case "HideCommentators":
					$EventDB['BoardCommentatorsStatus'] = 'disable';
					$EventDB['BoardStatus']['Commentators'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть судейский состав
				case "HideJudges":
					$EventDB['BoardJudgesStatus'] = 'disable';
					$EventDB['BoardStatus']['Judges'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть стартовый состав команды
				case "HideWelcome":
					$EventDB['BoardWelcomeStatus'] = 'disable';
					$EventDB['BoardStatus']['Welcome'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				//
				case "HideCount":
					$EventDB['BoardCountStatus'] = 'disable';
					$EventDB['BoardStatus']['Count'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['BoardCountStatus'],
					];
					break;
				//
				case "HideGoal2":
					$EventDB['BoardStatus']['Goal2'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть Логотип №1
				case "HideLogo1":
					$EventDB['BoardLogo1Status'] = 'disable';
					$EventDB['BoardStatus']['Logo1'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['BoardLogo1Status'],
					];
					break;
				// Скрыть стартовую заставку
				case "HideStart":
					$EventDB['BoardStartStatus'] = 'disable';
					$EventDB['BoardStatus']['Start'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['BoardStartStatus'],
					];
					break;
				// Скрыть стартовый состав команды
				case "HideListPlayer":
					$EventDB['BoardListPlayerLeftStatus'] = 'disable';
					$EventDB['BoardListPlayerRightStatus'] = 'disable';
					$EventDB['BoardStatus']['ListPlayer'] = 0;
					$EventDB['BoardStatus']['ListPlayer'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть первую пятерку
				case "HideStart5Player":
					$EventDB['BoardStart5PlayerLeftStatus'] = 'disable';
					$EventDB['BoardStart5PlayerRightStatus'] = 'disable';
					$EventDB['BoardStatus']['Start5Player'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть стартовые пятерки команд
				case "HideStart5LeftAndRight":
					$EventDB['BoardStart5LeftAndRightStatus'] = 'disable';
					$EventDB['BoardStatus']['Start5LeftAndRight'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть карточку оштрафованного игрока
				case "HidePlayerEjection":
				// Скрыть карточку игрока забившего гол
				case "HidePlayerGoal":
				// Скрыть карточку игрока
				case "HidePlayerTeam":
					if ($dataJson['Action'] == "HidePlayerTeam") {
						$EventDB['BoardStatus']['PlayerTeam'] = 0;
					}
					else if ($dataJson['Action'] == "HidePlayerGoal") {
						$EventDB['BoardStatus']['PlayerGoal'] = 0;
					}
					else if ($dataJson['Action'] == "HidePlayerEjection") {
						$EventDB['BoardStatus']['PlayerEjection'] = 0;
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть тренера
				case "HideTrainerTeam":
					$EventDB['BoardTrainerTeamStatus'] = 'disable';
					$EventDB['BoardStatus']['TrainerTeam'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть: Счёт на конец периода
				case "HideEndPeriod":
					$EventDB['BoardEndPeriod'] = 'disable';
					$EventDB['BoardStatus']['EndPeriod'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть: Счёт на конец периода
				case "HideStartPeriod":
					$EventDB['BoardStartPeriod'] = 'disable';
					$EventDB['BoardStatus']['StartPeriod'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть:
				case "HideEmptyNet":
				case "HidePenaltyShot":
				case "HideDelayedPenalty":
				case "HidePullGoalie":
					$EventDB['BoardStatus']['StartPeriod'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть: Раздевалка команды
				case "HideTeamRoom":
					$EventDB['BoardTeamRoomStatus'] = 'disable';
					$EventDB['BoardStatus']['TeamRoom'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть: Послематчевые булиты
				case "HideShootout_1_5":
					$EventDB['BoardStatus']['HideShootout_1_5'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				case "HideShootout_6_6":
					$EventDB['BoardStatus']['HideShootout_6_6'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				case "HideShootout_6_7":
					$EventDB['BoardStatus']['HideShootout_6_7'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть: Финальный счёт
				case "HideFinalResultBottom":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Скрыть: Перерыв
				case "HidePause":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				//Перезагрузка конфиг. файла
				case "ReOpenINI":
					// Обрабатываем конфигурационный файл по умолчанию: config-default.ini
					$configDefault = parse_ini_file(__DIR__ . "/config-default.ini");
					// Обрабатываем локальный конфигурационный файл: config-local.ini
					if (file_exists(__DIR__ . "/config-local.ini")) {
						$configLocal = parse_ini_file(__DIR__ . "/config-local.ini");
						$ini = array_merge($configDefault, $configLocal);
						unset($configLocal);
					}
					else {
						$ini = $configDefault;
					}

					unset($configDefault);

					if (!is_array($ini)) {
						print_r($ini);
						echo "Не удалось прочитать конфигурационный файл.\n";
						exit;
					}
					break;
				//
				default:
					if ($ini["PrintConsoleInfo"] == "y") {
						echo "Нет такой команды!\n";
					}
			}
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {
				echo "Action: " . $data .  ";\n";
				echo "Нет такой команды!\n";
			}
		}
		
		if (is_array($ReturnJsonToWeb) && array_key_exists('dAction', $ReturnJsonToWeb)) {
			foreach($users as $connection) {
				$connection['connect']->send(json_encode($ReturnJsonToWeb));
			}
		}
		WriteDBEvent();
		empty($ReturnJsonToWeb);
	}
	return 1;
}

$ws_worker = new Worker("websocket://0.0.0.0:" . $ini["WebSocketPort"]);

// Тут храним пользовательские соединения
$users = [];

$ws_worker->onConnect = function($connection) use (&$ini, &$users) {
	$connection->onWebSocketConnect = function($connection) use (&$users, &$ini) {
		$users[$connection->id]['connect'] = $connection;
		$RemoteIP = (string)$connection->getRemoteIp();
		if (array_key_exists($RemoteIP, $ini)) {
			if ($ini[$RemoteIP] != "") {
				$users[$connection->id]['admin'] = 1;
				$users[$connection->id]['role']  = [];
				foreach(explode(",", $ini[$RemoteIP]) as $val) {
					array_push($users[$connection->id]['role'], trim($val));
				}
				if ($ini["PrintConsoleInfo"] == "y") {echo "Пользователь Администратор\n";}
			}
			else {
				$users[$connection->id]['admin'] = 0;
				if ($ini["PrintConsoleInfo"] == "y") {echo "Пользователь НЕ Администратор\n";}
			}
		}
		else {
			$users[$connection->id]['admin'] = 0;
			if ($ini["PrintConsoleInfo"] == "y") {echo "Пользователь НЕ Администратор\n";}
		}
	};
	if ($ini["PrintConsoleInfo"] == "y") {echo "Клиент подключился, с IP:" . $connection->getRemoteIp() . "\n";}
};

$ws_worker->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$users) {
	if ($users[$connection->id]['admin'] == 1) {
		if (in_array('All', $users[$connection->id]['role'], true)) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "---------------------------------------------------------------------\n";}
			if ($ini["PrintConsoleInfo"] == "y") {echo "У пользователя полные права\n";}
			FuncWorks($data, $connection);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "У пользователя нет прав на выполнение команд!\n";}
		}
	}
};
// it starts once when you start server.php:
$ws_worker->onWorkerStart = function() use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users, &$EventSelect) {
	// Читаем базу данных
	ReadDBEvent();

	if ($ini['HOCKEY_SERVER_TYPE']=="DIAN") {
		//----------------------------------------------------

		echo "Мы пытаемся подключиться к DIAN!\n";
		$connection = new AsyncTcpConnection("tcp://" . $ini['DIAN_HOCKEY_IP'] . ":". $ini['DIAN_HOCKEY_PORT']);
		$connection->onConnect = function($connection) {
			echo "Мы подключились к Hockey!\n";
		};
		$connection->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users, &$RawInputLogFile) {
			$len = strlen($data);
			$Modify = 0;
			for($index = 0; $index < $len; $index++){
				//echo "Counter: {$index}\n";
				$d = unpack("H*data", substr($data, $index, 1));
				// Пакеты статичных строк (10 байт):
				if (hexdec($d["data"]) == 3) {
					$byteArray = unpack("H2Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8/H2Chet9",substr($data, $index+1, 9));
					$command = (int)hexdec($byteArray["Chet1"]);
					// Удаленные игроки
					if (hexdec($byteArray["Chet9"]) == 9) {
						// Строки удалений:
						// 101[ 1 0:00] 107[ 1 0:00]
						// 102[ 2 0:00] 108[ 2 0:00]
						// 103[ 3 0:00] 109[ 3 0:00]
						$numDelPlayer = (int)($byteArray["Chet2"] . $byteArray["Chet3"]);
						$minDelPlayer = (int)($byteArray["Chet4"] . $byteArray["Chet5"]);
						$secDelPlayer = (int)($byteArray["Chet7"] . $byteArray["Chet8"]);
						//echo "Counter: {$command}\n";
						if (($command >= 149 && $command <= 151) || ($command >= 155 && $command <= 157)) {
							if ($command == 149) {
								$DeleteLinePlayer = 'Left1';
							}
							elseif ($command == 150) {
								$DeleteLinePlayer = 'Left2';
							}
							elseif ($command == 151) {
								$DeleteLinePlayer = 'Left3';
							}
							elseif ($command == 155) {
								$DeleteLinePlayer = 'Right1';
							}
							elseif ($command == 156) {
								$DeleteLinePlayer = 'Right2';
							}
							elseif ($command == 157) {
								$DeleteLinePlayer = 'Right3';
							}
							$Modify += EditCurrentEvent('DelPlayer',['DeleteLinePlayer' => $DeleteLinePlayer,'numDelPlayer' => $numDelPlayer, 'minDelPlayer' => $minDelPlayer, 'secDelPlayer' => $secDelPlayer]);
						}
						elseif ($command == 254) {
							//echo "[Chet3.1----------------------------------------] => " . (hexdec($byteArray["Chet1"])) . "\n";
							// 4: Флаги таймеров: 0-ой бит таймер игры идет, 2 - перерыв, 4 - правый таймаут, 8 - левый таймаут, 4 - таймер 24-сек. идет
							// Флаги таймеров:
							// 0 - игра
							// 2 - перерыв
							// 4 - правый таймаут
							// 8 - левый таймаут
							// 4 - таймер 24-сек
							$TimerType = (int)$byteArray["Chet4"];
							if ($TimerType == 0) {
								$Modify += EditCurrentEvent('Type',['Count' => 'Play']);
							}
							else if ($TimerType == 2) {
								$Modify += EditCurrentEvent('Type',['Count' => 'Pause']);
							}
							else if ($TimerType == 4) {
								$Modify += EditCurrentEvent('Type',['Count' => 'RightTimeOut']);
							}
							else if ($TimerType == 8) {
								$Modify += EditCurrentEvent('Type',['Count' => 'LeftTimeOut']);
							}
							unset($TimerType);
							
							//echo "[Chet3.3] => " . hexdec($byteArray["Chet5"]) . "\n";
							//echo "[Chet3.4] => " . hexdec($byteArray["Chet6"]) . "\n";
							//echo "[Chet3.1----------------------------------------] <= \n";
						}
					}
					$index+=9;
				}
				// Пакет таймера (10 байт):
				elseif (hexdec($d["data"]) == 1) {
					$byteArray = unpack("h1Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8/H2Chet9",substr($data, $index+1, 9));
					if (hexdec($byteArray["Chet9"]) == 7) {
						// 1: Таймер игры минуты 1-ая цифра
						// 2: Таймер игры минуты 2-ая цифра
						$Modify += EditCurrentEvent('Min',['Count' => (int)((($byteArray["Chet1"] == "c" || $byteArray["Chet1"] == "e") ? "" : $byteArray["Chet1"]) . ($byteArray["Chet2"] == "c" ? 0 : $byteArray["Chet2"]))]);
						
						// 3: Таймер игры секунды 1-ая цифра
						// 4: Таймер игры секунды 2-ая цифра
						$Modify += EditCurrentEvent('Sec',['Count' => (int)($byteArray["Chet3"] . $byteArray["Chet4"])]);

						// 5: Таймер игры десятые
						//echo "[Timer dec] => " . ($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . "\n";
						$Modify += EditCurrentEvent('MSec',['Count' => (int)($byteArray["Chet5"])]);

						// 6: 1 (таймер игры идет) или 2 (таймер игры не идет)
						if ((int)$byteArray["Chet6"] == 1) {
							$Modify += EditCurrentEvent('Status',['Status' => 'Play']);
							//if ($ini["PrintConsoleInfo"] == "y") { echo "Play ${Modify} >>>>>>>>>>>\n";}
						}
						else {
							$Modify += EditCurrentEvent('Status',['Status' => 'Stop']);
							//if ($ini["PrintConsoleInfo"] == "y") { echo "Stop ${Modify} >>>>>>>>>>>\n";}
						}

						// 8: Флаги сирен: 0-ой бит основная, 1 - команд, 2 - судей, 4 - 24-сек.
						//echo "[Alarm] => " . $byteArray["Chet8"] . "\n";
					}
					$index+=9;
				}
				// Пакет счета (11 байт):
				elseif (hexdec($d["data"]) == 2) {
					$byteArray = unpack("h1Chet1/h1Chet2/h1Chet3/h1Period/h1Chet5/h1Chet6/h1Chet7/h1Chet8/h1Chet9/H2Chet10",substr($data, $index+1, 10));
					if (hexdec($byteArray["Chet10"]) == 8) {
						// 1: Счет левой команды 1-ая цифра
						// 2: Счет левой команды 2-ая цифра
						// 3: Счет левой команды 3-ая цифра
						$CountPlayerLeft = (int)(($byteArray["Chet1"] == "c" ? "" : $byteArray["Chet1"]) . ($byteArray["Chet2"] == "c" ? "" : $byteArray["Chet2"]) . $byteArray["Chet3"]);
						$Modify += EditCurrentEvent('CountPlayerLeft',['Count' => $CountPlayerLeft]);
						unset($CountPlayerLeft);
						// 5: Счет левой команды 1-ая цифра
						// 6: Счет левой команды 2-ая цифра
						// 7: Счет левой команды 3-ая цифра
						$CountPlayerRight = (int)(($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . ($byteArray["Chet6"] == "c" ? "" : $byteArray["Chet6"]) . $byteArray["Chet7"]);
						$Modify += EditCurrentEvent('CountPlayerRight',['Count' => $CountPlayerRight]);
						unset($CountPlayerRight);
						// 4: Период
						$Modify += EditCurrentEvent('Period',['Count' => (int)$byteArray["Period"]]);
						// 8: Фолы левой команды
						//echo "[Foll left] => " . (hexdec($byteArray["Chet8"])-12) . "\n";
						// 9: Фолы правой команды
						//echo "[Foll Right] => " . (hexdec($byteArray["Chet9"])-12) . "\n";
					}
					$index+=10;
					
				}
				// Пакет названия левой команды: 4 ... 10
				elseif (hexdec($d["data"]) == 4) {
					if ($ini["PrintConsoleInfo"] == "y") {
						#echo "4-----------------\n";
					}
				}
				// Пакет названия правой команды: 5 ... 11
				elseif (hexdec($d["data"]) == 5) {
					if ($ini["PrintConsoleInfo"] == "y") {
						#echo "5-----------------\n";
					}
				}
				// Пакет бегущей строки: 6 ... 12
				elseif (hexdec($d["data"]) == 6) {
					if ($ini["PrintConsoleInfo"] == "y") {
						echo "6-----------------\n";
					}
					$byteArray = unpack("h1Chet1/h1Chet2/h1Chet3/h1Chet3/h1Chet5/c1Chet6/h1Chet7/h1Chet8/h1Chet9/H2Chet10",substr($data, $index+1, 11));
					echo "=" . hexdec($byteArray["Chet1"]) . "=\n";#1
					echo "=" . hexdec($byteArray["Chet2"]) . "=\n";#8
					echo "=" . hexdec($byteArray["Chet3"]) . "=\n";#12
					echo "=" . $byteArray["Chet4"] . "=\n";#
					echo "=" . $byteArray["Chet5"] . "=\n";#
					echo "=" . (int)$byteArray["Chet6"] . "=\n";
					echo "=" . hexdec($byteArray["Chet7"]) . "=\n";
					echo "=" . hexdec($byteArray["Chet8"]) . "=\n";
					echo "=" . hexdec($byteArray["Chet9"]) . "=\n";
					echo "=" . hexdec($byteArray["Chet10"]) . "=\n";
					$index+=11;
				}
				if (hexdec($d["data"]) == 14) {
					if ($Modify >= 1) {
						PowerPlay();
						$ReturnData = [
							'dAction' => 'Update',
							'Count' => [
								'Left'  => $EventDB['CountPlayerLeft']['Count'],
								'Right' => $EventDB['CountPlayerRight']['Count'],
							],
							'Period' => $EventDB['Period']['Count'],
							'Timer' => [
								'Status' => $EventDB['TimerStatus']['Count'],
								'Type' => $EventDB['TimerType']['Count'],
								'Min'  => $EventDB['TimerMinutes'],
								'Sec'  => $EventDB['TimerSecondes'],
								'MSec' => $EventDB['TimerMSecondes'],
							],
							'DelPlayer' => [
								'Left'  => [

								],
								'Right' => [
									'l1' => [
										'Num' => $EventDB['DelPlayer']['Right1']['Num'],
										'Min' => $EventDB['DelPlayer']['Right1']['Min'],
										'Sec' => $EventDB['DelPlayer']['Right1']['Sec'],
									],
									'l2' => [
										'Num' => $EventDB['DelPlayer']['Right2']['Num'],
										'Min' => $EventDB['DelPlayer']['Right2']['Min'],
										'Sec' => $EventDB['DelPlayer']['Right2']['Sec'],
									],
									'l3' => [
										'Num' => $EventDB['DelPlayer']['Right3']['Num'],
										'Min' => $EventDB['DelPlayer']['Right3']['Min'],
										'Sec' => $EventDB['DelPlayer']['Right3']['Sec'],
									]
								]
							],
							'PowerPlay' => [
								'Left' => [
									'Line1'  => [
										'Num' => $EventDB['DelPlayer']['Left1']['Num'],
										'Min' => $EventDB['DelPlayer']['Left1']['Min'],
										'Sec' => $EventDB['DelPlayer']['Left1']['Sec'],
									],
									'Line2'  => [
										'Num' => $EventDB['DelPlayer']['Left2']['Num'],
										'Min' => $EventDB['DelPlayer']['Left2']['Min'],
										'Sec' => $EventDB['DelPlayer']['Left2']['Sec'],
									],
									'Line3'  => [
										'Num' => $EventDB['DelPlayer']['Left3']['Num'],
										'Min' => $EventDB['DelPlayer']['Left3']['Min'],
										'Sec' => $EventDB['DelPlayer']['Left3']['Sec'],
									],
									'Count' => $EventDB['PowerPlay']['Left']['Count'],
									'Min'   => $EventDB['PowerPlay']['Left']['Min'],
									'Sec'   => $EventDB['PowerPlay']['Left']['Sec']
								],
								'Right' => [
									'Line1' => [
										'Num' => $EventDB['DelPlayer']['Right1']['Num'],
										'Min' => $EventDB['DelPlayer']['Right1']['Min'],
										'Sec' => $EventDB['DelPlayer']['Right1']['Sec'],
									],
									'Line2' => [
										'Num' => $EventDB['DelPlayer']['Right2']['Num'],
										'Min' => $EventDB['DelPlayer']['Right2']['Min'],
										'Sec' => $EventDB['DelPlayer']['Right2']['Sec'],
									],
									'Line3' => [
										'Num' => $EventDB['DelPlayer']['Right3']['Num'],
										'Min' => $EventDB['DelPlayer']['Right3']['Min'],
										'Sec' => $EventDB['DelPlayer']['Right3']['Sec'],
									],
									'Count' => $EventDB['PowerPlay']['Right']['Count'],
									'Min'   => $EventDB['PowerPlay']['Right']['Min'],
									'Sec'   => $EventDB['PowerPlay']['Right']['Sec']
								],
								'Position' => $EventDB['PowerPlay']['OneLine']['Position'], // Left, Right, Both 
								'Min' => $EventDB['PowerPlay']['OneLine']['Min'],
								'Sec' => $EventDB['PowerPlay']['OneLine']['Sec']
							],
						];
						foreach($users as $connectionUsers) {
							$connectionUsers['connect']->send(json_encode($ReturnData, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
						}
						unset($ReturnData);
						SchedulerEvent();
						
						if ($ini["PrintConsoleInfo"] == "y") {
							//echo "Данные отправлены>>>>>>>>>>>\n";
						}
					}
				}
			}
			$connection->send("\x15\x30\x30");
		};
		$connection->onClose = function($connection) use (&$ini) {
			if ($ini["PrintConsoleInfo"] == "y") { echo "Отключились от хоккейного сервера управления. Подключаемся повторно через 5 секунд.\n"; }
			// Подключаемся повторно через 5 секунд
			$connection->reConnect(5);
		};
		$connection->connect();
	}
	else if ($ini['HOCKEY_SERVER_TYPE']=="PALAMI") {
		//----------------------------------------------------

		echo "Мы пытаемся подключиться к Hockey0!\n";
		$connection = new AsyncTcpConnection("tcp://" . $ini['PALAMI_HOCKEY_IP'] . ":". $ini['PALAMI_HOCKEY_PORT']);
		$connection->onConnect = function($connection) {
			$connection->send("Tablo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n\n");
			if ($ini["PrintConsoleInfo"] == "y") { echo "Мы подключились к Hockey1!\n";}
		};
		$connection->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users, &$RawInputLogFile) {
			$Modify = 0;
			if (!empty($data)) {
				$data = rtrim($data);
				$dataJson = json_decode($data, true);
				if (json_last_error() === JSON_ERROR_NONE) {
					// Данные в JSON формате
					if ($dataJson['Action'] == 'UpdateExternal') {
						echo "Action Json: " . $dataJson['Action'] .  ";\n";
						// Счет левой команды
						$Modify += EditCurrentEvent('CountPlayerLeft',['Count' => $dataJson['SchetLeft']]);
						//--------------------------------
						// Счет левой команды
						$Modify += EditCurrentEvent('CountPlayerRight',['Count' => $dataJson['SchetRight']]);

						//---------------------------------
						// Период
						if ($dataJson['Period'] == 0) {
							//$Period = 0;
							$Modify += EditCurrentEvent('Period',['Count' => 0]);
						}
						elseif ($dataJson['Period'] == 1 || $dataJson['Period'] == 2) {
							//$Period = 1;
							$Modify += EditCurrentEvent('Period',['Count' => 1]);
						}
						elseif ($dataJson['Period'] == 3 || $dataJson['Period'] == 4) {
							//$Period = 2;
							$Modify += EditCurrentEvent('Period',['Count' => 2]);
						}
						elseif ($dataJson['Period'] == 5 || $dataJson['Period'] == 6) {
							//$Period = 3;
							$Modify += EditCurrentEvent('Period',['Count' => 3]);
						}
						elseif ($dataJson['Period'] == 7) {
							//$Period = 4;
							$Modify += EditCurrentEvent('Period',['Count' => 4]);
						}
						//---------------------------------
						// Период
						if ($dataJson['Period'] == 1 || $dataJson['Period'] == 3 || $dataJson['Period'] == 5 || $dataJson['Period'] == 7) {
							//$TimerType = 0;
							$Modify += EditCurrentEvent('Type',['Count' => 'Play']);
						}
						elseif ($dataJson['Period'] == 0 || $dataJson['Period'] == 2 || $dataJson['Period'] == 4 || $dataJson['Period'] == 6) {
							//$TimerType = 2;
							$Modify += EditCurrentEvent('Type',['Count' => 'Pause']);
						}
						if ($dataJson['TimerStatus'] == 2) {
							//$TimerType = 4;
							$Modify += EditCurrentEvent('Type',['Count' => 'RightTimeOut']);
						}
						// 4: Флаги таймеров: 0-ой бит таймер игры идет, 2 - перерыв, 4 - правый таймаут, 8 - левый таймаут, 4 - таймер 24-сек. идет

						$Modify += EditCurrentEvent('Min',['Count' => $dataJson['Min']]);
						$Modify += EditCurrentEvent('Sec',['Count' => $dataJson['Sec']]);

						if ($Modify === 1) {
							foreach($users as $connectionUsers) {
								$EventDB['dAction'] = 'Update';
								$connectionUsers['connect']->send(json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
							}

							SchedulerEvent();

							if ($ini["PrintConsoleInfo"] == "y") {
								//echo "Данные отправлены>>>>>>>>>>>\n";
							}
						}
					}
				}
			}
		};
		$connection->onClose = function($connection) use (&$ini) {
			if ($ini["PrintConsoleInfo"] == "y") { echo "Отключились от хоккейного сервера управления. Подключаемся повторно через 5 секунд.\n"; }
			// Подключаемся повторно через 5 секунд
			$connection->reConnect(5);
		};
		$connection->connect();
	}
	else {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Тип табло нераспознан или выбран ручной режим.\n";}
	}
};


$ws_worker->onClose = function($connection) use(&$users, &$ini) {
	// unset parameter when user is disconnected
	unset($users[$connection->id]);
	if ($ini["PrintConsoleInfo"] == "y") {echo "Клиент отключился, с IP:" . $connection->getRemoteIp() . "\n";}
};

// Run worker
Worker::runAll();
