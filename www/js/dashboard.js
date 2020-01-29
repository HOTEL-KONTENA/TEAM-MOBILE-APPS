function openMyTab(id, tab){
    $(".tab-content").removeClass('active');
    $(".tab .icon").removeClass('active');
    $("#"+id).addClass('active');
    $("#"+tab).addClass('active');
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
    //2B. LOAD TAMU
    this.room()
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

function room (){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    oid = 0
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "https://enginev1.hotelkontena.com/api/room/status",
        data: { has_user: true, group_by_room:true, created_at_gte: 'today', org_id : oid, status: ['OCCUPIED_DIRTY', 'VACANT_DIRTY'] },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".status").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.length){
                    var html = '<div class="item align-center status"><i class="float-center" style="font-size:11px;">tidak ada data tamu</i></div>'
                    $('#guestSection').append(html); //append your new tr
                }
                $(msg.data).each(function () {
                    var h = new Date(this.created_at).getHours();
                    h = ("0" + h).slice(-2);
                    var m = new Date(this.created_at).getMinutes();
                    m = ("0" + m).slice(-2);
                    let note = 'Checked in to rm '+this.room.name;
                    if(this.status === 'VACANT_DIRTY'){
                        let note = 'Checked out from rm '+this.room.name;
                    }
                    var html = '<div class="item status"><div class="left"><i class="icon ion-home"></i></div><h2 class="text-green text-strong">'+this.user.name+'</h2><p class="text-grey-500">'+note+'</p><div class="right align-right text-small"><ul><li class="text-green text-strong">'+h+':'+m+'</li><li class=" text-grey-500">'+this.when+'</li></ul></div>';
                    $('#guestSection').append(html); //append your new tr
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