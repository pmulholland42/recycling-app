import { SET_MATERIALS, SET_LOCATION, SET_LOCATION_NAME } from './actions';
import Material from '../interfaces/Material';


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
    recyclabilityMap: new Map<string, boolean>([
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
    ])
}

export const recyclingReducer = (state = initialRecyclingState, action: any) => {
    var newState: RecyclingState;
    switch (action.type) {
        case SET_MATERIALS:
            newState = { ...state, materials: action.payload.materials };
            console.log(newState.materials);
            return newState;
        default:
            return state;
    }
}

export interface Location {
    latitude: number,
    longitude: number,
}

interface LocationState {
    location: Location,
    locationName: string,
}

const initialLocationState: LocationState = {
    location: {
        latitude: 0,
        longitude: 0,
    },
    locationName: '',
}

export const locationReducer = (state = initialLocationState, action: any) => {
    let newState: LocationState;
    switch (action.type) {
        case SET_LOCATION:
            newState = { ...state, location: action.payload.location };
            return newState;
        case SET_LOCATION_NAME:
            newState = { ...state, locationName: action.payload.locationName };
            return newState;
        default:
            return state;
    }
}