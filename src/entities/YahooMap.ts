import { IMaps, Maps } from './Maps'
import { ICoordinate} from "./Coordinate";
import {  GeoLocoMapRequest } from "../Request";
import {ApiRequest} from "./ApiRequest";

var allmarker: any[] = []

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
         this.response = geoLocoMapRequest.initRequest(this.map.getZoom()).response.response
         this.url = geoLocoMapRequest.url
         this.apiRequest()
         this.request()
      }

      // インターフェース表示
      this.zoomControl = new Y.ZoomControl()
      this.homeControl = new Y.HomeControl()
      this.layerControl = new Y.LayerSetControl

      if (this.maps.element_flag) {
         this.map.addControl(this.zoomControl)
         this.map.addControl(this.homeControl)
         this.map.addControl(this.layerControl)
      }
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
      return {lat:this.map.getCenter().lat(),lng:this.map.getCenter().lng()}
   }

   setCenter(coordinate: ICoordinate) {
      this.map.drawMap( new Y.LatLng(coordinate.lat, coordinate.lng),this.maps.zoom!,Y.LayerSetId.NORMAL )
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

   marker(res: any, id?: number) {

      var response = this.markerConvert(response, id)

      if (id) {
         for ( var i = 0; i < this.markers.length; i++) {
            this.map.removeFeature(this.markers[i]);
         }
      }

      response = Object.entries(res)


       console.log(response)
      for ( var i = 0; i < response.length; i++) {



         if(allmarker[i]) {
            if (allmarker[i]['id']  != response[i][1]['id']) {
               if(response[i]['marker_display']  ) {

                  this.markers[i] =  new Y.Marker(new Y.LatLng(response[i][1]['coordinate'][0], response[i][1]['coordinate'][1]));
                  var  feed = response[i][1]['feed_flag'] ? `<iframe src=${response[i][1]['feed']} frameborder="0" ></iframe>` : ""
                  var content = feed ? feed : response[i][1]['description']
                  var description_format = response[i][1]['description_format']
                  if(description_format ==  'text') {
                     var format: string =  feed ? content : this.escapeHtml(content)
                     this.markers[i].bindInfoWindow(format);
                  } else if (description_format == 'html') {
                     this.markers[i].bindInfoWindow(`<div class="detail">${content}</div>`);
                  }

                  this.map.addFeature(this.markers[i]);

               }

            }
         } else {
            if(response[i][1]['marker_display'] ) {

               this.markers[i] =  new Y.Marker(new Y.LatLng(response[i][1]['coordinate'][0], response[i][1]['coordinate'][1]));
               var  feed = response[i]['feed_flag'] ? `<iframe src=${response[i][1]['feed']} frameborder="0" ></iframe>` : ""
               var content = feed ? feed : response[i][1]['description']
               var description_format = response[i][1]['description_format']
               if(description_format ==  'text') {
                  var format: string =  feed ? content : this.escapeHtml(content)
                  this.markers[i].bindInfoWindow(format);
               } else if (description_format == 'html') {
                  this.markers[i].bindInfoWindow(`<div class="detail">${content}</div>`);
               }

               this.map.addFeature(this.markers[i]);

            }
            response[i][1]['marker_flag'] = true
            allmarker.push(response[i][1])

         }
      }

   }

   escapeHtml(str: string){
      str = str.replace(/&/g, '&amp;');
      str = str.replace(/>/g, '&gt;');
      str = str.replace(/</g, '&lt;');
      str = str.replace(/"/g, '&quot;');
      str = str.replace(/'/g, '&#x27;');
      str = str.replace(/`/g, '&#x60;');
      str = str.replace(/\r?\n/g, '<br>')
      return str;
   }


   // @todo マーカ消せない..
   deleteMarker(id: number) {
       this.request(id)
   }

   markerConvert(res:any, id?:number) {
      if (id) {
         for (var i = 0; i < res.length; i++) {
            if (res[i]['id'] == id) {
               const index = res.findIndex((v:any) => v.id === id);
               const removedUser = res.splice(index, 1);
               return res;
            }
         }
      } else {
         return res
      }
   }

   apiRequest() {

      var timer: any = 0
      this.map.bind('moveend', () => {
         clearTimeout(timer)
         timer = countup()
      });
      var countup = () => {
         return setTimeout(request , 500);
      }

      var request = () => {

         var coordinate = { lat: this.map.getCenter().lat() , lng: this.map.getCenter().lng()}
         if (this.url) {
            var res = new ApiRequest(coordinate,this.url,this.getZoom())
            res.response
                .then((res:any)  => {
                       this.marker(res)
                })
         }
      }

   }
}
