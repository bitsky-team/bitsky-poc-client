import React, { Component } from 'react'

import {
  Container,
  Row,
  Col,
  Nav, 
  NavItem, 
  NavLink,
  Button
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen, faUserShield, faUserCog, faUserAlt, faShoePrints, faTh, faUsers } from '@fortawesome/free-solid-svg-icons'
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons'

export default class UserDocumentationPage extends Component {
  render() {
    return (
      <Container className="docs-container">
        <Row>
          <Col md="12">
            <div className="docs-left-subcontainer">
              <Button color="info" onClick={(e) => this.props.history.push('/')}><FontAwesomeIcon icon={faArrowAltCircleLeft}/> Retourner à l'accueil</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <div className="docs-left-subcontainer">
              <Nav vertical>
                <NavItem className="dropdown-toggler">
                  <NavLink href="#"><FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon> Utilisateur</NavLink>
                  <div className="dropdown-content">
                    <NavItem>
                      <NavLink href="#"><FontAwesomeIcon icon={faShoePrints} rotation={270}></FontAwesomeIcon> Premiers pas</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#"><FontAwesomeIcon icon={faUserShield}></FontAwesomeIcon> Confidentialité</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#"><FontAwesomeIcon icon={faUserCog}></FontAwesomeIcon> Préférences</NavLink>
                    </NavItem>
                  </div>
                </NavItem>
                <NavItem className="dropdown-toggler">
                  <NavLink href="#"><FontAwesomeIcon icon={faLockOpen}></FontAwesomeIcon> Administrateur</NavLink>
                  <div className="dropdown-content">
                    <NavItem>
                      <NavLink href="#"><FontAwesomeIcon icon={faShoePrints} rotation={270}></FontAwesomeIcon> Premiers pas</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#"><FontAwesomeIcon icon={faTh}></FontAwesomeIcon> Tableau de bord</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="#"><FontAwesomeIcon icon={faUsers}></FontAwesomeIcon> Utilisateurs</NavLink>
                    </NavItem>
                  </div>
                </NavItem>
              </Nav>
            </div>
          </Col>
          <Col md="9">
            <div className="docs-right-subcontainer">
                       
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}
