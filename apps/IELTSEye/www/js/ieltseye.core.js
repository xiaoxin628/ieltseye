currentPage = 0;
weiboUrl = 'http://weibo.com/';
siteUrl = 'http://www.ieltseye.com/';
apiUrl = siteUrl + 'ieltsApi/index';
versionApi = siteUrl + 'ieltsApi/version';
keyword = '';
//每次只请求一次
connectionLock = false;
version = '1.0.2';
ieltseyeFileSystem = '';

//检查网络连接

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    if (navigator.connection.type == Connection.NONE) {
        alert('Connection type: ' + states[networkState]);
        $.mobile.loading("hide");
        return false;
    }
    if (connectionLock) {
        alert('正在请求中，请稍等...');
        return false;
    }
    return true;
}

function checkUpdate(file){
    console.log('checkUpdate');
    //6小时提示升级一次.
    var notifyTime = 21600*1000;
    console.log(device.platform);
    console.log(notifyTime);
    console.log(file.lastModifiedDate);
    //debug
    if(file.lastModifiedDate <= (Date.parse(new Date()) - notifyTime)){
        var newVersion = '';
        var updateUrl = '';
        $.ajax({
            type: "get",
            url: versionApi+"?platform="+device.platform,
            async:false,
            dataType: "json",
            success: function(data) {
                updateUrl = data.updateUrl;
                newVersion = data.version;
            },
        });
        var onConfirm = function(buttonIndex){
            console.log(buttonIndex);
            if (buttonIndex == 1) {
                var ref = window.open(encodeURI(updateUrl), '_system');
            }
        };

        if (version != newVersion && newVersion !== '') {
            navigator.notification.vibrate(1000);
            navigator.notification.confirm(
                newVersion+' has been released!',  // message
                onConfirm,
                'New version',            // title
                'Upgrade,Later'                  // buttonName
            );
            //remove
            ieltseyeFileSystem.root.getFile("version.txt", null, removeVersion, onFileSystemFail);
            // //create new one
            ieltseyeFileSystem.root.getFile("version.txt", {create: true, exclusive: false});
        }else{
            console.log("verson:"+version+",newVersion"+newVersion);
        }
    }
}

function removeVersion(fileEntry){
    fileEntry.remove(null,onFileSystemFail);
    console.log('remove '+fileEntry.name);
}

function gotFS(fileSystem) {
    ieltseyeFileSystem = fileSystem;
    fileSystem.root.getFile("version.txt", {create: true, exclusive: false}, gotFileEntry, onFileSystemFail);
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, onFileSystemFail);
}

function gotFile(file){
    checkUpdate(file);
}

function onFileSystemSuccess(fileSystem) {
    gotFS(fileSystem);
    console.log(fileSystem.name);
    console.log("sys");
}

function onResolveSuccess(fileEntry) {
    console.log(fileEntry.name);
    console.log("name");
}

function onFileSystemFail(evt) {
    console.log(evt.target.error.code);
}