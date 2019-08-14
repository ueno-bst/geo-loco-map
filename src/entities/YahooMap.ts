import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";

/// <reference path="../../typings/browser.d.ts" />
export class YahooMapEntity {

   constructor(maps: Partial<IMaps> = {}) {

      var ymap = new Y.Map("map");
      var latlng = new Y.LatLng(35.660238, 139.730077);
      ymap.drawMap(latlng, 17, Y.LayerSetId.NORMAL);

      var marker = new Y.Marker(new Y.LatLng(35.660238, 139.730077));
      ymap.addFeature(marker);

   }

   requestMap(coordinate: ICoordinate, response: any) {
      var ymap = new Y.Map("map");
      var latlng = new Y.LatLng(coordinate.lat, coordinate.lng)
      ymap.drawMap(latlng, 15, Y.LayerSetId.NORMAL);

      var marker = new Y.Marker(latlng);
      ymap.addFeature(marker);

      for (var i = 0; i < response['data'].length; i++) {

         var marker =  new Y.Marker(new Y.LatLng(response['data'][i]['coordinate'][0], response['data'][i]['coordinate'][1]));
         marker.bindInfoWindow('やっほー、はね丸です。<br>リアルでは一度も訪れたことはありませんが…。(笑)');
         ymap.addFeature(marker);
      }
   }
}
