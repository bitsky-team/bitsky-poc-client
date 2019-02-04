// React
import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'

// Components 
import LoginPage from './components/login/LoginPage'
import RegisterPage from './components/register/RegisterPage'
import ActivityFeedPage from './components/activity_feed/ActivityFeedPage'
import RegisterConfirmationPage from './components/register/RegisterConfirmationPage'

// Services
import AuthService from './services/AuthService'
import AdministrationPage from './components/administration/AdministrationPage'
import UsersAdministrationPage from './components/administration/users/UsersAdministrationPage'
import UserDocumentationPage from './components/docs/user/UserDocumentationPage'

const PrivateRoute = ({component: Component, authed, ...rest}) => {
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

  state = {
    authenticated: (localStorage.getItem('token') && localStorage.getItem('id')) ? true : false
  }

  componentDidMount() {
    setInterval(async () => {
      const authenticated = await AuthService.verify()
      this.setState({authenticated})
    }, 1000)
  }

  componentDidUpdate() {
    let noAuthRoutes = [
      '/',
      '/login',
      '/register',
      '/docs'
    ]

    let adminRoutes = [
      '/administration',
      '/admin_manage_users'
    ]

    if(!noAuthRoutes.includes(this.props.history.location.pathname)) {
      if(!this.state.authenticated 
          || ((adminRoutes.includes(this.props.history.location.pathname) && !AuthService.isAdmin()))) {
        this.props.history.push('/')
      }
    }else
    {
      if(this.state.authenticated) {
        this.props.history.push('/activity_feed')
      }
    }
  }

  render() {
    return(
      <div>
          <Route exact path='/' component={LoginPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
          <Route exact path='/docs' component={UserDocumentationPage} />

          <PrivateRoute exact authed={this.state.authenticated} path='/activity_feed' component={ActivityFeedPage} />
          <PrivateRoute exact authed={this.state.authenticated} path='/register_confirmation' component={RegisterConfirmationPage} />
          <PrivateRoute exact authed={this.state.authenticated} path='/administration' component={AdministrationPage} />
          <PrivateRoute exact authed={this.state.authenticated} path='/admin_manage_users' component={UsersAdministrationPage} />
      </div>
    )
  }
  
}

export default withRouter(Router)