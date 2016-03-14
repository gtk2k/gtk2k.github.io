#three.js(WebGL)で動画を表示(再生)する
three.js(WebGL)では、HTMLのimgエレメント、canvasエレメント、videoエレメントからテクスチャーを作成することが可能です。  
今回は動画を表示させるのが目的なので、videoエレメントからテクスチャーを生成し表示(再生)させます。

##STEP 1: Getting Started
[STEP 1 デモ](https://gtk2k.github.io/threejs-movietexture/step2.html)  
まずは、もっとも簡単なサンプルとして、Planeオブジェクトに動画テクスチャーを張り、再生させてみます。
以降のステップはこのサンプルコードをベースとして進みます。  
(なお、WebGLで動画を描画していることを示すためコントロールを使ってマウスなどで回転・ズームできるようにしています)

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

      // 動画を再生(表示)するためのvideoエレメントを作成
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


##STEP 2: 警告を消す その１
[STEP 2 デモ](https://gtk2k.github.io/threejs-movietexture/step2.html)  
STEP 1でWebGL上で動画を再生させました。実行自体はできるのですが、ただ、開発ツール(F12)を開いてみてください。  
コンソールに以下のような警告が永遠と出力されていると思います。  
![警告その１](https://raw.githubusercontent.com/gtk2k/gtk2k.github.io/master/threejs-movietexture/filter_warning.png)
この警告を出力させないようにするには、警告が示すようにmovieTextureのminFilterをTHREE.NearestFilterかTHREE.LinearFilterに設定します。
```js
// videoエレメントからからテクスチャーを生成
movieTexture = new THREE.Texture(video);
// ★テクスチャーのminFilterをTHREE.LinearFilterに設定するコードを追加
movieTexture.minFilter = THREE.LinearFilter;
```

##STEP 3: 警告を消す その２
[STEP 3 デモ](https://gtk2k.github.io/threejs-movietexture/step2.html)  
STEP 2で出力され続ける警告を消すことができましたが、それでもまだ以下のような警告が出ます。
![警告その２](https://raw.githubusercontent.com/gtk2k/gtk2k.github.io/master/threejs-movietexture/texturesize_warning.png)
これは動画の情報(特にサイズ)が読み込まれないうちに、レンダリングを行うと出る警告です。
なので、動画の情報が読み込まれてからrender関数を実行すれば警告が出なくなります。  
(STEP 2もそうですが、動画に限らず画像においてもでもこれらの警告が出ます)
```js
// init関数の最後にrender()を行っている行を消しておく

var video = document.createElement('video');
video.loop = true;
video.autoplay = true;
video.src = 'big-buck-bunny_294_1280x720.mp4';
// ★動画のメタ情報が読み込まれたらrender関数を実行するコードを追加
video.onlodadedmetadata = render;
```

##STEP 4: ステレオレンダリング
[STEP 4 デモ](https://gtk2k.github.io/threejs-movietexture/step2.html)  
WebGLでレンダリングを行っているため、動画をステレオレンダリングさせることも簡単です。
すでにMMD_Songleでステレオレンダリングを行っていますので、あとは3D空間に、動画テクスチャーを張った3Dオブジェクトを追加するだけでＯＫです。デモでは、AキーでステレオレンダリングのON/OFFを行えるようにしています。

##STEP 5: 最後の難関！！ iPhoneのSafariで動画を再生するとプレイヤーが全画面表示で起動されてしまうのを突破する
ちょっと大げさなタイトルをつけてしまいましたが、iPhoneのSafariで動画を再生するとどうしてもプレイヤーが全画面表示されてしまいブラウザーの画面が見えなくなってしまいます。  
こうなってしまうと、せっかく作ったWeGLコンテンツを楽しむことができなくなります。  
しかし、以下の2つ方法を行うことでこれを突破することができます。

###1. webkit-playsinline属性の追加
まず初めに、(テクスチャーに使用する)videoエレメントに"webkit-playsinline"属性を追加します。  
これにより、プレイヤーを起動せずにインラインプレイを行うという設定ができます。

```js
var video = document.createElement('video');
video.loop = true;
video.autoplay = true;
video.src = 'big-buck-bunny_294_1280x720.mp4';
video.onlodadedmetadata = render;
// videoエレメントにwebkit-playsinline属性を追加する
video.setAttribute('webkit-playsinline', true);
```
ただし、これを行っただけではiPhoneのSafari上だと動画を再生すると全画面プレイヤーが表示されてしまいます。

###2. "ホーム画面に追加”
[STEP 5 デモ](https://gtk2k.github.io/threejs-movietexture/step2.html)  
[おまけ 360度動画の デモ](https://gtk2k.github.io/threejs-movietexture/step2.html)  
そこで、次に行うのが”ホーム画面に追加"です。  
"ホーム画面に追加”を行うと、ホーム画面にアイコンが表示され、アイコンをタップするとWebサイトにアクセスすることができるようになります。
![ホーム画面に追加](https://raw.githubusercontent.com/gtk2k/gtk2k.github.io/master/threejs-movietexture/add_to_homescreen.PNG)
この2つを行うことで、iPhoneのSafariではなくなりますが、ホーム画面に追加したアイコンからアクセスすると、動画を使ったWebGLコンテンツでも楽しむことができるようになります。

以上
