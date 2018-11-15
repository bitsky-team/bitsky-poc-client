import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Router from './Router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './assets/css/index.css'

ReactDOM.render((
  <div>
    <BrowserRouter>
      <Router />
    </BrowserRouter>    
    <ToastContainer />
  </div>),
  document.getElementById('root')
)
