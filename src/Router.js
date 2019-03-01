// React
import React, {Component} from 'react'
import {Route, Redirect, withRouter} from 'react-router-dom'

// Components
import LoginPage from './components/login/LoginPage'
import RegisterPage from './components/register/RegisterPage'
import ActivityFeedPage from './components/activity_feed/ActivityFeedPage'
import RegisterConfirmationPage from './components/register/RegisterConfirmationPage'
import ProfilePage from './components/profile/ProfilePage'
import AdministrationPage from './components/administration/AdministrationPage'
import {AdministrationLinksPage} from './components/administration/AdministrationLinksPage'
import UsersAdministrationPage from './components/administration/users/UsersAdministrationPage'
import UserDocumentationPage from './components/docs/user/UserDocumentationPage'
import UserPreferencesPage from './components/preferences/UserPreferencesPage'
import UserPreferencesSecurityPage from './components/preferences/UserPreferencesSecurityPage'
import UserPreferencesAccountPage from './components/preferences/UserPreferencesAccountPage'

// Services
import AuthService from './services/AuthService'
import {AdministrationSettingsPage} from './components/administration/AdministrationSettingsPage'

const PrivateRoute = ({component: Component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{pathname: '/login', state: {from: props.location}}} />
        )
      }
    />
  )
}

class Router extends Component {
  state = {
    authenticated: !!(
      localStorage.getItem('token') && localStorage.getItem('id')
    ),
  }

  componentWillMount = async () => {
    const authenticated = await AuthService.verify()
    this.setState({authenticated})
  }

  componentDidUpdate() {
    let noAuthRoutes = ['/', '/login', '/register', '/docs']

    let adminRoutes = ['/administration', '/admin_manage_users']

    if (!noAuthRoutes.includes(this.props.history.location.pathname)) {
      if (
        !this.state.authenticated ||
        (adminRoutes.includes(this.props.history.location.pathname) &&
          !AuthService.isAdmin())
      ) {
        this.props.history.push('/')
      }
    } else {
      if (this.state.authenticated) {
        this.props.history.push('/activity_feed')
      }
    }
  }

  render() {
    return (
      <div>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/docs" component={UserDocumentationPage} />

        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/activity_feed"
          component={ActivityFeedPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/profile/:id?"
          component={ProfilePage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/register_confirmation"
          component={RegisterConfirmationPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/user_preferences"
          component={UserPreferencesPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/user_security"
          component={UserPreferencesSecurityPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/user_account"
          component={UserPreferencesAccountPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/administration"
          component={AdministrationPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path="/admin_manage_users"
          component={UsersAdministrationPage}
        />
        <PrivateRoute
          exact
          authed={this.state.authenticated}
          path={"/admin_manage_settings"}
          component={AdministrationSettingsPage}
        />
        <PrivateRoute exact authed={this.state.authenticated} path={"/admin_manage_links"} component={AdministrationLinksPage}/>
      </div>
    )
  }
}

export default withRouter(Router)
