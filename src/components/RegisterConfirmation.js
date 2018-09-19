import React, { Component } from 'react';
import $ from 'jquery';
import { Container, Row, Col, Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, 
    Button } from 'reactstrap';
import jwtDecode from 'jwt-decode';
import logo from '../assets/img/logo-small.png';
import avatarDefault from '../assets/img/avatar-default.png';


class RegisterConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
          session: jwtDecode(localStorage.getItem('token'))
        }
    }

    render() {
    return (
        <div>
          <Container className="main-container" style={{ minHeight: '100vh' }}>
            <Row style={{ justifyContent: 'center' }}>
              <Col sm="12" md="8" className="headerLogo">
                <img src={logo} alt="logo" height="128" />
              </Col>
              <Col sm="12" md="8" className="infos-container">
                <h4>Parlez-nous de vous, {this.state.session.firstname} !</h4>
                <hr/>
                <Container>
                  <Row>
                    <Col md="6">
                      <div className="register-title">
                        <img src={avatarDefault} alt="avatar" height="128" />
                        <h3>{this.state.session.firstname} {this.state.session.lastname}</h3>
                      </div>
                    </Col>  
                    <Col md="6"></Col>  
                  </Row>  
                </Container>                
              </Col>
            </Row>
          </Container>
        </div>
    );
    }
}

export default RegisterConfirmation;
