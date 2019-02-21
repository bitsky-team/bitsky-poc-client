import React, {Fragment, useState} from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap'
import Navbar from '../common/template/Navbar'
import UserPreferencesSideMenu from './common/UserPreferencesSideMenu'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-toastify'
import axios from 'axios'
import {config} from '../../config'
import qs from 'qs'

const UserSecurityContainer = styled.div`
  &&& {
    text-align: left;
  }
`

const UserPreferencesSecurityPage = () => {
  const [actualPassword, setActualPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [repeatNewPassword, setRepeatNewPassword] = useState(null)

  const onSubmit = async () => {
    if (
      actualPassword &&
      actualPassword.length >= 8 &&
      (newPassword && newPassword.length >= 8) &&
      (repeatNewPassword && repeatNewPassword.length >= 8) &&
      newPassword === repeatNewPassword
    ) {
      const response = await axios.post(
        `${config.API_ROOT}/change_password`,
        qs.stringify({
          token: localStorage.getItem('token'),
          uniq_id: localStorage.getItem('id'),
          actualPassword,
          newPassword
        })
      )
      
      const {success} = response.data

      if (success) {
        toast.success('Votre mot de passe a bien été modifié !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
      } else {
        console.log(response)
        toast.error('Une erreur est survenue !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } else {
      toast.error('Veuillez remplir tous les champs correctement !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  return (
    <Fragment>
      <Navbar />
      <Container>
        <Row>
          <Col>
            <Container className="main-container">
              <Row>
                <Col md="3" className="no-margin-left no-margin-right">
                  <UserPreferencesSideMenu />
                </Col>
                <Col md="9" className="no-margin-left no-margin-right">
                  <Container>
                    <Row>
                      <Col>
                        <div className="user-container margin-top-10">
                          <UserSecurityContainer>
                            <h4 style={{marginBottom: '15px'}}>
                              Modifier votre mot de passe
                            </h4>

                            <Form>
                              <FormGroup>
                                <Label for="userPassword">
                                  Mot de passe actuel
                                </Label>
                                <Input
                                  type="password"
                                  name="userActualPassword"
                                  id="userActualPassword"
                                  onChange={e =>
                                    setActualPassword(e.target.value)
                                  }
                                />
                              </FormGroup>

                              <FormGroup>
                                <Label for="userPassword">
                                  Nouveau mot de passe
                                </Label>
                                <Input
                                  type="password"
                                  name="userNewPassword"
                                  id="userNewPassword"
                                  onChange={e => setNewPassword(e.target.value)}
                                />
                              </FormGroup>

                              <FormGroup>
                                <Label for="userPassword">
                                  Répétez votre nouveau mot de passe
                                </Label>
                                <Input
                                  type="password"
                                  name="userRepeatNewPassword"
                                  id="userRepeatNewPassword"
                                  onChange={e =>
                                    setRepeatNewPassword(e.target.value)
                                  }
                                />
                              </FormGroup>

                              <Button
                                className="modal-choice"
                                color="primary"
                                block
                                onClick={onSubmit}
                              >
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </Button>
                            </Form>
                          </UserSecurityContainer>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default UserPreferencesSecurityPage
