import RequestUseCase from '../usecases/RequestUseCase'
import { ICoordinate } from '../entities/Coordinate'

export default class RequestControllers {


    constructor(coordinate: ICoordinate, url: string) {
         return new RequestUseCase(coordinate, url)
    }
}

