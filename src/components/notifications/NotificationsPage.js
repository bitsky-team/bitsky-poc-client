import React, {Fragment, useReducer, useEffect} from 'react'
import Navbar from '../common/template/Navbar'
import {Button, Col, Container, Row} from 'reactstrap'
import {CenteredRow} from '../profile/ProfilePage'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEyeSlash, faEye} from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import axios from 'axios'
import {config} from '../../config'
import qs from 'qs'
import Loader from '../Loader'

const NotificationsContainer = styled(Container)`
  &&& {
    padding: 20px;
    text-align: initial;
  }
`

const NotificationSubtitle = styled.h3`
  display: flex;
  justify-content: space-between;
  color: rgb(131, 178, 224);
  text-align: center;

  * {
    flex: 1;
  }
`

const NotificationSubcontainer = styled.div`
  background-color: #f5f7f8;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
`

const Notification = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;

  :not(:first-child) {
    margin-top: 10px;
  }
`

const NotificationLink = styled(Link)`
  font-weight: 500;
  color: rgb(131, 178, 224);
  transition: 0.2s;

  :hover {
    text-decoration: none;
    color: rgb(75, 111, 149);
  }
`

const NotificationImage = styled.img`
  && {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    margin: 0 10px 0 0;
    cursor: pointer;
  }
`

const initialState = {
  loading: false,
  notifications: [],
}

const ACTIONS = {
  START_FETCHING: 'START_FETCHING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  RESET: 'RESET',
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_FETCHING:
      return {
        ...initialState,
        loading: true,
      }
    case ACTIONS.SET_NOTIFICATIONS:
      return {
        ...initialState,
        loading: false,
        notifications: action.payload
      }
    case ACTIONS.RESET:
      return initialState
    default:
      throw new Error('Action type not found')
  }
}

export const NotificationsPage = ({history}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const getNotifications = () => {
    dispatch({ type: ACTIONS.START_FETCHING })

    return axios.post(
      `${config.API_ROOT}/get_user_notifications`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }

  useEffect(() => {
    fetch().catch(err => console.log('Error while loading notifications: ', err))
  }, [])

  const viewedNotifications = state.notifications.filter(
    notification => notification.viewed
  )
  
  const notViewedNotifications = state.notifications.filter(
    notification => !notification.viewed
  )
  
  const fetch = async () => {
    const {data} = await getNotifications()
    
    if (data.success) {
      dispatch({
        type: ACTIONS.SET_NOTIFICATIONS,
        payload: data.notifications,
      })
    }
  }
  
  const readAll = async () => {
    await axios.post(
      `${config.API_ROOT}/read_user_notifications`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
    
    await fetch()
  }
  
  const deleteAll = async () => {
    await axios.post(
      `${config.API_ROOT}/delete_user_notifications`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
    
    dispatch({type: ACTIONS.RESET})
  }
  
  return (
    <Fragment>
      <Navbar hideNotificationsCount={notViewedNotifications.length === 0 ? 1 : 0} />

      <Container className="main-container">
        <CenteredRow>
          <Col md="6" className="no-margin-left no-margin-right">
            <NotificationsContainer className="user-container">
              <Row>
                <Col>
                  <h2>Notifications</h2>
                  <NotificationSubtitle>
                    <div />
                    <FontAwesomeIcon icon={faEyeSlash} />
                    <div style={{textAlign: 'right'}}>
                      <Button color="info" className="see-more-button" onClick={readAll}>
                        Marquer tout comme lu
                      </Button>
                    </div>
                  </NotificationSubtitle>
                  <NotificationSubcontainer>
                    <Fade bottom cascade>
                      <div>
                        {!state.loading ? (
                          notViewedNotifications.length > 0 ? (
                            notViewedNotifications.map(notification => (
                              <Notification key={notification.id}>
                                <NotificationImage
                                  src={notification.sender.avatar}
                                  alt="avatar"
                                  onClick={() => {history.push(`/profile/${notification.sender.id}`)}}
                                />
                                <div>
                                  <NotificationLink to={`/profile/${notification.sender.id}`}>
                                    {`${notification.sender.firstname} ${notification.sender.lastname}`}
                                  </NotificationLink>{' '}
                                  
                                  {` ${notification.message} `}
                                  
                                  <NotificationLink to="/">
                                    {`${notification.elementMessage}`}
                                  </NotificationLink>
                                  .
                                </div>
                              </Notification>
                            ))
                          ) : (
                            <p>Aucune</p>
                          )
                        ) : (
                          <Loader display={1} />
                        )}
                      </div>
                    </Fade>
                  </NotificationSubcontainer>

                  <NotificationSubtitle>
                    <div />
                    <FontAwesomeIcon icon={faEye} />
                    <div style={{textAlign: 'right'}}>
                      <Button color="info" className="see-more-button" onClick={deleteAll}>
                        Tout supprimer
                      </Button>
                    </div>
                  </NotificationSubtitle>
                  <NotificationSubcontainer>
                    <Fade bottom cascade>
                      <div>
                        {!state.loading ? (
                          viewedNotifications.length > 0 ? (
                            viewedNotifications.reverse().map(notification => (
                              <Notification key={notification.id}>
                                <NotificationImage
                                  src={notification.sender.avatar}
                                  alt="avatar"
                                  onClick={() => {history.push(`/profile/${notification.sender.id}`)}}
                                />
                                <div>
                                  <NotificationLink to={`/profile/${notification.sender.id}`}>
                                    {`${notification.sender.firstname} ${notification.sender.lastname}`}
                                  </NotificationLink>{' '}
      
                                  {` ${notification.message} `}
      
                                  <NotificationLink to="/">
                                    {`${notification.elementMessage}`}
                                  </NotificationLink>
                                  .
                                </div>
                              </Notification>
                            ))
                          ) : (
                            <p>Aucune</p>
                          )
                        ) : (
                          <Loader display={1} />
                        )}
                      </div>
                    </Fade>
                  </NotificationSubcontainer>
                </Col>
              </Row>
            </NotificationsContainer>
          </Col>
        </CenteredRow>
      </Container>
    </Fragment>
  )
}