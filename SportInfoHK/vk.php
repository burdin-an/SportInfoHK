<?php

setlocale(LC_CTYPE, 'ru_RU.UTF-8');
error_reporting(E_ALL ^ E_WARNING);

require_once __DIR__ . '/vendor/autoload.php';

use VK\Client\VKApiClient;
use \VK\OAuth\VKOAuth;
use \VK\OAuth\VKOAuthDisplay;
use \VK\OAuth\Scopes\VKOAuthUserScope;
use \VK\OAuth\VKOAuthResponseType;

$vk = new VKApiClient();

$oauth = new VKOAuth();
$client_id = 52635436;
$redirect_uri = 'https://hk.local.ru/';
$display = VKOAuthDisplay::PAGE;
$scope = [VKOAuthUserScope::VIDEO];
$state = '9IgvtdRk9PDlvh53lcCaWdMs2cUQgMdGk';

$browser_url = $oauth->getAuthorizeUrl(VKOAuthResponseType::CODE, $client_id, $redirect_uri, $display, $scope, $state);

echo $browser_url;

