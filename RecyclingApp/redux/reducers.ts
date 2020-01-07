import { SET_RECYCLING_TYPES } from './actions';

import RecyclingType from 'interfaces/RecyclingType';

interface ReduxAction {
    type: string,
    payload: any,
}

interface RecyclingTypesState {
    recyclingTypes: RecyclingType[],
}

var initialRecyclingTypesState: RecyclingTypesState = {
    recyclingTypes: []
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