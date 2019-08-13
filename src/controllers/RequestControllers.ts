import RequestUseCase from '../usecases/RequestUseCase'
import { ICoordinate } from '../entities/Coordinate'

export default class RequestControllers {

    constructor(req: ICoordinate) {
        const request = new RequestUseCase(req)
        request.RequestUseCase()
    }
}

