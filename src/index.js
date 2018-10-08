import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import Router from './Router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css';

ReactDOM.render((
  <HashRouter>
    <Router />
  </HashRouter>),
  document.getElementById('root')
);
