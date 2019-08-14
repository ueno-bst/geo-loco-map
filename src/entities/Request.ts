import { ICoordinate } from "./Coordinate";
import {GoogleMapEntiry} from "./GoogleMap";
import {YahooMapEntity} from "./YahooMap";

export class RequestEntity {

    xmlHttpRequest(coordinate: ICoordinate, url: string, map_type: string) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url,true)
        xhr.responseType = 'json';
        xhr.send()
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {

                    if (map_type == 'yahoo') {
                        const yahoomap = new YahooMapEntity()
                        yahoomap.requestMap(coordinate, xhr.response)

                    }else {
                        const googlemap = new GoogleMapEntiry()
                        googlemap.requestMap(coordinate, xhr.response)
                    }
                }
            }
        };

    }
}
