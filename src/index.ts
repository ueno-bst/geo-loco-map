import * as http from "http";
import GoogleMaps from './map'

 class Server {

    constructor() {
        console.log('server')

        var server = http.createServer((req, res):void => {
            new  GoogleMaps(req)
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.write("Hello World!!\n");
            res.end();
        });
        server.listen('8080');
    }
}

new Server()


