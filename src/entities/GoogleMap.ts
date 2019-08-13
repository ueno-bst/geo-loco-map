import { IMaps, Maps } from '../entities/Maps'
import { ICoordinate} from "./Coordinate";
import { IResponseEntity } from "./Response";


interface option {
    zoom: number
    MapTypeId: string
}


export class GoogleMapEntiry {

    maps: IMaps

    private map: google.maps.Map
    private options: option;
    private marker: any


    constructor(maps: Partial<IMaps> = {}) {

        const opts = { ...Maps, ...maps }
        this.maps = opts

        this.options = { zoom: 3, MapTypeId: 'terrian' };
        this.map = new google.maps.Map(document.getElementById(this.maps.selector) ,{
                center: { lat: 35.681236, lng: 139.767125 },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )
        //this.marker = new google.maps.Marker({
        //    position: { lat: 35.681236, lng:139.767125 },
        //    map: this.map
        //})

    }

    requestMap(coordinate: ICoordinate, reponse: IResponseEntity[]) {

        this.map = new google.maps.Map(document.getElementById('map') ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )

        for (var i = 0; i < reponse.length; i++) {
            const markerLatLng = new google.maps.LatLng({lat: reponse[i]['lat'], lng: reponse[i]['lng']}); // 緯度経度のデータ作成
            this.marker = new google.maps.Marker({ // マーカーの追加
                position: markerLatLng, // マーカーを立てる位置を指定
                map: this.map // マーカーを立てる地図を指定
            });

        }
    }

}

