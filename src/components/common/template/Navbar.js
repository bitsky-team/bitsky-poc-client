import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import logo_small from '../../../assets/img/logo-small.png';
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
import { faCaretDown, faBell, faInbox, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

class Navbar extends Component {
  render() {
    return (
        <ReactstrapNavbar light expand="md">
            <NavbarBrand href="/"><img src={logo_small} height="40" alt="Logo"/></NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} />
            <Collapse isOpen={this.props.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem className="nav-item-icon">
                        <NavLink href={null}><FontAwesomeIcon icon={faBell} /></NavLink>
                    </NavItem>
                    <NavItem className="nav-item-icon">
                        <NavLink href={null}><FontAwesomeIcon icon={faInbox} /></NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav>
                            { this.props.user.firstname + ' ' + this.props.user.lastname } <FontAwesomeIcon icon={faCaretDown} />
                        </DropdownToggle>
                        <DropdownMenu right>
                        <DropdownItem>
                            Option 1
                        </DropdownItem>
                        <DropdownItem onClick={ () => this.props.history.push('/administration') }>
                            <FontAwesomeIcon icon={faUnlockAlt} /> Administration
                        </DropdownItem>
                        <DropdownItem>
                            Option 2
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={(e) => {localStorage.removeItem('id'); localStorage.removeItem('token');}}>
                            Déconnexion
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
