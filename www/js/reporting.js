$(function() {
    $("#formReport").show();
    $("#sendingReport").hide();
});

function reporting(){
    window.plugins.mockgpschecker.check(successMockCheckerCallback, errorMockCheckerCallback);
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
        contentType: 'application/x-www-form-urlencoded',
        url: "https://enginev1.hotelkontena.com/api/hr/absent",
        data: { latitude: sessionStorage.getItem('input.latitude'),  longitude: sessionStorage.getItem('input.longitude'), image: sessionStorage.getItem('input.image'), is_in_office:  $("#is_in_office").prop("checked"), org_id : oid },
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
