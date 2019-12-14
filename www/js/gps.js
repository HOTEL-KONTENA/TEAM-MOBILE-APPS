document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady(){
  navigator.geolocation.getCurrentPosition(onFindLoc, orFailLoc,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });               
}

function onFindLoc(position){
  let latlng = position.coords.latitude+","+position.coords.longitude;
	let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +latlng+ "&key=AIzaSyDhGU-wSjC89hoHPStx7bYGOjHpULJQHGI";
  $.getJSON(url, function (data) {
    let route = "",
    street_number = "",
    kelurahan = "",
    kecamatan = "",
    kota = "",
    provinsi = "",
    negara = "",
    pos = "";
    for (let i = 0; i < data.results[0].address_components.length; i++) {
        let addr = data.results[0].address_components[i];
        if (addr.types[0] == 'street_number') 
        street_number = addr.short_name;
        else if (addr.types[0] == 'route')
        route= addr.short_name;
        else if (addr.types[0] == 'administrative_area_level_4')
        kelurahan = addr.short_name;
        else if (addr.types[0] == ['administrative_area_level_3'])
        kecamatan = addr.short_name;
        else if (addr.types[0] == ['administrative_area_level_2'])
        kota = addr.short_name;
        else if (addr.types[0] == ['administrative_area_level_1'])
        provinsi = addr.short_name;
        else if (addr.types[0] == ['country'])
        negara = addr.long_name;
        else if (addr.types[0] == ['postal_code'])
        pos = addr.short_name;
    }
    let lokasi = "Lokasi Anda saat ini : "+ route +" No."+ street_number+", "+ kelurahan + ", "+ kecamatan+", "+kota+", "+provinsi+" "+ pos + ", " + negara; 
    alert(lokasi);
  });
}
function orFailLoc(err){
	alert(err)
}
