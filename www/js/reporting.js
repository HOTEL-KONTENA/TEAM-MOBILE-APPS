$(function() {
    $("#formReport").show();
    $("#sendingReport").hide();
    
    //2. get schedule
    this.schedule();
});

function reporting(){
    window.plugins.mockgpschecker.check(successMockCheckerCallback, errorMockCheckerCallback);
}

function schedule (){
    $.ajax({
        crossDomain: true,
        type: 'GET',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        url: window.localStorage.getItem('base_url')+"/whoami",
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem('user.jwt'));
            // xhr.setRequestHeader("X-Mobile", "false");
        },
        success: function(msg){
            if(msg.status==='success'){
                $("#scheduleScetion .schedules").remove();       
                if(!msg.data.user.works_in_hotel){
                    let html = '<div class="item schedules"><p>Belum ada schedule</p></div>';
                    $('#scheduleScetion').append(html); //append your new tr
                }

                $(msg.data.user.works_in_hotel).each(function () {
                    $(this.schedules).each(function () {
                        let date_in = new Date(this.date_in);
                        let time_in = date_in.getHours() + ":" + (date_in.getMinutes()<10?'0':'') + date_in.getMinutes();

                        let date_out = new Date(this.date_out);
                        let time_out = date_out.getHours() + ":" + (date_out.getMinutes()<10?'0':'') + date_out.getMinutes();

                        let html = '<div class="item schedules"><p>'+this.title+' [ '+time_in+' - '+time_out+' ]</p><div class="right"><input type="radio" name="schedule_ids" value='+this.id+' class="teal"></div></div>';
                        $('#scheduleScetion').append(html); //append your new tr
                    });
                });
            }else{
                alert(msg.message);
            }
        }
    });
}

function successMockCheckerCallback(result) {
  if(!result.isMock){
      navigator.geolocation.getCurrentPosition(this.onLocationSuccess, this.onLocationFail, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });               
  }else{
    alert('HARAP MATIKAN/HAPUS APLIKASI FAKE GPS, SAAT MELAPOR KEHADIRAN')
  }
}
 
function errorMockCheckerCallback(error) {
  sessionStorage.setItem('session.mock', true);
}

function onLocationSuccess(position) {
    sessionStorage.setItem('input.latitude', position.coords.latitude);
    sessionStorage.setItem('input.longitude', position.coords.longitude);
    this.submitReport()
}

function onLocationFail(message) {
    alert('Gagal mendapatkan lokasi Anda. Pastikan GPS Anda menyala');
}

function submitReport (){
    $("#formReport").hide();
    $("#sendingReport").show();

    const oid   = sessionStorage.getItem('org.id');
    schedule_id = null

    var ele = document.getElementsByName('schedule_ids'); 
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked){
            schedule_id = ele[i].value
        }
        
    } 

    $.ajax({
        crossDomain: true,
        type: 'POST',
        // make sure you respect the same origin policy with this url:
        // http://en.wikipedia.org/wiki/Same_origin_policy
        contentType: 'application/x-www-form-urlencoded',
        url: window.localStorage.getItem('base_url')+"/hr/absent",
        data: { latitude: sessionStorage.getItem('input.latitude'),  longitude: sessionStorage.getItem('input.longitude'), image: sessionStorage.getItem('input.image'), is_in_office:  $("#is_in_office").prop("checked"), org_id : oid, schedule_id: schedule_id },
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
