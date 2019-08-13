import MapsUseCase from '../usecases/MapsUseCase'
import { IMaps } from '../entities/Maps'

export default class MapsControllers {

    maps: IMaps

    constructor(maps: IMaps) {
        this.maps = maps
        const mapsUsecase = new MapsUseCase(this.maps)
        mapsUsecase.execute()
    }

}
