
var os = "-";

var clientStrings = [
    {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
    {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
    {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
    {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
    {s:'Windows Vista', r:/Windows NT 6.0/},
    {s:'Windows Server 2003', r:/Windows NT 5.2/},
    {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
    {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
    {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
    {s:'Windows 98', r:/(Windows 98|Win98)/},
    {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
    {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s:'Windows CE', r:/Windows CE/},
    {s:'Windows 3.11', r:/Win16/},
    {s:'Android', r:/Android/},
    {s:'Open BSD', r:/OpenBSD/},
    {s:'Sun OS', r:/SunOS/},
    {s:'Linux', r:/(Linux|X11)/},
    {s:'iOS', r:/(iPhone|iPad|iPod)/},
    {s:'Mac OS X', r:/Mac OS X/},
    {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s:'QNX', r:/QNX/},
    {s:'UNIX', r:/UNIX/},
    {s:'BeOS', r:/BeOS/},
    {s:'OS/2', r:/OS\/2/},
    {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
];
for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(navigator.userAgent)) {
        os = cs.s;
        break;
    }
}

console.log(os);

var nbPlugins = navigator.plugins.length;

console.log("Nombre de plugins : "+nbPlugins);

for(var i=0; i<nbPlugins    ; i++) {
  console.log(navigator.plugins[i].name+" | "+navigator.plugins[i].filename+" | "+navigator.plugins[i].description+" | "+navigator.plugins[i].version);
}

function sendDataUser() {
    var dataToSend = new Object();
    
    dataToSend.platform = os;
    
    var allPlugins = getPluginsList();
    var stringAllPlugins = convertListToString(allPlugins);
    dataToSend.plugins = stringAllPlugins;

    $.ajax({
            url:"trackingServer.php",
            type:"POST",
            data:dataToSend,
            success:function(data){
                var json = JSON.parse(data);
                document.getElementById("platform").innerHTML = json["platform"];
                document.getElementById("plugins").innerHTML = json["plugins"];
                document.getElementById("nbVisits").innerHTML = json["nbVisits"];
            },
            error:function(){
                console.log("Erreur requête");
            }
    });
}

sendDataUser();


function getPluginsList() {
    var nbPlugins = 0;
    try{
        nbPlugins = navigator.plugins.length;
    }
    catch(error){
    }
    var listPlugins = [];
    if (nbPlugins > 0){
        for( var i = 0; i<nbPlugins; i++){
            listPlugins.push(navigator.plugins[i].name);
        }
    }
    return listPlugins;
}

function convertListToString(l){
    var str = "";
    for (var i = 0; i < l.length; i++){
        str += l[i];
        if (i != (l.length-1)){
            str += ", ";
        }
    }
    return str;
}
