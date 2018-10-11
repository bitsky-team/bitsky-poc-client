import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import Router from './Router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css';

String.prototype.trunc = String.prototype.trunc || function(n){
    return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
};

ReactDOM.render((
  <HashRouter>
    <Router />
  </HashRouter>),
  document.getElementById('root')
);
