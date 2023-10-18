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
$GameNameArray   = [];
$GamePlaceArray  = [];
$EventSelect     = "";
$Start_time      = 1;
// Планировщик
$EventsTimer     = [];
$EventsType = ['min','sec','period','status','type'];
//Структура базы мероприятия
$EventDB         = [];
$EventDBDefault = [
	'DBVersion'   => 12,
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
	'GameTemperature'    => '',
	'GameWeather'    => '',
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
	'TimerSecondes' => (string)'00',
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
	'CommentatorFirst' => [
		'UID'      => "",
		'FullName' => ""
	],
	'CommentatorSecond' => [
		'UID'      => "",
		'FullName' => ""
	],
	'DelPlayer' => [
		'Left1'  => [
			'Upd' => 0,
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
function ReadEventSelect ()  {
	global $ini;
	global $EventSelect;
	$EventSelectDefault = [
		"UID"      => "",
		"FileName" => "DEFAULT.json",
		"GameDate" => "01.01.3000",
		"GameTime" => "00:00",
		"PlayerLeft" => [
			"FullName" => "DEFAULT",
			"Logo"     => "LOGO_Default"
		],
		"PlayerRight" => [
			"FullName" => "DEFAULT",
			"Logo"     => "LOGO_Default"
		]
	];

	if (!file_exists(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL'])) {
		$DBFile = fopen(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL'], 'w');
		fwrite($DBFile, json_encode($EventSelectDefault, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
		fclose($DBFile);
	}
	// Обрабатываем базу данных
	$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL']) , true );
	if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем базу c выбранным мероприятием\n";}
	if (is_array($tempEventDB) && array_key_exists('FileName', $tempEventDB)) {
		$EventSelect = $tempEventDB;
		if ($ini["PrintConsoleInfo"] == "y") {echo "База актуальной версии1!\n";}
	}
	else {
		$EventSelect['FileName'] = 'DEFAULT.json';
	}
	unset($tempEventDB);
}
function WriteEventSelect ($EventUID  = false, $FileName = "")  {
	global $ini;

	$tempEventDB = ReadDBEvent($EventUID);
	$EventSelectDefault = [
		"UID"      => $EventUID,
		"FileName" => $FileName,
		"GameDate" => $tempEventDB['GameDate'],
		"GameTime" => $tempEventDB['GameTime'],
		"GameOver" => $tempEventDB['GameOver'],
		"PlayerLeft" => [
			"FullName" => $tempEventDB['PlayerLeft']['FullName'],
			"Logo"     => $tempEventDB['PlayerLeft']['Logo']
		],
		"PlayerRight" => [
			"FullName" => $tempEventDB['PlayerRight']['FullName'],
			"Logo"     => $tempEventDB['PlayerRight']['Logo']
		]
	];

	$DBFile = fopen(__DIR__ . '/' . $ini['DB_EVENT_SELECT_LOCAL'], 'w');
	fwrite($DBFile, json_encode($EventSelectDefault, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
	fclose($DBFile);
	if ($ini["PrintConsoleInfo"] == "y") {echo "База актуальной версии1!\n";}
	unset($tempEventDB);
}
//Читаем файл с настройками
ReadConfigFile();
//События, действия
ReadTriggerFile();
//Читаем файл с данными о выбранном мероприятии
ReadEventSelect();

function ReadDBEvent($EventUID  = false) {
	global $ini;
	global $EventSelect;
	global $EventDB;
	global $EventDBDefault;
	$FileName = "Empty";
	if ($EventUID) {
		$tempDBEventsList = ReadDBEventsList();
		if (array_key_exists($EventUID, $tempDBEventsList) && $tempDBEventsList[$EventUID]) {
			$FileName = $tempDBEventsList[$EventUID]['File'];
			
		}
		unset($tempDBEventsList);
	}
	else {
		$FileName = $EventSelect['FileName'];
	}
	// Обрабатываем базу данных
	if (file_exists(__DIR__ . '/DB/Events/' . $FileName . '.json')) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/DB/Events/' . $FileName . '.json') , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем базу \n";}
		if (!$EventUID && is_array($tempEventDB) && array_key_exists('DBVersion',$tempEventDB)) {
			if ($tempEventDB['DBVersion'] == $EventDBDefault['DBVersion']) {
				if ($ini["PrintConsoleInfo"] == "y") {echo "База актуальной версии!\n";}
				$EventDB = $tempEventDB;
			}
			else {
				if ($ini["PrintConsoleInfo"] == "y") {echo "База старой версии!!!!\n";}
				return false;
			}
			return $tempEventDB;
		}
		elseif ($EventUID && is_array($tempEventDB) && array_key_exists('DBVersion',$tempEventDB)) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка1!!!!\n";}
			return $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка2!!!!\n";}
			return false;
		}
	}
	else {
		if (!$EventUID) {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Файла с базой мероприятия нет. Загружаем базу по умолчанию!!!!\n";}
			$EventDB = $EventDBDefault;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Файла с базой мероприятия нет.!!!!\n";}
			return false;
		}
	}
}
function WriteDBEvent($EventUID  = false,$EventData  = []) {
	global $ini;
	global $EventSelect;
	global $EventDB;
	$FileName = "Empty";
	if ($EventDB['GameOverTemp'] == 1 && $EventDB['GameOver'] == 1) {
		echo "--------------\n";
		echo "Мероприятие завершено, вносить изменения нельзя!!!\n";
		echo "--------------\n";
		return false;
	}
	if ($EventUID) {
		$tempDBEventsList = ReadDBEventsList();
		if (array_key_exists($EventUID, $tempDBEventsList) && $tempDBEventsList[$EventUID]['File']) {
			$FileName = $tempDBEventsList[$EventUID]['File'];
		}
	}
	else {
		$FileName = $EventSelect['FileName'];
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
/*function ReadDBTeamPlayers ($TeamUID) {
	global $ini;
	// Обрабатываем локальный файл c хоккейными командами.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл хоккейных команд\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			return $tempEventDB[$TeamUID];
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с хоккейными командами!!!\n";}
		}
		unset($tempEventDB);
	}
}*/
/*function ReadDBTeams () {
	global $ini;
	global $TeamsArray;
	$TeamsArray=[];
	// Обрабатываем файл c хоккейными командами по умолчанию.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_DEFAULT'])) {
		$TeamsArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_DEFAULT']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл хоккейных команд по умолчанию\n";}
		if ($TeamsArray && is_array($TeamsArray)) { 
			
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл с хоккейными командами!!!\n";}
		}
	}
	else {
		echo "Не удалось прочитать файл с хоккейными командами.\n";
		exit;
	}
	// Обрабатываем локальный файл c хоккейными командами.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл хоккейных команд\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			$TeamsArray = $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с хоккейными командами!!!\n";}
		}
		unset($tempEventDB);
	}
	$arraySort = [];
	foreach ($TeamsArray as $key => $row) {
		$arraySort[$key] = $row['FullName'];
	}
	array_multisort($arraySort, SORT_ASC, $TeamsArray);
	$arraySort = null;
	unset($arraySort);
}*/
/*function WriteDBTeams ($action, $Json) {
	global $ini;
	global $TeamsArray;
	// Обрабатываем локальный файл c хоккейными командами.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл хоккейных команд\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			if ($action == 'DeleteTeam') {
				unset($tempEventDB[$Json]);
			}
			elseif ($action == 'CreateTeam') {
				$tempEventDB[base64_encode(random_bytes(8))] = [
					"ShortName" => "Новая запись",
					"FullName" => "Новая запись",
					"Desc" => "Новая запись",
					"Logo" => "LOGO_DEFAULT",
					"Place" => "",
					"Boss" => "",
					"Trainer" => "",
					"Administrator" => "",
					"MiddleLet" => "",
					"Players" => [
						[
							"PID" => 0,
							"Enable" => 0,
							"Starting5Enable" => 0,
							"Position" => "",
							"Role" => "",
							"Photo" => "PHOTO_DEFAULT",
							"FullName" => ""
						]
					]
				];
			}
			elseif ($action == 'SaveTeam') {
				$tempEventDB[$Json['Key']] = [
					"ShortName" => $Json['ShortName'],
					"FullName" => $Json['FullName'],
					"Desc" => $Json['Desc'],
					"Logo" => $Json['Logo'],
					"Place" => $Json['Place'],
					"Boss" => $Json['Boss'],
					"Trainer" => $Json['Trainer'],
					"Administrator" => $Json['Administrator'],
					"MiddleLet" => $Json['MiddleLet']
				];
			}
			elseif ($action == 'SaveTeamPlayers') {
				$tempEventDB[$Json['Key']]["Players"] = $Json['Players'];
			}
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'], 'w');
			fwrite($WriteFile, json_encode($tempEventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
			$TeamsArray = $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с хоккейными командами!!!\n";}
		}
		unset($tempEventDB);
	}
}*/
function ReadDBTeamsList () {
	global $ini;
	$TeamsArrayList[0] = [
		"Name" => "Команд нет",
		"Desc" => "",
		"File" => false
	];
	// Обрабатываем файл cо списком мероприятий.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAMS_LIST'])) {
		$tempTeamsArrayList = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAMS_LIST']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл cо списком команд\n";}
		if (!is_array($tempTeamsArrayList)) { 
			if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка базы списка команд!!!\n";}
		}
		else {
			$TeamsArrayList = $tempTeamsArrayList;
		}
		unset($tempTeamsArrayList);
	}
	else {
		echo "Не удалось прочитать файл cо списком команд.\n";
	}
	$arraySort = [];
	foreach ($TeamsArrayList as $key => $row) {
		$arraySort[$key] = $row['Name'];
	}
	array_multisort($arraySort, SORT_ASC, $TeamsArrayList);
	$arraySort = null;
	unset($arraySort);
	return $TeamsArrayList;
}
function WriteDBTeamsList ($action, $Json) {
	global $ini;
	$tempTeamsDBList[0] = [
		"Name" => "Мероприятий нет",
		"Desc" => "",
		"File" => null
	];
	// Обрабатываем локальный конфигурационный файл c названием игр.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAMS_LIST'])) {
		$tempTeamsDBList = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAMS_LIST']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл cо списком команд\n";}
		
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
		else if ($tempTeamsDBList && is_array($tempTeamsDBList)) {
			if ($action == 'DeleteTeamList') {
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
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_TEAMS_LIST'], 'w');
			fwrite($WriteFile, json_encode($tempTeamsDBList, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл со списком команд!!!\n";}
		}
		$arraySort = [];
		foreach ($tempTeamsDBList as $key => $row) {
			$arraySort[$key] = $row['FullName'];
		}
		array_multisort($arraySort, SORT_ASC, $tempTeamsDBList);
		$arraySort = null;
		unset($arraySort);
		return $tempTeamsDBList;
	}
	else {
		return null;
	}
}
function ReadDBTeam($TeamUID  = false) {
	global $ini;
	$FileName = "Empty";
	if ($TeamUID) {
		$tempDBTeamsList = ReadDBTeamsList();
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
function ReadDBGameName () {
	global $ini;
	global $GameNameArray;
	// Обрабатываем конфигурационный файл c названием игр по умолчанию.
	if (file_exists(__DIR__ . '/' . $ini['DB_GAME_NAME_DEFAULT'])) {
		$GameNameArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_NAME_DEFAULT']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл c названием игр по умолчанию\n";}
		if ($GameNameArray && is_array($GameNameArray)) { /* тут пусто  */ }
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл с названием игр!!!\n";}
		}
	}
	else {
		echo "Не удалось прочитать файл с названием игр.\n";
		exit;
	}
	// Обрабатываем локальный конфигурационный файл c названием игр.
	if (file_exists(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл c названием игр\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			$GameNameArray = $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с названием игр!!!\n";}
		}
		unset($tempEventDB);
	}
	$arraySort = [];
	foreach ($GameNameArray as $key => $row) {
		$arraySort[$key] = $row['ShortName'];
	}
	array_multisort($arraySort, SORT_ASC, $GameNameArray);
	$arraySort = null;
	unset($arraySort);
}
function WriteDBGameName ($action, $Json) {
	global $ini;
	global $GameNameArray;
	// Обрабатываем локальный конфигурационный файл c названием игр.
	if (file_exists(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл c названием игр\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			if ($action == 'DeleteGameName') {
				unset($tempEventDB[$Json]);
			}
			else if ($action == 'CreateGameName') {
				$tempEventDB[base64_encode(random_bytes(8))] = [
					"ShortName" => "Новая запись",
					"FullName" => "Новая запись",
					"Desc" => "Новая запись"
				];
			}
			else if ($action == 'SaveGameName') {
				$tempEventDB[$Json['Key']] = [
					"ShortName" => $Json['ShortName'],
					"FullName" => $Json['FullName'],
					"Desc" => $Json['Desc']
				];
			}
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_GAME_NAME_LOCAL'], 'w');
			fwrite($WriteFile, json_encode($tempEventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
			$GameNameArray = $tempEventDB;
			$arraySort = [];
			foreach ($GameNameArray as $key => $row) {
				$arraySort[$key] = $row['ShortName'];
			}
			array_multisort($arraySort, SORT_ASC, $GameNameArray);
			$arraySort = null;
			unset($arraySort);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с названием игр!!!\n";}
		}
		unset($tempEventDB);
	}
}
function ReadDBGamePlace () {
	global $ini;
	global $GamePlaceArray;
	// Обрабатываем конфигурационный файл с местами проведения хоккейных матчей по умолчанию.
	if (file_exists(__DIR__ . '/' . $ini['DB_GAME_PLACE_DEFAULT'])) {
		$GamePlaceArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_PLACE_DEFAULT']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл с местами проведения хоккейных матчей по умолчанию\n";}
		if ($GamePlaceArray && is_array($GamePlaceArray)) { /* тут пусто  */ }
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать файл с местами проведения хоккейных матчей!!!\n";}
		}
	}
	else {
		echo "Не удалось прочитать файл с местами проведения хоккейных матчей.\n";
		exit;
	}
	// Обрабатываем локальный файл с местами проведения хоккейных матчей
	if (file_exists(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл с местами проведения хоккейных матчей\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			$GamePlaceArray = $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с местами проведения хоккейных матчей!!!\n";}
		}
		unset($tempEventDB);
	}
	$arraySort = [];
	foreach ($GamePlaceArray as $key => $row) {
		$arraySort[$key] = $row['ShortName'];
	}
	array_multisort($arraySort, SORT_ASC, $GamePlaceArray);
	$arraySort = null;
	unset($arraySort);
}
function WriteDBGamePlace ($action, $Json) {
	global $ini;
	global $GamePlaceArray;
	// Обрабатываем локальный конфигурационный файл с местами проведения хоккейных матчей.
	if (file_exists(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл с местами проведения хоккейных матчей\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			if ($action == 'DeleteGamePlace') {
				unset($tempEventDB[$Json]);
			}
			else if ($action == 'CreateGamePlace') {
				$tempEventDB[base64_encode(random_bytes(8))] = [
					'ShortName' => 'АНовая запись',
					'FullName' => 'Новая запись',
					'Place' => '',
					'Desc' => 'Новая запись',
					'Logo' => 'Default.png'
				];
			}
			else if ($action == 'SaveGamePlace') {
				$tempEventDB[$Json['Key']] = [
					"ShortName" => $Json['ShortName'],
					"FullName"  => $Json['FullName'],
					"Place"     => $Json['Place'],
					"Desc"      => $Json['Desc'],
					"Logo"      => $Json['Logo']
				];
			}
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_GAME_PLACE_LOCAL'], 'w');
			fwrite($WriteFile, json_encode($tempEventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
			$GamePlaceArray = $tempEventDB;
			$arraySort = [];
			foreach ($GamePlaceArray as $key => $row) {
				$arraySort[$key] = $row['ShortName'];
			}
			array_multisort($arraySort, SORT_ASC, $GamePlaceArray);
			$arraySort = null;
			unset($arraySort);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с названием игр!!!\n";}
		}
		unset($tempEventDB);
	}
}
function ReadDBJudges () {
	global $ini;
	// Обрабатываем файл cо списком судей.
	if (file_exists(__DIR__ . '/' . $ini['DB_JUDGES'])) {
		$tempJudgesArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_JUDGES']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл cо списком судей\n";}
		if (!is_array($tempJudgesArray)) { 
			if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка базы списка судей!!!\n";}
		}
		else {
			$arraySort = [];
			foreach ($tempJudgesArray as $key => $row) {
				$arraySort[$key] = $row['ShortName'];
			}
			array_multisort($arraySort, SORT_ASC, $tempJudgesArray);
			$arraySort = null;
			unset($arraySort);
			return $tempJudgesArray;
		}
	}
	else {
		echo "Не удалось прочитать файл cо списком судей.\n";
	}
	return null;
}
function WriteDBJudges ($action, $Json) {
	global $ini;
	// Обрабатываем локальный конфигурационный файл c судьями.
	if (file_exists(__DIR__ . '/' . $ini['DB_JUDGES'])) {
		$tempJudgesArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_JUDGES']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл cо списком судей\n";}
		
		if ($action == 'CreateJudge') {
			$tempJudgesArray[base64_encode(random_bytes(8))] = [
				"Number"    => 0,
				"ShortName" => "0 Новый судья",
				"FullName"  => "",
				'Photo'     => "PHOTO_JUDGE_DEFAULT",
				"Desc"      => ""
			];
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_JUDGES'], 'w');
			fwrite($WriteFile, json_encode($tempJudgesArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
		}
		else if ($tempJudgesArray && is_array($tempJudgesArray)) {
			if ($action == 'DeleteJudge') {
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
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_JUDGES'], 'w');
			fwrite($WriteFile, json_encode($tempJudgesArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл со списком судей!!!\n";}
		}
		$arraySort = [];
		foreach ($tempJudgesArray as $key => $row) {
			$arraySort[$key] = $row['ShortName'];
		}
		array_multisort($arraySort, SORT_ASC, $tempJudgesArray);
		$arraySort = null;
		unset($arraySort);
		return $tempJudgesArray;
	}
	else {
		return null;
	}
}
function ReadDBCommentators () {
	global $ini;
	// Обрабатываем файл cо списком комментаторов.
	if (file_exists(__DIR__ . '/' . $ini['DB_COMMENTATORS'])) {
		$tempCommentatorsArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_COMMENTATORS']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл cо списком комментаторов\n";}
		if (!is_array($tempCommentatorsArray)) { 
			if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка базы списка комментаторов!!!\n";}
		}
		else {
			$arraySort = [];
			foreach ($tempCommentatorsArray as $key => $row) {
				$arraySort[$key] = $row['ShortName'];
			}
			array_multisort($arraySort, SORT_ASC, $tempCommentatorsArray);
			$arraySort = null;
			unset($arraySort);
			return $tempCommentatorsArray;
		}
	}
	else {
		echo "Не удалось прочитать файл cо списком комментаторов.\n";
	}
	return null;
}
function WriteDBCommentators ($action, $Json) {
	global $ini;
	// Обрабатываем локальный конфигурационный файл c комментаторов.
	if (file_exists(__DIR__ . '/' . $ini['DB_COMMENTATORS'])) {
		$tempCommentatorsArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_COMMENTATORS']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл cо списком комментаторов\n";}
		
		if ($action == 'CreateCommentator') {
			$tempCommentatorsArray[base64_encode(random_bytes(8))] = [
				"ShortName" => "Новый комментатор",
				"FullName"  => "",
				'Photo'     => "PHOTO_JUDGE_DEFAULT",
				"Desc"      => ""
			];
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_COMMENTATORS'], 'w');
			fwrite($WriteFile, json_encode($tempCommentatorsArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
		}
		else if ($tempCommentatorsArray && is_array($tempCommentatorsArray)) {
			if ($action == 'DeleteCommentator') {
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
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_COMMENTATORS'], 'w');
			fwrite($WriteFile, json_encode($tempCommentatorsArray, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл со списком комментаторов!!!\n";}
		}
		return $tempCommentatorsArray;
	}
	else {
		return null;
	}
}
function ReadDBEventsList () {
	global $ini;
	$EventsArrayList[0] = [
		"Name" => "Мероприятий нет",
		"File" => false
	];
	// Обрабатываем файл cо списком мероприятий.
	if (file_exists(__DIR__ . '/' . $ini['DB_EVENTS_LIST'])) {
		$tempEventsArrayList = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_EVENTS_LIST']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл cо списком мероприятий\n";}
		if (!is_array($tempEventsArrayList)) { 
			if ($ini["PrintConsoleInfo"] == "y") {echo "Ошибка базы списка мероприятий!!!\n";}
		}
		else {
			$EventsArrayList = $tempEventsArrayList;
		}
		unset($tempEventsArrayList);
	}
	else {
		echo "Не удалось прочитать файл cо списком мероприятий.\n";
	}
	$arraySort = [];
	foreach ($EventsArrayList as $key => $row) {
		$arraySort[$key] = $row['Name'];
	}
	array_multisort($arraySort, SORT_DESC, $EventsArrayList);
	$arraySort = null;
	unset($arraySort);
	return $EventsArrayList;
}
function WriteDBEventsList ($action, $Json) {
	global $ini;
	global $EventDBDefault;
	global $GamePlaceArray;
	global $GameNameArray;
	$tempEventDBList[0] = [
		"Name" => "Мероприятий нет",
		"File" => null
	];
	// Обрабатываем локальный конфигурационный файл c названием игр.
	if (!file_exists(__DIR__ . '/' . $ini['DB_EVENTS_LIST'])) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось найти локальный файл со списком мероприятий!!!\n";}
		return null;
	}
	if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл cо списком мероприятий\n";}
	$tempEventDBList = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_EVENTS_LIST']) , true );
	if (!is_array($tempEventDBList)) {
		if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл со списком мероприятий!!!\n";}
		return null;
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
		$tempCommentators = ReadDBCommentators();
		foreach (['CommentatorFirst','CommentatorSecond']  as $value) {
			$tempUID  = $Json['Event'][$value]['UID'];
			if ($tempUID != "" && array_key_exists($tempUID, $tempCommentators) && is_array($tempCommentators[$tempUID])) {
				$Json['Event'][$value] = $tempCommentators[$tempUID];
				$Json['Event'][$value]['UID'] = $tempUID;
			}
			else {
				$Json['Event'][$value] = [];
				$Json['Event'][$value]['UID'] = "";
			}
		}

		//Судейская бригада
		$tempJudges = ReadDBJudges();
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
		$tempTeamLeft = ReadDBTeam($tempTeamLeftUID);
		$tempTeamRight = ReadDBTeam($tempTeamRightUID);
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
	$WriteFile = fopen(__DIR__ . '/' . $ini['DB_EVENTS_LIST'], 'w');
	fwrite($WriteFile, json_encode($tempEventDBList, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
	fclose($WriteFile);

	$arraySort = [];
	foreach ($tempEventDBList as $key => $row) {
		$arraySort[$key] = $row['Name'];
	}
	array_multisort($arraySort, SORT_DESC, $tempEventDBList);
	$arraySort = null;
	unset($arraySort);
	return $tempEventDBList;
}
ReadDBGameName  ();
ReadDBGamePlace ();

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
function FuncWorks($data, $connection) {
	global $EventDB;
	global $users;
	global $TimerID;
	global $Start_time;
	global $ini;
	global $GameNameArray;
	global $GamePlaceArray;
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
			}
			switch ($dataJson['Action']) {
				//Получить список мест проведения и названий матчей
				case "GetAllDB":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListAllDB",
						"GameNameArray"      => $GameNameArray,
						"GamePlaceArray"     => $GamePlaceArray
					];
					break;
				//
				case "GetAllDBEvent":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListAllDBEvent",
						"Event"     => ReadDBEvent($dataJson['Value']),
						"TeamArray" => ReadDBTeamsList(),
						"GameNameArray"      => $GameNameArray,
						"GamePlaceArray"     => $GamePlaceArray,
						"JudgesArray"        => ReadDBJudges(),
						"CommentatorsArray"  => ReadDBCommentators()
					];
					break;
				//
				case "GetJudgesDB":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListJudgesDB",
						"JudgesArray" => ReadDBJudges(),
						"PhotoJudges" => ['PHOTO_JUDGE_DEFAULT']
					];
					break;
				//
				case "GetCommentatorsDB":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListCommentatorsDB",
						"CommentatorsArray" => ReadDBCommentators(),
						"PhotoCommentators" => ['PHOTO_COMMENTATOR_DEFAULT'],
					];
					break;
				//
				case "GetTeamsPlayers":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListTeamsPlayers",
						"EventSelected" => $EventSelect,
						"PlayersLeft"  => $EventDB['PlayerLeft'],
						"PlayersRight" => $EventDB['PlayerRight']
					];
					break;
				//
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
				//
				case "GetTeamsList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListTeams",
						"ListTeams" => ReadDBTeamsList()
					];
					break;
				//
				case "GetEventsList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListEvents",
						"ListEvents" => ReadDBEventsList(),
						"SelectEvent" => $EventSelect
					];
					break;
				//
				case "ChangeCurrentEvent":
					$TempEventsList = ReadDBEventsList();
					if (is_array($TempEventsList[$dataJson['Value']])) {
						if (file_exists(__DIR__ . '/DB/Events/' . $TempEventsList[$dataJson['Value']]['File'] . ".json")) {
							//Записываем данные из памяти в файл
							WriteDBEvent();
							
							//ту мы меняем файл с выбранным мероприятием
							WriteEventSelect($dataJson['Value'], $TempEventsList[$dataJson['Value']]['File']);
	
							ReadEventSelect();
							//Читаем базу нового мероприятия из файла
							$EventDB = null;
							unset($EventDB);
							ReadDBEvent();
						}
						else {
							echo "Не удалось прочитать файл базы мероприятия.\n";
						}	 
					}
					else {
						echo "В списке мероприятий нет такого мероприятия.\n";
					}
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListEvents",
						"ListEvents" => ReadDBEventsList(),
						"SelectEvent" => $EventSelect
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
				// Название матча: Создать, сохранить и удалить
				case "DeleteGameName":
				case "SaveGameName":
				case "CreateGameName":
					WriteDBGameName($dataJson['Action'], $dataJson['Value']);
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListAllDB",
						"GameNameArray"  => $GameNameArray,
						"GamePlaceArray" => $GamePlaceArray,
					];
					break;
				// Место проведения матча: Создать, сохранить и удалить
				case "DeleteGamePlace":
				case "SaveGamePlace":
				case "CreateGamePlace":
					$LogoGamePlace = ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL']);
					WriteDBGamePlace($dataJson['Action'], $dataJson['Value']);
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListAllDB",
						"GameNameArray"  => $GameNameArray,
						"GamePlaceArray" => $GamePlaceArray,
						"LogoGamePlace" => $LogoGamePlace
					];
					break;
				// Судейская бригада: Создать, сохранить и удалить
				case "DeleteJudge":
				case "SaveJudge":
				case "CreateJudge":
					$ReturnJsonToWeb = [
						"timestamp"   => time(),
						"dAction"     => "ListJudgesDB",
						"JudgesArray" => WriteDBJudges($dataJson['Action'], $dataJson['Value']),
						"PhotoJudges" => ['PHOTO_JUDGE_DEFAULT']
					];
					break;
				// Комментаторы: Создать, сохранить и удалить
				case "DeleteCommentator":
				case "SaveCommentator":
				case "CreateCommentator":
					$ReturnJsonToWeb = [
						"timestamp"   => time(),
						"dAction"     => "ListCommentatorsDB",
						"CommentatorsArray" => WriteDBCommentators($dataJson['Action'], $dataJson['Value']),
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
						"ListTeams" => WriteDBTeamsList($dataJson['Action'], $dataJson['Value'])
					];
					break;
				//
				case "DeleteEventList":
				case "SaveEventName":
				case "SaveEventList":
				case "CreateEventList":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => "ListEvents",
						"ListEvents" => WriteDBEventsList($dataJson['Action'], $dataJson['Value']),
						"SelectEvent" => $EventSelect
					];
					break;
				//
				case "SaveCurrentTeamPlayers":
					if ($EventSelect['UID'] == $dataJson['Value']['EventUID']) {
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
				//Изменить шаблон
				case "OpenTemplate":
					echo $dataJson['Value'] . "\n";
					$ReturnJsonToWeb = [
						"timestamp"    => time(),
						"dAction"      => $dataJson['Action'],
						"Board"        => $dataJson['Board'],
						"TemplateFile" => $dataJson['Value']
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
						"CommentatorFirst"  => $EventDB['CommentatorFirst']['FullName'],
						"CommentatorSecond" => $EventDB['CommentatorSecond']['FullName']
					];
					break;
				// Скрыть комментаторов
				case "HideBoardCommentators":
					$EventDB['BoardCommentatorsStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
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
				// Скрыть судейский состав
				case "HideBoardJudges":
					$EventDB['BoardJudgesStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
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
				// Скрыть стартовый состав команды
				case "HideBoardWelcome":
					$EventDB['BoardWelcomeStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
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
				//
				case "HideBoardCount":
					$EventDB['BoardCountStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['BoardCountStatus'],
					];
					break;
				// Показать стартовую заставку
				case "ShowBoardStart":
				case "UpdateBoardCount":
					if ($dataJson['Action'] == "ShowBoardStart") {
						$EventDB['BoardStartStatus'] = 'active';
					}
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
				// Скрыть Логотип №1
				case "HideBoardLogo1":
					$EventDB['BoardLogo1Status'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['BoardLogo1Status'],
					];
					break;
				// Скрыть стартовую заставку
				case "HideBoardStart":
					$EventDB['BoardStartStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"Value"     => $EventDB['BoardStartStatus'],
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
				// Скрыть стартовый состав команды
				case "HideBoardListPlayer":
					$EventDB['BoardListPlayerLeftStatus'] = 'disable';
					$EventDB['BoardListPlayerRightStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Показать первую пятерку команды
				case "ShowBoardStart5Player":
					$EventDB['BoardStart5Player' . $dataJson['TeamPosition'] . 'Status'] = 'active';
					$tempStart5 = [
						"Logo" => $EventDB['Player' . $dataJson['TeamPosition']]['Logo'],
						"FullName" => $EventDB['Player' . $dataJson['TeamPosition']]['FullName'],
						"Place" => $EventDB['Player' . $dataJson['TeamPosition']]['Place'],
						"LF" => [
							'UID'      => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"RF" => [
							'UID'      => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"CF" => [
							'UID'      => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"LD" => [
							'UID'      => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"RD" => [
							'UID'      => '0',
							'FullName' => 'Пусто',
							'Photo'    => 'PHOTO_DEFAULT'
						],
						"GT" => [
							'UID'      => '0',
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
										$tempStart5[$key]['UID']      = $value['Key'];
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
				// Скрыть первую пятерку
				case "HideBoardStart5Player":
					$EventDB['BoardStart5PlayerLeftStatus'] = 'disable';
					$EventDB['BoardStart5PlayerRightStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Гол
				case "ShowBoardGoal":
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
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
							$ReturnJsonToWeb = [
								"timestamp" => time(),
								"dAction"   => $dataJson['Action'],
								"Board"     => $dataJson['Board'],
								"Value"     => $tempTeamPlayerDB
							];
							var_dump($ReturnJsonToWeb);
						}
						$tempTeamPlayerDB = null;
					}
					break;
				// Скрыть карточку игрока
				case "HideBoardPlayerTeam":
					$EventDB['BoardPlayerTeamStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
					break;
				// Показать тренера команды
				case "ShowBoardTrainerTeam":
					$EventDB['BoardTrainerTeamStatus'] = 'active';
					$tempTrainer = [
						"TrainerTitle"    => "Тренер",
						"TrainerFullName" => $EventDB['Player'.$dataJson['TeamPosition']]['Trainer']
					];
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board'],
						"TrainerTitle"    => $tempTrainer['TrainerTitle'],
						"TrainerFullName" => $tempTrainer['TrainerFullName']
					];
					unset($tempTrainer);
					break;
				// Скрыть тренера
				case "HideBoardTrainerTeam":
					$EventDB['BoardTrainerTeamStatus'] = 'disable';
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction"   => $dataJson['Action'],
						"Board"     => $dataJson['Board']
					];
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
					$EventDB['GameOverTemp'] = 1;
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
				// Скрыть: Счёт на конец периода
				case "HideBoardEndPeriod":
					$EventDB['BoardEndPeriod'] = 'disable';
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
			}
			switch ($data) {
				//
				case "TimerStartFirstPeriod":
				case "TimerStartSecondPeriod":
					if ($TimerID == 0) {
						//$Start_time = 0;
						$TimerID = Timer::add(1, function()use(&$TimerID, &$users, &$Start_time, &$data, &$ini) {
							$timerShow = $Start_time++;
							if($timerShow >= 2701) {
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "Timer::del($TimerID)\n";
								}
								Timer::del($TimerID);
								$TimerID=0;
							}
							else {
								if ($data == "TimerStartSecondPeriod") {
									$timerShow = $timerShow+2700;
								}
								$minutes = floor($timerShow / 60);
								if ($minutes < 10) {$minutes = "0".$minutes;} 
								$seconds = $timerShow % 60;
								if ($seconds < 10) {$seconds = "0".$seconds;} 
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "Timer run ".$minutes.":".$seconds." \n";
								}
								$ReturnJsonToWeb = [
									"timestamp" => time(),
									"dAction" => "TimerUpdate",
									"Value"   => $minutes.":".$seconds,
								];
								foreach($users as $connection) {
									$connection['connect']->send(json_encode($ReturnJsonToWeb));
								}
							}
						});
					}
					break;
				//
				case "TimerPause":
					if ($TimerID != 0) {
						Timer::del($TimerID);
						$TimerID=0;
					}
					break;
				//
				case "TimerClean":
					if ($TimerID != 0) {
						Timer::del($TimerID);
						$TimerID=0;
						$Start_time=1;
					}
					$EventDB['TimerMinutes'] = 0;
					$EventDB['TimerSecondes'] = 0;
					$ReturnJsonToWeb = [
						"timestamp" => time(),
						"dAction" => "TimerUpdate",
						"Value"   => (string)'00:00',
					];
					break;
				


								//Очистить всё

				
				

				//
				default:
					if ($ini["PrintConsoleInfo"] == "y") {
						echo "Нет такой команды!\n";
					}
			}
		}

		if (array_key_exists('dAction', $ReturnJsonToWeb)) {
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
	$EventDB = ReadDBEvent();

	if ($ini['HOCKEY_SERVER_TYPE']=="DIAN") {
		//----------------------------------------------------

		echo "Мы пытаемся подключиться к Hockey!\n";
		$connection = new AsyncTcpConnection("tcp://" . $ini['DIAN_HOCKEY_IP'] . ":". $ini['DIAN_HOCKEY_PORT']);
		$connection->onConnect = function($connection) {
			echo "Мы подключились к Hockey!\n";
		};
		$connection->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users, &$RawInputLogFile) {
			$len = strlen($data);
			$Modify = 0;
			for($index = 0;          $index < $len;               $index++){
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
							// Добавляем информацию об удаленном игроке
							if ($EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != $numDelPlayer && $numDelPlayer != 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] == 0) {
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "[Add Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
								}
								if ($secDelPlayer < 10) {$secDelPlayer = "0".$secDelPlayer;}
								$EventDB['DelPlayer'][$DeleteLinePlayer] = [
									'Upd' => 1,
									'Num' => $numDelPlayer,
									'Min' => $minDelPlayer,
									'Sec' => $secDelPlayer,
									'Time' => $minDelPlayer . ":" . $secDelPlayer,
								];
								$Modify = 1;
							}
							// Удаляем информацию об удаленном игроке
							elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != $numDelPlayer && $numDelPlayer == 0 && $EventDB['DelPlayer'][$DeleteLinePlayer]['Num'] != 0) {
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "[Remove Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
								}
								if ($secDelPlayer < 10) {$secDelPlayer = "0".$secDelPlayer;}
								$EventDB['DelPlayer'][$DeleteLinePlayer] = [
									'Upd' => 2,
									'Num' => $numDelPlayer,
									'Min' => $minDelPlayer,
									'Sec' => $secDelPlayer,
									'Time' => $minDelPlayer . ":" . $secDelPlayer,
								];
								$Modify = 1;
							}
							// Обновляем информацию об удаленном игроке
							elseif ($EventDB['DelPlayer'][$DeleteLinePlayer]['Min'] != $minDelPlayer || $EventDB['DelPlayer'][$DeleteLinePlayer]['Sec'] != $secDelPlayer) {
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "[Update Delete " . $DeleteLinePlayer . "] => num: " . $numDelPlayer . " min:" . $minDelPlayer . " Sec:"  . $secDelPlayer . "\n";
								}
								if ($secDelPlayer < 10) {$secDelPlayer = "0".$secDelPlayer;}
								$EventDB['DelPlayer'][$DeleteLinePlayer] = [
									'Upd' => 3,
									'Num' => $numDelPlayer,
									'Min' => $minDelPlayer,
									'Sec' => $secDelPlayer,
									'Time' => $minDelPlayer . ":" . $secDelPlayer,
								];
								$Modify = 1;
							}
						}
						elseif ($command == 254) {
							//echo "[Chet3.1----------------------------------------] => " . (hexdec($byteArray["Chet1"])) . "\n";
							// 4: Флаги таймеров: 0-ой бит таймер игры идет, 2 - перерыв, 4 - правый таймаут, 8 - левый таймаут, 4 - таймер 24-сек. идет
							if ($EventDB['TimerType']['Count'] != (int)$byteArray["Chet4"]) {
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "[Timer Type] => " . $byteArray["Chet4"] . "\n";
								}
								$EventDB['TimerType']['Count'] = (int)$byteArray["Chet4"];
								$EventDB['TimerType']['Upd']   = 1;
								$Modify = 1;
							}
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
						$TimerMinutes = (int)((($byteArray["Chet1"] == "c" || $byteArray["Chet1"] == "e") ? "" : $byteArray["Chet1"]) . ($byteArray["Chet2"] == "c" ? 0 : $byteArray["Chet2"]));
						if ($EventDB['TimerMinutes'] != $TimerMinutes) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Timer Min] => ${TimerMinutes}\n";
							}
							$EventDB['TimerMinutes'] = $TimerMinutes;
							$EventDB['TimerUpdate'] = 1;
							$Modify = 1;
						}
						
						// 3: Таймер игры секунды 1-ая цифра
						// 4: Таймер игры секунды 2-ая цифра
						$TimerSecondes = (int)($byteArray["Chet3"] . $byteArray["Chet4"]);
						if ($EventDB['TimerSecondes'] != $TimerSecondes) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Time Sec] => ${TimerSecondes}\n";
							}
							$EventDB['TimerSecondes'] = $TimerSecondes;
							$EventDB['TimerUpdate'] = 1;
							$Modify = 1;
						}
						unset($TimerMinutes);
						unset($TimerSecondes);
						// 5: Таймер игры десятые
						//echo "[Timer dec] => " . ($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . "\n";
						// 6: 1 (таймер игры идет) или 2 (таймер игры не идет)
						if ($EventDB['TimerStatus']['Count'] != (int)$byteArray["Chet6"]) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Timer Status] => " . ((int)$byteArray["Chet6"] == 1 ? "Play" : "Stop") . "\n";
							}
							$EventDB['TimerStatus']['Count'] = (int)$byteArray["Chet6"];
							$EventDB['TimerStatus']['Upd'] = 1;
							$Modify = 1;
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
						if ($EventDB['CountPlayerLeft']['Count'] != $CountPlayerLeft) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Count Left] => ${CountPlayerLeft}\n";
							}
							$EventDB['CountPlayerLeft']['Count'] = $CountPlayerLeft;
							$EventDB['CountPlayerLeft']['Upd'] = 1;
							$Modify = 1;
						}
						unset($CountPlayerLeft);
						// 5: Счет левой команды 1-ая цифра
						// 6: Счет левой команды 2-ая цифра
						// 7: Счет левой команды 3-ая цифра
						$CountPlayerRight = (int)(($byteArray["Chet5"] == "c" ? "" : $byteArray["Chet5"]) . ($byteArray["Chet6"] == "c" ? "" : $byteArray["Chet6"]) . $byteArray["Chet7"]);
						if ($EventDB['CountPlayerRight']['Count'] != $CountPlayerRight) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Count Right] => ${CountPlayerRight}\n";
							}
							$EventDB['CountPlayerRight']['Count'] = $CountPlayerRight;
							$EventDB['CountPlayerRight']['Upd'] = 1;
							$Modify = 1;
						}
						unset($CountPlayerRight);
						// 4: Период
						if ($EventDB['Period']['Count'] != (int)$byteArray["Period"]) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Period] => " . $byteArray["Period"] . "\n";
							}
							$EventDB['Period']['Count']  = (int)$byteArray["Period"];
							$EventDB['Period']['Upd']  = 1;
							$Modify = 1;
						}
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
						//echo "4-----------------\n";
					}
				}
				// Пакет названия правой команды: 5 ... 11
				elseif (hexdec($d["data"]) == 5) {
					if ($ini["PrintConsoleInfo"] == "y") {
						//echo "5-----------------\n";
					}
				}
				// Пакет бегущей строки: 6 ... 12
				elseif (hexdec($d["data"]) == 6) {
					if ($ini["PrintConsoleInfo"] == "y") {
						//echo "6-----------------\n";
					}
				}
				if (hexdec($d["data"]) == 14) {
					if ($Modify === 1) {
						foreach($users as $connectionUsers) {
							$EventDB['dAction'] = 'Update';
							$connectionUsers['connect']->send(json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
						}
						$EventsExecute = [
							"Execute" => 0,
							"Page" => 0,
							"Bank" => 0,
						];
						foreach($EventsTimer as $key => $value) {
							foreach($EventsType as $check) {
								if ($check == "min" && array_key_exists($check, $value) && $value[$check] == $EventDB['TimerMinutes']) {
									$EventsExecute['Execute']++;
									if ($ini["PrintConsoleInfo"] == "y") {/* echo "Events min >>>>>>>>>>>\n";*/}
								}
								if ($check == "sec" && array_key_exists($check, $value) && $value[$check] == $EventDB['TimerSecondes']) {
									$EventsExecute['Execute']++;
									if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events sec >>>>>>>>>>>\n";*/}
								}
								if ($check == "period" && array_key_exists($check, $value)) {
									if (array_key_exists("periodOnlyChange", $value)) {
										if ($EventDB['Period']['Upd'] == 1 && $value[$check] == $EventDB['Period']['Count']) {
											$EventsExecute['Execute']++;
											if ($ini["PrintConsoleInfo"] == "y") { /* echo "Events period >>>>>>>>>>>\n"; */}
										}
									}
									else if ($value[$check] == $EventDB['Period']['Count']) {
										$EventsExecute['Execute']++;
										if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events period >>>>>>>>>>>\n";*/ }
									}
								}
								if ($check == "status" && array_key_exists($check, $value)) {
									if (array_key_exists("statusOnlyChange", $value)) {
										if ($EventDB['TimerStatus']['Upd'] == 1 && $value[$check] == $EventDB['TimerStatus']['Count']) {
											$EventsExecute['Execute']++;
											if ($ini["PrintConsoleInfo"] == "y") { echo "Events type >>>>>>>>>>>\n";}
										}
									}
									else if ($value[$check] == $EventDB['TimerStatus']['Count']) {
										$EventsExecute['Execute']++;
										if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events type >>>>>>>>>>>\n";*/}
									}
								}
								if ($check == "type" && array_key_exists($check, $value)) {
									if (array_key_exists("typeOnlyChange", $value)) {
										if ($EventDB['TimerType']['Upd'] == 1 && $value[$check] == $EventDB['TimerType']['Count']) {
											$EventsExecute['Execute']++;
											if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events type >>>>>>>>>>>\n";*/}
										}
									}
									else if ($value[$check] == $EventDB['TimerType']['Count']) {
										$EventsExecute['Execute']++;
										if ($ini["PrintConsoleInfo"] == "y") {/*echo "Events type >>>>>>>>>>>\n";*/}
									}
								}
								if ($EventsExecute['Execute'] >= 1) {
									$EventsExecute['Page'] = $value['page'];
									$EventsExecute['Bank'] = $value['bank'];
								}
							}
							if ($EventsExecute['Execute'] == $EventsTimer[$key]['COUNT']) {
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "Events >>>>>>>>>>>\n";
								}
								$fp = stream_socket_client($ini['COMPANION_ADDRESS']);
								if ($fp) {
									fwrite($fp, "BANK-PRESS " . $EventsExecute['Page'] . " " . $EventsExecute['Bank'] . "\n");
									fclose($fp);
								}
								if ($ini["PrintConsoleInfo"] == "y") {
									echo "BANK-PRESS ".$EventsExecute['Page']. " == " . $EventsExecute['Bank'] ."  >>>>>>>>>>>\n";
								}
							}
							if ($ini["PrintConsoleInfo"] == "y") {
								//echo "Events  ".$EventsExecute['Execute']. " == " . $EventsTimer[$key]['COUNT'] ."  >>>>>>>>>>>\n";
							}
							$EventsExecute = [
								"Execute" => 0,
								"Page" => 0,
								"Bank" => 0,
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
						if ($ini["PrintConsoleInfo"] == "y") {
							echo "Данные отправлены>>>>>>>>>>>\n";
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
			$connection->send("Tablo");
			echo "Мы подключились к Hockey1!\n";
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
						$CountPlayerLeft = $dataJson['SchetLeft'];
						if ($EventDB['CountPlayerLeft']['Count'] != $CountPlayerLeft) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Count Left] => ${CountPlayerLeft}\n";
							}
							$EventDB['CountPlayerLeft']['Count'] = $CountPlayerLeft;
							$EventDB['CountPlayerLeft']['Upd'] = 1;
							$Modify = 1;
						}
						unset($CountPlayerLeft);
						//--------------------------------
						// Счет левой команды
						$CountPlayerRight = $dataJson['SchetRight'];
						if ($EventDB['CountPlayerRight']['Count'] != $CountPlayerRight) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Count Right] => ${CountPlayerRight}\n";
							}
							$EventDB['CountPlayerRight']['Count'] = $CountPlayerRight;
							$EventDB['CountPlayerRight']['Upd'] = 1;
							$Modify = 1;
						}
						unset($CountPlayerRight);
						//---------------------------------
						// Период
						if ($dataJson['Period'] == 0) {
							$Period = 0;
						}
						elseif ($dataJson['Period'] == 1 || $dataJson['Period'] == 2) {
							$Period = 1;
						}
						elseif ($dataJson['Period'] == 3 || $dataJson['Period'] == 4) {
							$Period = 2;
						}
						elseif ($dataJson['Period'] == 5 || $dataJson['Period'] == 6) {
							$Period = 3;
						}
						elseif ($dataJson['Period'] == 7) {
							$Period = 4;
						}
						if ($EventDB['Period']['Count'] != $Period) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Period] => " . $Period . "\n";
							}
							$EventDB['Period']['Count']  = $Period;
							$EventDB['Period']['Upd']  = 1;
							$Modify = 1;
						}
						unset($Period);
						//---------------------------------
						// Период
						if ($dataJson['Period'] == 1 || $dataJson['Period'] == 3 || $dataJson['Period'] == 5 || $dataJson['Period'] == 7) {
							$TimerType = 0;
						}
						elseif ($dataJson['Period'] == 0 || $dataJson['Period'] == 2 || $dataJson['Period'] == 4 || $dataJson['Period'] == 6) {
							$TimerType = 2;
						}
						if ($dataJson['TimerStatus'] == 2) {
							$TimerType = 4;
						}
						// 4: Флаги таймеров: 0-ой бит таймер игры идет, 2 - перерыв, 4 - правый таймаут, 8 - левый таймаут, 4 - таймер 24-сек. идет
						if ($EventDB['TimerType']['Count'] != $TimerType) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Timer Type] => " . $TimerType . "\n";
							}
							$EventDB['TimerType']['Count'] = $TimerType;
							$EventDB['TimerType']['Upd']   = 1;
							$Modify = 1;
						}
						unset($TimerType);

						$TimerMinutes = $dataJson['Min'];
						if ($EventDB['TimerMinutes'] != $TimerMinutes) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Timer Min] => ${TimerMinutes}\n";
							}
							$EventDB['TimerMinutes'] = $TimerMinutes;
							$EventDB['TimerUpdate'] = 1;
							$Modify = 1;
						}
						
						$TimerSecondes =  $dataJson['Sec'];
						if ($EventDB['TimerSecondes'] != $TimerSecondes) {
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "[Time Sec] => ${TimerSecondes}\n";
							}
							$EventDB['TimerSecondes'] = $TimerSecondes;
							$EventDB['TimerUpdate'] = 1;
							$Modify = 1;
						}
						unset($TimerMinutes);
						unset($TimerSecondes);

						if ($Modify === 1) {
							foreach($users as $connectionUsers) {
								$EventDB['dAction'] = 'Update';
								$connectionUsers['connect']->send(json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
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
							if ($ini["PrintConsoleInfo"] == "y") {
								echo "Данные отправлены>>>>>>>>>>>\n";
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
