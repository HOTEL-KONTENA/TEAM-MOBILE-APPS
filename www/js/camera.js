// window.plugins.flashlight.available(function(isAvailable) {
//   if (!isAvailable) {
//     alert("HANYA BISA ABSEN MELALUI DEVICE DENGAN FLASHLIGHT");
//   }
// });

let app = {
    init: function(){
        document.getElementById('takePhoto').addEventListener('click', app.takephoto);
    },
    takephoto: function(){
        let opts = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: 1,
        };
        
        navigator.camera.getPicture(app.ftw, app.wta, opts);
    },

    ftw: function(imgURI){
        sessionStorage.setItem('input.image', imgURI);
        document.getElementById('takePhoto').src = "data:image/jpeg;base64," +imgURI;
    },

    wta: function(msg){
        alert(msg);
    }
};

document.addEventListener('deviceready', app.init);