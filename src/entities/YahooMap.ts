import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";
import {  GeoLocoMapRequest } from "../Request";
import {ApiRequest} from "./ApiRequest";

/// <reference path="../../typings/browser.d.ts" />
export class YahooMapEntity {

   map: Y.Map

   maps: IMaps
   response?: any
   latlng: Y.LatLng
   url?: string

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

      // 以下インターフェースの表示
      this.map.addControl(new Y.CenterMarkControl())
      this.map.addControl(new Y.HomeControl())
      this.map.addControl(new Y.ScaleControl())
      this.map.addControl(new Y.ZoomControl())
      this.map.addControl(new Y.SliderZoomControlHorizontal())
      this.map.addControl(new Y.SliderZoomControlVertical())
      this.map.addControl(new Y.SearchControl())

   }

   request() {

      this.response
          .then((res:any) => {
             this.marker(res)
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
       //@todo コントロールが削除できない
      this.map.removeControl(new Y.LayerSetControl())
      this.map.removeControl(new Y.CenterMarkControl())
      this.map.removeControl(new Y.HomeControl())
      this.map.removeControl(new Y.ScaleControl())
      this.map.removeControl(new Y.ZoomControl())
      this.map.removeControl(new Y.SliderZoomControlHorizontal())
      this.map.removeControl(new Y.SliderZoomControlVertical())
      this.map.removeControl(new Y.SearchControl())
   }

   addMarker(coordinate: ICoordinate) {
      var marker = new Y.Marker(new Y.LatLng(coordinate.lat,coordinate.lng), );
      this.map.addFeature(marker);
   }

   marker(response: any, id?: number) {


      if (response) {
         for ( var i = 0; i < response.json.length; i++) {

            if(response.json[i]['marker_display'] ) {

               var marker =  new Y.Marker(new Y.LatLng(response.json[i]['coordinate'][0], response.json[i]['coordinate'][1]));
               var description = response.json[i]['description']
               var description_format = response.json[i]['description_format']
               if(description_format ==  'text') {
                  marker.bindInfoWindow(description);
               } else if (description_format == 'html') {
                  marker.bindInfoWindow(`<div class="detail">${description}</div>`);
               }
               this.map.addFeature(marker);
            }
         }
      }
   }

   // @todo マーカ消せない..
   deleteMarker(id: number) {

      this.response.then((res: any) => {
         for ( var i = 0; i < res.json.length; i++) {

            if(res.json[i]['id'] === id ) {
               var marker =  new Y.Marker(new Y.LatLng(res.json[i]['coordinate'][0], res.json[i]['coordinate'][1]));
               this.map.removeFeature(marker);
            }
         }

      })

   }

   apiRequest() {

      this.map.bind('movestart', () => {
         console.log('fa')
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
