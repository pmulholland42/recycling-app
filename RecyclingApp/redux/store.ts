import { createStore, combineReducers } from 'redux';
import { recyclingReducer, locationReducer } from './reducers';

const reducers = combineReducers({ recyclingReducer, locationReducer });
export const store = createStore(reducers);