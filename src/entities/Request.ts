import { ICoordinate } from "./Coordinate";
import {GoogleMapRequestEntiry} from "./GoogleMapRequest";
import { IMaps} from "./Maps";
import {YahooMapEntity} from "./YahooMap";


export class API {

    coordinate: ICoordinate
    maps: IMaps
    response: any

    constructor(coordinate: ICoordinate, maps: IMaps )  {
        this.coordinate = coordinate
        this.maps = maps
        this.response = this.request(maps,coordinate)
    }


    async  request(maps: any, coordinate: ICoordinate) {
        var res =  await fetch(maps.maps.api_url)
            .then(res => res.json())


        if (maps.maps.map_type == 'google') {
            new GoogleMapRequestEntiry(coordinate, maps.maps, res)
        } else if (maps.maps.map_type == 'yahoo') {
            new YahooMapEntity().addMarker(coordinate, res)
        }

       return RequestEntity.fromJSON(res);
    }

}

class Marker {

    id: number
    coordinate: number[]
    description:string
    description_format: string
    label: string
    marker_display: boolean
    url: string

    constructor(arg: any) {
        this.id = arg['id'];
        this.coordinate = arg['coordinate'];
        this.description = arg['description'];
        this.description_format = arg['description_format'];
        this.label = arg['label'];
        this.marker_display = arg['marker_display'];
        this.url = arg['url'];
    }
}
class RequestEntity {
    json: any[] = []

    static fromJSON(res: any) {
        var obj = new RequestEntity();

        for (var index = 0; index < res.data.length; index++) {
            obj.json[index] = new Marker(res.data[index])
        }
        return obj;
    }

}






