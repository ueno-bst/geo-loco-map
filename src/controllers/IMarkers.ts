import {MarkerData} from "../entities/Response";
import {isObject} from "../utils/Types";

export interface IMarkerList<T> {
    marker: MarkerData,
    origin: T | null,
    display: boolean,
}

export function isIMarkerList<T>(args: any): args is IMarkerList<T> {
    return args !== null &&
        isObject(args) &&
        args.marker instanceof MarkerData;
}