import React, {useState} from 'react'
import {Container, Row, Col, Form, Alert} from 'reactstrap'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import jwtDecode from 'jwt-decode'
import Navbar from '../../common/template/Navbar'
import Rank from '../../common/Rank'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCopy, faPlus} from '@fortawesome/free-solid-svg-icons'

const ModuleContainer = styled.div`
  && {
    padding: 10px 30px !important;
    display: flex;
    flex-direction: column;

    :not(:first-child) {
      margin-top: 16px;
    }
  }
`

const KeyModuleContainer = styled(ModuleContainer)`
  width: fit-content;
  margin: 0 auto;
  background: linear-gradient(45deg, #83b2e0 0, #a5cdf5 100%);
  border-radius: 5px;
  color: #fff;
`

const KeyTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const KeyContainer = styled.div`
  padding: 10px;
  background-color: #f5f7f8;
  color: #83b2e0;
  border-radius: 5px 0 0 5px;
  width: initial;
  font-size: 20px;
  margin-left: 16px;
`

const KeyMainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const KeyButton = styled.button`
  && {
    height: 50px;
    border-radius: 0 5px 5px 0;
    font-size: 16px;

    :hover {
      background-color: #f5f7f8;
      border-color: #f5f7f8;
      border-left-color: #83b2e0;
      color: #83b2e0;
    }
  }
`

const KeyForm = styled(Form)`
  margin-top: 16px;
`

export const AdministrationLinksPage = () => {
  const [session] = useState(
    localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null
  )

  const [links, setLinks] = useState([])

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
            <KeyModuleContainer className="user-container no-center admin-dashboard">
              <KeyTitleContainer>
                <h4>Votre clé de liaison</h4>
                <KeyMainContainer>
                  <KeyContainer>
                    <span>{process.env.REACT_APP_BITSKY_LINK_KEY}</span>
                  </KeyContainer>
                  <KeyButton className="btn btn-info">
                    <FontAwesomeIcon icon={faCopy} />
                  </KeyButton>
                </KeyMainContainer>
              </KeyTitleContainer>
            </KeyModuleContainer>
            <ModuleContainer className="user-container no-center admin-top-bar">
              <Container className="no-padding-left no-padding-right">
                <Row className="align-items-center">
                  <Col className="text-left">
                    <h4>Liaisons</h4>
                  </Col>
                  <Col className="text-right">
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => this.toggleUserManageModal('ADD', null)}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Ajouter
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {links.length > 0 ? (
                      links
                    ) : (
                      <Alert
                        color="info"
                        style={{
                          width: '50%',
                          margin: '16px auto',
                          textAlign: 'center',
                        }}
                      >
                        Il n'y a aucune liaison pour le moment.
                      </Alert>
                    )}
                  </Col>
                </Row>
              </Container>
            </ModuleContainer>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
