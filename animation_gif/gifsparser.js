(function () {
  function loadGIF(url, successCB, errorCB) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
      parseGIF(new Uint8Array(e.target.response), successCB, errorCB);
    }
    xhr.onerror = function () { errorCB && errorCB('loadGIF: load error'); };
    xhr.send();
  }

  function parseGIF(gif, successCB, errorCB) {
    var pos = 0, duration = 0, delayTimes = [], width = 0, height = 0, loadCnt = 0;
    var graphicControl = null, imageData = null, frames = [], loopCnt = 0;
    if (gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46 && // 'GIF'
      gif[3] === 0x38 && gif[4] === 0x39 && gif[5] === 0x61) { // '89a'
      width = gif[6] + (gif[7] << 8);
      height = gif[8] + (gif[9] << 8);
      pos = gif[10] & 0xf0 ? 13 + (256 * 3) : 13;
      var gifHeader = gif.subarray(0, pos);
      while (gif[pos] !== 0x3b) {
        var offset = pos, blockId = gif[pos];
        if (blockId === 0x21) {
          var label = gif[++pos];
          if ([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1) {
            label === 0xf9 && (delayTimes.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10));
            label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));
            while (gif[++pos]) pos += gif[pos];
            label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
          } else { errorCB && errorCB('parseGIF: unknown label'); break; }
        } else if (blockId === 0x2c) {
          pos += gif[pos += 9] & 0xf0 ? 10 + (256 * 3) : 10;
          while (gif[++pos]) pos += gif[pos];
          var imageData = gif.subarray(offset, pos + 1);
          frames.push(URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData])));
        } else { errorCB && errorCB('parseGIF: unknown blockId'); break; }
        pos++;
      }
    } else { errorCB && errorCB('parseGIF: no GIF89a'); }
    if (frames.length) {
      frames.forEach(function (url, i) {
        var img = new Image();
        img.onload = function (e, i) {
          loadCnt++;
          frames[i] = this;
          if (loadCnt === frames.length) successCB && successCB(delayTimes, loopCnt, frames);
        }.bind(img, null, i);
        img.src = url;
      });
    }
  }
  window.loadGIF = loadGIF;
})();

