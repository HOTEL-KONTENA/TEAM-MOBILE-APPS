$(function() {
    this.headline()
    this.reported()

    $("#reportingSection").hide();
    $("#reportedSection").hide();
    $("#sendingReport").hide();
});

function headline (){
    $("#teamName").html(sessionStorage.getItem('user.name'));
    
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        $("#teamRole").html(ps[i].role);
    }
}

function reported (){
    oid = 0
    let ps = JSON.parse(sessionStorage.getItem('user.works_in_hotel'));
    for (let i in ps) {
        oid = ps[i].org_id
    }

    navigator.geolocation.getCurrentPosition(this.onLocationSuccess, this.onLocationFail, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });               

    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: "http://enginev1.hotelkontena.com/hr/history",
        data: { start: 'today', end: 'today', org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $(".history").remove(); //remove all the tr's except first ,As you are using it as table headers.            

                $(msg.data.data).each(function () {
                    var html = '<div class="item history"><div class="left"><p class="align-center">'+this.at+'</p></div><p class="text-grey-500">'+this.status+'</p></div>';
                    $('#reportedSection').append(html); //append your new tr
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

// Change image source and upload photo to server
function onLocationSuccess(position) {
    // Set image source
    sessionStorage.setItem('input.latitude', position.coords.latitude);
    sessionStorage.setItem('input.longitude', position.coords.longitude);
}

function onLocationFail(message) {
    alert('Failed because: ' + message);
}

function reportingToggle() {
    $("#reportingSection").toggle();
}

function reportedToggle() {
    $("#reportedSection").toggle();
}

function reporting(){
    if(sessionStorage.getItem('session.mock')){
        alert('HARAP MATIKAN MOCK LOCATION, SAAT MELAPOR KEHADIRAN')
    }else{
        this.submitReport()
    }
}

function submitReport (){
    $("#formReport").hide();
    $("#sendingReport").show();

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
        url: "http://enginev1.hotelkontena.com/hr/absent/",
        data: { latitude: sessionStorage.getItem('input.latitude'),  longitude: sessionStorage.getItem('input.longitude'), image: sessionStorage.getItem('input.image'), is_in_office:  $("#input.is_in_office").val(), org_id : oid },
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                document.getElementById('takePhoto').src = "img/camera.png";
                
                $("#sendingReport").hide();
                $("#formReport").show();

                alert('Data Anda telah tersimpan');
                this.reported()
            }else{
                $("#sendingReport").hide();
                $("#formReport").show();
                
                alert(msg.message);
            }
        }
    });

}