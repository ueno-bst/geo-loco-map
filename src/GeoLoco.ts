import MapsControllers from './controllers/MapsControllers'
import { IMaps, Maps }  from './entities/Maps'


export class GeoLocoMap {
    maps: IMaps
    map: any

    constructor(maps: IMaps)
    {
        this.maps = maps
        this.map  = new  MapsControllers(this.maps)
    }
}
