import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import logo_small from '../../../assets/img/logo-small.png'
import AuthService from '../../../services/AuthService'
import jwtDecode from 'jwt-decode'
import {
  Collapse,
  Navbar as ReactstrapNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faCaretDown,
  faUserCog,
  faUser,
  faPowerOff,
  faBell,
  faInbox,
  faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'
import styled from 'styled-components'
import LoopService from '../../../services/LoopService'

const NotificationCount = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(218,179,215);
  color: #FFF;
  border-radius: 50%;
  position: absolute;
  bottom: -8px;
  right: 0;
  height: 20px;
  width: 20px;
  font-size: 10px;
  font-weight: bold;
`

const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [session] = useState(localStorage.getItem('token')
    ? jwtDecode(localStorage.getItem('token'))
    : null)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)

  let notificationsInterval = null
  let messagesInterval = null

  const toggleNavbar = e => {
    setIsOpen(!isOpen)
  }

  const goHome = e => {
    e.preventDefault()
    let history = props.history
    if (history.location.pathname !== '/activity_feed')
      history.push('/activity_feed')
    else window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  
  const getNotificationsCount = async () => {
    const {data} = await axios.post(
      `${config.API_ROOT}/count_user_notifications`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
    
    if (data.success) {
      setNotificationsCount(data.count)
    }
  }
  
  const getMessagesCount = async () => {
    const {data} = await axios.post(
      `${config.API_ROOT}/count_unread_messages`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
    
    if (data.success) {
      setMessagesCount(data.count)
    }
  }
  
  useEffect(() => {
    getNotificationsCount().catch(err =>
      console.log('Cant get first notifications count: ', err)
    )
  
    getMessagesCount().catch(err =>
      console.log('Cant get first messages count: ', err)
    )
  
    notificationsInterval = LoopService.loop(5000, () => {
      getNotificationsCount().catch(err =>
        console.log('Cant get notifications count: ', err)
      )
    })
  
    messagesInterval = LoopService.loop(5000, () => {
      getMessagesCount().catch(err =>
        console.log('Cant get messages count: ', err)
      )
    })
    
    return () => {
      LoopService.stop(messagesInterval)
      LoopService.stop(notificationsInterval)
    }
  }, [])

  return (
    <ReactstrapNavbar light expand="md">
      <NavbarBrand onClick={goHome}>
        <img src={logo_small} height="40" alt="Logo" />
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <div className="nav-centered-icons">
            <NavItem className="nav-item-icon" style={{position: 'relative'}}>
              <NavLink
                onClick={() => props.history.push('/messaging')}
              >
                <FontAwesomeIcon icon={faInbox} />
              </NavLink>
              {(messagesCount > 0 && !props.hideMessagesCount) && <NotificationCount>{messagesCount}</NotificationCount>}
            </NavItem>
            <NavItem className="nav-item-icon" style={{position: 'relative'}}>
              <NavLink
                onClick={() => props.history.push('/notifications')}
              >
                <FontAwesomeIcon icon={faBell} />
              </NavLink>
              {(notificationsCount > 0 && !props.hideNotificationsCount) && <NotificationCount>{notificationsCount}</NotificationCount>}
            </NavItem>
          </div>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
              {session.firstname + ' ' + session.lastname}{' '}
              <FontAwesomeIcon icon={faCaretDown} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={() => props.history.push('/profile')}
              >
                <FontAwesomeIcon icon={faUser} /> Profil
              </DropdownItem>
              {AuthService.isAdmin() && (
                <DropdownItem
                  onClick={() => props.history.push('/administration')}
                >
                  <FontAwesomeIcon icon={faUnlockAlt} /> Administration
                </DropdownItem>
              )}
              <DropdownItem
                onClick={() => props.history.push('/user_preferences')}
              >
                <FontAwesomeIcon icon={faUserCog} /> Préférences
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={logout}>
                <FontAwesomeIcon icon={faPowerOff} /> Déconnexion
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </ReactstrapNavbar>
  )
}

export default withRouter(Navbar)
