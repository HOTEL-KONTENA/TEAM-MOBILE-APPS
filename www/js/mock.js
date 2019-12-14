document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
  window.plugins.mockgpschecker.check(successCallback, errorCallback);
}
 
function successCallback(result) {
  console.log(sessionStorage.setItem('session.mock')); // true - enabled, false - disabled
}
 
function errorCallback(error) {
  alert(error);
}