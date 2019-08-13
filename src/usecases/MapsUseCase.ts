import { IMaps } from "../entities/Maps";
import { GoogleMapEntiry } from "../entities/GoogleMap";

export default class MapsUseCase  {
    imaps: IMaps;

    constructor(maps: IMaps) {
        this.imaps = maps
    }

    execute() {
        new GoogleMapEntiry(this.imaps)
    }

}
