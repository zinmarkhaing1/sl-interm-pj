import {combineReducers} from 'redux';
import { noteReducer } from './note'; 

const reducers = combineReducers({
    movies :noteReducer
})
export default reducers;