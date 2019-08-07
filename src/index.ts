console.log("typescrip")

class GoogleMaps  {

    public name: string;
    private map: any;
    private options: any;

    constructor () {
        this.name = "GoogleMap";
        this.options = { zoom: 3, MapTypeId: 'terrian' };
        this.map = new google.maps.Map(document.getElementById('map', ) ,{
            center: { lat: 48.2, lng: 16.3667 },
            scrollwheel: false,
            zoom:10,
            }
        )}
}

new GoogleMaps()
