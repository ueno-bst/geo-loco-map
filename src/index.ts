import RequestControllers from './controllers/RequestControllers'
import MapsControllers from './controllers/MapsControllers'
import { IMaps, Maps }  from './entities/Maps'
import { ICoordinate} from "./entities/Coordinate";

export class GeoLocoMap {
    maps: IMaps

    constructor(maps: IMaps)
    {
        this.maps = maps
    }

    InitMaps(){
        new  MapsControllers(this.maps)
    }

    request(req: ICoordinate, url = this.maps.api_url) {
        new RequestControllers(req, url)
    }
}

const geolocomap = new GeoLocoMap({latlng: [35.658581, 139.745433],selector: 'map', api_url: 'http://localhost:8000'})
//geolocomap.InitMaps()

geolocomap.request({lat: 35.658581, lng:139.745433})
