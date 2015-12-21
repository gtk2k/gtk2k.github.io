AFRAME.registerComponent('dualfisheyeesimplestitch', {
  schema: {
    texture: new Image(2,2)
  },
  update: function (previousData) {
    var object3D = this.el.object3D;
    var textureElement = document.querySelector(this.data.texture);
    var vertexShader = document.getElementById('vertexShader').textContent;
    var fragmentShader = document.getElementById('fragmentShader').textContent;

    var videoTexture = new THREE.VideoTexture(textureElement);
    videoTexture.minFilter = videoTexture.magFilter;

    var material = new THREE.ShaderMaterial({
      uniforms: {
        texture: { type: 't', value: videoTexture }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    object3D.material = material;
  }
});
