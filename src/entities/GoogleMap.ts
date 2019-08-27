import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";
import { GeoLocoMapRequest }  from "../Request";
import { ApiRequest } from "./ApiRequest";


interface option {
    zoom: number
    MapTypeId: string
}


export class GoogleMapEntiry {

    maps: IMaps

    map: google.maps.Map
    options: option;
    info: google.maps.InfoWindow;
    markers: google.maps.Marker[] = []
    response?: any
    url?: string



    constructor(maps: Partial<IMaps> = {}, geoLocoMapRequest?: GeoLocoMapRequest) {

        const opts = { ...Maps, ...maps }
        this.maps = opts
        this.info = new google.maps.InfoWindow()
        this.options = { zoom: 3, MapTypeId: 'terrian' };


        if (geoLocoMapRequest == undefined) {
            this.map = this.drawMap(this.maps.latlng!)
        } else  {
            this.map = this.drawMap(geoLocoMapRequest.coordinate)
        }

        if (geoLocoMapRequest != undefined) {
            this.url = geoLocoMapRequest.url
            this.response = geoLocoMapRequest.response.response.response
            this.apiRequest()
        }
        this.request()

    }


    request = () =>  {

        this.response
            .then((res:any) => {
                this.marker(res)
            })

        console.log(this.markers)
    }


    // map表示
    drawMap(coordinate: ICoordinate) {
        return new google.maps.Map(document.getElementById(this.maps.selector) ,{
                center: { lat: coordinate.lat, lng: coordinate.lng },
                scrollwheel: false,
                zoom: this.maps.zoom,
            }
        )

    }

    markerEvent(i:number) {
        const marker =  this.markers[i]
        const info =  this.info
        const map = this.map
        this.markers[i].addListener('click', function() {
            info.open(map, marker);
        });
    }

    getZoom() {
        this.map.getZoom()
    }

    setZoom(number: number) {
        this.map.setZoom(number)

    }

    getCenter() {
        this.map.getCenter()
    }
    setCenter(coordinate: ICoordinate) {
        this.map.setCenter( new google.maps.LatLng( coordinate.lat, coordinate.lng))
    }

    setOptions() {
        var options = {
            disableDefaultUI: true,
        }
        this.map.setOptions(options)
    }

    addMarker(coordinate: ICoordinate) {
        var markerLatLng = new google.maps.LatLng({lat: coordinate.lat, lng: coordinate.lng});
        var markers = new google.maps.Marker({
            position: markerLatLng,
        });
        markers.setMap(this.map)
    }

    deleteMarker(id: number) {
        console.log(this.markers)

        for(var i = 0; this.markers.length; i++) {

        }

        //this.response
        //    .then(res =>
        //    {
        //        for (var i = 0; i < res.json.length; i++) {
        //            if (res.json[i]['id'] === id) {

        //                var markerLatLng = new google.maps.LatLng({lat: res.json[i]['coordinate'][0], lng: res.json[i]['coordinate'][1]});
        //                var marker = new google.maps.Marker({
        //                    position: markerLatLng,
        //                });
        //                marker.setMap(null)

        //            }
        //        }

        //    })
    }

    marker(res: any, id?: number) {



        for (var i = 0; i < res.json.length; i++) {


            if(res.json[i]['marker_display'] ) {

                const markerLatLng = new google.maps.LatLng({lat: res.json[i]['coordinate'][0], lng: res.json[i]['coordinate'][1]});
                this.markers[i] = new google.maps.Marker({
                    position: markerLatLng,
                });
                this.markers[i].setMap(this.map)

                var description = res.json[i]['description']
                var description_format = res.json[i]['description_format']

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

    apiRequest() {

        this.map.addListener('center_changed', () => {
            countup()
        });
        var countup = () => {
            setTimeout(request , 500);
        }


        var request = () => {
            var coordinate = { lat: this.map.getCenter().lat() , lng: this.map.getCenter().lng()}
            if(this.url) {
                var res = new ApiRequest(coordinate,this.url)
                res.response
                    .then((res: any)  =>
                        this.marker(res)
                    )
            }
        }

    }
}

