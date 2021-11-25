screen.orientation.lock('portrait-primary').then(function success() {
    console.log("Successfully locked the orientation");
}, function error(errMsg) {
    console.log("Error locking the orientation :: " + errMsg);
});

window.localStorage.setItem('base_url', 'https://sandy.hotelkontena.com/api');
// window.localStorage.setItem('base_url', 'https://enginev1.hotelkontena.com/api');

document.addEventListener("deviceready", onDeviceReadyFCM, false);
 
function onDeviceReadyFCM(){
    FCMPlugin.onNotification(function(data){
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          window.localStorage.setItem('notif.title', data.title);
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
          window.localStorage.setItem('notif.title', data.title);
        }
        
        if(sessionStorage.getItem('user.jwt') !== null){
          window.location.href = "dashboard.html";
        }
    });
}

function onBackToDashboard(hash){
    window.location.href = "dashboard.html#"+hash;
}

function money(n) {
    return n.toLocaleString('en-US', {minimumFractionDigits: 0});
}
