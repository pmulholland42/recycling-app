import { SET_MATERIALS } from './actions';
import Material from '../interfaces/Material';

export interface ReduxAction {
    type: string,
    payload: any,
}

export interface GlobalState {
    recyclingReducer: RecyclingState,
}

interface RecyclingState {
    materials: Material[],
}

var initialRecyclingState: RecyclingState = {
    materials: [
        {
            type: 'plastic',
            plasticNumber: 1,
            name: 'Polyethylene Terephthalate',
            code: 'PETE',
            isRecyclable: true,
        },
        {
            type: 'plastic',
            plasticNumber: 2,
            name: 'High-Density Polyethylene',
            code: 'HDPE',
            isRecyclable: true,
        },
        {
            type: 'plastic',
            plasticNumber: 3,
            name: 'Polyvinyl Chloride',
            code: 'PVC',
            isRecyclable: false,
        },
        {
            type: 'plastic',
            plasticNumber: 4,
            name: 'Low-Density Polyethylene',
            code: 'LDPE',
            isRecyclable: false,
        },
        {
            type: 'plastic',
            plasticNumber: 5,
            name: 'Polypropylene',
            code: 'PP',
            isRecyclable: false,
        },
        {
            type: 'plastic',
            plasticNumber: 6,
            name: 'Polystyrene',
            code: 'PS',
            isRecyclable: true,
        },
        {
            type: 'plastic',
            plasticNumber: 7,
            name: 'Other',
            isRecyclable: true,
        },
        {
            type: 'glass',
            name: 'Brown glass',
            isRecyclable: true,
        },
        {
            type: 'glass',
            name: 'Green glass',
            isRecyclable: true,
        },
        {
            type: 'glass',
            name: 'Clear glass',
            isRecyclable: true,
        },
        {
            type: 'metal',
            name: 'Steel',
            isRecyclable: true,
        },
        {
            type: 'metal',
            name: 'Tin',
            isRecyclable: true,
        },
        {
            type: 'metal',
            name: 'Aluminum',
            isRecyclable: true,
        },
        {
            type: 'paper',
            name: 'Newspaper',
        },
    ],
}

export var recyclingReducer = (state = initialRecyclingState, action: ReduxAction) => {
    var newState: RecyclingState;
    switch (action.type) {
        case SET_MATERIALS:
            newState = { ...state, materials: action.payload.materials };
            return newState;
        default:
            return state;
    }
}