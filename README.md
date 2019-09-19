## リクエストパラメーター (APIに送るリクエスト)

{API_URL}/?lat=

|論理名|名前|型|説明|
|:---|:---|:---|:---|
|経度|lng|float|位置情報を取得する基準値|
|緯度|lat|float|位置情報を取得する基準値|
|ズーム率|zoom|int|地図の拡縮尺度|



## レスポンスパラメータ一覧 (APIのレスポンス)

|論理名|名前|型|デフォルト値|フォーマット|説明|
|:---|:---|:---|:---|:---|:---|
|物件ID|id|string|||物件情報のID(※ユニーク値である必要があります|
|物件情報のURL|url|string|||物件情報のURL|
|ラベル|label|string|||物件の名前|
|物件情報の詳細、説明|description|string|||物件の説明文|
|物件情報の詳細、説明のフォーマット|description_format|string|html||物件の説明文のフォーマットhtmlかテキストで表示するかを選択 テキストの場合 "text" 値がなければ表示しない|
|フィードURL|feed|string|||フィードURL|
|フィードフラグ|feed_flag|boolean|true||フィードURLか詳細を表示するかのフラグ、デフォルトはフィードURLを表示させる|
|マーカーフラグ|marker_display|boolean|true||マーカーを表示させるかしないかのフラグ デフォルトは表示|
|座標|coordinate|array||coordinate[lat: lng:]||取得した不動産の緯度経度の座標データ この座標データに対してマーカを立てる

# GeoLocoMap の起動設定

## 初期パラメータ

|論理名|名前|型|デフォルト値|説明|
|---|---|---|---|---|
|地図の種類|map_type|string|"google"|"google" : Google Mapで表示する<br>"yahoo" : Yahoo Mapで表示する|
|セレクタ|selector|string|"#map"|地図を表示させるHTML要素を示すセレクタ。該当要素が複数ある場合は、最初の一つ目を対象にします|
|中心地|center|float[2]|[35.681236,139.767125] (東京駅)|表示させる地図の中心点の緯度・経度情報|
|ズーム|zoom|int|10|地図表示のズーム Google Map 1~21, Yahoo Map 1~20|
|APIのURL|api_url|url|--|マーカー情報を取得するためのAPIを示すURL|
|インターフェイスの表示|show_ui|boolean|true|地図上のインターフェースの表示、非表示のフラグ|
|マーカーバルーンの表示|show_info|boolean|true|マーカーをクリックした際に、地物情報を表示するかの情報|
|グリッド|grid|float||5|一つのあたりのグリッドの距離 単位はkm|
|遅延秒数|lazy_load|float||500|地図を送る際、APIにリクエストを発信するまでの遅延時間(ミリ秒)|

## イベントハンドラ

|メソッド名|aaa|説明|
|:---|---|:---|
|onInit|(object) => void|地図が初期化された直後に実行されるイベント|
|onZoom|(object, int) => void|表示地図のズーム率が変更されるごとに実行されるイベント|
|onMove|(object, float[]) => void|表示地図の中心点が変更されるごとに実行されるイベント|
|onUI|(object, boolean) => void|インターフェイスの表示状態が切り替わるごとに実行されるイベント|
|onChange|(object) => void|表示する地図の状態が変更されるごとに実行されるイベント|
|onClickMarker|(string, object) => void|マーカーがクリックされた際に実行されるイベント|

# GeoLocoMapがサポートする関数

|関数|返却値|説明|
|---|---|---|
|getCenter()|{lat, lng}|表示地図の現在の中心点を取得|
|setCenter(lat: float, lng: float)|void|表示地図の中心を変更|
|getZoom()|int|表示地図のズーム率を取得|
|setZoom(zoom: int)|void|表示地図のズーム率を変更する|
