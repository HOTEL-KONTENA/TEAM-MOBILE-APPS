
function onChangePassword(){
    window.location.href = "password.html";
}

function onSubmitNewPassword(){
    const old_password = $('#oldPassword').val();
    const new_password = $('#newPassword').val();
    const confirmation_password = $('#confirmPassword').val();

    $.ajax({
        crossDomain: true,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://128.199.145.173:9888/api/password",
        data: { old_password: old_password, new_password: new_password, confirmation_password: confirmation_password },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                sessionStorage.setItem('user.id', msg.data.user.id);
                sessionStorage.setItem('user.name',msg.data.user.name);
                sessionStorage.setItem('user.username',msg.data.user.username);
                sessionStorage.setItem('user.jwt',msg.data.jwt_token);
                sessionStorage.setItem('user.partners',JSON.stringify(msg.data.user.partners));
                $('#oldPassword').val('');
                $('#newPassword').val('');
                $('#confirmPassword').val('');
                alert('Password anda berhasil diganti'); //append your new tr
                window.location.href = "dashboard.html#profileTab";
            }else{
                alert(msg.message);
            }
        }
    });
}

function onForgetPassword(){
    const username = $('#loginPhone').val();

    $.ajax({
        crossDomain: true,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://128.199.145.173:9888/api/forget",
        data: { username: username},
        success: function(msg){
            if(msg.status==='success'){
                sessionStorage.setItem('user.username',username);
                alert(msg.message);
                window.location.href = "reset.html";
            }else{
                alert(msg.message);
            }
        }
    });
}

function onResetPassword(){
    const username = sessionStorage.getItem('user.username');
    const token    = $('#otp').val();
    const password = $('#newPassword').val();

    $.ajax({
        crossDomain: true,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://128.199.145.173:9888/api/reset",
        data: { username: username,  password: password, token:token },
        success: function(msg){
            if(msg.status==='success'){
                alert(msg.message);
                sessionStorage.clear();
                window.location.href = "index.html";
            }else{
                alert(msg.message);
            }
        }
    });
}
function onBackToForget(){
    window.location.href = "forget.html";
}

function onBackToLogin(){
    window.location.href = "index.html";
}
