import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";

/// <reference path="../../typings/browser.d.ts" />
export class YahooMapEntity {

   map: Y.Map
   latlng: Y.LatLng

   maps: IMaps
   coordinate: ICoordinate

   constructor(maps: Partial<IMaps> = {}) {

      const opts = { ...Maps, ...maps }
      this.maps = opts
      this.map = new Y.Map("map");
      this.latlng = new Y.LatLng(35.660238, 139.730077);
      this.map.drawMap(this.latlng, 17, Y.LayerSetId.NORMAL);
   }

   addMarker(coordinate: ICoordinate, response: any, addMaker?: boolean, id?: number) {

      console.log(response)
       this.coordinate = coordinate


      var ymap = new Y.Map("map");
      var latlng = new Y.LatLng(coordinate.lat, coordinate.lng)
      ymap.drawMap(latlng, 15, Y.LayerSetId.NORMAL);

      for ( var i = 0; i < response['data'].length; i++) {

         if(response['data'][i]['marker_display'] && id == undefined && response['data'][i]['id'] != id ) {


            var marker =  new Y.Marker(new Y.LatLng(response['data'][i]['coordinate'][0], response['data'][i]['coordinate'][1]));
            var description = response['data'][i]['description']
            var description_format = response['data'][i]['description_format']
            if(description_format ==  'text') {
               marker.bindInfoWindow(description);
            } else if (description_format == 'html') {
               marker.bindInfoWindow(`<div class="detail">${description}</div>`);
            }
            ymap.addFeature(marker);
         }
      }

      if (addMaker) {
         ymap.addFeature(new Y.Marker(new Y.LatLng(coordinate.lat, coordinate.lng)));
      }
   }

   deleteMarker(id: number,response:any) {


      response.then(res => {
         for ( var i = 0; i < res.json.length; i++) {

            if(res.json[i]['marker_display'] &&  res.json[i]['id'] != id ) {
               var ymap = new Y.Map("map");
               ymap.drawMap(new Y.LatLng(res.json[i]['coordinate'][0], res.json[i]['coordinate'][1]), 15, Y.LayerSetId.NORMAL);


               var marker =  new Y.Marker(new Y.LatLng(res.json[i]['coordinate'][0], res.json[i]['coordinate'][1]));
               console.log(marker)
               var description = res.json[i]['description']
               var description_format = res.json[i]['description_format']
               if(description_format ==  'text') {
                  marker.bindInfoWindow(description);
               } else if (description_format == 'html') {
                  marker.bindInfoWindow(`<div class="detail">${description}</div>`);
               }
               ymap.addFeature(marker);
            }
         }

      })

   }
}
