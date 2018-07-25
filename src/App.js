import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ActivityFeed from './components/ActivityFeed';

class App extends Component {

  render() {
    return(
        <div>
            <Route exact path='/' component={ActivityFeed}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
        </div>
    )
  }
  
}

export default App;
