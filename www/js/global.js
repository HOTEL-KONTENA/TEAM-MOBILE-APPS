screen.orientation.lock('portrait-primary').then(function success() {
    console.log("Successfully locked the orientation");
}, function error(errMsg) {
    console.log("Error locking the orientation :: " + errMsg);
});

document.addEventListener("deviceready", onDeviceReadyFCM, false);
 
function onDeviceReadyFCM(){
    FCMPlugin.onNotification(function(data){
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          alert( JSON.stringify(data.title) );
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
          alert( JSON.stringify(data.title) );
        }
    });
}

function onBackToDashboard(hash){
    window.location.href = "dashboard.html#"+hash;
}
