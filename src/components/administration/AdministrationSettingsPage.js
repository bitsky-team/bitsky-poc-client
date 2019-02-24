import React, {useState, useEffect} from 'react'
import {Container, Row, Col} from 'reactstrap'
import AdministrationSideMenu from './common/AdministrationSideMenu'
import jwtDecode from 'jwt-decode'
import Navbar from '../common/template/Navbar'
import Rank from '../common/Rank'
import styled from 'styled-components'
import axios from 'axios'
import qs from 'qs'
import {config} from '../../config'
import {toast} from 'react-toastify'

const ModuleContainer = styled.div`
  && {
    padding: 10px 30px !important;
    display: flex;
  }
`

const ModuleOption = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  h4 {
    margin: 0;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;

  button:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  button:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`
const Button = styled.button`
  border: none;
  background-color: ${({disabled, activated}) =>
    disabled
      ? 'rgb(207, 148, 202)'
      : activated
      ? 'rgb(131, 178, 224)'
      : '#FFF'};
  color: ${({disabled, activated}) =>
    activated || disabled ? 'white' : 'black'};
  border: ${({disabled, activated}) =>
    activated || disabled ? 'none' : '1px solid lightgrey'};
  padding: ${({disabled, activated}) =>
    activated || disabled ? '6px 5px' : '5px'};
  cursor: pointer;
  -webkit-appearance: none;
  border-radius: 5px;
`

export const AdministrationSettingsPage = () => {
  const [session] = useState(
    localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null
  )

  const [registrationState, setRegistrationState] = useState(null)

  useEffect(() => {
    getRegistrationState()
  }, [])

  const getRegistrationState = async () => {
    const response = await axios.get(
      `${config.API_ROOT}/get_registration_module_state`
    )

    const {success, state} = response.data
    
    if (success) {
      setRegistrationState(state === 1)
    } else {
      toast.error('Une erreur est survenue !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const changeRegistrationState = async state => {
    let stateChanged = false
    
    if (state && !registrationState) {
      setRegistrationState(state)
      stateChanged = true
    }

    if (!state && registrationState) {
      setRegistrationState(false)
      stateChanged = true
    }
  
    
    if (stateChanged) {
      const response = await axios.post(
        `${config.API_ROOT}/toggle_registration_module_state`,
        qs.stringify({
          token: localStorage.getItem('token'),
          uniq_id: localStorage.getItem('id'),
        })
      )
      
      const {success} = response.data

      if (!success) {
        toast.error('Une erreur est survenue !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    }
  }

  return (
    <div>
      <Navbar />
      <Container className="main-container">
        <Row>
          <Col md="3" className="no-margin-left no-margin-right">
            <div className="user-container">
              <img src={localStorage.getItem('avatar')} alt="Avatar" />
              <h5>{session.firstname + ' ' + session.lastname}</h5>
              <p className="rank">
                <Rank id={session.rank} />
              </p>
            </div>

            <AdministrationSideMenu />
          </Col>
          <Col md="9" className="no-margin-left no-margin-right">
            <ModuleContainer className="user-container no-center admin-dashboard">
              <ModuleOption>
                <h4>Module d'inscription</h4>
                {registrationState != null &&
                  <ButtonGroup>
                    <Button
                      onClick={() => changeRegistrationState(true)}
                      activated={registrationState === true}
                    >
                      Activé
                    </Button>
                    <Button
                      onClick={() => changeRegistrationState(false)}
                      disabled={registrationState === false}
                    >
                      Désactivé
                    </Button>
                  </ButtonGroup>
                }
              </ModuleOption>
            </ModuleContainer>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
