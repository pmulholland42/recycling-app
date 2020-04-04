import { SET_MATERIALS, SET_LOCATION } from './actions';
import Material from '../interfaces/Material';

export interface ReduxAction {
    type: string,
    payload: any,
}

export interface GlobalState {
    recyclingReducer: RecyclingState,
    locationReducer: LocationState,
}

interface RecyclingState {
    materials: Material[],
    recyclabilityMap: Map<number, boolean>,
}

const initialRecyclingState: RecyclingState = {
    materials: [
        {
            id: 0,
            type: 'plastic',
            plasticNumber: 1,
            name: 'Polyethylene Terephthalate',
            code: 'PETE',
        },
        {
            id: 1,
            type: 'plastic',
            plasticNumber: 2,
            name: 'High-Density Polyethylene',
            code: 'HDPE',
        },
        {
            id: 2,
            type: 'plastic',
            plasticNumber: 3,
            name: 'Polyvinyl Chloride',
            code: 'PVC',
        },
        {
            id: 3,
            type: 'plastic',
            plasticNumber: 4,
            name: 'Low-Density Polyethylene',
            code: 'LDPE',
        },
        {
            id: 4,
            type: 'plastic',
            plasticNumber: 5,
            name: 'Polypropylene',
            code: 'PP',
        },
        {
            id: 5,
            type: 'plastic',
            plasticNumber: 6,
            name: 'Polystyrene',
            code: 'PS',
        },
        {
            id: 6,
            type: 'plastic',
            plasticNumber: 7,
            name: 'Other',
        },
        {
            id: 7,
            type: 'glass',
            name: 'Brown glass',
        },
        {
            id: 8,
            type: 'glass',
            name: 'Green glass',
        },
        {
            id: 9,
            type: 'glass',
            name: 'Clear glass',
        },
        {
            id: 10,
            type: 'metal',
            name: 'Steel',
        },
        {
            id: 11,
            type: 'metal',
            name: 'Tin',
        },
        {
            id: 12,
            type: 'metal',
            name: 'Aluminum',
        },
        {
            id: 13,
            type: 'paper',
            name: 'Newspaper',
        },
    ],
    recyclabilityMap: new Map<number, boolean>([
        [0, true],
        [1, true],
        [2, false],
        [3, false],
        [4, false],
        [5, true],
        [6, true],
        [7, true],
        [8, true],
        [9, true],
        [10, true],
        [11, true],
    ])
}

export const recyclingReducer = (state = initialRecyclingState, action: ReduxAction) => {
    var newState: RecyclingState;
    switch (action.type) {
        case SET_MATERIALS:
            newState = { ...state, materials: action.payload.materials };
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
    location: Location
}

const initialLocationState: LocationState = {
    location: {
        latitude: 0,
        longitude: 0,
    }
}

export const locationReducer = (state = initialLocationState, action: ReduxAction) => {
    let newState: LocationState;
    switch (action.type) {
        case SET_LOCATION:
            newState = { ...state, location: action.payload.location };
            return newState;
        default:
            return state;
    }
}