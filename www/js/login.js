screen.orientation.lock('portrait-primary').then(function success() {
    console.log("Successfully locked the orientation");
}, function error(errMsg) {
    console.log("Error locking the orientation :: " + errMsg);
});


function onLogin(){
    const username = $('#loginPhone').val();
    const password = $('#loginPassword').val();
        
    if (typeof FCMPlugin != 'undefined') {
        FCMPlugin.getToken(function (fcmtoken) {
            $.ajax({
                crossDomain: true,
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                // make sure you respect the same origin policy with this url:
                // http://en.wikipedia.org/wiki/Same_origin_policy
                url: "https://enginev1.hotelkontena.com/api/login",
                data: { username: username, password: password, fcmtoken : fcmtoken },
                success: function(msg){
                    if(msg.status==='success'){
                        sessionStorage.setItem('user.id', msg.data.user.id);
                        sessionStorage.setItem('user.name',msg.data.user.name);
                        sessionStorage.setItem('user.username',msg.data.user.username);
                        sessionStorage.setItem('user.jwt',msg.data.jwt_token);
                        sessionStorage.setItem('user.works_in_hotel',JSON.stringify(msg.data.user.works_in_hotel));
                        sessionStorage.setItem('announcements',JSON.stringify(msg.data.announcements));
                        // lanjut ke halaman berikutnya
                        window.location.href = "dashboard.html";
                    }else{
                        alert(msg.message);
                    }
                }
            });
        });
    }
}

function onForget(){
    window.location.href = "forget.html";
}
