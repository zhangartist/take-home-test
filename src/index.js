// react
import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

// data store
import Store from './store/store.js';
import { Provider } from 'react-redux'

// pages
import Home from './pages/home/home.js';

// global CSS
import './index.css';
import 'antd/dist/antd.css'


// render react
ReactDOM.render(
	<Provider store={Store}>
	    <Home />
  	</Provider>,
    document.getElementById('root')
);





