import { ILatLng } from "../entities/LatLng"
import { ApiRequest } from "../entities/ApiRequest"

export  class RequestUseCase {

    constructor(coordinate: ILatLng, url: string, zoom?: number) {
        return new ApiRequest(coordinate,url,zoom)
    }
}
