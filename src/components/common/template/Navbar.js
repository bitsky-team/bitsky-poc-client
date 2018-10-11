import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import logo_small from '../../../assets/img/logo-small.png';
import AuthService from '../../../services/AuthService';
import jwtDecode from 'jwt-decode';
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
    DropdownItem
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faUserCog, faUser, faPowerOff, faBell, faInbox, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            session: jwtDecode(localStorage.getItem('token'))
        }
    }
    
    toggleNavbar = (e) => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    goHome = (e) => {
        e.preventDefault();
        let history = this.props.history;
        if(history.location.pathname !== "/activity_feed") history.push('/activity_feed');
        else window.location.reload();
    }

    render() {
        return (
            <ReactstrapNavbar light expand="md">
                <NavbarBrand onClick={this.goHome}><img src={logo_small} height="40" alt="Logo"/></NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />
                <Collapse isOpen={this.props.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <div className="nav-centered-icons">
                            <NavItem className="nav-item-icon">
                                <NavLink href={null}><FontAwesomeIcon icon={faInbox} /></NavLink>
                            </NavItem>
                            <NavItem className="nav-item-icon">
                                <NavLink href={null}><FontAwesomeIcon icon={faBell} /></NavLink>
                            </NavItem>
                        </div>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav>
                                { this.state.session.firstname + ' ' + this.state.session.lastname } <FontAwesomeIcon icon={faCaretDown} />
                            </DropdownToggle>
                            <DropdownMenu right>
                            <DropdownItem>
                            <FontAwesomeIcon icon={faUser} /> Profil
                            </DropdownItem>
                            {AuthService.isAdmin() && 
                                <DropdownItem onClick={ () => this.props.history.push('/administration') }>
                                    <FontAwesomeIcon icon={faUnlockAlt} /> Administration
                                </DropdownItem>
                            }
                            <DropdownItem>
                                <FontAwesomeIcon icon={faUserCog} /> Préférences
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={(e) => {localStorage.removeItem('id'); localStorage.removeItem('token');}}>
                                <FontAwesomeIcon icon={faPowerOff} /> Déconnexion
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </ReactstrapNavbar>
        )
    }
}


export default withRouter(Navbar);
