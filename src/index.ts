import MapsControllers from './controllers/MapsControllers'
import { IMaps, Maps }  from './entities/Maps'
import { Request } from "./Request";
import { ICoordinate } from "./entities/Coordinate";
import {API} from "./entities/Request";

export default class GeoLocoMap {
    maps: IMaps
    drawMap: IMaps


    constructor(maps: IMaps)
    {
        const opts = { ...Maps, ...maps }
        this.maps = opts
        this.drawMap  = new MapsControllers(this.maps).InitMap()
    }

    request(coordinate: ICoordinate) {
        var response = new Request(coordinate,this.drawMap)

        return response

    }

    //getZoom(){
    //    return this.drawMap.map.getZoom()
    //}
    //setZoom(number: Number) {
    //    return this.drawMap.map.setZoom(number)
    //}


    //getCenter() {
    //   return this.drawMap.map.getCenter()
    //}

    //setCenter() {
    //    if (this.maps.map_type == 'google') {

    //        this.drawMap.map.setCenter( new google.maps.LatLng( 35.48694629636732, 138.7805510999999 ))

    //    } else if (this.maps.map_type == 'yahoo') {

    //        this.drawMap.map.drawMap(new Y.LatLng(35.66572, 139.73100)  )

    //    }
    //}

    //setController() {
    //    if (this.maps.map_type == 'google') {

    //        var options = {
    //            disableDefaultUI: true,
    //        }
    //        this.drawMap.map.setOptions(options)

    //    } else if (this.maps.map_type == 'yahoo') {

    //        this.drawMap.map.addControl(new Y.LayerSetControl())
    //        this.drawMap.map.addControl(new Y.CenterMarkControl())
    //        this.drawMap.map.addControl(new Y.HomeControl())
    //        this.drawMap.map.addControl(new Y.ScaleControl())
    //        this.drawMap.map.addControl(new Y.ZoomControl())
    //        this.drawMap.map.addControl(new Y.SliderZoomControlHorizontal())
    //        this.drawMap.map.addControl(new Y.SliderZoomControlVertical())
    //        this.drawMap.map.addControl(new Y.SearchControl())

    //    }
    //}

}

var  response  = new GeoLocoMap({map_type: 'google',latlng: [35.658581, 139.745433],selector: 'map', api_url: 'http://localhost:8888/response.php'}).request({lat: 35, lng:135 })

//console.log(response)
console.log(response.deleteMarker(2))
//console.log(response.addMarker({lat:35,  lng:135}))

