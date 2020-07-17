
$(function() {
    var d = new Date();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var h = d.getDate();
    var y = d.getFullYear();
    let fd  = y+'-01-01';
    let ld  = y+'-'+m+'-'+h;

    $('#closedStart').val(fd);
    $('#closedEnd').val(ld);

    this.sent()
    this.closed()
});


function sent (){
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
        url: window.localStorage.getItem('base_url')+"/hr/payroll",
        data: { start: null, end: null, org_id : oid, 'is_closed': 0},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".sentReceipt").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.data.length){
                    var html = '<div class="item align-center sentReceipt"><i class="float-center" style="font-size:11px;">tidak ada data</i></div>'
                    $('#sentSection').append(html); //append your new tr
                }

                sessionStorage.setItem('payroll', JSON.stringify(msg.data.data))

                $(msg.data.data).each(function (index, item) {
                    var d = new Date(item.submitted_at).getDate();
                    var m = mN[new Date(item.submitted_at).getMonth()];
                    var Y = new Date(item.submitted_at).getFullYear();
                    var html = '<div class="item sentReceipt" data-id="'+ item.id +'" data-type="sent"><div class="row"><div class="col"><p class="align-center">'+item.title+'</p><p class="align-center" style="font-size:18px;padding:5px;"><strong>'+money(item.total)+'</strong></p></div></div><div class="row"><div class="col"><p class="align-center">Dikirim tanggal<br/>'+d+' '+m+' '+Y+'</p></div><div class="col"><button class="green radius full  small" onClick="onClosed('+item.id+')">Diterima</button></div></div></div>';
                    $('#sentSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function closed (){
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
    ];

    oid = 0
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }
    const start = $('#closedStart').val() + ' 00:00:00';
    const end = $('#closedEnd').val() + ' 23:59:59';

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/payroll",
        data: { start: start, end: end, org_id : oid, 'is_closed': 1},
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".closedReceipt").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.data.length){
                    var html = '<div class="item align-center closedReceipt"><i class="float-center" style="font-size:11px;">tidak ada data</i></div>'
                    $('#closedSection').append(html); //append your new tr
                }

                sessionStorage.setItem('payrollClosed', JSON.stringify(msg.data.data))

                $(msg.data.data).each(function (index, item) {
                    var d = new Date(item.submitted_at).getDate();
                    var m = mN[new Date(item.submitted_at).getMonth()];
                    var Y = new Date(item.submitted_at).getFullYear();

                    var d2 = new Date(item.closed_at).getDate();
                    var m2 = mN[new Date(item.closed_at).getMonth()];
                    var Y2 = new Date(item.closed_at).getFullYear();

                    var html = '<div class="item closedReceipt" data-id="'+ item.id +'" data-type="closed" onClick="selectedPayroll(this)"><div class="row"><div class="col"><p class="align-center">'+item.title+'</p><p class="align-center" style="font-size:18px;padding:5px;"><strong>'+money(item.total)+'</strong></p></div></div><div class="row"><div class="col"><p class="align-center">Dikirim tanggal<br/>'+d+' '+m+' '+Y+'</p></div><div class="col"><p class="align-center">Diterima tanggal <br/>'+d2+' '+m2+' '+Y2+'</p></div></div></div>';
                    $('#closedSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}


function onClosed (id){
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
        url: window.localStorage.getItem('base_url')+"/hr/payroll/"+id,
        // data: { username: username, password: password, fcmtoken : fcmtoken },
        data: { org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                window.location.href = "payroll.html";
            }else{
                alert(msg.message);
            }
        }
    });
}

function payrollDetail() {
    var getId = parseInt(sessionStorage.getItem('payroll-id'));
    var getType = sessionStorage.getItem('payroll-type');

    if(getType === 'send') {
        var getData = JSON.parse(sessionStorage.getItem('payroll'));
    } else {
        var getData = JSON.parse(sessionStorage.getItem('payrollClosed'));
    }

    var selected = getData.find(dt => { return dt.id === getId });
    var content = $('#payrollDetail');

    $('#payroll-title').html(selected.title)

    selected.lines.forEach(function(item, index) {
        var itemList = '<div class="row" style="margin-bottom:10px;"><div class="col"><p>' + item.description + '&nbsp; (' + item.unit +')</p></div><div class="col right"><p>'+ (item.price * item.qty) +'</p></div></div>';
        $('#payroll-lines').append(itemList);
    })

    $('#payroll-total').html(selected.total);
}

function selectedPayroll(elem) {
    var dataId = $(elem).attr('data-id');
    var dataType = $(elem).attr('data-type');
    sessionStorage.setItem('payroll-id', dataId);
    sessionStorage.setItem('payroll-type', dataType);
    window.location.href = "payrollDetail.html";
}

function onBackToPayroll() {
    window.location.href = "payroll.html";
}