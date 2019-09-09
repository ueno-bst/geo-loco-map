import { IMaps, Maps } from './Maps'
import { ICoordinate } from "./Coordinate";
import { GeoLocoMapRequest }  from "../Request";
import { ApiRequest } from "./ApiRequest";

interface option {
    zoom: number
    MapTypeId: string
}


var allmarker: any[] = []
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
            this.response = geoLocoMapRequest.initRequest(this.getZoom()).response.response
            this.apiRequest()
            this.request()
        }
        if (!this.maps.element_flag) {

            const  options = {
                disableDefaultUI: true,
            }
            this.map.setOptions(options)
        }

    }



    request (id?: number) {
        this.response
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
        return this.map.getZoom()
    }

    setZoom(number: number) {
        this.map.setZoom(number)

    }

    getCenter() {
        return {lat:this.map.getCenter().lat(),lng:this.map.getCenter().lng()}
    }
    setCenter(coordinate: ICoordinate) {
        this.map.setCenter( new google.maps.LatLng( coordinate.lat, coordinate.lng))
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


        var response = this.markerConvert(response, id)


        if(id) {
            for (var i = 0; i < this.markers.length; i++) {
                if(this.markers[i]) {
                    this.markers[i].setMap(null)
                }
            }
        }


        var res: any = Object.entries(response)

        for (var i = 0; i < res.length; i++) {
            if(allmarker[i]) {
                if (allmarker[i]['id']  != res[i][1]['id']) {

                    if(res[i][1]['marker_display'] ) {

                        var  markerLatLng = new google.maps.LatLng({lat: res[i][1]['coordinate'][0], lng: res[i][1]['coordinate'][1]});
                        this.markers[i] = new google.maps.Marker({
                            position: markerLatLng,
                        });
                        this.markers[i].setMap(this.map)

                        var  feed = res[i]['feed_flag'] ? `<iframe src=${res[i][1]['feed']} frameborder="0" ></iframe>` : ""
                        var content = feed ? feed : res[i][1]['description']
                        var description_format = res[i][1]['description_format']
                        if(description_format ==  'text') {
                            var format: string =  feed ? content : this.escapeHtml(content)
                            this.info = new google.maps.InfoWindow({
                                content:format
                            })
                        } else if (description_format == 'html') {
                            var format: string =  '<div id="detail">'+content+'</div>'
                            this.info = new google.maps.InfoWindow({
                            })
                            this.info.setContent(format)
                        }

                        this.markerEvent(i);
                    }
                }

            } else {

                if(res[i][1]['marker_display'] ) {

                    var  markerLatLng = new google.maps.LatLng({lat: res[i][1]['coordinate'][0], lng: res[i][1]['coordinate'][1]});
                    this.markers[i] = new google.maps.Marker({
                        position: markerLatLng,
                    });
                    this.markers[i].setMap(this.map)


                    var  feed = res[i][1]['feed_flag'] ? `<iframe src=${res[i]['feed']} frameborder="0" ></iframe>` : ""
                    var content = feed ? feed : res[i][1]['description']
                    var description_format = res[i][1]['description_format']
                    if(description_format ==  'text') {
                        var format: string =  feed ? content : this.escapeHtml(content)
                        this.info = new google.maps.InfoWindow({
                            content:format
                        })
                    } else if (description_format == 'html') {
                        var format: string =  '<div id="detail">'+content+'</div>'
                        this.info = new google.maps.InfoWindow({
                        })
                        this.info.setContent(format)
                    }

                    this.markerEvent(i);
                }
                res[i][1]['marker_flag'] = true
                allmarker.push(res[i])

            }

        }
        return this.markers
    }

    escapeHtml(str: string){
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#x27;');
        str = str.replace(/`/g, '&#x60;');
        str = str.replace(/\r?\n/g, '<br>')
        return str;
    }

    markerConvert(res:any, id?:number) {
        if (id) {
            for (var i = 0; i < res.length; i++) {
                if (res[i]['id'] == id) {
                    const index = res.findIndex((v:any) => v.id === id);
                    const removedUser = res.splice(index, 1);
                    return res;
                }
            }
        } else {
            return res
        }
    }


    apiRequest() {

        var timer: any = 0
        this.map.addListener('center_changed', () => {
            clearTimeout(timer)
            timer = countup()

        });

        var countup = () => {
             return  setTimeout(request , 500);
        }

        var request = () => {
            var coordinate = { lat: this.map.getCenter().lat() , lng: this.map.getCenter().lng()}
            if(this.url) {
                var res = new ApiRequest(coordinate,this.url,this.getZoom())
                res.response
                    .then((res: any)  =>
                        this.marker(res)
                    )
            }
        }

    }
}

