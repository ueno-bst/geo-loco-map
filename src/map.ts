
export default class GoogleMaps  {

    private map: any;
    private options: any;
    private marker: any

    constructor (req: any) {
        console.log(req)

        this.options = { zoom: 3, MapTypeId: 'terrian' };
        this.map = new google.maps.Map(document.getElementById('map', ) ,{
            center: { lat: 48.2, lng: 16.3667 },
            scrollwheel: false,
            zoom:10,
            }
        )
        this.marker = new google.maps.Marker({
            position: { lat: 48.3, lng: 16.3668 },
            map: this.map
        })
    };

}

