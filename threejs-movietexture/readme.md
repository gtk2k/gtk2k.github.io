#three.js(WebGL)で動画を表示させる
three.js(WebGL)では、HTMLの<img>、<canvas>、<video>からテクスチャーを作成することが可能です。
今回は動画を表示させるのが目的なので、<video>からテクスチャーを生成し表示(再生)させます。

##STEP 1: Getting Started
まずは、もっとも簡単なサンプルとして、Planeオブジェクトに動画テクスチャーを張り、表示(再生)させます。
以降のステップはこのサンプルコードをベースとして進みます。
```js
    'use strict';

    window.onload = init;

    var renderer, scene, camera;
    var movieTexture;
    var controls;
    var isStereo = false;

    function init() {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
      // カメラを手前に引く
      camera.position.z = 1.1;

      // 動画を表示させるPlaneジオメトリを生成
      var geometry = new THREE.PlaneBufferGeometry(1280 / 720, 1);

      // 動画を最セするためのvideoエレメントを作成
      var video = document.createElement('video');
      video.loop = true;
      video.autoplay = true;
      video.src = 'big-buck-bunny_294_1280x720.mp4';

      // videoエレメントからからテクスチャーを生成
      movieTexture = new THREE.Texture(video);

      // テクスチャーにmovieTextureを使用してマテリアルを生成
      // sideプロパティには、THREE.FrontSide(表), THREE.BackSide(裏), THREE.DoubleSide(表裏両方)が設定できる
      // THREE.DoubleSideを設定すると3Dオブジェクト(ポリゴン)の表はもとより裏を表示してもテクスチャーが描画される(裏は鏡像になる)
      var material = new THREE.MeshBasicMaterial({ map: movieTexture, side: THREE.DoubleSide });

      var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // WebGLでレンダリングされていることを示すため、コントロールライブラリを使用して、
      // マウスやタッチスライドで回転・ズームできるようにする
      controls = new THREE.OrbitControls(camera, renderer.domElement);

      render();
    }

    function render() {
      requestAnimationFrame(render);
      // 毎フレーム 動画テクスチャーのneedsUpdateプロパティをtrueにセットすることで動画の再生を行う
      movieTexture.needsUpdate = true;
      // コントロールをアップデート
      controls.update();
      // レンダリング
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
```
(STEP 1 デモ)[https://gtk2k.github.io/threejs-movietexture/step1.html]

##STEP 2: 警告を消す
STEP 1で動画を再生させることができました。実行自体はできるのですが、ただ、開発ツールを開くとコンソールに警告が出続けてしまいます。
この警告を出力させないようにするには、movieTextureのminFilterをLinearFilter(THREE.LinearFilter)に設定します。


