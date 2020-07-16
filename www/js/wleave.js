 var lines = new Array()
 var form = {}
 var descriptionLine = null,
    amountLine = null,
    startLine = null,
    endLine = null,
    componentLine = null;

 //  var component = null;
 
 $(function() {
    // this.quota()
    // this.wleave()
});


function quota (){
    oid = 0
    st  = '2019-12-16 00:00:00'
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
        //st  = ps[i].created_at
    }
    
    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/quota",
        data: { start: st, end: 'now', org_id : oid , tag: 'AL' },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $('#quotaWleave').html(msg.data); //append your new stat
            }else{
                alert(msg.message);
            }
        }
    });
}


function quotaPH (){
    oid = 0
    st  = '2019-12-16 00:00:00'
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
        //st  = ps[i].created_at
    }
    
    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/quota",
        data: { start: st, end: 'now', org_id : oid , tag: 'PH' },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $('#quotaPH').html(msg.data); //append your new stat
            }else{
                alert(msg.message);
            }
        }
    });
}


function quotaEO (){
    oid = 0
    st  = '2019-12-16 00:00:00'
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
        //st  = ps[i].created_at
    }
    
    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/quota",
        data: { start: st, end: 'now', org_id : oid , tag: 'EO' },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $('#quotaEO').html(msg.data); //append your new stat
            }else{
                alert(msg.message);
            }
        }
    });
}

function wleave() {
    const mN = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

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
        url: window.localStorage.getItem('base_url')+"/hr/workleave",
        data: { start: 'first day of this month', end: 'today', org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".document").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                if(!msg.data.data.length){
                    var html = '<div class="item align-center document"><i class="float-center" style="font-size:11px;">tidak ada riwayat pengajuan</i></div>'
                    $('#documentWleave').append(html); //append your new tr
                }

                sessionStorage.setItem('workleave', JSON.stringify(msg.data.data))
                
                $(msg.data.data).each(function(index, item) {
                    var date = moment(item.submitted_at, 'YYYY-MM-DD').isValid() ? moment(item.submitted_at).format('DD-MM-YYYY') : '-'
                    var html = '<div class="item document item-document" data-id="'+ item.id +'" onClick="selectedWleaveDocument(this)"><div class="row"><div class="col-25"><p class="align-center">'+ date +'</p></div><div class="col"><p class="text-grey-500 wrap"><strong>'+ item.title +'</strong><br/>'+item.status+'</p></div></div></div>';
                    $('#documentWleave').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function selectedWleaveDocument(elem) {
    var dataId = $(elem).attr('data-id')
    sessionStorage.setItem('document-workleave-id', dataId)
    window.location.href = "workleaveDetail.html";
}

function setFormWleave() {
    var getId = parseInt(sessionStorage.getItem('document-workleave-id'));
    if (getId) {
        var getData = JSON.parse(sessionStorage.getItem('workleave'));
        var selected = getData.find(dt => { return dt.id === getId });

        $('#formId').val(selected.id)
        $('#titleId').val(selected.title)

        if(selected.lines.length !== 0) {
            selected.lines.forEach(function(item, index) {

                var tmp = $('#template-alert-custom');
                var section = $('#workleaveLine');
                var clone = tmp.clone().removeClass('hidden').addClass('white template').css('margin-top', '20px').css('margin-bottom', '20px;').removeAttr('id');
                clone.find('#componentLine').val(parseInt(item.component_id))
                clone.find('#descriptionLine').val(item.description)
                clone.find('#amountLine').val(item.amount)
                clone.find('#startLine').val(item.started_at)
                clone.find('#endLine').val(item.ended_at)

                section.append(clone)
            })
            
        }
    }
}

function wleaveDocument() {

    var getId = parseInt(sessionStorage.getItem('document-workleave-id'));
    var getData = JSON.parse(sessionStorage.getItem('workleave'));
    var selected = getData.find(dt => { return dt.id === getId });


    var content = $('#documentDetailWleave');

    var date = moment(selected.submitted_at, 'YYYY-MM-DD').isValid() ? moment(selected.submitted_at).format('DD-MM-YYYY') : '-'
    $('#document-title').html(selected.title)
    $('#document-date').html(date)
    $('#document-status').html(selected.status)
    $('#document-edit').attr('data-id', selected.id)
    $('#document-delete').attr('data-id', selected.id)

    selected.lines.forEach(function(item, index) {
        var itemList = '<div class="row" style="margin-bottom:10px;"><div class="col"><p>'+ (index+1) + ' ' + item.description + '&nbsp; ' + item.amount +' Hari Dimulai dari tanggal '+ moment(item.started_at, 'YYYY-MM-DD').format('DD-MM-YYYY') +' sampai dengan tanggal '+ moment(item.ended_at, 'YYYY-MM-DD').format('DD-MM-YYYY') +'</p></div></div>'
        $('#document-lines').append(itemList)
    })

    if(selected.status !== 'DRAFT') {
        $('#document-edit').hide()
        $('#document-delete').hide()
    }
}

function wleavecomponent() {
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
        url: window.localStorage.getItem('base_url')+"/hr/component",
        data: { date: 'today', org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(msg.data.data).each(function(index, item) {
                    var option = $('<option value="' + item.id + '" data-name="'+ item.title +'">'+ item.title + '</option>');
                    // var html = '<option value="' + item.id + '" data-item="'+ JSON.stringify(item) +'">'+ item.title + '</option>'
                    $('.componentLine').append(option);
                })
                // $('#category').
                // $(".document").remove(); //remove all the tr's except first ,As you are using it as table headers.            
                // if(!msg.data.data.length){
                //     var html = '<div class="item align-center document"><i class="float-center" style="font-size:11px;">tidak ada riwayat pengajuan</i></div>'
                //     $('#documentWleave').append(html); //append your new tr
                // }
                
                // $(msg.data.data).each(function () {
                //     var d = new Date(this.date).getDate();
                //     var m = mN[new Date(this.date).getMonth()];
                //     var Y = new Date(this.date).getFullYear();
                //     var html = '<div class="item document"><div class="row"><div class="col-25"><p class="align-center">'+d+' '+m+' '+Y+'</p></div><div class="col"><p class="text-grey-500 wrap"><strong>'+this.at+'</strong><br/>'+this.status+'</p></div></div></div>';
                //     $('#documentWleave').append(html); //append your new tr
                // });
            }else{
                alert(msg.message);
            }
        }
    });
}

function onChangeAmount(elem) {
    const tmpParent = $(elem).parents('.template');
    const startLine = $(tmpParent).find('.startLine');

    if (startLine.val() !== '') {
      onChangeStart($(tmpParent).find('.startLine'));
    }
  }

  function onChangeStart(elem) {
    const tmpParent = $(elem).parents('.template');
    const tmpElemAmount = $(tmpParent).find('.amountLine');
    const tmpAmount = parseInt($(tmpElemAmount).val());
    const endDate = moment($(elem).val()).add(parseInt(tmpAmount), 'days').format('YYYY-MM-DD');

    $(tmpParent.find('.endLine')).val(endDate);
  }

function addDocument() {
    var tmp = $('#template-alert-custom');
    var section = $('#workleaveLine');
    var clone = tmp.clone().removeClass('hidden').addClass('white template').css('margin-top', '20px').css('margin-bottom', '20px;').removeAttr('id');

    section.append(clone);
}

function deleteDocument(elem) {
    $(elem).parents('.template').remove();
}

function save() {
    var tmp = $('#workleaveLine');
    lines = []
    tmp.children('.template').each(function(index, item) {
        const id = $('#formId').val()
        const title = $('#titleId').val()
        const desc = $(item).find('.descriptionLine').val();
        const amount = $(item).find('.amountLine').val();
        const start = $(item).find('.startLine').val();
        const end = $(item).find('.endLine').val();
        const component = $(item).find('.componentLine');
        const componentOption = $(component.children('option')[component[0].selectedIndex])
        
        lines.push({
            description: desc,
            started_at: start,
            ended_at: end,
            amount: amount,
            component_id: component.val(),
            component_title: componentOption.attr('data-name')
        })
        form.id = id
        form.title = title
        form.lines = lines
    })

    $.ajax({
        crossDomain: true,
        type: 'POST',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/workleave",
        data: { 
            title: form.title, 
            lines: form.lines,
            org_id : oid 
        },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                window.location.href = "workleave.html";
            }else{
                alert(msg.message);
            }
        }
    });
}

function update(elem) {
    var dataId = $(elem).attr('data-id')
    sessionStorage.setItem('document-workleave-id', dataId)

    oid = 0
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }

    $.ajax({
        crossDomain: true,
        type: 'PATCH',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/workleave/" + dataId,
        data: { org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                window.location.href = "workleave.html";
            }else{
                alert(msg.message);
            }
        }
    });
}

function deleted(elem) {
    var dataId = $(elem).attr('data-id')
    sessionStorage.setItem('document-workleave-id', dataId)

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
        url: window.localStorage.getItem('base_url')+"/hr/workleave/" + dataId,
        data: {
            org_id : oid   
        },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                window.location.href = "workleave.html";
            }else{
                alert(msg.message);
            }
        }
    });
}

function loadLine() {
    lines.forEach(function(item, index) {
    })
}

function onFormLine() {
    window.location.href = "wleaveFormLine.html";
}

function wleaveTemplate() {
    
}

// DEFINED LINKS
function onNewWleave(){
    sessionStorage.removeItem('document-workleave-id')
    window.location.href = "wleaveForm.html";
}

// DEFINED LINKS
function onBackToWleave(){
    window.location.href = "workleave.html";
}
