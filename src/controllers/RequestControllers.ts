import RequestUseCase from '../usecases/RequestUseCase'
import { ICoordinate } from '../entities/Coordinate'

export default class RequestControllers {

    constructor(req: ICoordinate, url: string, map_type: string) {
        const request = new RequestUseCase(req, url, map_type)
        request.RequestUseCase()
    }
}

