import { RequestUseCase } from '../usecases/RequestUseCase'
import { ICoordinate } from '../entities/Coordinate'

export class RequestControllers {

    response:any

    constructor(coordinate: ICoordinate, url: string,zoom?: number) {
         this.response = new RequestUseCase(coordinate, url,zoom)
    }
}

