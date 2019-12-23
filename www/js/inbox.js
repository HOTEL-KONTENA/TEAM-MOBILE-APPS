
$(function() {
    this.inbox()
    sessionStorage.setItem('session.read', 0)
});


function inbox (){
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
        url: "http://128.199.145.173:9888/api/inbox",
        data: { has_approved: 0, org_id: oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".inbox").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.length){
                    var html = '<div class="item align-center inbox"><i class="float-center" style="font-size:11px;">tidak pesan masuk</i></div>'
                    $('#inboxSection').append(html); //append your new tr
                }

                $(msg.data).each(function () {
                    var d = new Date(this.created_at).getDate();
                    var m = mN[new Date(this.created_at).getMonth()];
                    var Y = new Date(this.created_at).getFullYear();
                    var html = '<div class="item inbox" onClick="inboxDetail(`'+this.id+'`)"><div class="row"><div class="col-50"><p class="align-center">'+d+' '+m+' '+Y+'</p></div><div class="col"><p class="text-grey-500 wrap">'+this.title+'</p></div></div></div>';
                    $('#inboxSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function inboxDetail (id){
    sessionStorage.setItem('session.read', id)
    window.location.href = "inboxDetail.html";
}
