/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/controllers/MapsControllers.ts":
/*!********************************************!*\
  !*** ./src/controllers/MapsControllers.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar MapsUseCase_1 = __importDefault(__webpack_require__(/*! ../usecases/MapsUseCase */ \"./src/usecases/MapsUseCase.ts\"));\nvar MapsControllers = (function () {\n    function MapsControllers(maps) {\n        this.maps = maps;\n        var mapsUsecase = new MapsUseCase_1.default(this.maps);\n        mapsUsecase.execute();\n    }\n    return MapsControllers;\n}());\nexports.default = MapsControllers;\n\n\n//# sourceURL=webpack:///./src/controllers/MapsControllers.ts?");

/***/ }),

/***/ "./src/controllers/RequestControllers.ts":
/*!***********************************************!*\
  !*** ./src/controllers/RequestControllers.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar RequestUseCase_1 = __importDefault(__webpack_require__(/*! ../usecases/RequestUseCase */ \"./src/usecases/RequestUseCase.ts\"));\nvar RequestControllers = (function () {\n    function RequestControllers(req, url, map_type) {\n        var request = new RequestUseCase_1.default(req, url, map_type);\n        request.RequestUseCase();\n    }\n    return RequestControllers;\n}());\nexports.default = RequestControllers;\n\n\n//# sourceURL=webpack:///./src/controllers/RequestControllers.ts?");

/***/ }),

/***/ "./src/entities/GoogleMap.ts":
/*!***********************************!*\
  !*** ./src/entities/GoogleMap.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Maps_1 = __webpack_require__(/*! ./Maps */ \"./src/entities/Maps.ts\");\nvar GoogleMapEntiry = (function () {\n    function GoogleMapEntiry(maps) {\n        if (maps === void 0) { maps = {}; }\n        var opts = __assign({}, Maps_1.Maps, maps);\n        this.maps = opts;\n        this.info = new google.maps.InfoWindow();\n        this.options = { zoom: 3, MapTypeId: 'terrian' };\n        this.map = new google.maps.Map(document.getElementById(this.maps.selector), {\n            center: { lat: 35.681236, lng: 139.767125 },\n            scrollwheel: false,\n            zoom: this.maps.zoom,\n        });\n    }\n    GoogleMapEntiry.prototype.requestMap = function (coordinate, response) {\n        console.log(response);\n        this.map = new google.maps.Map(document.getElementById('map'), {\n            center: { lat: coordinate.lat, lng: coordinate.lng },\n            scrollwheel: false,\n            zoom: this.maps.zoom,\n        });\n        for (var i = 0; i < response['data'].length; i++) {\n            var markerLatLng = new google.maps.LatLng({ lat: response['data'][i]['coordinate'][0], lng: response['data'][i]['coordinate'][1] });\n            this.marker = new google.maps.Marker({\n                position: markerLatLng,\n                map: this.map\n            });\n            this.info = new google.maps.InfoWindow({\n                content: '<div class=\"detail\">' + response['data'][i]['url'] + '</div>'\n            });\n            this.markerEvent(i);\n        }\n    };\n    GoogleMapEntiry.prototype.markerEvent = function (i) {\n        var marker = this.marker;\n        var info = this.info;\n        var map = this.map;\n        this.marker.addListener('click', function () {\n            info.open(map, marker);\n        });\n    };\n    return GoogleMapEntiry;\n}());\nexports.GoogleMapEntiry = GoogleMapEntiry;\n\n\n//# sourceURL=webpack:///./src/entities/GoogleMap.ts?");

/***/ }),

/***/ "./src/entities/Maps.ts":
/*!******************************!*\
  !*** ./src/entities/Maps.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.Maps = {\n    map_type: 'google',\n    latlng: [35.681236, 139.767125],\n    zoom: 16,\n    element_flag: true,\n    grid: 5,\n    lazy_load: 0.5,\n    selector: 'map',\n    api_url: 'localhost:8000'\n};\n\n\n//# sourceURL=webpack:///./src/entities/Maps.ts?");

/***/ }),

/***/ "./src/entities/Request.ts":
/*!*********************************!*\
  !*** ./src/entities/Request.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar GoogleMap_1 = __webpack_require__(/*! ./GoogleMap */ \"./src/entities/GoogleMap.ts\");\nvar YahooMap_1 = __webpack_require__(/*! ./YahooMap */ \"./src/entities/YahooMap.ts\");\nvar RequestEntity = (function () {\n    function RequestEntity() {\n    }\n    RequestEntity.prototype.xmlHttpRequest = function (coordinate, url, map_type) {\n        var xhr = new XMLHttpRequest();\n        xhr.open(\"GET\", url, true);\n        xhr.responseType = 'json';\n        xhr.send();\n        xhr.onload = function () {\n            if (xhr.readyState === xhr.DONE) {\n                if (xhr.status === 200) {\n                    if (map_type == 'yahoo') {\n                        var yahoomap = new YahooMap_1.YahooMapEntity();\n                        yahoomap.requestMap(coordinate, xhr.response);\n                    }\n                    else {\n                        var googlemap = new GoogleMap_1.GoogleMapEntiry();\n                        googlemap.requestMap(coordinate, xhr.response);\n                    }\n                }\n            }\n        };\n    };\n    return RequestEntity;\n}());\nexports.RequestEntity = RequestEntity;\n\n\n//# sourceURL=webpack:///./src/entities/Request.ts?");

/***/ }),

/***/ "./src/entities/YahooMap.ts":
/*!**********************************!*\
  !*** ./src/entities/YahooMap.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Maps_1 = __webpack_require__(/*! ./Maps */ \"./src/entities/Maps.ts\");\nvar YahooMapEntity = (function () {\n    function YahooMapEntity(maps) {\n        if (maps === void 0) { maps = {}; }\n        var opts = __assign({}, Maps_1.Maps, maps);\n        this.ymap = new Y.Map(\"map\");\n        this.ymap.drawMap(new Y.LatLng(35.66572, 139.73100), 17, Y.LayerSetId.NORMAL);\n    }\n    YahooMapEntity.prototype.requestMap = function (coordinate, response) {\n        console.log(response);\n        var marker = new Y.Marker(new Y.LatLng(35.660238, 139.730077));\n        this.ymap.addFeature(marker);\n    };\n    return YahooMapEntity;\n}());\nexports.YahooMapEntity = YahooMapEntity;\n\n\n//# sourceURL=webpack:///./src/entities/YahooMap.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar RequestControllers_1 = __importDefault(__webpack_require__(/*! ./controllers/RequestControllers */ \"./src/controllers/RequestControllers.ts\"));\nvar MapsControllers_1 = __importDefault(__webpack_require__(/*! ./controllers/MapsControllers */ \"./src/controllers/MapsControllers.ts\"));\nvar GeoLocoMap = (function () {\n    function GeoLocoMap(maps) {\n        this.maps = maps;\n    }\n    GeoLocoMap.prototype.InitMaps = function () {\n        new MapsControllers_1.default(this.maps);\n    };\n    GeoLocoMap.prototype.request = function (req, url, mapType) {\n        if (url === void 0) { url = this.maps.api_url; }\n        if (mapType === void 0) { mapType = this.maps.map_type; }\n        if (mapType == undefined) {\n            mapType = 'google';\n        }\n        new RequestControllers_1.default(req, url, mapType);\n    };\n    return GeoLocoMap;\n}());\nexports.default = GeoLocoMap;\nvar geolocomap = new GeoLocoMap({ map_type: 'yahoo', latlng: [35.658581, 139.745433], selector: 'map', api_url: 'http://localhost:8888/response.php' });\ngeolocomap.request({ lat: 35, lng: 135 });\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/usecases/MapsUseCase.ts":
/*!*************************************!*\
  !*** ./src/usecases/MapsUseCase.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar GoogleMap_1 = __webpack_require__(/*! ../entities/GoogleMap */ \"./src/entities/GoogleMap.ts\");\nvar YahooMap_1 = __webpack_require__(/*! ../entities/YahooMap */ \"./src/entities/YahooMap.ts\");\nvar MapsUseCase = (function () {\n    function MapsUseCase(maps) {\n        this.imaps = maps;\n    }\n    MapsUseCase.prototype.execute = function () {\n        if (this.imaps.map_type == 'yahoo') {\n            new YahooMap_1.YahooMapEntity(this.imaps);\n        }\n        else {\n            new GoogleMap_1.GoogleMapEntiry(this.imaps);\n        }\n    };\n    return MapsUseCase;\n}());\nexports.default = MapsUseCase;\n\n\n//# sourceURL=webpack:///./src/usecases/MapsUseCase.ts?");

/***/ }),

/***/ "./src/usecases/RequestUseCase.ts":
/*!****************************************!*\
  !*** ./src/usecases/RequestUseCase.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Request_1 = __webpack_require__(/*! ../entities/Request */ \"./src/entities/Request.ts\");\nvar RequestUseCase = (function () {\n    function RequestUseCase(coordinate, url, map_type) {\n        this.coodinate = coordinate;\n        this.url = url;\n        this.map_type = map_type;\n    }\n    RequestUseCase.prototype.RequestUseCase = function () {\n        var request = new Request_1.RequestEntity();\n        request.xmlHttpRequest(this.coodinate, this.url, this.map_type);\n    };\n    return RequestUseCase;\n}());\nexports.default = RequestUseCase;\n\n\n//# sourceURL=webpack:///./src/usecases/RequestUseCase.ts?");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/index.ts */\"./src/index.ts\");\n\n\n//# sourceURL=webpack:///multi_./src/index.ts?");

/***/ })

/******/ });