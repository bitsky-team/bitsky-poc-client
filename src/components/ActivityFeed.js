import React, { Component } from 'react';
import logo_small from '../assets/img/logo-small.png';
import { Container, Row, Col, Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';


class ActivityFeed extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/"><img src={logo_small} height="40" alt="Logo"/></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink href="/components/">Components</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Menu
                        </DropdownToggle>
                        <DropdownMenu right>
                        <DropdownItem>
                            Option 1
                        </DropdownItem>
                        <DropdownItem>
                            Option 2
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={(e) => {localStorage.removeItem('id'); localStorage.removeItem('token'); this.props.history.push('/login');}}>
                            Déconnexion
                        </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
            <Container className="main-container">
            <Row>
                <Col md="3" className="no-margin-left no-margin-right">
                    <div className="user-container">
                        <img src={logo_small} alt="Logo" />
                        <h5>Jason Van Malder</h5>
                        <p>Administrateur</p>
                        <hr/>
                        <p className="text-left">Activité</p>
                        <div className="badge pink text-left">
                            <span><strong>174</strong></span>
                            <span>Publications postées</span>
                        </div>
                        <div className="badge blue text-left">
                            <span><strong>225</strong></span>
                            <span>Fichiers téléchargés</span>
                        </div>
                    </div>
                </Col>
                <Col md="5" className="no-margin-left no-margin-right">
                    <div className="publish-container">
                        <textarea rows="1" cols="50" placeholder="Poster une publication"></textarea>
                    </div>
                </Col>
                <Col md="4" className="no-margin-left no-margin-right">
               
        ggg
                </Col>
            </Row>
            </Container>
        </div>
    );
    }
  
}

export default ActivityFeed;
