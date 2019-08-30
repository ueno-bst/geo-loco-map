import { IMaps, Maps } from './Maps'
import { ICoordinate } from "./Coordinate";
import { GeoLocoMapRequest }  from "../Request";
import { ApiRequest } from "./ApiRequest";
import * as ts from "typescript/lib/tsserverlibrary";
import convertScriptKindName = ts.server.convertScriptKindName;


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
            this.request()
        }

    }



    request (id?: number) {
        this.markers = this.response
            .then((res:any) => {
                this.marker(res,id)
            })
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
        this.request(id)
    }


    marker(response: any, id?: number) {


        var res = this.markerConert(response, id)


        for (var i = 0; i < res.json.length; i++) {
            if(res.json[i]['marker_display'] ) {

                var  markerLatLng = new google.maps.LatLng({lat: res.json[i]['coordinate'][0], lng: res.json[i]['coordinate'][1]});
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
        return this.markers
    }

    markerConert(res:any, id?:number) {
        if (id) {
            for (var i = 0; i < res.json.length; i++) {
                if (res.json[i]['id'] == id) {
                    const index = res.json.findIndex((v:any) => v.id === id);
                    const removedUser = res.json.splice(index, 1);
                    return res;
                }
            }
        } else {
            return res
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

