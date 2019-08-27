import { ICoordinate } from "./Coordinate";


export class ApiRequest {

    coordinate: ICoordinate
    response: any
    url: string

    constructor(coordinate: ICoordinate, url: string)  {
        this.coordinate = coordinate
        this.url = url
        this.response = this.request()
    }

    async  request() {
        var coordinate = Object.entries(this.coordinate)


        var res =  await fetch(this.url+"/?latlng="+coordinate[0][1]).then(res =>
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






