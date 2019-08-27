import {ICoordinate} from "./Coordinate";

export interface IMaps {
    map_type?: string
    latlng?: ICoordinate
    zoom?: number
    element_flag?: boolean
    grid?: number
    lazy_load?: number
    selector: string
    //api_url: string
}

export const Maps: IMaps =  {
    map_type: 'google',
    latlng:  {lat:35.681236,lng:139.767125},
    zoom: 13,
    element_flag:true,
    grid: 5,
    lazy_load: 0.5,
    selector: 'map',
    //api_url: 'localhost:8000'
}
