import {GeoLocoMap} from "~/GeoLocoMap";
const map = new GeoLocoMap({center: [34,134], map_type: 'yahoo', selector: '#map'});
map.on('info', () => {

});
