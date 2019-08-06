console.log("typescrip")

export class GoogleMaps  {

    public name: string;
    private map: any;
    private options: any;

    constructor () {
        this.name = "GoogleMap";
        this.options = { zoom: 3, MapTypeId: 'terrian' };
        console.log(new google.maps.Map(document.getElementById('map')))
        this.map = new google.maps.Map(document.getElementById('map')
        )}
}

new GoogleMaps()
