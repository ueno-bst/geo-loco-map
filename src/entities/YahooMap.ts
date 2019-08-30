import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";
import {  GeoLocoMapRequest } from "../Request";
import {ApiRequest} from "./ApiRequest";

/// <reference path="../typings/yahoo.d.ts" />
export class YahooMapEntity {

   map: Y.Map

   maps: IMaps
   response?: any
   latlng: Y.LatLng
   url?: string
   markers: Y.Marker[] = []

   zoomControl: Y.ZoomControl
   homeControl: Y.HomeControl
   layerControl: Y.LayerSetControl


   constructor(maps: Partial<IMaps> = {}, geoLocoMapRequest?: GeoLocoMapRequest) {

      const opts = { ...Maps, ...maps }
      this.maps = opts


      this.map = new Y.Map(this.maps.selector)



      if (geoLocoMapRequest == undefined) {
         //@todo this.maps.latlngには値が入らないことはないので!で対応した(これでいいのか)
         this.latlng = new Y.LatLng(this.maps.latlng!.lat,this.maps.latlng!.lng)
      } else  {
         this.latlng = new Y.LatLng(geoLocoMapRequest.coordinate.lat,geoLocoMapRequest.coordinate.lng,)
      }
      this.map.drawMap(this.latlng, this.maps.zoom!,Y.LayerSetId.NORMAL)

      // APIからのレスポンス表示
      if (geoLocoMapRequest != undefined) {
         this.response = geoLocoMapRequest.response.response.response
         this.url = geoLocoMapRequest.url
         this.apiRequest()
         this.request()
      }

      // インターフェース表示
      this.zoomControl = new Y.ZoomControl()
      this.homeControl = new Y.HomeControl()
      this.layerControl = new Y.LayerSetControl

      this.map.addControl(this.zoomControl)
      this.map.addControl(this.homeControl)
      this.map.addControl(this.layerControl)

   }

   request(id?: number) {

      this.response
          .then((res:any) => {
             this.marker(res,id)
          })

   }


   getZoom() {
      return this.map.getZoom()
   }

   setZoom(number: number) {
      this.map.setZoom(number,true,this.latlng,false)
   }


   getCenter() {
      return this.map.getCenter()
   }

   setCenter(coordinate: ICoordinate) {
      this.map.drawMap( new Y.LatLng(coordinate.lat, coordinate.lng),coordinate.lng,Y.LayerSetId.NORMAL )
   }

   setOptions() {
      this.map.removeControl(this.zoomControl)
      this.map.removeControl(this.homeControl)
      this.map.removeControl(this.layerControl)
   }

   addMarker(coordinate: ICoordinate) {
      var marker = new Y.Marker(new Y.LatLng(coordinate.lat,coordinate.lng), );
      this.map.addFeature(marker);
   }

   marker(response: any, id?: number) {



      var response = this.markerConvert(response, id)

      if (id) {
         for ( var i = 0; i < this.markers.length; i++) {
            this.map.removeFeature(this.markers[i]);
         }
      }

      for ( var i = 0; i < response.json.length; i++) {

         if(response.json[i]['marker_display'] ) {

            this.markers[i] =  new Y.Marker(new Y.LatLng(response.json[i]['coordinate'][0], response.json[i]['coordinate'][1]));
            var description = response.json[i]['description']
            var description_format = response.json[i]['description_format']
            if(description_format ==  'text') {
               this.markers[i].bindInfoWindow(description);
            } else if (description_format == 'html') {
               this.markers[i].bindInfoWindow(`<div class="detail">${description}</div>`);
            }

            this.map.addFeature(this.markers[i]);

         }
      }
   }

   // @todo マーカ消せない..
   deleteMarker(id: number) {
       this.request(id)
   }

   markerConvert(res:any, id?:number) {
      if (id) {
         for (var i = 0; i < res.json.length; i++) {
            if (res.json[i]['id'] == id) {
               const index = res.json.findIndex((v:any) => v.id === id);
               const removedUser = res.json.splice(index, 1);
               return res;
            }
         }
      } else {
         return res
      }
   }

   apiRequest() {

      this.map.bind('movestart', () => {
         countup()
      });
      var countup = () => {
         setTimeout(request , 500);
      }

      var request = () => {
         var coordinate = { lat: this.map.getCenter().lat() , lng: this.map.getCenter().lng()}
         if (this.url) {
            var res = new ApiRequest(coordinate,this.url)
            res.response
                .then((res:any)  =>
                    this.marker(res)
                )
         }
      }

   }
}
