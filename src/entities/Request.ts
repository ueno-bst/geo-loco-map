import { ICoordinate } from "./Coordinate";
import {GoogleMapEntiry} from "./GoogleMap";

export class RequestEntity {

    xmlHttpRequest(coordinate: ICoordinate, url: string) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url)
        xhr.responseType = 'json';
        xhr.send()
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    const googlemap = new GoogleMapEntiry()
                    googlemap.requestMap(coordinate, xhr.response)
                }
            }
        };

    }
}
