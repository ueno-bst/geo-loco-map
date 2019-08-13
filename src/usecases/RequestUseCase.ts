import { ICoordinate } from "../entities/Coordinate"
import { RequestEntity } from "../entities/Request"

export default class RequestUseCase {
    coodinate: ICoordinate;
    url: string

    constructor(coordinate: ICoordinate, url: string) {
        this.coodinate = coordinate
        this.url = url
    }

    RequestUseCase() {
        const request = new RequestEntity()
        request.xmlHttpRequest(this.coodinate, this.url)
    }

}
