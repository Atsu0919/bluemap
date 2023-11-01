function readFirst() {
    //プルダウンリストをループ処理で値を取り出してセレクトボックスにセットする
    for (var i = 0; i < list.length; i++) {
        let opt = document.createElement("option");
        opt.value = list[i];  //value値
        opt.text = list[i];   //テキスト値
        document.getElementById("pullDownList").appendChild(opt);
    }
};
// jsonデータを読み込み
async function jsonRead(name) {
    let path = 'json/' + name + '.geojson';
    const response = await fetch(path);
    const json = await response.json();

    function mystyle(feature) {
        let mystyle = {
            weight: 1,
            color: "#026ec1"
        };
        if (feature.properties.座標系 == '任意座標系') {
            mystyle = {
                weight: 1,
                color: "#347901"
            };
        }
        return mystyle;
    };
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: '#178fc5',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }
    function writeContent(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 2,
            color: '#ce4760',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        let h = [];
        Object.keys(layer.feature.properties).forEach(function (key) {
            h.push(`<li>${key}:${layer.feature.properties[key]}</li>`)
        });
        let text = document.getElementById('contents');
        text.innerHTML = h.join('');
    }

    if (map.hasLayer(geojson)) {
        map.removeLayer(geojson);
    };

    turf.geomEach(json, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId
    ) {
        console.log(currentGeometry);
        let point = turf.centroid(currentGeometry);
        console.log(point);
        let icon = L.divIcon({
            html: featureProperties.地番,
            className: 'my-icon-class',
            iconSize: [30,10],
        })
        let pointLayer = L.geoJson(point, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: icon });
            }
        });
        map.on('zoomend', function () {
            var currentZoom = map.getZoom();
            if (currentZoom >= 20) {
                pointLayer.addTo(map);
            } else {
                map.removeLayer(pointLayer);
            }
        });

    });



    geojson = L.geoJson(json,
        {
            style: mystyle,
            onEachFeature: function onEachFeature(feature, layer) {
                if (feature.properties && feature.properties.地番) {
                    let popcontents = feature.properties.大字名 + feature.properties.地番;
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: writeContent
                    });

                    layer.bindPopup(popcontents);
                }
            }
        }).addTo(map);
    map.fitBounds(L.geoJson(json).getBounds());

    return json;
};

var map = L.map('mapid').setView([41.768671, 140.728962], 14);
let geojson
var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
    maxZoom: 20,
    maxNativeZoom: 18
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    maxZoom: 20,
    maxNativeZoom: 18
});

var baseMaps = {
    "地理院地図": gsi,
    "OpenStreetMap": osm
};
L.control.layers(baseMaps).addTo(map);
gsi.addTo(map);

outputPos(map);
//マップムーブイベント
map.on('move', function (e) {
    //マップムーブイベントで値を出力
    outputPos(map);
});

//現在の緯度・経度・倍率を取得して指定の要素に情報を出力する関数
function outputPos(map) {
    var pos = map.getCenter();
    var zoom = map.getZoom();
    //spanに出力
    document.getElementById('lat_span').innerHTML = pos.lat;
    document.getElementById('lng_span').innerHTML = pos.lng;
    document.getElementById('zoom_span').innerHTML = zoom;
};
function selectName(obj) {
    var idx = obj.selectedIndex;
    var value = obj.options[idx].value;
    jsonRead(value)
};