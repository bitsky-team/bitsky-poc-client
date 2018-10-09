import React, { Component } from 'react';
import { 
    Container, 
    Row, 
    Col, 
} from 'reactstrap';
import AdministrationSideMenu from './common/AdministrationSideMenu';
import jwtDecode from 'jwt-decode';
import RankService from '../../services/RankService';
import Navbar from '../common/template/Navbar';
import avatar from '../../assets/img/avatar.png';


export default class AdministrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: jwtDecode(localStorage.getItem('token'))
        };
    }

    render() {
        return (
            <div>
            <Navbar />
            <Container className="main-container">
                <Row>
                    <Col md="3" className="no-margin-left no-margin-right">
                        <div className="user-container">
                            <img src={avatar} alt="Avatar" />
                            <h5>{ this.state.session.firstname + ' ' + this.state.session.lastname }</h5>
                            <p className="rank">{ RankService.translate(this.state.session.rank) }</p>
                            <AdministrationSideMenu />
                        </div>
                    </Col>
                    <Col md="9" className="no-margin-left no-margin-right">
                        <div className="user-container no-center">
                            
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        )
    }
}
