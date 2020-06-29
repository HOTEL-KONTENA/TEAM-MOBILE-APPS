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
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }
    
    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/hr/quota",
        data: { start: 'first day of this month', end: 'today', org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                console.log('check', $('#quotaWleave'))
                $('#quotaWleave').html(msg.data); //append your new stat
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

function wleaveDocument() {
    console.log("check ", sessionStorage.getItem('document-workleave-id'))
    console.log("check ", JSON.parse(sessionStorage.getItem('workleave')))
    // console.log("check ", $(elem).attr('data-id'))

    var getId = parseInt(sessionStorage.getItem('document-workleave-id'));
    var getData = JSON.parse(sessionStorage.getItem('workleave'));
    var selected = getData.find(dt => { return dt.id === getId });

    console.log('get data', getData)
    console.log('selected', selected)

    var content = $('#documentDetailWleave');

    $('#document-title').html(selected.title)
    $('#document-date').html(selected.submitted_at)
    $('#document-status').html(selected.status)

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
            console.log('check', msg)
            if(msg.status==='success'){
                $(msg.data.data).each(function(index, item) {
                    var option = $('<option value="' + item.id + '" data-name="'+ item.title +'">'+ item.title + '</option>');
                    // var html = '<option value="' + item.id + '" data-item="'+ JSON.stringify(item) +'">'+ item.title + '</option>'
                    $('#componentLine').append(option);
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

// function addLine() {
//     console.log('check selected', $('#template-alert-custom'));
//     console.log('check description', descriptionLine);
//     console.log('check amount', amountLine);

    
//     const desc = $('#descriptionLine').val();
//     const amount = $('#amountLine').val();
//     const start = $('#startLine').val();
//     const end = $('#endLine').val();
//     const tmpComponent = $('#componentLine');
//     const component = $(tmpComponent.children('option')[tmpComponent[0].selectedIndex])
//     console.log('check select', $('#descriptionLine'));
//     console.log('check val', tmpComponent.val());
//     console.log('check option', tmpComponent.children('option')[tmpComponent[0].selectedIndex]);
//     console.log('check option', tmpComponent.children('option').find('selected'));
//     console.log('check selected', $(tmpComponent.children('option')[tmpComponent[0].selectedIndex]))
//     lines.push({
//         desc: desc,
//         started_at: start,
//         ended_at: end,
//         amount: amount,
//         component_id: tmpComponent.val(),
//         component_title: component.attr('data-name')
//     })
//     console.log('ceechk', lines)
    
//     console.log('check component', this.component)
//     console.log('check component', component.attr('data-name'))
// }

function test(param) {
    console.log('check param', param)
    alert({
        title: 'Ajukan Cuti',
        message: 'Harap isikan data berikut',
        template: 'template-alert-custom',
        width: '90%',
        inputs: [
            {
                label: 'Test'
            }
        ],
        buttons:[
            {
                label: 'Finish',
                onclick: function() {
                    console.log('check this', this)
                    addLine();
                    // closeAlert();
                }
            },
            {
                label:'Cancel',
                onclick: function() {
                    closeAlert();
                }
            }
        ]
    })
}

function loadLine() {
    console.log('check lines', lines);
    lines.forEach(function(item, index) {
        console.log('chekc item', item)
        console.log('chekc index', index)
    })
}

function onFormLine() {
    window.location.href = "wleaveFormLine.html";
}

function wleaveTemplate() {
    
}

// DEFINED LINKS
function onNewWleave(){
    window.location.href = "wleaveForm.html";
}

// DEFINED LINKS
function onBackToWleave(){
    window.location.href = "workleave.html";
}
