import { ICoordinate } from "./Coordinate";


export class ApiRequest {

    coordinate: ICoordinate
    response: any
    url: string
    zoom: number

    constructor(coordinate: ICoordinate, url: string,zoom: number)  {
        this.coordinate = coordinate
        this.url = url
        this.zoom = zoom
        this.response = this.request()
    }

    async  request() {
        var coordinate = Object.entries(this.coordinate)

        var res =  await fetch(this.url+"/?lat="+coordinate[0][1]+"&lng="+coordinate[1][1]+'&zoom='+this.zoom,
        ).then(res =>
            {
                return res.json()
            })


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
    feed:string
    feed_flag: boolean

    constructor(arg: any) {
        if (arg['marker_display'] == undefined) {
            this.marker_display = true;
        }else {
            this.marker_display = arg['marker_display'];
        }
        this.id = arg['id'];
        this.coordinate = arg['coordinate'];
        this.description = arg['description'];
        this.description_format = arg['description_format'];
        this.label = arg['label'];
        this.url = arg['url'];
        this.feed =arg['feed']
        this.feed_flag =arg['feed_flag']
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






