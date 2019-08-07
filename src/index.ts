import GoogleMaps from './map'

 class Request {

     constructor() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:8000")
        xhr.responseType = 'json';
        xhr.send()
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    new GoogleMaps(xhr.response)
                }
            }
        };
    }
}

new Request()

