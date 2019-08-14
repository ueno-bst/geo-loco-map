import { ICoordinate } from "../entities/Coordinate"
import { RequestEntity } from "../entities/Request"

export default class RequestUseCase {
    coodinate: ICoordinate;
    url: string
    map_type: string

    constructor(coordinate: ICoordinate, url: string, map_type: string) {
        this.coodinate = coordinate
        this.url = url
        this.map_type = map_type
    }

    RequestUseCase() {
        const request = new RequestEntity()
        request.xmlHttpRequest(this.coodinate, this.url, this.map_type)
    }

}
