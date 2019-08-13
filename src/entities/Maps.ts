export interface IMaps {
    map_type?: string
    latlng?: number[]
    zoom?: number
    element_flag?: boolean
    grid?: number
    lazy_load?: number
    selector: string
    api_url: string
}

export const Maps: IMaps =  {
    map_type: 'google',
    latlng:  [35.681236,139.767125],
    zoom: 16,
    element_flag:true,
    grid: 5,
    lazy_load: 0.5,
    selector: 'map',
    api_url: 'localhost:8000'
}
