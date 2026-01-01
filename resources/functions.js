var createTextStyle = function(feature, resolution, labelText, labelFont,
                               labelFill, placement, bufferColor,
                               bufferWidth) {

    if (feature.hide || !labelText) {
        return; 
    } 

    if (bufferWidth == 0) {
        var bufferStyle = null;
    } else {
        var bufferStyle = new ol.style.Stroke({
            color: bufferColor,
            width: bufferWidth
        })
    }
    
    var textStyle = new ol.style.Text({
        font: labelFont,
        text: labelText,
        textBaseline: "middle",
        textAlign: "left",
        offsetX: 8,
        offsetY: 3,
        placement: placement,
        maxAngle: 0,
        fill: new ol.style.Fill({
          color: labelFill
        }),
        stroke: bufferStyle
    });

    return textStyle;
};

// 中央マーカー用 Overlay
var centerMarker = new ol.Overlay({
  element: document.createElement('div'),
  positioning: 'center-center',
  stopEvent: false
});

// マーカーの見た目
centerMarker.getElement().style.width = '20px';
centerMarker.getElement().style.height = '20px';
centerMarker.getElement().style.borderRadius = '50%';
centerMarker.getElement().style.background = 'rgba(255,0,0,0.6)';
centerMarker.getElement().style.border = '2px solid #ff0000';
centerMarker.getElement().style.boxShadow = '0 0 10px rgba(255,0,0,0.8)';

// map に追加
map.addOverlay(centerMarker);



// 点滅制御用++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var blinkInterval = null;

// 強調表示スタイル（点滅時）
var blinkStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({ color: 'rgba(255,0,0,0.6)' }),
    stroke: new ol.style.Stroke({ color: '#ff0000', width: 2 })
  }),
  text: new ol.style.Text({
    font: 'bold 14px sans-serif',
    fill: new ol.style.Fill({ color: '#ff0000' }),
    stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
  })
  

  
});
// 点滅制御用++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


function blinkFeature(feature) {
  // 既存点滅を停止
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }
  
  //alert('blinkFeatur'); 
  
  var visible = false;
  var originalStyle = feature.getStyle();

  blinkInterval = setInterval(function () {
    if (visible) {
      feature.setStyle(originalStyle || null); // 元に戻す
    } else {
      // テキストを属性値から再設定
      blinkStyle.getText().setText(feature.get('azachiban'));
      feature.setStyle(blinkStyle);
    }
    visible = !visible;
  }, 500);
  
  //alert('blinkInterval:'+blinkInterval); 

  // 5秒後に停止
  setTimeout(function () {
    clearInterval(blinkInterval);
    feature.setStyle(originalStyle || null);
  }, 5000);
}


// 点滅制御用++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function stripe(stripeWidth, gapWidth, angle, color) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = screen.width;
    canvas.height = stripeWidth + gapWidth;
    context.fillStyle = color;
    context.lineWidth = stripeWidth;
    context.fillRect(0, 0, canvas.width, stripeWidth);
    innerPattern = context.createPattern(canvas, 'repeat');

    var outerCanvas = document.createElement('canvas');
    var outerContext = outerCanvas.getContext('2d');
    outerCanvas.width = screen.width;
    outerCanvas.height = screen.height;
    outerContext.rotate((Math.PI / 180) * angle);
    outerContext.translate(-(screen.width/2), -(screen.height/2));
    outerContext.fillStyle = innerPattern;
    outerContext.fillRect(0,0,screen.width,screen.height);

    return outerContext.createPattern(outerCanvas, 'no-repeat');
};

var selectedChibanFeature = null;

function searchChiban() {
  var aza = document.getElementById('azaSelect').value;
  var chiban = document.getElementById('chibanInput').value.trim();
  var resultDiv = document.getElementById('chibanResult');

  resultDiv.innerHTML = '';
  selectedChibanFeature = null;

  if (!aza || !chiban) {
    resultDiv.innerHTML = '大字と地番を入力してください';
    return;
  }

  // 結合文字列（例：末吉70）
  var searchText = aza + chiban;

  var features = lyr_hachichibantext_2.getSource().getFeatures();
  var hitCount = 0;

  features.forEach(function (feature) {
    var azachiban = feature.get('azachiban');

    if (azachiban && azachiban.toString().includes(searchText)) {
      hitCount++;

      var div = document.createElement('div');
      div.textContent = azachiban;
      div.style.cursor = 'pointer';
      div.style.padding = '2px';
      div.style.borderBottom = '1px solid #ddd';

      div.onclick = function () {
        selectedChibanFeature = feature;

        // 選択状態の見た目
        Array.from(resultDiv.children).forEach(function (c) {
          c.style.background = '';
        });
        div.style.background = '#cce5ff';
		
	    blinkFeature(feature);

      };

      resultDiv.appendChild(div);
    }
  });

  if (hitCount === 0) {
    resultDiv.innerHTML = '該当する地番がありません';
  }
}

// 選択地番へズーム
var centerMarker = null;

function zoomToSelectedChiban() {
  if (!selectedChibanFeature) {
    alert('地番を選択してください');
    return;
  }

  var geometry = selectedChibanFeature.getGeometry();
  var extent = geometry.getExtent();

  map.getView().fit(extent, {
    maxZoom: 18,
    duration: 500
  });

  // ズーム完了後にマーカー表示
  setTimeout(function () {
    var center = ol.extent.getCenter(extent);

    // 初回のみ Overlay を作成
    if (!centerMarker) {
      var el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.background = 'rgba(255,0,0,0.6)';
      el.style.border = '2px solid #ff0000';
      el.style.boxShadow = '0 0 10px rgba(255,0,0,0.8)';
      el.style.pointerEvents = 'none';

      centerMarker = new ol.Overlay({
        element: el,
        positioning: 'center-center',
        stopEvent: false
      });

      map.addOverlay(centerMarker);
    }

    centerMarker.setPosition(center);

    // 3秒後に消す
    setTimeout(function () {
      centerMarker.setPosition(undefined);
    }, 3000);

  }, 600);
}
