import React, { Component } from 'react';
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
                <NavbarBrand href="/">Bitsky</NavbarBrand>
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
                        <DropdownItem onClick={(e) => {localStorage.removeItem('token'); this.props.history.push('/login');}}>
                            Déconnexion
                        </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
            <Container className="main-container">
            <Row>
                <Col md="12" className="no-margin-left no-margin-right">
                {/*<div className="search-container">
                <img src={logo_small} alt="logo"/>
                <div className="search-bar">
                    <i class="fa fa-search" aria-hidden="true"></i> Rechercher
                </div>
                </div>*/}
        ggg
                </Col>
            </Row>
            </Container>
        </div>
    );
    }
  
}

export default ActivityFeed;
