import { ICoordinate } from "../entities/Coordinate"
import { RequestEntity } from "../entities/Request"

export default class RequestUseCase  {
    coodinate: ICoordinate;

    constructor(coordinate: ICoordinate) {
        this.coodinate = coordinate
    }

    RequestUseCase() {
        const request = new RequestEntity()
        request.xmlHttpRequest(this.coodinate)
    }

}
