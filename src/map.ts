
export default class GoogleMaps  {

    private map: any;
    private options: any;
    private marker: any

    constructor (req: any) {

        this.options = { zoom: 3, MapTypeId: 'terrian' };
        this.map = new google.maps.Map(document.getElementById('map', ) ,{
            center: { lat: req.marker.lat, lng: req.marker.lng },
            scrollwheel: false,
            zoom:18,
            }
        )
        this.marker = new google.maps.Marker({
            position: { lat: req.marker.lat, lng: req.marker.lng },
            map: this.map
        })
    };

}

