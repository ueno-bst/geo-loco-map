import { ICoordinate } from "../entities/Coordinate"
import { ApiRequest } from "../entities/ApiRequest"

export  class RequestUseCase {
    response: any

    constructor(coordinate: ICoordinate, url: string,zoom: number) {
        this.response =  new ApiRequest(coordinate,url,zoom)
    }
}
