## リクエストパラメーター (APIに送るリクエスト)


|論理名|名前|型|説明|
|:---|:---|:---|:---|
|経度|lng|float|座標データを取得するための中心地|
|緯度|lat|float|座標データを取得するための中心地|


## レスポンスパラメーター一覧 (APIのレスポンス)


|論理名|名前|型|フォーマット|説明|
|:---|:---|:---|:---|:---|
|物件Id|id|string||物件情報のid(unique)|
|物件情報のURL|url|string||物件情報のurl|
|ラベル|label|string||物件の名前|
|物件情報の詳細、説明|description|string||物件の説明文|
|物件情報の詳細、説明のフォーマット|description_format|true||物件の説明文のフォーマットhtmlかテキストで表示するかを選択 デフォルトはhtml|
|座標|coordinate|array|coordinate[lat: lng:]|取得した不動産の緯度経度の座標データ この座標データに対してマーカを立てる
|ズーム|zoom|string|地図の拡大縮小 Google Map:1~21, Yahoo Map:1~20,Open Street Map: 1~19 |