// React
import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

// Components 
import Login from './components/Login';
import Register from './components/Register';
import ActivityFeed from './components/ActivityFeed';

// Services
import AuthService from './services/AuthService';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

class App extends Component {

  componentDidMount() {
    let noAuthRoutes = [
      '/',
      '/login',
      '/register'
    ];

    setInterval(() => {
      if(!noAuthRoutes.includes(this.props.history.location.pathname)) {
        if(!AuthService.verify()) {
          this.props.history.push('/');
        }
      }
    }, 1000);
  }

  render() {
    return(
        <div>
            <Route exact path='/' component={Login} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <PrivateRoute exact authed={AuthService.verify()} path='/dashboard' component={ActivityFeed} />
        </div>
    )
  }
  
}

export default withRouter(App);
