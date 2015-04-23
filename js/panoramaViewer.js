function panoramaViewer(){
  renderer = new THREE.WebGLRenderer({ antialias: true });
  //renderer.context.canvas.addEventListener("webglcontextlost", function (event) {
  //  event.preventDefault();
  //  cancelAnimationFrame(animationId);
  //  console.log('webGL Context Lost');
  //}, false);
  //renderer.context.canvas.addEventListener("webglcontextrestored", function (event) {
  //  console.log('webGL Context Restored');
  //}, false);
  document.body.appendChild(renderer.domElement);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  var geometry = new THREE.SphereGeometry(100, 128, 128);
  geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  //var geometry = new THREE.PlaneBufferGeometry(video.videoWidth, video.videoHeight, 1, 1);
  videoTexture = new THREE.Texture(video);
  videoTexture.generateMipmaps = false;
  videoTexture.magFilter = videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
  videoTexture.repeat.x = 0.5;
  //videoTexture.anisotropy = renderer.getMaxAnisotropy();
  var material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
  var mesh = new THREE.Mesh(geometry, material);
  //mesh.position.z = -1000;
  scene.add(mesh);

  vrEffect = new THREE.VREffect(renderer);
  vrEffect.setSize(window.innerWidth, window.innerHeight);
  oculusEffect = new THREE.OculusRiftEffect(renderer, { scale: 1.0 });
  var vrManager = new WebVRManager(renderer, vrEffect);
  vrControls = new THREE.VRControls(camera, null, deviceType == 'PC' ? window.normalModeInputDevice : null);

  window.addEventListener('resize', function (event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    vrEffect.setSize(window.innerWidth, window.innerHeight);
  }, false);

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (location.search) {
      vrControls.update(true);
      videoTexture.needsUpdate = true;
      oculusEffect.render(scene, camera);
    } else {
      vrControls.update(vrManager.isVRMode());
      if (vrManager.isVRMode()) {
        videoTexture.needsUpdate = true;
        vrEffect.render(scene, camera, videoTexture);
      } else {
        videoTexture.offset.x = .5;
        videoTexture.needsUpdate = true;
        renderer.render(scene, camera);
      }
    }
  }
  var animationId = requestAnimationFrame(animate);
}