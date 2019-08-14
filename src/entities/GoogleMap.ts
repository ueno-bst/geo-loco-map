import { IMaps, Maps } from './Maps'
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

    requestMap(coordinate: ICoordinate, response: any) {
        console.log(response)
        this.map = new google.maps.Map(document.getElementById('map') ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )

        for (var i = 0; i < response['data'].length; i++) {
            const markerLatLng = new google.maps.LatLng({lat: response['data'][i]['coordinate'][0], lng: response['data'][i]['coordinate'][1]}); // 緯度経度のデータ作成
            this.marker = new google.maps.Marker({
                position: markerLatLng,
                map: this.map
            });
            this.info = new google.maps.InfoWindow({
                content: '<div class="detail">'+ response['data'][i]['url']+'</div>'
            })
            this.markerEvent(i);

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

