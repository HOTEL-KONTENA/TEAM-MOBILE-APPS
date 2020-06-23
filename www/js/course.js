
$(function() {
    var d = new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var h = d.getDate();
    var y = d.getFullYear();
    let fd  = y+'-01-01';
    let ld  = y+'-'+m+'-'+h;

    $('#upcomingStart').val(fd);
    $('#upcomingEnd').val(ld);

    this.upcoming()
});


function upcoming (){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    oid = 0
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }

    const start = $('#upcomingStart').val() + ' 00:00:00';
    const end = $('#upcomingEnd').val() + ' 23:59:59';

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/course",
        data: { start: start, end: end, org_id : oid},
        // data: { start: 'today', end: 'next week', org_id : oid},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".upcomingTraining").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.data.length){
                    var html = '<div class="item align-center upcomingTraining"><i class="float-center" style="font-size:11px;">tidak ada data</i></div>'
                    $('#upcomingSection').append(html); //append your new tr
                }

                $(msg.data.data).each(function () {
                    var d = new Date(this.started_at).getDate();
                    var m = mN[new Date(this.started_at).getMonth()];
                    var Y = new Date(this.started_at).getFullYear();

                    var d2 = new Date(this.ended_at).getDate();
                    var m2 = mN[new Date(this.ended_at).getMonth()];
                    var Y2 = new Date(this.ended_at).getFullYear();

                    if (this.closed_at) {
                        var closed  = '<span class="text-small red radius padding">closed</span>';
                    } else {
                        var closed  = '<span class="text-small green radius padding">open</span>';
                    }

                    if (this.trainer_id == sessionStorage.getItem('user.id')) {
                        if (this.closed_at) {
                            var html = '<div class="item upcomingTraining"><div class="row"><div class="col"><p class="align-center" style="font-size:18px;padding:5px;"><strong>'+this.title+'</strong></p><p class="align-center">' +closed+ '&nbsp;<span class="text-small green radius padding">trainer</span></p></div></div><div class="row" style="padding-top:10px;"><div class="col"><p class="align-center">'+d+' '+m+' s/d<br/>'+d2+' '+m2+' '+Y2+'</p></div><div class="col"><button class="grey radius full small">Selesai</button></div></div></div>';
                        } else {
                            var html = '<div class="item upcomingTraining"><div class="row"><div class="col"><p class="align-center" style="font-size:18px;padding:5px;"><strong>'+this.title+'</strong></p><p class="align-center">' +closed+ '&nbsp;<span class="text-small green radius padding">trainer</span></p></div></div><div class="row" style="padding-top:10px;"><div class="col"><p class="align-center">'+d+' '+m+' s/d<br/>'+d2+' '+m2+' '+Y2+'</p></div><div class="col"><button class="red radius full small" onClick="onEnroll('+this.id+')">Selesai</button></div></div></div>';
                        }
                    }
                    else{
                        if (this.enrolls.length > 0) {
                            var html = '<div class="item upcomingTraining"><div class="row"><div class="col"><p class="align-center" style="font-size:18px;padding:5px;"><strong>'+this.title+'</strong></p><p class="align-center">' +closed+ '</p></div></div><div class="row" style="padding-top:10px;"><div class="col"><p class="align-center">'+d+' '+m+' s/d<br/>'+d2+' '+m2+' '+Y2+'</p></div><div class="col"><button class="grey radius full small">Terdaftar</button></div></div></div>';
                        } else {
                            var html = '<div class="item upcomingTraining"><div class="row"><div class="col"><p class="align-center" style="font-size:18px;padding:5px;"><strong>'+this.title+'</strong></p><p class="align-center">' +closed+ '</p></div></div><div class="row" style="padding-top:10px;"><div class="col"><p class="align-center">'+d+' '+m+' s/d<br/>'+d2+' '+m2+' '+Y2+'</p></div><div class="col"><button class="green radius full small" onClick="onEnroll('+this.id+')">Daftar</button></div></div></div>';
                        }
                    }

                    $('#upcomingSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function onEnroll (id){
    oid = 0
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }

    $.ajax({
        crossDomain: true,
        type: 'PATCH',
        contentType: 'application/x-www-form-urlencoded',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/course/"+id,
        // data: { username: username, password: password, fcmtoken : fcmtoken },
        data: { org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                window.location.href = "course.html";
            }else{
                alert(msg.message);
            }
        }
    });
}
