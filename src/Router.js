// React
import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

// Components 
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import ActivityFeedPage from './components/activity_feed/ActivityFeedPage';
import RegisterConfirmationPage from './components/register/RegisterConfirmationPage';

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

class Router extends Component {

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
      }else
      {
        if(AuthService.verify()) {
          this.props.history.push('/activity_feed');
        }
      }
    }, 400);
  }

  render() {
    return(
        <div>
            <Route exact path='/' component={LoginPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/register' component={RegisterPage} />
            <PrivateRoute exact authed={AuthService.verify()} path='/activity_feed' component={ActivityFeedPage} />
            <PrivateRoute exact authed={AuthService.verify()} path='/register_confirmation' component={RegisterConfirmationPage} />
        </div>
    )
  }
  
}

export default withRouter(Router);
