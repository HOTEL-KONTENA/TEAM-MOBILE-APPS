
$(function() {
    this.reported()
});


function reported (){
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
        url: "https://enginev1.hotelkontena.com/api/hr/history",
        data: { start: 'first day of this month', end: 'today', org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".history").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.data.length){
                    var html = '<div class="item align-center history"><i class="float-center" style="font-size:11px;">tidak ada riwayat kehadiran</i></div>'
                    $('#reportedSection').append(html); //append your new tr
                }

                $(msg.data.data).each(function () {
                    var d = new Date(this.date).getDate();
                    var m = mN[new Date(this.date).getMonth()];
                    var Y = new Date(this.date).getFullYear();
                    var html = '<div class="item history"><div class="row"><div class="col-25"><p class="align-center">'+d+' '+m+' '+Y+'</p></div><div class="col"><p class="text-grey-500 wrap"><strong>'+this.at+'</strong><br/>'+this.status+'</p></div></div></div>';
                    $('#reportedSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}
