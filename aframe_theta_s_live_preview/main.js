navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.mozGetUserMedia && (selectDevice.style.display = 'none');
var thetaSDeviceId = null;
navigator.mediaDevices.enumerateDevices().then((devices) => {
  for(var device of devices) {
    console.log(device.label);
    device.label.includes('RICOH THETA S') && (thetaSDeviceId = device.deviceId);
    if (device.kind !== 'videoinput') continue;
    var opt = document.createElement('option');

    opt.text = device.label || device.deviceId;
    opt.value = device.deviceId;
    selectDevice.appendChild(opt);
  }
  thetaSDeviceId && (selectDevice.value = thetaSDeviceId);
  changeInput(thetaSDeviceId || selectDevice.value);
  selectDevice.addEventListener('change', () => {
    changeInput(selectDevice.value);
  });
});

var changeInput = (deviceId) => {
  navigator.getUserMedia({
    video: {
      optional: [{ sourceId: deviceId }]
    }, audio: false
  }, (stream) => {
    texVideo.src = URL.createObjectURL(stream);
    texVideo.play();
  }, () => { });
}
