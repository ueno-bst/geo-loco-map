import { IMaps } from "../entities/Maps";
import { GoogleMapEntiry } from "../entities/GoogleMap";
import { YahooMapEntity } from "../entities/YahooMap";

export default class MapsUseCase  {
    imaps: IMaps;

    constructor(maps: IMaps) {
        this.imaps = maps
    }

    execute() {
        if (this.imaps.map_type == 'yahoo') {
            new YahooMapEntity(this.imaps)
        }else {
            new GoogleMapEntiry(this.imaps)
        }
    }

}
