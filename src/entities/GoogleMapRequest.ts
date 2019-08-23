import { ICoordinate} from "./Coordinate";
import { IMaps} from "./Maps";


export class GoogleMapRequestEntiry {

    markers: google.maps.Marker[] = []
    info: google.maps.InfoWindow
    maps: google.maps.Map
    map: IMaps
    coordinate: ICoordinate



    constructor(coordinate: ICoordinate, maps: IMaps, response: any, addMarker: boolean = false) {

        this.coordinate = coordinate
        this.map = maps


        this.info = new google.maps.InfoWindow

        this.maps = new google.maps.Map(document.getElementById(maps.selector) ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: maps.zoom
            }
        )


        var marker: google.maps.Marker[] = []


        if(addMarker) {
            var latlng = new google.maps.LatLng({lat: coordinate.lat, lng: coordinate.lng});
           new google.maps.Marker({
                position: latlng,
                map: this.maps
            });
        }

        for (var i = 0; i < response['data'].length; i++) {


            if(response['data'][i]['marker_display']) {
                const markerLatLng = new google.maps.LatLng({lat: response['data'][i]['coordinate'][0], lng: response['data'][i]['coordinate'][1]});
                this.markers[i] = new google.maps.Marker({
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


    deleteMarker(id:number,response: any) {

        response.then(res => {
            var maps = new google.maps.Map(document.getElementById('map') ,{
                    center: { lat: this.coordinate.lat, lng: this.coordinate.lng },
                    scrollwheel: false,
                    zoom: 12
                }
            )

            for(var i = 0; i < res.json.length; i++) {

                if(res.json[i].marker_display && res.json[i].id != id) {
                    const markerLatLng = new google.maps.LatLng({lat: res.json[i].coordinate[0], lng: res.json[i].coordinate[1]}); // 緯度経度のデータ作成
                    this.markers[i] = new google.maps.Marker({
                        position: markerLatLng,
                        map:maps
                    });
                    var description = res.json[i].description
                    var description_format = res.json[i].description_format

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

        })
    }

    markerEvent(i:number) {
        const marker =  this.markers[i]
        const info =  this.info
        const map = this.maps
        this.markers[i].addListener('click', function() {
            info.open(map, marker);
        });
    }
}

