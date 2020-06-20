
$(function() {
    this.inboxDetail()
});


function inboxDetail (){
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
        url: window.localStorage.getItem('base_url')+"/inbox",
        data: { has_approved: 0, org_id: oid, id: sessionStorage.getItem('session.read') },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".detail").remove(); //remove all the tr's except first ,As you are using it as table headers.            

                $(msg.data).each(function () {
                    var d = new Date(this.created_at).getDate();
                    var m = mN[new Date(this.created_at).getMonth()];
                    var Y = new Date(this.created_at).getFullYear();
                    // if(this.approved_at === null){
                    var html = '<div class="item detail"><p class="text-grey-500 wrap">'+this.title+'</p></div><div class="item detail"><p class="text-grey-500 wrap">'+this.render+'</p></div><div class="item detail center"><button class="left red circle icon ion-close" onClick="declineInbox('+this.id+')"></button><button class="green circle icon ion-checkmark" onClick="approveInbox('+this.id+')"></button></div>';
                    $('#readSection').append(html); //append your new tr
                    // }
                });
            }else{
                alert(msg.message);
            }
        }
    });
}


function declineInbox (id){
    if(confirm('Anda yakin menolak permintaan ini?')){
        oid = 0
        let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
        for (let i in ps) {
            oid = ps[i].org_id
        }
        $.ajax({
            crossDomain: true,
            type: 'DELETE',
            // make sure you respect the same origin policy with this url:
            // http://en.wikipedia.org/wiki/Same_origin_policy
            url: window.localStorage.getItem('base_url')+"/inbox/decline",
            data: { org_id: oid, id: id },
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
                // xhr.setRequestHeader("X-Mobile", "false");
            },
            success: function(msg){
                if(msg.status==='success'){
                    alert('BERHASIL OTORISASI DATA')
                    window.location.href = "inbox.html";
                }else{
                    alert(msg.message);
                }
            }
        });
    }
}

function approveInbox (id){
    if(confirm('Anda yakin menyetujui permintaan ini?')){
        oid = 0
        let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
        for (let i in ps) {
            oid = ps[i].org_id
        }
        $.ajax({
            crossDomain: true,
            type: 'POST',
            // make sure you respect the same origin policy with this url:
            // http://en.wikipedia.org/wiki/Same_origin_policy
            url: window.localStorage.getItem('base_url')+"/inbox/approve",
            data: { org_id: oid, id: id },
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
                // xhr.setRequestHeader("X-Mobile", "false");
            },
            success: function(msg){
                if(msg.status==='success'){
                    alert('BERHASIL OTORISASI DATA')
                    window.location.href = "inbox.html";
                }else{
                    alert(msg.message);
                }
            }
        });
    }
}


function onBackToInbox(){
    window.location.href = "inbox.html";
}
