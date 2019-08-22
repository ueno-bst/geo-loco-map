import RequestUseCase from '../usecases/RequestUseCase'
import { ICoordinate } from '../entities/Coordinate'
import { IMaps} from "../entities/Maps";


export default class RequestControllers {

    request: RequestUseCase

    constructor(coordinate: ICoordinate, maps: IMaps) {
        this.request = new RequestUseCase(coordinate, maps)
    }

    //addMarker(req: ICoordinate) {
    //    const request = new RequestUseCase(req)
    //    request.addMarker()
    //}

    //removeMarker(req: ICoordinate) {
    //    const request = new RequestUseCase(req)
    //    request.removeMarker()
    //}
}

