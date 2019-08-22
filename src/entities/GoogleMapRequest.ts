import { ICoordinate} from "./Coordinate";
import { IMaps} from "./Maps";
import {readdirSync} from "fs";


export class GoogleMapRequestEntiry {

    marker: google.maps.Marker[] = []
    info: google.maps.InfoWindow
    maps: google.maps.Map
    map: IMaps



    constructor(coordinate: ICoordinate, maps: IMaps, response: any) {
        this.map = maps

        this.info = new google.maps.InfoWindow

        this.maps = new google.maps.Map(document.getElementById(maps.selector) ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: maps.zoom
            }
        )


        for (var i = 0; i < response['data'].length; i++) {

            if(response['data'][i]['marker_display']) {
                const markerLatLng = new google.maps.LatLng({lat: response['data'][i]['coordinate'][0], lng: response['data'][i]['coordinate'][1]});
                this.marker[i] = new google.maps.Marker({
                    position: markerLatLng,
                    map: this.maps
                });
                var description = response['data'][i]['description']
                var description_format = response['data'][i]['description_format']

                if(description_format ==  'text') {
                    var format: string = description
                    this.info = new google.maps.InfoWindow({
                        content:  format
                    })
                } else if (description_format == 'html') {
                    var format: string =  '<div class="detail">'+ description+'</div>'
                    this.info = new google.maps.InfoWindow({
                        content:  format
                    })

                }
                this.markerEvent(i);


            }

        }
    }

    markerEvent(i:number) {
        const marker =  this.marker[i]
        const info =  this.info
        const map = this.maps
        this.marker[i].addListener('click', function() {
            info.open(map, marker);
        });
    }

    addMarker(coordinate: ICoordinate){

        const markerLatLng = new google.maps.LatLng({lat: coordinate.lat, lng: coordinate.lng}); // 緯度経度のデータ作成
        var marker = new google.maps.Marker({
            position: markerLatLng,
            map:this.maps
        });

    }

    deleteMarker(id:number,response: any) {

        response.then(res => {
            var res = res.json[1]
            const markerLatLng = new google.maps.LatLng({lat: res.coordinate[0], lng: res.coordinate[1]}); // 緯度経度のデータ作成
            var marker = new google.maps.Marker({
                position: markerLatLng,
                map:this.maps
            });
            console.log(this.maps)
            marker.setMap(null);
        })
    }
}

