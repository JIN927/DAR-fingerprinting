<?php
require 'DBConnection.php';

class Result {
    public $id = "";
    public $platform = "";
    public $plugins = "";
    public $nbVisits = "";
}

function sortPlugins($plugs){
    $allPlugins = explode(", ", $plugs);
   
    asort($allPlugins);
    
    $allPluginsSortedString = "";
    foreach ($allPlugins as &$plug) {
        $allPluginsSortedString = $allPluginsSortedString . ", " . $plug;
    }
    $allPluginsSortedString = substr($allPluginsSortedString,2);
    return $allPluginsSortedString;
}

$platform = $_POST["platform"];
$plugins = $_POST["plugins"];

$pluginsSorted = sortPlugins($plugins);

$sqlCheckIfUserExists = "SELECT id,nbVisits FROM users WHERE platform='$platform' AND plugins='$pluginsSorted'"; 
$reqCheckIfUserExists = mysqli_query($con,$sqlCheckIfUserExists); 

if(mysqli_num_rows($reqCheckIfUserExists)==0) {
    $sqlInsertNewUser = "INSERT INTO users (platform,plugins,nbVisits) VALUES ('$platform','$pluginsSorted',0)";
    $reqInsertNewUser = mysqli_query($con,$sqlInsertNewUser);
}
else {
    for ($setGetData = array (); $rowGetData = $reqCheckIfUserExists->fetch_assoc(); $setGetData[] = $rowGetData);
    $countGetData = count($setGetData);
    
    $nbVisits = $setGetData[0]['nbVisits'];
    $id = $setGetData[0]['id'];
    $nbVisitsNew = $nbVisits + 1;
    
    $sqlUpdateUser = "UPDATE users SET nbVisits='$nbVisitsNew' WHERE id='$id'";
    $reqUpdateUser = mysqli_query($con,$sqlUpdateUser);   
}
    
$sqlGetNewUser = "SELECT id,platform,plugins,nbVisits FROM users WHERE platform='$platform' AND plugins='$pluginsSorted'";
$reqGetNewUser = mysqli_query($con,$sqlGetNewUser); 

for ($setGetNewUser = array (); $rowGetNewUser = $reqGetNewUser->fetch_assoc(); $setGetNewUser[] = $rowGetNewUser);
$countGetNewUser = count($setGetNewUser);

if($countGetNewUser>0){
    $id = $setGetNewUser[0]['id'];
    $platform = $setGetNewUser[0]['platform'];
    $plugins = $setGetNewUser[0]['plugins'];
    $nbVisits = $setGetNewUser[0]['nbVisits'];
    $result = new Result();
    $result->id = $id;
    $result->platform = $platform;
    $result->plugins = $plugins;
    $result->nbVisits = $nbVisits;
    echo json_encode($result);
}