import { ICoordinate } from "../entities/Coordinate"
import { ApiRequest } from "../entities/ApiRequest"

export  class RequestUseCase {

    constructor(coordinate: ICoordinate, url: string,zoom?: number) {
        return new ApiRequest(coordinate,url,zoom)
    }
}
