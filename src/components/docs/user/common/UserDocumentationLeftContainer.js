import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLockOpen, faUserShield, faUserCog, faUserAlt, faShoePrints, faTh, faUsers } from '@fortawesome/free-solid-svg-icons'
import {
    Col,
    Nav, 
    NavItem, 
    NavLink,
} from 'reactstrap'
export default class UserDocumentationLeftContainer extends Component {
  render() {
    return (
        <Col md="3" className="no-padding-right">
            <div className="docs-left-subcontainer">
                <Nav vertical>
                    <NavItem className="dropdown-toggler">
                        {/* TODO: Changer li parent (les enfants ne peuvent pas être descendant d'un autre li)*/}
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
    )
  }
}
