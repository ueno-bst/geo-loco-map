<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {ILatLng, ILatLngBounds} from "~/entities/LatLng";
import {Loader} from "@googlemaps/js-api-loader";

const
    $map = ref<HTMLElement>(),
    markers = ref<string[]>([]),
    zoom = ref<number>(),
    center = ref<ILatLng>(),
    bound = ref<ILatLngBounds | null>(null),
    ui = ref<boolean>(),
    info = ref<boolean>(),
    autoRequest = ref<boolean>(),
    count = reactive({
        current: 0,
        total: 0,
    });

onMounted(() => {
    if ($map.value) {
        new Loader({
            apiKey: "AIzaSyDys3l0fXuc1b39XjRGoHdhP24N3Ovg1iI",
        }).load().then(() => {
            let timer: NodeJS.Timeout | undefined;

            import('~/index').then((GeoLocoMap) => {
                const map = new GeoLocoMap.default({
                    map_type: 'google',
                    center: [35.6525164, 139.7366392],
                    // center: [35, 135],
                    zoom: 15,
                    // zoom_min: 1,
                    zoom_max: 20,
                    show_ui: true,
                    show_info: true,
                    selector: $map.value,
                    api: {
                        url: 'http://oshigoto-lab.aldev.designserver.space/rest-api/gis/v1/bounds/item',
                        // url: '/geo-loco-map/src/response.json',
                        user: 'oshigoto-dev',
                        password: 'sMlre20Y3CUO1xMxlejq',
                        precision: 10,
                        type: 'bounds',
                        delay: 500,
                        auto: true
                    },
                    onInit: function (e) {
                        // console.info("onInit", map.controller, e.controller);
                    },
                    onMove: function (obj, coordinate) {
                        console.info("onMove", obj.controller, coordinate.lat, coordinate.lng);
                    },
                    onZoom: function (obj, zoom) {
                        console.info("onZoom", obj.controller, zoom, obj.getBounds().ne, obj.getBounds().sw);
                    },
                    onUI: function (obj, f) {
                        // console.info("onUI", map.controller, obj.controller, f);
                    },
                    onChange: function (obj) {
                        console.info("onChange", obj.controller);

                        center.value = obj.getCenter();
                        bound.value = obj.getBounds();
                        zoom.value = obj.getZoom();
                        ui.value = obj.getUI();
                        info.value = obj.getInfo();
                        autoRequest.value = map.config.api.auto;


                        renderMarkers();
                    }
                });

                map
                    .on("request", function (o, url) {
                        console.info(url.build());
                    })
                    .on("response", function (o, response) {
                        $("#marker-total").text(response.data.length);
                    })
                    .on("marker.disable", function (o, ids) {
                        markers.value = [];
                        renderMarkers();
                    })
                    .on("marker.active", function (o, ids) {
                        markers.value = ids;
                        renderMarkers();
                    });

                function renderMarkers() {
                    clearTimeout(timer);

                    timer = setTimeout(function () {
                        const
                            m = markers.value;

                        let
                            i,
                            data = [];

                        if (markers && m.length > 0) {
                            for (i = 0; i < m.length; i++) {
                                data.push(map.getMarker(m[i]));
                            }
                        } else {
                            data = map.getViewInMarkers(30);
                        }

                        /*
                        const $node = $("<ol>").appendTo($("#markers").empty());

                        for ( i = 0; i < data.length; i ++) {
                            const datum = data[i];

                            $node.append($("<li>").html(datum.id + ":" + datum.label));
                        }

                        $("#marker-count").text(data.length);
                        */

                        count.current = data.length;
                    }, 200);
                }
            });
        })
    }
});
</script>

<template>
    <section style="display: flex; width: 100vw; height: 100vh;">
        <div ref="$map" class="map" style="flex-grow: 1"></div>
        <div style="width: 40vw; padding: 1em; display: flex; flex-direction: column;">
            <fieldset style="margin: 0 0 1em 0;">
                <legend>コントロールの表示</legend>
                <label>
                    <input type="checkbox" id="ui" value="1" :value="ui"> コントローラー表示
                </label>
                <label>
                    <input type="checkbox" id="info" value="1" :value="info"> 情報バルーン表示(クリック時)
                </label>

                <table>
                    <tr>
                        <th><label for="latitude">Lat:</label></th>
                        <td><input ref="$lat" id="latitude" type="number" min="-90.00000000" max="90.0000000"
                                   :value="center?.lat"
                                   step="0.005"></td>
                    </tr>
                    <tr>
                        <th><label for="longitude">Lng:</label></th>
                        <td><input ref="$lng" id="longitude" type="number" min="-180.00000000" max="180.0000000"
                                   :value="center?.lng"
                                   step="0.005"></td>
                    </tr>
                    <tr>
                        <th><label for="zoom">Zoom:</label></th>
                        <td><input ref="$zoom" id="zoom" type="number" min="1" max="20" :value="zoom"></td>
                    </tr>
                    <tr>
                        <th rowspan="4">Bounds:</th>
                        <td><input id="bound-ne" type="number" readonly :value="bound?.ne.lat"></td>
                    </tr>
                    <tr>
                        <td><input id="bound-nw" type="number" readonly :value="bound?.ne.lng"></td>
                    </tr>
                    <tr>
                        <td><input id="bound-se" type="number" readonly :value="bound?.sw.lat"></td>
                    </tr>
                    <tr>
                        <td><input id="bound-sw" type="number" readonly :value="bound?.sw.lng"></td>
                    </tr>
                </table>
                <input type="button" id="request" value="APIリクエスト">
                <label><input type="checkbox" id="auto-request" value="1" :value="autoRequest"></label>
            </fieldset>
            <fieldset style="position:relative; flex-grow: 1; padding: 1em;">
                <legend>ビュー内にあるマーカー情報 (<var id="marker-count">{{ count.current }}</var> / <var id="marker-total">{{
                        count.total
                    }}</var>)
                </legend>
                <div id="markers"
                     style="position: absolute; left: .5em; top: 1.5em; bottom:0; right: .5em; box-sizing: border-box; border:0; overflow: auto;"></div>
            </fieldset>
        </div>
    </section>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
