function openMyTab(id, tab){
    $(".tab-content").removeClass('active');
    $(".tab .icon").removeClass('active');
    $("#"+id).addClass('active');
    $("#"+tab).addClass('active');

    this.notifs()
}

$(function() {
    //0. PREDEFINED WINDOW 
    hash = $(window.location.hash);
    if (hash.length === 0) {
        $("#homeTab").click(); //Activate first tab
    }else{
        hash.click()
    }

    //1. LOAD HEADLINE
    this.headline()
    //2. LOAD HOME SECTION
    //2A. LOAD ANNOUNCEMENT
    this.announcement()
    //2B. LOAD NOTIF
    // this.notifs()
});

function headline (){
    $(".teamName").html(sessionStorage.getItem('user.name'));
    
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        $(".teamRole").html(ps[i].role);
    }
}

function announcement (){
    $("#announcement .item").remove();       
    let ps2 = JSON.parse(sessionStorage.getItem('announcements'));
    for (let i in ps2) {
        for (let j in ps2[i]) {
            var html = '<div class="padding border-green shadow radius mark"><p><strong>'+i+' : </strong> '+ps2[i][j]+'</p></div>'
            // var html = '<div class="item"><span class="text-small radius padding"></span></div>'
            $('#announcement').append(html); //append your new tr
        }
    }
}

function notifs (){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/notif",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $("#notifSection .status").remove();       
                if(!msg.data.length){
                    let html = '<div class="item status"><p class="text-grey-500">Tidak ada notifikasi baru</p></div>';
                    $('#notifSection').append(html); //append your new tr
                }

                $(msg.data).each(function () {
                    var d = new Date(this.updated_at).getDate();
                    var m = mN[new Date(this.updated_at).getMonth()];
                    var Y = new Date(this.updated_at).getFullYear();
                    var html = '<div class="item status"><div class="row"><div class="col-40"><p class="align-center">'+d+' '+m+' '+Y+'</p></div><div class="col"><p class="text-grey-500 wrap">'+this.title+'</p></div></div></div></div>';
                    $('#notifSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

// DEFINED LINKS
function onReporting(){
    window.location.href = "reporting.html";
}

function onReported(){
    window.location.href = "reported.html";
}

function onWorkleave(){
    window.location.href = "workleave.html";
}

function onPayroll(){
    window.location.href = "payroll.html";
}

function onCourse(){
    window.location.href = "course.html";
}

function onArchive(){
    window.location.href = "archive.html";
}

function onInbox(){
    window.location.href = "inbox.html";
}

function onChangePassword(){
    window.location.href = "password.html";
}

function onLogout(){
    sessionStorage.clear();
    window.location.href = "index.html";
}