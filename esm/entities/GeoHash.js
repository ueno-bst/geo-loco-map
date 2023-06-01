import { LatLng } from "./LatLng";
export var GeoHash;
(function (GeoHash) {
    const MAP32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    function coordinateToBit(coordinate, min, max, length = 10) {
        let bit = '';
        for (let index = 0; index < length; index++) {
            const mid = (min + max) / 2.0;
            if (coordinate > mid) {
                bit += '1';
                min = mid;
            }
            else {
                bit += '0';
                max = mid;
            }
        }
        return bit;
    }
    function bitToCoordinate(bit, min, max) {
        let error = 0;
        let value = 0;
        for (let index = 0; index < bit.length; index++) {
            const mid = (min + max) / 2.0;
            if (bit[index] === '1') {
                min = mid;
            }
            else {
                max = mid;
            }
            value = (min + max) / 2.0;
            error = value - error;
        }
        return value;
    }
    function encode(coordinate, length = 10) {
        const bit_length = Math.ceil(length / 2) * 5;
        const latitude_bits = coordinateToBit(coordinate.lat, -90, 90, bit_length);
        const longitude_bits = coordinateToBit(coordinate.lng, -180, 180, bit_length);
        let bins = '';
        for (let index = 0; index < bit_length; index++) {
            bins += longitude_bits[index] + latitude_bits[index];
        }
        let hash = '';
        for (let index = 0; index < bins.length; index += 5) {
            const bin = bins.substring(index, index + 5);
            const dec = Number.parseInt(bin, 2);
            hash += MAP32[dec];
        }
        return hash.substring(0, length);
    }
    GeoHash.encode = encode;
    function decode(hash) {
        let bins = '';
        for (let index = 0; index < hash.length; index++) {
            let dec = MAP32.indexOf(hash[index]);
            if (dec < 0) {
                dec = 0;
            }
            bins += dec.toString(2).padStart(5, "0");
        }
        if (bins.length % 2 !== 0) {
            bins += '0';
        }
        let latitude_bits = '';
        let longitude_bits = '';
        for (let index = 0; index < bins.length; index += 2) {
            latitude_bits += bins[index];
            longitude_bits += bins[index + 1];
        }
        return new LatLng(bitToCoordinate(latitude_bits, -90, 90), bitToCoordinate(longitude_bits, -180, 180));
    }
    GeoHash.decode = decode;
})(GeoHash || (GeoHash = {}));
//# sourceMappingURL=GeoHash.js.map