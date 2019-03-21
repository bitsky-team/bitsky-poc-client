import React, {useState} from 'react'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import Navbar from '../../common/template/Navbar'
import Rank from '../../common/Rank'
import jwtDecode from 'jwt-decode'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {withRouter} from 'react-router'

const SpanBitsky = styled.span`
  font-size: 25px;
`

const Icon = styled.span`
  position: absolute;
  right: 50px;
  background: #CF94CA;
  color: #FFF;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease-in-out;
`

const MyBistky = styled(Row)`
  border: 2px solid #CF94CA;  
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &&& {
    padding: 15px 30px 15px 30px;
  }
  
  :hover #icon {
    right: 30px !important;
  }
  
  &&:hover {
    background-color: rgba(207, 148, 202, 0.2);
  }
`

const AdministrationFilesPage = props => {

  const [session] = useState(localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null)

  return (
      <div>
        <Navbar/>
        <Container className="main-container">
          <Row>
            <Col md="3" className="no-margin-left no-margin-right">
              <div className="user-container">
                <img src={localStorage.getItem('avatar')} alt="Avatar"/>
                <h5>{session.firstname + ' ' + session.lastname}</h5>
                <p className="rank"><Rank id={session.rank}/></p>
              </div>
              <AdministrationSideMenu/>
            </Col>
            <Col md="9" className="no-margin-left no-margin-right">
              <div className="user-container no-center admin-dashboard">
                <h4>Choix du Bitsky</h4>
                <Container className="margin-top-10">
                  <MyBistky className="user-container" onClick={() => props.history.push('/admin_manage_files')}>
                    <SpanBitsky>Bitsky actuel</SpanBitsky>
                    <Icon id="icon"><FontAwesomeIcon icon={faArrowRight}/></Icon>
                  </MyBistky>
                </Container>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

export default withRouter(AdministrationFilesPage)