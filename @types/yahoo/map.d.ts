declare namespace Y {

    enum MapType {
        NORMAL,
        STANDARD,
        SMARTPHONE,
    }

    type MapOptions = {
        /** 地図の動作設定 */
        configure?: MapConfigure,
        /** デフォルトで使用されるレイヤーセットの配列を変更できます。  {LayerSet} を参照してください */
        layerSets?: LayerSet[],
    }

    type IconOption = {
        iconSize?: Size,
        iconAnchor?: Point,
        infoWindowAnchor?: Point,
        className?: string,
        iconHtml?: string
    }

    type MarkerOption = {
        icon: Icon
    }

    type LabelOption = {
        className: string,
        offset: Point,
        clickable: boolean,
        draggable: boolean,
    }

    type LayerSetOption = {
        maxZoom: number,
        minZoom: number,
        projection: Projection
    }

    // Core クラス

    /**
     * 地図表示
     */
    class Map {
        constructor(id: string, options: MapOptions)

        addControl(layer?: LayerSetControl,
                   center?: CenterMarkControl,
                   home?: HomeControl,
                   scale?: ScaleControl,
                   Zoom?: ZoomControl,
                   SlideZoomh?: SliderZoomControlHorizontal,
                   slideZoomv?: SliderZoomControlVertical,
                   search?: SearchControl
        ): void

        /**
         * 地図に地物を追加します。
         * @param feature 地物
         */
        addFeature(feature: Feature): void

        /**
         * 地図に複数の地物を追加します。
         * @param features 地物
         */
        addFeatures(features: Feature[]): void;

        /**
         * 地図にレイヤーを追加します。 追加されたレイヤーはすべてのレイヤーセットに対して追加されます。
         * @param layer 追加するレイヤー
         */
        addLayer(layer: Y.Layer): void

        /**
         * 地図に新しいレイヤーセットを追加します。
         * @param id 追加するレイヤーセットID
         * @param layerset 追加するレイヤーセット
         */
        addLayerSet(id: string, layerset: LayerSet): void;

        /**
         * プラグインを追加します。
         * @param plugin 追加するプラグイン
         */
        addPlugin(plugin: Plugin): void;

        /**
         * 地図オブジェクトが通知するイベントに対してイベントハンドラを設定します。
         * @param type イベント名
         * @param fn イベント発生時に呼び出されるイベントハンドラ
         * @param object 設定したイベントハンドラ内でthisとして評価されるオブジェクト。省略時は地図オブジェクト自身をthisとして評価。
         */
        bind(type: string, fn: (...args: any[]) => void, object?: Object): void;

        /**
         * 地図からすべての地物を削除します。 独自のレイヤーに定義された地物は削除の対象外となります。
         */
        clearFeatures(): void;

        /**
         * 現在表示している情報ウィンドウを閉じます。
         */
        closeInfoWindow(): void;

        /**
         * 指定された地理座標範囲が含まれる範囲の地図を表示します。
         * @param bounds 地理範囲
         * @param layerSetId レイヤーセットID
         */
        drawBounds(bounds: LatLngBounds, layerSetId?: LayerSetId): void;

        /**
         * 地図を描画します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param center 中心の緯度経度
         * @param zoom ズームレベル
         * @param layerSetId レイヤーセットID
         */
        drawMap(center: LatLng, zoom?: number, layerSetId?: LayerSetId): void;

        /**
         * コンテナ座標を地理座標へ変換します。
         * @param point コンテナ座標
         */
        fromContainerPixelToLatLng(point: Point): LatLng;

        /**
         * 地理座標をコンテナ座標へ変換します。
         * @param latlng 地理座標
         */
        fromLatLngToContainerPixel(latlng: LatLng): Point;

        /**
         * 地図の矩形領域を緯度経度座標で返します。
         */
        getBounds(): LatLngBounds | undefined;

        /**
         * 指定された矩形領域が地図に収まるズームレベルを返します。
         * @param bounds 緯度経度矩形領域
         */
        getBoundsZoomLevel(bounds: LatLngBounds): number;

        /**
         * 地図中心点の地理座標を返します。
         */
        getCenter(): LatLng

        /**
         * 各種設定を返します。
         * @param name 設定名
         */
        getConfigure(name: string): MapConfigure;

        /**
         * 各種設定内容をすべて返します。
         */
        getConfigures(): Object;

        /**
         * 地図を含むDOMオブジェクトを返します。
         */
        getContainer(): JQuery;

        /**
         * 現在選択されているLayerSetを返します。
         */
        getCurrentLayerSet(): LayerSet;

        /**
         * 現在選択中のレイヤーセットIDを返します。
         */
        getCurrentLayerSetId(): LayerSetId;

        /**
         * 地図上のすべての地物を取得します。 独自のレイヤーに定義された地物は対象外となります
         */
        getFeatures(): Feature[];

        /**
         * 現在表示している情報ウィンドウを返します。
         */
        getInfoWindow(): InfoWindow;

        /**
         * 指定したレイヤーセットIDで地図に登録されているレイヤーセットを返します。
         * @param id レイヤーセットID
         */
        getLayerSet(id: string): LayerSet;

        /**
         * 地図に登録されているすべてのレイヤーセットを配列で返します。
         */
        getLayerSets(): LayerSet[];

        /**
         * 地図が描画されているDOMオブジェクトを返します。
         */
        getMapContainer(): JQuery;

        /**
         * 利用可能なズームレベルの数を返します。 現在設定されているレイヤーセットのズームレベル数に依存します。
         */
        getMaxZoom(): number;

        /**
         * プラグインを取得します。
         * @param name 取得するプラグインの名前
         */
        getPlugin(name: string): Plugin;

        /**
         * 現在の地図に関連付けられているProjectionを返します。
         */
        getProjection(): Projection;

        /**
         * マップコンテナのサイズをピクセル単位で取得します。
         */
        getSize(): Size;

        /**
         * 地図のシステムレイヤーが返されます。
         */
        getSystemLayer(): Layer;

        /**
         * 地図に設定されたズームレベルを返します。
         */
        getZoom(): number

        /**
         * 情報ウィンドウが開いているかどうかを返します。
         */
        isInfoWindowOpen(): boolean;

        /**
         * 地図の作成後にdrawMapによって初期化された場合に、trueを返します。
         */
        isLoaded(): boolean;

        /**
         * 指定された地点に情報ウィンドウを表示します。 表示位置には、緯度経度座標もしくはピクセル座標を指定できます。 コンテンツには、HTML文字列、Contentオブジェクト、DOMノードのいずれかを指定できます。
         * @param latlng ウィンドウを表示する緯度経度座標もしくはピクセル座標
         * @param content ウィンドウ内に表示するコンテンツ
         * @param infoWindowOptions ウィンドウ表示のためのオプション。詳細はInfoWindowを参照
         * @param offset ウィンドウ表示する緯度経度に対するオフセット値
         */
        openInfoWindow(latlng: LatLngBounds, content: string | JQuery, infoWindowOptions: Object, offset: Size): InfoWindow;

        /**
         * 指定されたピクセルサイズ分地図を移動します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param distance 移動距離
         * @param animation アニメーション処理の有無
         */
        panBy(distance: Size, animation?: boolean): void;

        /**
         * 指定された方向に画面分だけ地図を移動します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param dx x方向移動距離
         * @param dy y方向移動距離
         * @param animation アニメーション処理の有無
         */
        panDirection(dx: number, dy: number, animation?: boolean): void;

        /**
         * 地図の中心を指定された地点に変更します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param center 中心点緯度経度
         * @param animation アニメーション処理の有無
         */
        panTo(center: LatLng, animation?: boolean): void;

        /**
         * 地図の状態を変更せずに再描画します。
         * @param force 座標情報の変更を通知
         */
        redraw(force: boolean): void;

        /**
         * 地図からコントロールを削除します。
         * @param control 削除対象となるコントロール
         */
        removeControl(control: Control): void

        /**
         * 地図から地物を削除します。
         * @param feature 地物
         */
        removeFeature(feature: Feature): void

        /**
         * 地図からレイヤーを削除します。 地図に登録されているすべてのレイヤーセットからレイヤーを削除します。
         * @param layer 削除するレイヤー
         */
        removeLayer(layer: Layer): void;

        /**
         * 地図からレイヤーセットを削除します。
         * @param id レイヤーセットID
         */
        removeLayerSet(id: string): void;

        /**
         * プラグインを削除します。
         * @param plugin 削除するプラグイン
         */
        removePlugin(plugin: Plugin): void;

        /**
         * JavaScriptマップAPIが外部APIと通信する際に使われるアプリケーションIDを設定します
         * @param appId アプリケーションID
         */
        setApplicationId(appId: string): void;

        /**
         * 地図動作の設定を行います。設定内容は、MapConfigureを参照してください。
         * @param name 設定名
         * @param value 設定内容
         */
        setConfigure(name: string, value: boolean): void;

        /**
         * 地図動作のための各種設定を行います。
         * @param configures 設定内容
         */
        setConfigures(configures: MapConfigure): void;

        /**
         * 新しいレイヤーセットIDを選択します。 LayerSetはAddLayerSetで地図に追加されている必要があります。
         * @param id レイヤーセットID
         * @param redraw 地図再描画の有無
         */
        setLayerSetId(id: string, redraw?: boolean): void;

        /**
         * ズームレベルを指定した新しい値に設定します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param zoom ズームレベル
         * @param animation trueの時、ズーム時にアニメーション処理を行う
         * @param latlng ズームの基準としたい位置を指定します
         * @param center trueの時、引数latlngで指定した基準位置をズーム後の中心点とします
         */
        setZoom(zoom: number, animation?: boolean, latlng?: LatLng, center?: boolean): void;

        /**
         * 地図オブジェクトに設定されたイベントを解除します。
         * @param listener 解除するイベントリスナー
         */
        unbind(listener: EventListener): void;

        /**
         * 地図を表示する html 要素のサイズが変化したときに、ユーザは Map.updateSize() を実行する必要があります。
         */
        updateSize(): void;

        /**
         * ズームレベルを一つ上げます。latlngが指定されている場合、ズーム後にlatlngが画面内に含まれるようにズームを変更します。 centerがtrueの場合、latlngの位置が中心点となるようにズームを変更します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param latlng ズームの基点となる緯度経度
         * @param animation ズーム時にアニメーション処理
         * @param center ズームとともに中心点をlatlngの位置へ移動
         */
        zoomIn(latlng: LatLng, animation?: boolean, center?: boolean): void;

        /**
         * ズームレベルを一つ下げます。latlngが指定されている場合、ズーム後にlatlngが画面内に含まれるようにズームを変更します。 centerがtrueの場合、latlngの位置が中心点となるようにズームを変更します。 引数は変数名と同じ名前のキーを持つオブジェクトでも指定できます。
         * @param latlng ズームの基点となる緯度経度
         * @param animation ズーム時にアニメーション処理
         * @param center ズームとともに中心点をlatlngの位置へ移動
         */
        zoomOut(latlng: LatLng, animation?: boolean, center?: boolean): void;
    }

    /**
     * リスティング表示
     */
    class Listing {

    }

    // Feature クラス

    /**
     * 地物
     */
    class Feature {
        public layer: Layer;
        public drawn: boolean;

        /**
         * 地物のピクセル座標位置を再計算する必要が生じたときに、Layerから呼び出され位置の再配置を行います。
         */
        adjust(): void;

        /**
         * 地物オブジェクトが通知するイベントに対してイベントハンドラを設定します。
         * @param type イベント名
         * @param fn イベント発生時に呼び出されるイベントハンドラ
         * @param option 設定したイベントハンドラ内でthisとして評価されるオブジェクト。省略時は地物オブジェクト自身をthisとして評価。
         */
        bind(type: string, fn: Function, option?: Object): EventListener;

        /**
         * 指定されたコンテンツを、この地物に関連付けます。 関連付けられたコンテンツは、この地物がクリックされたときに吹きだし内に表示されます。
         * @param content 表示するコンテンツのHTMLもしくはDOMノードオブジェクト
         * @param infoWindowOption InfoWindowに渡されるオプション
         */
        bindInfoWindow(content: string | Node, infoWindowOption?: Object): InfoWindow;

        /**
         * 地物を描画します。 Layerから呼び出されます。
         * @param force
         */
        draw(force: boolean): void;

        /**
         * 地物を表す緯度経度を返します。
         */
        getLatLng(): LatLng

        /**
         * 地物を表す緯度経度の配列を返します。
         */
        getLatLngs(): LatLng[];

        /**
         * 地物に関連付けられているLayerを返します。
         */
        getLayer(): Layer;

        /**
         * 地物に関連付けられているMapを返します。
         */
        getMap(): Map

        /**
         * FeatureLayer.addFeatureを使用して、Layerに地物が追加されるときに呼び出されます。
         * @param layer
         */
        initialize(layer: Layer): void;

        /**
         * 地物がLayer上に描画済みかどうかを返します。
         */
        isDrawn(): boolean;

        /**
         * 地物が画像などを緯度経度に関連付けて表現されるデータであるかどうかを返します。主にMarkerが該当します。
         */
        isRaster(): boolean;

        /**
         * 地物上に吹きだしを表示します。
         * @param content 表示するコンテンツのHTMLもしくはDOMノードオブジェクト
         * @param infoWindowOptions InfoWindowに渡されるオプション
         */
        openInfoWindow(content: string | Node, infoWindowOptions?: Object): InfoWindow;

        /**
         * 地物を削除します。 Layerから呼び出されます。
         */
        remove(): void;

        /**
         * 地物に設定されたイベントを解除します。
         * @param listener 解除するイベントリスナー
         */
        unbind(listener: EventListener): void;

        getContainableBounds(latlngs?: LatLng[]): LatLngBounds | null;

        getContainableSize(): Size[];

        addExStyle(): boolean;

    }

    /**
     * アイコン
     */
    class Icon {
        constructor(src: string, option?: IconOption)
    }

    /**
     * 地物の描画スタイル
     */
    class Style {

    }

    /**
     * マーカー
     */
    class Marker extends Feature {
        constructor(latlng: LatLng, option?: MarkerOption);
    }

    /**
     * ラベル
     */
    class Label extends Feature {
        constructor(latlng: LatLng, label: string, options?: LabelOption)

        /**
         * ラベルがクリック可能かどうかを返します。
         */
        isClickable(): boolean;

        /**
         * ラベルがマウスドラッグにより移動可能かどうかを返します。
         */
        isDraggable(): boolean;

        /**
         * ラベルをクリック可能にするかどうかを設定します。
         * @param clickable
         */
        setClickable(clickable: boolean): void;

        /**
         * ラベルをマウスドラッグにより移動可能にするかどうかを設定します。
         * @param draggable
         */
        setDraggable(draggable: boolean): void;
    }

    /**
     * ポリライン
     */
    class Polyline extends Feature {
    }

    /**
     * ポリゴン
     */
    class Polygon extends Polyline {
    }

    /**
     * 円
     */
    class Circle extends Feature {
    }

    // Layer クラス

    /**
     * レイヤー
     */
    class Layer {

        container: JQuery | null;
        copyrightCollection: CopyrightCollection;
        initialized: boolean;
        map: Map | null;
        name: string;
        options: object;
        zIndex: number;

        constructor(name: string, options?: Object);

        bind(type: string, fn: Function, object?: Object): EventListener;

        draw(): void;

        drawLayer(force: boolean): void;

        initialize(): void;

        isInitialized(): boolean;

        isSystemLayer(): boolean;

        remove(): void;

        isDrawn(): boolean;

        /**
         * レイヤーを表示する
         */
        show(): void;

        /**
         * レイヤーを非表示状態にする
         */
        hide(): void;

        /**
         * レイヤーの非表示状態を取得する
         */
        isHidden(): boolean;

        /**
         * コンテナ座標を地理座標へ変換します。
         * @param p
         */
        fromContainerPixelToLatLng(p: Y.Point): Y.LatLng

        /**
         * Div座標を地理座標へ変換します。
         * @param p
         */
        fromDivPixelToLatLng(p: Y.Point): Y.LatLng

        /**
         * 地理座標列をDiv座標列へ変換します。
         * @param latlngs
         * @param offset
         */
        fromLatLngsToDivPixels(latlngs: Y.LatLng[], offset?: Y.Point): Y.Point[];

        /**
         * 地理座標をコンテナ座標へ変換します。
         * @param g
         */
        fromLatLngToContainerPixel(g: Y.LatLng): Y.Point;

        /**
         * 地理座標をDiv座標へ変換します。
         * @param latlng
         */
        fromLatLngToDivPixel(latlng: Y.LatLng): Y.Point;


        /**
         * タイル座標を地理座標へ変換します。
         * @param tx
         * @param ty
         * @param x
         * @param y
         */
        fromTileToLatLng(tx: number, ty: number, x: number, y: number): void;

        /**
         * レイヤーを描画するコンテナを返します。
         */
        getContainer(): JQuery;

        /**
         * コピーライトの集合を返します。
         */
        getCopyrightCollection(): CopyrightCollection;

        /**
         * レイヤーが関連付けられているMapを返します。
         */
        getMap(): Map;

        /**
         * レイヤーが関連付けられているMapのコンテナを返します。
         */
        getMapContainer(): JQuery;

        /**
         * Featureオブジェクトを保有するか返却します
         */
        hasFeature(): boolean;
    }

    /**
     * レイヤーの集合
     */
    class LayerSet {
        /**
         * 複数のレイヤーから構成されるレイヤーの集合を表します。
         * @param name レイヤー名
         * @param layers Layerの配列
         * @param options オプション
         */
        constructor(name: string, layers: Layer[], options?: LayerSetOption);

        /**
         *
         * @param layer
         */
        addLayer(layer: Layer): void;

        /**
         * レイヤーコンテナの順序をaddLayer()された順番に補正します。
         */
        adjustLayerOrder(): void;

        /**
         * レイヤーセットが利用可能かどうかを返します。
         */
        getEnable(): boolean;

        /**
         * レイヤーセットの表示名称を返します。
         */
        getFullName(): string;

        /**
         * すべてのレイヤー配列を取得します。
         */
        getLayers(): Layer[];

        /**
         * 利用可能な最大ズームレベルを返します。
         */
        getMaxZoom(): number;

        /**
         * 利用可能な最小ズームレベルを返します。
         */
        getMinZoom(): number;

        /**
         * レイヤーセットの名称を返します。
         */
        getName(): string;

        /**
         * 地図からレイヤーセットを取り除きます。
         * @param exclude
         */
        remove(exclude?: LayerSet): void;

        /**
         * レイヤーを削除します。
         * @param layer
         */
        removeLayer(layer: Layer): void;

        /**
         * レイヤーセットが利用可能かどうかを設定します。
         * @param value
         */
        setEnable(value: boolean): boolean;

        /**
         * レイヤーセットの最大ズームレベルを再設定します。
         * @param zoomLevel ズームレベル
         */
        setMaxZoom(zoomLevel: number): number;

        /**
         * レイヤーセットの最小ズームレベルを再設定します。
         * @param setMinZoom ズームレベル
         */
        setMinZoom(setMinZoom: number): number;
    }

    /**
     * コピーライト
     */
    class Copyright {
        /**
         * 著作権情報を表します。
         * @param id
         * @param bounds
         * @param minZoom
         * @param text
         */
        constructor(id: string, bounds: LatLngBounds, minZoom: number, text: string);
    }

    /**
     * コピーライトの集合
     */
    class CopyrightCollection {
        /**
         * 複数のコピーライトから構成されるコピーライトの集合を表します。
         * @param prefix
         * @param options
         */
        constructor(prefix?: string, options?: Object);

        /**
         * コレクションに著作権情報オブジェクトを追加します。
         * @param copyright コピーライトオブジェクト
         */
        addCopyright(copyright: Copyright): void;

        /**
         * 指定されたズームレベルで指定されたマップ領域に関連するプレフィックスと、該当する著作権文字列をすべて返します。
         * @param bounds マップ領域
         * @param zoom ズームレベル
         */
        getCopyrightNotice(bounds: LatLngBounds, zoom: number): string[];

        /**
         * 指定されたズームレベルで指定されたマップ領域に関連する著作権文字列をすべて返します。
         * @param bounds マップ領域
         * @param zoom ズームレベル
         */
        getCopyrights(bounds: LatLngBounds, zoom: number): string[];

        /**
         * プレフィックスを設定する。
         * @param prefix プレフィックス
         */
        setPrefix(prefix: string): void;
    }

    /**
     * 地物レイヤー
     */
    class FeatureLayer extends Layer {
        /**
         * 地物を追加可能なレイヤーです。
         * @param name
         */
        constructor(name: string);

        /**
         * 地物をレイヤーに追加します。
         * @param feature 追加する地物
         */
        addFeature(feature: Feature): void;

        /**
         * レイヤーに含まれるすべての地物を削除します。
         */
        clearFeatures(): void;

        /**
         * レイヤーに含まれるすべての地物を取得します。
         */
        getFeatures(): Feature[];

        /**
         * レイヤー上に追加されている地物が全て地図上に収まる最適な地理座標範囲を返します。
         */
        getSuitedBounds(): LatLngBounds;

        /**
         * 地物をレイヤーから削除します。
         * @param feature
         * @param redraw
         */
        removeFeature(feature: Feature, redraw?: boolean): void;
    }

    /**
     * タイルレイヤ
     */
    class TileLayer extends Layer {
        /**
         * タイル形式に表示可能なレイヤー
         */
        constructor(name: string, size?: Y.Size, options?: Object);

        public floatTileSize: Y.Size;
        public tileSize: Y.Size;
    }

    /**
     * タイル画像レイヤー
     */
    class ImageTileLayer extends TileLayer {

    }

    /**
     * リスティングレイヤー
     */
    class ListingLayer extends FeatureLayer {

    }

    /**
     * GeoXmlレイヤー
     */
    class GeoXmlLayer extends ListingLayer {

    }

    /**
     * スタイル地図レイヤー
     */
    class StyleMapLayer extends ImageTileLayer {

    }

    /**
     * 白地図レイヤー
     */
    class BlankMapLayer extends ImageTileLayer {

    }

    /**
     * 経路探索レイヤー
     */
    class RouteSearchLayer extends FeatureLayer {

    }

    /**
     * YOLPサーチレイヤー
     */
    class YolpSearchLayer extends ListingLayer {

    }

    /**
     * ヒートマップレイヤー
     */
    class GeoXmlHeatmapLayer extends ImageTileLayer {

    }

    /**
     * 雨雲レーダーレイヤー
     */
    class WeatherMapLayer extends ImageTileLayer {

    }

    // Base クラス

    /**
     * ピクセル座標
     */
    class Point {
        x: number;
        y: number;

        constructor(x: number, y: number)
    }

    /**
     * ピクセルサイズ
     */
    class Size {
        constructor(width: number, height: number)
    }

    /**
     * ピクセル矩形領域
     */
    class Bounds {

    }

    /**
     * 地理座標
     */
    class LatLng {
        constructor(lat: number, lng: number)

        lat(): number

        lng(): number
    }

    /**
     * 地理座標矩形領域
     */
    class LatLngBounds {
        constructor(sw: LatLng, ne: LatLng)

        ne: LatLng;
        sw: LatLng;

        /**
         * 矩形領域の中心緯度経度座標を返します。
         */
        getCenter(): LatLng;
    }

    /**
     * 地図操作設定
     */
    type MapConfigure = {
        doubleClickZoom?: boolean,
        scrollWheelZoom?: boolean,
        singleClickPan?: boolean,
        dragging?: boolean,
        continuousZoom?: boolean,
        hybridPhoto?: boolean,
        enableFlickScroll?: boolean,
        enableOpenStreetMap?: boolean,
        mapType?: MapType,
        weatherOverlay?: boolean,
    }

    /**
     * レイヤーセットID
     */
    enum LayerSetId {
        B1,
        EARTHQUAKEPHOTO,
        NORMAL,
        OSM,
        PHOTO,
    }

    /**
     * YDF（YOLP Data Format）
     */
    class YDF {

    }

    /**
     * 吹きだし
     */
    class InfoWindow {

    }

    /**
     * 投影変換
     */
    class Projection {
        /**
         * 地図投影の変換を行うためのインターフェース仕様です。 地理座標と地図画像のピクセル座標を相互に変換するための関数が定義されています。
         */
        constructor();

        /**
         * 指定された地理座標とズームレベルに対応するピクセル座標で返します。
         * @param latlng
         * @param zoom
         */
        fromLatLngToPixel(latlng: LatLng, zoom: number): Point;

        /**
         * 指定されたピクセル座標とズームレベルに対応する地理座標を返します。
         * @param pixel
         * @param zoom
         */
        fromPixelToLatLng(pixel: Point, zoom: number): LatLng;

        /**
         * x 方向のピクセル数を返します。
         * @param zoom
         */
        getWrapWidth(zoom: number): number;
    }

    /**
     * メルカトル投影変換
     */
    class MercatorProjection extends Projection {

    }

    /**
     * イベント
     */
    class Event {

    }

    /**
     * イベントリスナー
     */
    class EventListener {

    }

    // Control クラス

    /**
     * UIコントロール
     */
    class Control {
    }

    /**
     * コントロール位置
     */
    enum ControlPosition {
        BOTTOM_LEFT,
        BOTTOM_RIGHT,
        TOP_LEFT,
        TOP_RIGHT,
    }

    /**
     * 中心点表示コントロール
     */
    class CenterMarkControl {
    }

    /**
     * レイヤーセット切り替えコントロール
     */
    class LayerSetControl {
    }

    /**
     * 縮尺コントロール
     */
    class ScaleControl {
    }

    /**
     * ズームコントロール
     */
    class ZoomControl {
    }

    /**
     * ホームアイコンコントロール
     */
    class HomeControl {
    }

    /**
     * スライダーズームコントロール（縦）
     */
    class SliderZoomControlVertical {
    }

    /**
     * スライダーズームコントロール（横）
     */
    class SliderZoomControlHorizontal {
    }

    /**
     * 住所カテゴリコントロール
     */
    class AddressCategoryControl {
        /**
         * 住所をカテゴリ形式で表示する機能を提供します。
         * @param options
         */
        constructor(options: Object);

        /**
         * コントロールを削除します。
         */
        remove(): void;
    }

    /**
     * 検索コントロール
     */
    class SearchControl {
    }

    // Plugin クラス

    /**
     * プラグイン
     */
    class Plugin {

    }

    /**
     * キー操作プラグイン
     */
    class KeyOperationPlugin extends Plugin {

    }

    /**
     * 注記クリックプラグイン
     */
    class MapAnnotationPlugin extends Plugin {

    }

    /**
     * 経路探索プラグイン
     */
    class RouteSearchPlugin extends Plugin {

    }

    /**
     * GeoXml切り替えプラグイン
     */
    class GeoXmlPlugin {

    }

    /**
     * リスティング切り替えタブプラグイン
     */
    class ListingTabPlugin {

    }


}
