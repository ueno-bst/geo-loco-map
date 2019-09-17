import {ILatLng} from "./LatLng";


var allmarker: any = {}
var json: any[] = []

export class ApiRequest {

    coordinate: ILatLng
    response: any
    url: string
    zoom: number

    constructor(coordinate: ILatLng, url: string, zoom?: number) {
        this.coordinate = coordinate
        this.url = url
        this.zoom = zoom!
        this.response = this.request()
    }

    async request() {
        var coordinate = Object.entries(this.coordinate)

        var res = await fetch(this.url + "?lat=" + coordinate[0][1] + "&lng=" + coordinate[1][1] + '&zoom=' + this.zoom,
        ).then(res => res.json())

        return RequestEntity.fromJSON(res);
    }
}

class Marker {

    id: number;
    coordinate: number[];
    description: string;
    description_format: string;
    label: string;
    marker_display: boolean = true;
    url: string;
    feed: string;
    feed_flag: boolean;

    constructor(arg: any) {
        this.marker_display = true;
        if (arg['marker_display'] !== undefined) {
            this.marker_display = arg['marker_display'];
        }
        this.id = arg['id'];
        this.coordinate = arg['coordinate'];
        this.description = arg['description'];
        this.description_format = arg['description_format'];
        this.label = arg['label'];
        this.url = arg['url'];
        this.feed = arg['feed'];
        this.feed_flag = arg['feed_flag'];
    }
}


class RequestEntity {

    static fromJSON(res: any) {

        for (var index = 0; index < res.data.length; index++) {

            var marker = res.data[index];
            var id = res.data[index].id;
            if (allmarker[id] === undefined) {
                allmarker[id] = new Marker(marker);
            }
        }
        return allmarker
    }

    //allmarker.push(res.data)

    //    var cleanList = allmarker.filter(value => {
    //        return value.filter(function(v1:any,i1:any,a1:any){
    //            return (a1.findIndex(function (v2:any) {
    //                return (v1.id === v2.id)
    //            }) === i1);
    //        })
    //    });

    //for (var index = 0; index < cleanList[0].length; index++) {
    //    json[index] = new Marker(cleanList[0][index])
    //}
    //return json;


}







