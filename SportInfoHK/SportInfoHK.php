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

$ini            = [];
$PlayerArray    = [];
$GameNameArray  = [];
$GamePlaceArray = [];
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

ReadConfigFile();

function ReadDBTeamPlayers ($TeamUID) {
	global $ini;
	// Обрабатываем локальный файл c хоккейными командами.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл хоккейных команд\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			var_dump($tempEventDB[$TeamUID]);
			return $tempEventDB[$TeamUID];
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с хоккейными командами!!!\n";}
		}
		unset($tempEventDB);
	}
}
function ReadDBTeams () {
	global $ini;
	global $PlayerArray;
    $PlayerArray=[];
	// Обрабатываем файл c хоккейными командами по умолчанию.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_DEFAULT'])) {
		
		$PlayerArray = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_DEFAULT']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем файл хоккейных команд по умолчанию\n";}
		if ($PlayerArray && is_array($PlayerArray)) { /* тут пусто  */ }
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
			$PlayerArray = $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с хоккейными командами!!!\n";}
		}
		unset($tempEventDB);
	}
}
function WriteDBTeams ($action, $Json) {
	global $ini;
	global $PlayerArray;
	// Обрабатываем локальный файл c хоккейными командами.
	if (file_exists(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'])) {
		$tempEventDB = json_decode( file_get_contents(__DIR__ . '/' . $ini['DB_TEAM_LOCAL']) , true );
		if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем локальный файл хоккейных команд\n";}
		if ($tempEventDB && is_array($tempEventDB)) {
			if ($action == 'DeleteTeam') {
				unset($tempEventDB[$Json]);
			}
			else if ($action == 'CreateTeam') {
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
					'Vratari' => [],
					'Security' => [],
					'Napadenie' => []
				];
			}
			else if ($action == 'SaveTeam') {
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
			else if ($action == 'SaveTeamPlayers') {
				$tempEventDB[$Json['Key']] = [
					'Vratari' => $Json['Vratari'],
					'Security' => $Json['Security'],
					'Napadenie' => $Json['Napadenie']
				];
			}
			$WriteFile = fopen(__DIR__ . '/' . $ini['DB_TEAM_LOCAL'], 'w');
			fwrite($WriteFile, json_encode($tempEventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
			fclose($WriteFile);
			$PlayerArray = $tempEventDB;
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с хоккейными командами!!!\n";}
		}
		unset($tempEventDB);
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
					'ShortName' => 'Новая запись',
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
		}
		else {
			if ($ini["PrintConsoleInfo"] == "y") {echo "Не удалось прочитать локальный файл с названием игр!!!\n";}
		}
		unset($tempEventDB);
	}
}

ReadDBTeams ();
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
//---------------------------------
$EventsTimer = [];
$EventsType = ['min','sec','period','status','type'];
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
//---------------------------------


$Start_time = 1;

$EventDB = [
    'DBVersion'   => 12,
    'dAction'     => 'None',
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
    ],
    'BoardWelcomeStatus' => 'disable',
	'BoardCountStatus' => 'disable',
    'BoardLogo1Status' => 'disable',
    'BoardStartStatus' => 'disable',
	'BoardJudgesStatus' => 'disable',
    'BoardListPlayerLeftStatus' => 'disable',
    'BoardListPlayerRightStatus'  => 'disable',
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

//Очистить всё
function ActionClearALL() {
    echo "Очистка экрана\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "Clear",
    ];
}
//Очистить Титры
function ActionClear($Action) {
    echo "Очистка Титров\n";
    return [
        "timestamp"    => time(),
        "dAction"      => $Action,
    ];
}
//Перезагрузить: Титры
function ActionReload($Action) {
    echo "Перезагрузить: Титры\n";
    return [
        "timestamp"    => time(),
        "dAction"      => $Action,
    ];
}
//Открыть титры для Хоккея
function ActionOpenTVHK() {
    echo "Открыть титры для Хоккея\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "OpenTVHK",
    ];
}
//Открыть титры для Футбола
function ActionOpenTVFootball() {
    echo "Открыть титры для Футбола\n";
    return [
        "timestamp"    => time(),
        "dAction"      => "OpenTVFootball",
    ];
}

function FuncWorks($data, $connection) {
    global $EventDB;
    global $users;
    global $TimerID;
    global $Start_time;
    global $ini;
    global $PlayerArray;
    global $GameNameArray;
    global $GamePlaceArray;

    if (!empty($data)) {
        /**************** Наполняем базу 2 убрали счёт ********************************/
        $ReturnJsonToWeb = [];
        $data = rtrim($data);
        $dataJson = json_decode($data, true);
		if (json_last_error() === JSON_ERROR_NONE) {
			// Данные в JSON формате
			if ($dataJson['Action'] == 'Update') {
				echo "Action Json: " . $dataJson['Action'] .  ";\n";
				//$ReturnJsonToWeb = ActionReload();
			}
			elseif ($dataJson['Action'] == 'GetTeamPlayers') {
				echo "Action Json: " . $dataJson['Action'] .  ";\n";
				$tempEventDB = ReadDBTeamPlayers($dataJson['Value']);
				$ReturnJsonToWeb = [
					"timestamp" => time(),
					"dAction"   => "ListTeamPlayers",
					'Players'   => $tempEventDB['Players'],
					'Vratari'   => $tempEventDB['Vratari'],
					'Security'  => $tempEventDB['Security'],
					'Napadenie' => $tempEventDB['Napadenie']
				];
				unset($tempEventDB);
			}
			elseif ($dataJson['Action'] == 'GetPlayer') {
				echo "Action Json: " . $dataJson['Action'] .  ";\n";
				$LogoGamePlace = ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL']);
				$LogoTeams = ReadLogo($ini['DIR_LOGO_TEAMS_LOCAL']);
				$ReturnJsonToWeb = [
					"timestamp" => time(),
					"dAction"   => "ListPlayer",
					"Player"    => $PlayerArray,
					"GameName"  => $GameNameArray,
					"GamePlace" => $GamePlaceArray,
					"LogoGamePlace" => $LogoGamePlace,
					"LogoTeams" => $LogoTeams
				];
			}
			elseif ($dataJson['Action'] == 'DeleteGameName' || $dataJson['Action'] == 'SaveGameName' || $dataJson['Action'] == 'CreateGameName') {
				echo "Action Json: " . $dataJson['Action'] .  ";\n";
				$LogoGamePlace = ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL']);
				$LogoTeams = ReadLogo($ini['DIR_LOGO_TEAMS_LOCAL']);
				WriteDBGameName($dataJson['Action'], $dataJson['Value']);
				$ReturnJsonToWeb = [
					"timestamp" => time(),
					"dAction"   => "ListPlayer",
					"Player"    => $PlayerArray,
					"GameName"  => $GameNameArray,
					"GamePlace" => $GamePlaceArray,
					"LogoGamePlace" => $LogoGamePlace,
					"LogoTeams" => $LogoTeams
				];
			}
			elseif ($dataJson['Action'] == 'DeleteGamePlace' || $dataJson['Action'] == 'SaveGamePlace' || $dataJson['Action'] == 'CreateGamePlace') {
				echo "Action Json: " . $dataJson['Action'] .  ";\n";
				$LogoGamePlace = ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL']);
				$LogoTeams = ReadLogo($ini['DIR_LOGO_TEAMS_LOCAL']);
				WriteDBGamePlace($dataJson['Action'], $dataJson['Value']);
				$ReturnJsonToWeb = [
					"timestamp" => time(),
					"dAction"   => "ListPlayer",
					"Player"    => $PlayerArray,
					"GameName"  => $GameNameArray,
					"GamePlace" => $GamePlaceArray,
					"LogoGamePlace" => $LogoGamePlace,
					"LogoTeams" => $LogoTeams
				];
			}
			elseif ($dataJson['Action'] == 'DeleteTeam' || $dataJson['Action'] == 'SaveTeam' || $dataJson['Action'] == 'CreateTeam') {
				echo "Action Json: " . $dataJson['Action'] .  ";\n";
				$LogoGamePlace = ReadLogo($ini['DIR_LOGO_GAME_PLACE_LOCAL']);
				$LogoTeams = ReadLogo($ini['DIR_LOGO_TEAMS_LOCAL']);
				WriteDBTeams($dataJson['Action'], $dataJson['Value']);
				$ReturnJsonToWeb = [
					"timestamp" => time(),
					"dAction"   => "ListPlayer",
					"Player"    => $PlayerArray,
					"GameName"  => $GameNameArray,
					"GamePlace" => $GamePlaceArray,
					"LogoGamePlace" => $LogoGamePlace,
					"LogoTeams" => $LogoTeams
				];
			}
            elseif ($dataJson['Action'] == 'SendNamePlayerLeft' || $dataJson['Action'] == 'SendNamePlayerRight') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $NamePlayerUID = $dataJson['Value'];
                if (array_key_exists($NamePlayerUID, $PlayerArray) && is_array($PlayerArray[$NamePlayerUID])) {
                    if ($dataJson['Action'] == 'SendNamePlayerLeft') {
                        $EventDB['PlayerLeft']['UID'] = $NamePlayerUID;
                    }
                    elseif ($dataJson['Action'] == 'SendNamePlayerRight') {
                        $EventDB['PlayerRight']['UID'] = $NamePlayerUID;
                    }
                    foreach($PlayerArray[$NamePlayerUID] as $key => $value) {
                        if ($dataJson['Action'] == 'SendNamePlayerLeft') {
                            $EventDB['PlayerLeft'][$key] = $value;
                        }
                        elseif ($dataJson['Action'] == 'SendNamePlayerRight') {
                            $EventDB['PlayerRight'][$key] = $value;
                        }
                    }
                }
                unset($NamePlayerUID);
                //$ReturnJsonToWeb = ActionReload();
            }
            elseif ($dataJson['Action'] == 'SendTimer') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                list($minutes, $second) = explode(":", $dataJson['Value']);
                if ($minutes < 1) {$minutes = 0;}
                if ($second < 1) {$second = 0;}
                if ($minutes >= 45) {$minutes = $minutes-45;}
                $minutes = $minutes * 60;
                $Start_time = $minutes + $second;
                $EventDB['Timer'] = $dataJson['Value'];
                //$ReturnJsonToWeb = ActionReload();
            }
            elseif ($dataJson['Action'] == 'SendGameName') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $GameNameUID = $dataJson['Value'];
                if (array_key_exists($GameNameUID, $GameNameArray) && is_array($GameNameArray[$GameNameUID])) {
                    $EventDB['GameName']['UID'] = $GameNameUID;
                    foreach($GameNameArray[$GameNameUID] as $key => $value) {
                        $EventDB['GameName'][$key] = $value;
                    }
                }
                unset($GameNameUID);
                //$ReturnJsonToWeb = ActionReload();
            }
            elseif ($dataJson['Action'] == 'SendGameDate') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['GameDate'] = $dataJson['Value'];
                //$ReturnJsonToWeb = ActionReload();
            }
            elseif ($dataJson['Action'] == 'SendGameTime') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['GameTime'] = $dataJson['Value'];
                //$ReturnJsonToWeb = ActionReload();
            }
			elseif ($dataJson['Action'] == 'SendGameTemperature') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['GameTemperature'] = $dataJson['Value'];
                //$ReturnJsonToWeb = ActionReload();
            }
            elseif ($dataJson['Action'] == 'SendGameWeather') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $EventDB['GameWeather'] = $dataJson['Value'];
                //$ReturnJsonToWeb = ActionReload();
            }
            elseif ($dataJson['Action'] == 'SendGamePlace') {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
                $GamePlaceUID = $dataJson['Value'];
                if (array_key_exists($GamePlaceUID, $GamePlaceArray) && is_array($GamePlaceArray[$GamePlaceUID])) {
                    $EventDB['GamePlace']['UID'] = $GamePlaceUID;
                    foreach($GamePlaceArray[$GamePlaceUID] as $key => $value) {
                        if ($key == 'FullName') {
							$EventDB['GamePlace'][$key] = str_replace("\n", "<br>", $value);
							$EventDB['GamePlace']['FullNameOneLine'] = str_replace("\n", " ", $value);
						}
						else {
							$EventDB['GamePlace'][$key] = $value;
						}
						
                    }

                }
                unset($GamePlaceUID);
                //$ReturnJsonToWeb = ActionReload();
            }
            else {
                echo "Action Json: " . $dataJson['Action'] .  ";\n";
            }
        }
        elseif ($data == "TimerStartFirstPeriod" || $data == "TimerStartSecondPeriod") {
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
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "TimerPause") {
            if ($TimerID != 0) {
                Timer::del($TimerID);
                $TimerID=0;
            }
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "TimerClean") {
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
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "CountPlayer1Plus" || $data == "CountPlayer1Minus") {
            if ($data == "CountPlayer1Plus") {
                $EventDB['CountPlayerLeft']['Count']++;
            }
            elseif ($data == "CountPlayer1Minus") {
                $EventDB['CountPlayerLeft']['Count']--;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "CountPlayerLeft",
                "Value"     => $EventDB['CountPlayerLeft']['Count'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "CountPlayer2Plus" || $data == "CountPlayer2Minus") {
            if ($data == "CountPlayer2Plus") {
                $EventDB['CountPlayerRight']['Count']++;
            }
            elseif ($data == "CountPlayer2Minus") {
                $EventDB['CountPlayerRight']['Count']--;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "CountPlayerRight",
                "Value"     => $EventDB['CountPlayerRight']['Count'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "PeriodPlus" || $data == "PeriodMinus") {
            if ($data == "PeriodPlus") {
                $EventDB['Period']['Count']++;
            }
            elseif ($data == "PeriodMinus") {
                $EventDB['Period']['Count']--;
            }
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => "Period",
                "Value"     => $EventDB['Period']['Count'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "ShowBoardOBSCount" || $data == "ShowBoardTVCount" || $data == "ShowBoardTabloCount") {
            $EventDB['BoardCountStatus'] = 'active';
            $ReturnJsonToWeb = $EventDB;
            $ReturnJsonToWeb["timestamp"] = time();
            $ReturnJsonToWeb["dAction"]   = $data;
            echo "Action: " . $data .  ";\n";
        }
        elseif ($data == "HideBoardOBSCount" || $data == "HideBoardTVCount" || $data == "HideBoardTabloCount") {
            $EventDB['BoardCountStatus'] = 'disable';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "Value"     => $EventDB['BoardCountStatus'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        // Обновить данные
        // Показать стартовую заставку
        elseif ($data == "UpdateBoardOBSCount" || $data == "UpdateBoardTVCount" || $data == "UpdateBoardTabloCount" || $data == "ShowBoardOBSStart" || $data == "ShowBoardTVStart" || $data == "ShowBoardTabloStart") {
            if ($data == "ShowBoardOBSStart" || $data == "ShowBoardTVStart" || $data == "ShowBoardTabloStart") {
                $EventDB['BoardStartStatus'] = 'active';
            }
            $ReturnJsonToWeb = $EventDB;
            $ReturnJsonToWeb["timestamp"] = time();
            $ReturnJsonToWeb["dAction"]   = $data;
            echo "Action: " . $data .  ";\n";
        }
        // Показать Логотип №1
        elseif ($data == "ShowBoardOBSLogo1" || $data == "ShowBoardTVLogo1" || $data == "ShowBoardTabloLogo1") {
            $EventDB['BoardLogo1Status'] = 'active';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "Logo"      => $EventDB['GamePlace']['Logo'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        // Скрыть Логотип №1
        elseif ($data == "HideBoardOBSLogo1" || $data == "HideBoardTVLogo1" || $data == "HideBoardTabloLogo1") {
            $EventDB['BoardLogo1Status'] = 'disable';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "Value"     => $EventDB['BoardLogo1Status'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        // Скрыть стартовую заставку
        elseif ($data == "HideBoardOBSStart" || $data == "HideBoardTVStart" || $data == "HideBoardTabloStart") {
            $EventDB['BoardStartStatus'] = 'disable';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "Value"     => $EventDB['BoardStartStatus'],
            ];
            echo "Action: " . $data .  ";\n";
        }
        // Показать стартовый состав правой команды
        elseif ($data == "ShowBoardOBSListPlayerRight" || $data == "ShowBoardTVListPlayerRight" || $data == "ShowBoardTabloListPlayerRight") {
            $EventDB['BoardListPlayerRightStatus'] = 'active';
            $ReturnJsonToWeb = [
                "timestamp" => time(),
                "dAction"   => $data,
                "Player"    => $EventDB['PlayerRight'],
            ];
            echo "Action: " . $data .  ";\n";
        }
		// Показать стартовый состав левой команды
		elseif ($data == "ShowBoardOBSListPlayerLeft" || $data == "ShowBoardTVListPlayerLeft" || $data == "ShowBoardTabloListPlayerLeft") {
			$EventDB['BoardListPlayerLeftStatus'] = 'active';
			$ReturnJsonToWeb = [
				"timestamp" => time(),
				"dAction"   => $data,
				"Player"    => $EventDB['PlayerLeft'],
			];
			echo "Action: " . $data .  ";\n";
		}
		// Скрыть стартовый состав команды
		elseif ($data == "HideBoardOBSListPlayer" || $data == "HideBoardTVListPlayer" || $data == "HideBoardTabloListPlayer") {
			$EventDB['BoardListPlayerLeftStatus'] = 'disable';
			$EventDB['BoardListPlayerRightStatus'] = 'disable';
			$ReturnJsonToWeb = [
				"timestamp" => time(),
				"dAction"   => $data
			];
			echo "Action: " . $data .  ";\n";
		}
		// Показать информацию по месту проведения матча (Название арены, дата, погода)
		elseif ($data == "ShowBoardOBSWelcome" || $data == "ShowBoardTVWelcome" || $data == "ShowBoardTabloWelcome") {
			$EventDB['BoardWelcomeStatus'] = 'active';
			$ReturnJsonToWeb = [
				"timestamp" => time(),
				"dAction"   => $data,
				"ArenaName"   => $EventDB['GamePlace']['FullNameOneLine'],
				"Place"       => $EventDB['GamePlace']['Place'],
				"Weather"     => $EventDB['GameWeather'],
				"Temperature" => $EventDB['GameTemperature']
			];
			echo "Action: " . $data .  ";\n";
		}
		// Скрыть стартовый состав команды
		elseif ($data == "HideBoardOBSWelcome" || $data == "HideBoardTVWelcome" || $data == "HideBoardTabloWelcome") {
			$EventDB['BoardWelcomeStatus'] = 'disable';
			$ReturnJsonToWeb = [
				"timestamp" => time(),
				"dAction"   => $data
			];
			echo "Action: " . $data .  ";\n";
		}
		// Показать судейский состав
		elseif ($data == "ShowBoardOBSJudges" || $data == "ShowBoardTVJudges" || $data == "ShowBoardTabloJudges") {
			$EventDB['BoardJudgesStatus'] = 'active';
			$ReturnJsonToWeb = [
				"timestamp" => time(),
				"dAction"   => $data,
			];
			echo "Action: " . $data .  ";\n";
		}
		// Скрыть судейский состав
		elseif ($data == "HideBoardOBSJudges" || $data == "HideBoardTVJudges" || $data == "HideBoardTabloJudges") {
			$EventDB['BoardWelcomeStatus'] = 'disable';
			$ReturnJsonToWeb = [
				"timestamp" => time(),
				"dAction"   => $data
			];
			echo "Action: " . $data .  ";\n";
		}
        //Очистить всё
        elseif ($data == "Clear") {
            echo "Action: Clear All\n";
            $ReturnJsonToWeb = ActionClearAll();
        }
        //Очистить Титры
        elseif ($data == "ClearOBS" || $data == "ClearTV" || $data == "ClearTablo") {
            echo "Action: " . $data .  ";\n";
            $ReturnJsonToWeb = ActionClear($data);
        }
        //Перезагрузка титров
        elseif ($data == "ReloadTV" || $data == "ReloadOBS" || $data == "ReloadTablo") {
            $ReturnJsonToWeb = ActionReload($data);
        }
        //Открыть титры для Хоккея
        elseif ($data == "OpenTVHK") {
            echo "Action: " . $data .  ";\n";
            $ReturnJsonToWeb = ActionOpenTVHK();
        }
        //Открыть титры для Футбола
        elseif ($data == "OpenTVFootball") {
            echo "Action: " . $data .  ";\n";
            $ReturnJsonToWeb = ActionOpenTVFootball();
        }
        //Перезагрузка конфиг. файла
        elseif ($data == "ReOpenINI") {
            echo "Action: " . $data .  ";\n";
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
        }
        else {
            echo "Нет такой команды!\n";
        }

        if (array_key_exists('dAction', $ReturnJsonToWeb)) {
            foreach($users as $connection) {
                $connection['connect']->send(json_encode($ReturnJsonToWeb));
            }
        }
        $DBFile = fopen(__DIR__ . '/DB/DB.json', 'w');
        fwrite($DBFile, json_encode($EventDB, JSON_PRETTY_PRINT|JSON_HEX_APOS|JSON_HEX_QUOT));
        fclose($DBFile);

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
$ws_worker->onWorkerStart = function() use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users) {
    // Обрабатываем базу данных
    if (file_exists(__DIR__ . "/DB/DB.json")) {
        $tempEventDB = json_decode( file_get_contents(__DIR__ . '/DB/DB.json') , true );
        if ($ini["PrintConsoleInfo"] == "y") {echo "Читаем базу\n";}
        if (is_array($tempEventDB) && $tempEventDB['DBVersion'] == $EventDB['DBVersion']) {
            $EventDB = $tempEventDB;
            if ($ini["PrintConsoleInfo"] == "y") {echo "База актуальной версии!\n";}
        }
        else {
            if ($ini["PrintConsoleInfo"] == "y") {echo "База старой версии!!!!\n";}
        }
    }
    if ($ini['HOCKEY_SERVER_TYPE']=="DIAN") {
        //----------------------------------------------------

        echo "Мы пытаемся подключиться к Hockey!\n";
        $connection = new AsyncTcpConnection("tcp://" . $ini['DIAN_HOCKEY_IP'] . ":". $ini['DIAN_HOCKEY_PORT']);
        $connection->onConnect = function($connection) {
            echo "Мы подключились к Hockey!\n";
        };
        $connection->onMessage = function($connection, $data) use (&$EventDB, &$ini, &$EventsTimer, &$EventsType, &$users, &$RawInputLogFile) {
            $ReturnJsonToWeb = '';
            if ($ini["PrintConsoleInfo"] == "y") {
                //print_r (unpack("h*",$data));
            }
            $len = strlen($data);
            $Modify = 0;
            for($index = 0;          $index < $len;               $index++){
                //echo "Counter: {$index}\n";
                $d = unpack("H*data", substr($data, $index, 1));
                // Пакеты статичных строк (10 байт):
                if (hexdec($d["data"]) == 3) {
                    $byteArray = unpack("H2Chet1/h1Chet2/h1Chet3/h1Chet4/h1Chet5/h1Chet6/h1Chet7/h1Chet8/H2Chet9",substr($data, $index+1, 9));
                    $command = (int)hexdec($byteArray["Chet1"]);
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
                                            if ($ini["PrintConsoleInfo"] == "y") { /*echo "Events type >>>>>>>>>>>\n";*/}
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
                            }
                            if ($ini["PrintConsoleInfo"] == "y") {
                                echo "Events  ".$EventsExecute['Execute']. " == " . $EventsTimer[$key]['COUNT'] ."  >>>>>>>>>>>\n";
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
