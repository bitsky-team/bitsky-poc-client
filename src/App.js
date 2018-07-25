import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

class App extends Component {

  render() {
    return(
        <div>
            <Route exact path='/' component={Login}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
        </div>
    )
  }
  
}

export default App;
