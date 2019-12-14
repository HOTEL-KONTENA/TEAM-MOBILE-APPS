function onLogin(){
    const username = $('#loginPhone').val();
    const password = $('#loginPassword').val();

    $.ajax({
        crossDomain: true,
        type: 'POST',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://enginev1.hotelkontena.com/sdm/login/",
        data: { username: username, password: password },
        success: function(msg){
            if(msg.status==='success'){
                sessionStorage.setItem('user.id', msg.data.user.id);
                sessionStorage.setItem('user.name',msg.data.user.name);
                sessionStorage.setItem('user.username',msg.data.user.username);
                sessionStorage.setItem('user.jwt',msg.data.jwt_token);
                sessionStorage.setItem('user.works_in_hotel',JSON.stringify(msg.data.user.works_in_hotel));
                // lanjut ke halaman berikutnya
                window.location.href = "dashboard.html";
            }else{
                alert(msg.message);
            }
        }
    });
}
