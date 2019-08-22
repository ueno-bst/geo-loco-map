import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";
import { IResponseEntity } from "./Response";
import {format} from "path";
import { GoogleMapRequestEntiry } from './GoogleMapRequest'


interface option {
    zoom: number
    MapTypeId: string
}


export class GoogleMapEntiry {

    maps: IMaps

    map: google.maps.Map
    options: option;
    info: any;




    constructor(maps: Partial<IMaps> = {}) {

        const opts = { ...Maps, ...maps }
        this.maps = opts
        this.info = new google.maps.InfoWindow()

        this.options = { zoom: 3, MapTypeId: 'terrian' };
        this.map = new google.maps.Map(document.getElementById(this.maps.selector) ,{
                center: { lat: 35.681236, lng: 139.767125 },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )
    }

    addMarker(coordinate: ICoordinate){
        var map = new google.maps.Map(document.getElementById(this.maps.selector) ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )

        const markerLatLng = new google.maps.LatLng({lat: coordinate.lat, lng: coordinate.lng}); // 緯度経度のデータ作成
        new google.maps.Marker({
            position: markerLatLng,
            map:map
        });

    }

    //removeMarker(coordinate: ICoordinate) {
    //    const markerLatLng = new google.maps.LatLng({lat: coordinate.lat, lng: coordinate.lng}); // 緯度経度のデータ作成
    //    this.marker = new google.maps.Marker.ts({
    //        position: markerLatLng,
    //    });

    //}

    //markerEvent(i: number) {
    //    const marker =  this.marker
    //    const info =  this.info
    //    const map = this.map
    //    this.marker.addListener('click', function() {
    //        info.open(map, marker);
    //    });
    //}

}

