import React, {Fragment, useState} from 'react'
import {Container, Row, Col, Button} from 'reactstrap'
import Navbar from '../../components/common/template/Navbar'
import UserPreferencesSideMenu from '../preferences/common/UserPreferencesSideMenu'
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import DeleteModal from './DeleteModal'
import axios from "axios";
import {config} from "../../config";
import qs from "qs";
import jwtDecode from "jwt-decode";
import {toast} from 'react-toastify'

const UserPreferencesAccountPage = () => {

  const [open, setOpen] = useState(false)

  const UserAccountContainer = styled.div`
    &&& {
      text-align: left;
    }
  `

  const DeleteButton = styled(Button)`
    
    &&& {
        background-color: rgb(238, 117, 117);
        border: 1px solid rgb(238, 117, 117);
    }
    
    &&&:hover,  &&&&:active, &&&:focus{
        background-color: rgb(234, 81, 81);
        border: 1px solid rgb(234, 81, 81);
    }
  `

  const toggleDeleteModal = () => {
    setOpen(!open)
  }

  return (
    <Fragment>
      <Navbar />
      <DeleteModal open={open} toggleDeleteModal={toggleDeleteModal}/>
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
                        <UserAccountContainer className="user-container margin-top-10">
                          <h4 style={{marginBottom: '15px'}}>
                            Supprimer définitivement mon compte et mes informations
                          </h4>
                          <DeleteButton
                              size="lg"
                              block
                              onClick={toggleDeleteModal}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </DeleteButton>
                        </UserAccountContainer>
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

export default UserPreferencesAccountPage
