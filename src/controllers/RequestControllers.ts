import RequestUseCase from '../usecases/RequestUseCase'
import { ICoordinate } from '../entities/Coordinate'

export default class RequestControllers {

    constructor(req: ICoordinate, url: string) {
        const request = new RequestUseCase(req, url)
        request.RequestUseCase()
    }
}

