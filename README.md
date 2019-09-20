## リクエストパラメーター (APIに送るリクエスト)

{API_URL}/?lat=

|論理名|名前|型|説明|
|:---|:---|:---|:---|
|経度|lng|float|表示中の地図の、緯度(longitude)が渡されます。<br>(小数点5桁以上は切り捨て)|
|緯度|lat|float|表示中の地図の、経度(latitude)が渡されます。<br>(小数点5桁以上は切り捨て)|
|ズーム率|zoom|int|地図の拡縮尺度値|

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

|名前|論理名|型|デフォルト値|説明|
|---|---|---|---|---|
|map_type|地図の種類|string|"google"|"google" : Google Mapで表示する<br>"yahoo" : Yahoo Mapで表示する|
|selector|セレクタ|string|"#map"|地図を表示させるHTML要素を示すセレクタ。<br>該当要素が複数ある場合は、最初の一つ目を対象にします|
|center|中心地|float[2]|[35.681236,139.767125] (東京駅)|表示させる地図の中心点の緯度・経度情報|
|zoom|ズーム|int|10|地図表示のズーム率<br>Google Map: 1~21<br>Yahoo Map: 1~20|
|zoom_min|ズーム下限|int|--|地図を縮小表示する際のズーム率下限値(※1)。<br>未指定の場合は制限がありません。|
|zoom_max|ズーム上限|int|--|地図を拡大表示する際のズーム率上限値(※1)。<br>未指定の場合は制限がありません。|
|api_url|APIのURL|url|--|マーカー情報を取得するためのAPIを示すURL|
|show_ui|インターフェイスの表示|boolean|true|地図上のインターフェースの表示、非表示のフラグ|
|show_info|マーカーバルーンの表示|boolean|true|マーカーをクリックした際に、マーカーバルーンを表示するかの設定|
|grid|グリッド|float||5|一つのあたりのグリッドの距離 単位はkm|
|lazy_load|遅延秒数|float||500|地図を送る際、APIにリクエストを発信するまでの遅延時間(ミリ秒)|

*※1 YahooMapを使用時には、拡縮時に動作が不安定になる場合があります*

## イベントハンドラ

|メソッド名|型|説明|
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
|getBounds()|{ne:{lat, lng}, sw:{lat, lng}}|地図の表示範囲を取得|
|getCenter()|{lat, lng}|表示地図の現在の中心点を取得|
|setCenter(lat: float, lng: float)|void|表示地図の中心を変更|
|getZoom()|int|表示地図のズーム率を取得|
|setZoom(zoom: int)|void|表示地図のズーム率を変更する|
|setUI(flag: boolean)|void|地図上のインターフェイスの表示状態を変更する|
|getUI()|boolean|地図上のインターフェイスの表示状態を取得|
|getInfo()|boolean|マーカークリック時にマーカーバルーンを表示する場合は `true` を返却|
|setInfo(flag: boolean)|void|マーカークリック時にマーカーバルーンの表示・非表示の設定を変更する|
|addMarker(object)|object|マーカー情報を追加する|
|hasMarker(id: string)|boolean|指定IDのマーカーが存在するか検証する|
|getMarker(id: string)|object∣null|指定IDのマーカー情報を取得|
|removeMarker(id: string)|boolean|指定IDのマーカーを削除する|
|getViewInMarker(limit: int)|object[]|地図内に表示されているマーカーのうち、中心点に近い順にマーカー情報を取得する。|