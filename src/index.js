import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Router from './Router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './assets/css/index.css'

ReactDOM.render((
  <div>
    <HashRouter>
      <Router />
    </HashRouter>    
    <ToastContainer />
  </div>),
  document.getElementById('root')
)
