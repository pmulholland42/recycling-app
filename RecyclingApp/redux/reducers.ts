import { SET_MATERIALS, SET_LOCATION, SET_POSITION, SET_RECYCLABILITY_MAP } from './actions';
import Material from '../interfaces/Material';
import { Location } from '../interfaces/Location';
import { LatLong } from '../interfaces/LatLong';


export interface GlobalState {
    recyclingReducer: RecyclingState,
    locationReducer: LocationState,
}

interface RecyclingState {
    materials: Material[],
    recyclabilityMap: Map<string, boolean>,
}

const initialRecyclingState: RecyclingState = {
    materials: [],
    recyclabilityMap: new Map<string, boolean>(),
}

/*
[
    ['7pWLj3irsgkjXafCBJFm', true],
    ['9Kk6lSJ4Ty1Pi9b6WhOk', true],
    ['9jyEuTtaGYmZ2z7ogAUX', false],
    ['ABN6O15sPGALbMoegr1J', false],
    ['CYVfnHoF0UqK94CprkjW', false],
    ['DjDYoTXkcnQmqUnRc9CW', true],
    ['Q7S2DdXQO6jc5HsUPQyB', true],
    ['TaAVvsGKLmnFuwfQKtAv', true],
    ['UpG5fm5BaV7udJn46FLS', true],
    ['YpMkVaD2pySuhMtd8xeJ', true],
    ['lJ0aegU9Slk4rJsEslFA', true],
    ['oN9rTiXfg02ubbfi3ZdS', true],
]*/

export const recyclingReducer = (state = initialRecyclingState, action: any) => {
    var newState: RecyclingState;
    switch (action.type) {
        case SET_MATERIALS:
            newState = { ...state, materials: action.payload.materials };
            return newState;
        case SET_RECYCLABILITY_MAP:
            newState = { ...state, recyclabilityMap: action.payload.recyclabilityMap };
            return newState;
        default:
            return state;
    }
}

interface LocationState {
    /** The user's current GPS position */
    position: LatLong,
    /** The user's current city/municipality */
    location: Location,
}

const initialLocationState: LocationState = {
    position: {
        latitude: 0,
        longitude: 0,
    },
    location: {
        id: '',
        name: '',
    },
}

export const locationReducer = (state = initialLocationState, action: any) => {
    let newState: LocationState;
    switch (action.type) {
        case SET_POSITION:
            newState = { ...state, position: action.payload.position };
            return newState;
        case SET_LOCATION:
            newState = { ...state, location: action.payload.location };
            return newState;
        default:
            return state;
    }
}