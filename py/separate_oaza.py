import json

with open('01202__11_r_2023.geojson', 'r') as file:
    data = json.load(file)

# 大字名ごとにFeatureを分割
feature_collections = {}
for feature in data['features']:
    oaza_name = feature['properties']['大字名']
    if oaza_name not in feature_collections:
        feature_collections[oaza_name] = {
            "type": "FeatureCollection",
            "name": f"01202_函館市_公共座標11系_筆R_{oaza_name}",
            "crs": data['crs'],
            "features": []
        }
    feature_collections[oaza_name]["features"].append(feature)

# ファイルに書き込み
for oaza_name, feature_collection in feature_collections.items():
    with open(f'{oaza_name}.geojson', 'w') as new_file:
        json.dump(feature_collection, new_file, indent=4, ensure_ascii=False)
