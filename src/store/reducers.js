import { combineReducers } from 'redux';
import { homeReducer } from '../pages/home/home.js';



var allReducers = combineReducers({
	home : homeReducer,
});



export default allReducers;
