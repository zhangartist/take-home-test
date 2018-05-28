// redux
import { createStore, applyMiddleware, compose } from 'redux';
// middlewares
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
// reducers
import allReducers from './reducers';


// compose middlewares
var middlewares = [thunk, promise];

// create store
var Store = compose(applyMiddleware(...middlewares))(createStore)(allReducers);


export default Store;
