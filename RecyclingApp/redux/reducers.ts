import { SET_RECYCLING_TYPES } from './actions';
import RecyclingType from 'interfaces/RecyclingType';

export interface ReduxAction {
    type: string,
    payload: any,
}

export interface GlobalState {
    recyclingTypesReducer: RecyclingTypesState,
}

interface RecyclingTypesState {
    recyclingTypes: RecyclingType[],
}

var initialRecyclingTypesState: RecyclingTypesState = {
    recyclingTypes: [
        {
            materialType: 'plastic',
            plasticNumber: 1,
            name: 'Polyethylene Terephthalate',
            code: 'PETE',
            isRecyclable: true,
        },
        {
            materialType: 'plastic',
            plasticNumber: 2,
            name: 'High-Density Polyethylene',
            code: 'HDPE',
            isRecyclable: true,
        },
        {
            materialType: 'plastic',
            plasticNumber: 3,
            name: 'Polyvinyl Chloride',
            code: 'PVC',
            isRecyclable: false,
        },
        {
            materialType: 'plastic',
            plasticNumber: 4,
            name: 'Low-Density Polyethylene',
            code: 'LDPE',
            isRecyclable: false,
        },
        {
            materialType: 'plastic',
            plasticNumber: 5,
            name: 'Polypropylene',
            code: 'PP',
            isRecyclable: false,
        },
        {
            materialType: 'plastic',
            plasticNumber: 6,
            name: 'Polystyrene',
            code: 'PS',
            isRecyclable: true,
        },
        {
            materialType: 'plastic',
            plasticNumber: 7,
            name: 'Other',
            isRecyclable: true,
        },
        {
            materialType: 'glass',
            name: 'Brown glass',
            isRecyclable: true,
        },
        {
            materialType: 'glass',
            name: 'Green glass',
            isRecyclable: true,
        },
        {
            materialType: 'glass',
            name: 'Clear glass',
            isRecyclable: true,
        },
        {
            materialType: 'metal',
            name: 'Steel',
            isRecyclable: true,
        },
        {
            materialType: 'metal',
            name: 'Tin',
            isRecyclable: true,
        },
        {
            materialType: 'metal',
            name: 'Aluminum',
            isRecyclable: true,
        },
        {
            materialType: 'paper',
            name: 'Newspaper',
        },
    ],
}

export var recyclingTypesReducer = (state = initialRecyclingTypesState, action: ReduxAction) => {
    var newState: RecyclingTypesState;
    switch (action.type) {
        case SET_RECYCLING_TYPES:
            newState = { ...state, recyclingTypes: action.payload.recyclingTypes };
            return newState;
        default:
            return state;
    }
}