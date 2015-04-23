# gtk2k.github.io
WebSocketBridgeHMDPositionSensorVRDevice を追加したWebVR Boilerplateテストページです。

* [test_mp4.html](http://gtk2k.github.io/test_mp4.html) 4000x2000でコーデックがh264の動画を使用したページです。
* [test_vp8.html](http://gtk2k.github.io/test_vp8.html) 4000x2000でコーデックがVP8の動画を使用したページです。
* [test_vp9.html](http://gtk2k.github.io/test_vp9.html) 4000x2000でコーデックがVP9の動画を使用したページです。

##問題点
私のマシン環境が多分に影響していると思いますが以下の問題点があります。
* Oculus Riftでのフレームレートがよくありません。Firefoxではビデオテクスチャー自体フレームレートがよくありません。
* mp4においてはalert()を実行したりすると再生が止まってしまいます。
* ループするように設定しているのですが、これもまたmp4では１回目の再生終了時点で止まってしまいます。

###私のマシン環境
- MacBook Pro: Mid 2012 Model A1398 EMC 2512
- CPU: i7-3615QM 2.3GHz
- Memory: 8GB
- GPU: GeForce GT 650M (Driver ver: 350.12)
- OS: Windows 8.1(Boot Camp)
