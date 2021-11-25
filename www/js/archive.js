
$(function() {
    this.all()
});


function all (){
    var d = new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var h = d.getDate();
    var y = d.getFullYear();
    let td  = y+'-'+m+'-'+h+' 23:59:59';

    const oid = sessionStorage.getItem('org.id');

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/archive",
        data: {org_id : oid},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".allArchive").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.data.length){
                    var html = '<div class="item align-center allArchive"><i class="float-center" style="font-size:11px;">tidak ada data</i></div>'
                    $('#allSection').append(html); //append your new tr
                }

                $(msg.data.data).each(function () {
                    if (this.expired_at && this.expired_at < td) {
                        var expired  = '<span class="text-small red radius padding">expired</span>';
                    } else {
                        var expired  = '<span class="text-small green radius padding">active</span>';
                    }

                    if (this.locked_at) {
                        var locked  = '<span class="text-small green radius padding">locked</span>';
                    } else {
                        var locked  = '<span class="text-small red radius padding">open</span>';
                    }

                    var html = '<div class="item allArchive"><div class="row"><div class="col"><p class="align-left" style="font-size:15px;padding:5px;"><strong>'+this.title+'</strong></p><p class="align-left">' +locked+ '&nbsp;' +expired+ '</p></div></div></div>';

                    $('#allSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}
