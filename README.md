## リクエストパラメーター (APIに送るリクエスト)


|論理名|名前|型|説明|
|:---|:---|:---|:---|
|経度|lng|float|位置情報を取得する基準値|
|緯度|lat|float|位置情報を取得する基準値|



## レスポンスパラメータ一覧 (APIのレスポンス)


|論理名|名前|型|デフォルト値|フォーマット|説明|
|:---|:---|:---|:---|:---|:---|
|物件Id|id|string|||物件情報のid(unique)|
|物件情報のURL|url|string|||物件情報のurl|
|ラベル|label|string|||物件の名前|
|物件情報の詳細、説明|description|string|||物件の説明文|
|物件情報の詳細、説明のフォーマット|description_format|string|html||物件の説明文のフォーマットhtmlかテキストで表示するかを選択 テキストの場合 "text" 値がなければ表示しない|
|フィードURL|feed|string|||フィードURL|
|フィードフラグ|feed_flag|boolean|true||フィードURLか詳細を表示するかのフラグ、デフォルトはフィードURLを表示させる|
|マーカーフラグ|marker_display|boolean|true||マーカーを表示させるかしないかのフラグ デフォルトは表示|
|座標|coordinate|array||coordinate[lat: lng:]||取得した不動産の緯度経度の座標データ この座標データに対してマーカを立てる

## geo-loco-map初期表示パラメータ

|論理名|名前|型|フォーマット|デフォルト値|説明|
|:---|:---|:---|:---|:---|:---|
|地図の種類|map_type|string||google|Google Map or Yahoo Mapで表示させるか Yahoo Mapの場合 "yahoo"|
|中心地|center|array|[{latitude},{longitude}]|latlng[35.681236,139.767125] (東京駅)|表示させる地図の中心地|
|ズーム|zoom|int||10|地図表示のズーム Google Map 1~21, Yahoo Map 1~20|
|インターフェイス|element_flag|boolean||true|地図上のインターフェースの表示、非表示のフラグ|
|グリッド|grid|float||5|一つのあたりのグリッドの距離 単位はkm|
|遅延秒数|lazy_load|float||0.5|地図をスクロールして止めた際にAPIにリクエスト送る秒数|
|セレクタ|selector|string|||地図を表示させるセレクタ|
|APIのURL|api_url|string|||リクエスト先のAPI|




