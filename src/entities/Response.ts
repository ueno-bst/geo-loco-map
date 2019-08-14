export interface IResponseEntity {
        data: data
}

interface data {
        id: string
        url: string
        label: string
        description:string
        description_format:string
        feed: string
        feed_flag:string
        marker_display:string
        coordinate:number[]
        lat:number
        lng:number
}
