// jsonデータを読み込み
async function jsonRead(name) {
    let path = 'json/' + name + '.geojson';
    const response = await fetch(path);
    const json = await response.json();
    console.log(json);
    L.geoJson(json,
        {
            onEachFeature: function onEachFeature(feature, layer) {
                if (feature.properties && feature.properties.地番) {
                    layer.bindPopup(feature.properties.地番);
                }
            }
        }).addTo(map);
    map.fitBounds(L.geoJson(json).getBounds());
    return json;
};

var map = L.map('mapid').setView([41.768671, 140.728962], 15);

var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
    maxZoom: 20,
    maxNativeZoom: 18
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
});

var baseMaps = {
    "地理院地図": gsi,
    "OpenStreetMap": osm
};
L.control.layers(baseMaps).addTo(map);
gsi.addTo(map);

function selectName(obj) {
    var idx = obj.selectedIndex;
    var value = obj.options[idx].value;
    jsonRead(value)
}