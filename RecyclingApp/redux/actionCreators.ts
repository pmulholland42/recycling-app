import { SET_MATERIALS, SET_RECYCLABILITY_MAP, SET_LOCATION, SET_POSITION } from './actions';
import Material from '../interfaces/Material';
import { LatLong } from '../interfaces/LatLong';
import { Location } from '../interfaces/Location';


export function setMaterials(materials: Material[]) {
    return {
        type: SET_MATERIALS,
        payload: {
            materials,
        },
    }
}

export function setRecyclabilityMap(recyclabilityMap: Map<string, boolean>) {
    return {
        type: SET_RECYCLABILITY_MAP,
        payload: {
            recyclabilityMap,
        }
    }
}

export function setPosition(position: LatLong) {
    return {
        type: SET_POSITION,
        payload: {
            position,
        }
    }
}

export function setLocation(location: Location) {
    return {
        type: SET_LOCATION,
        payload: {
            location,
        }
    }
}