import { RequestUseCase } from '../usecases/RequestUseCase'
import { ILatLng } from '../entities/LatLng'

export class RequestControllers {

    response:any

    constructor(coordinate: ILatLng, url: string, zoom?: number) {
         this.response = new RequestUseCase(coordinate, url,zoom)
    }
}

