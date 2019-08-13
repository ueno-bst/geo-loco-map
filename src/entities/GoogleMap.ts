import { IMaps, Maps } from '../entities/Maps'
import { ICoordinate} from "./Coordinate";
import { IResponseEntity } from "./Response";


interface option {
    zoom: number
    MapTypeId: string
}


export class GoogleMapEntiry {

    maps: IMaps

    map: google.maps.Map
    options: option;
    marker: any
    info: any


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

    requestMap(coordinate: ICoordinate, reponse: IResponseEntity[]) {

        this.map = new google.maps.Map(document.getElementById('map') ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )

        for (var i = 0; i < reponse.length; i++) {
            const markerLatLng = new google.maps.LatLng({lat: reponse[i]['lat'], lng: reponse[i]['lng']}); // 緯度経度のデータ作成
            this.marker = new google.maps.Marker({
                position: markerLatLng,
                map: this.map
            });
            console.log(reponse[i])
            this.info = new google.maps.InfoWindow({
                content: '<div class="detail">'+ reponse[i]['url']+'</div>'
            })
            this.markerEvent(i);

            console.log('aaaaaaaaa')
        }

    }
    markerEvent(i: number) {
        const marker =  this.marker
        const info =  this.info
        const map = this.map
        this.marker.addListener('click', function() {
            info.open(map, marker);
       });
    }

}

