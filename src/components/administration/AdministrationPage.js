import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
} from 'reactstrap';
import AdministrationSideMenu from './common/AdministrationSideMenu';
import AdministrationUsedStorage from './common/AdministrationUsedStorage';
import AdministrationInfos from './common/AdministrationInfos';
import jwtDecode from 'jwt-decode';
import RankService from '../../services/RankService';
import Navbar from '../common/template/Navbar';
import avatar from '../../assets/img/avatar.png';


export default class AdministrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: jwtDecode(localStorage.getItem('token')),
            temperature: 40,
            cpuPercentage: 30,
            diskStorage: {
                disque1: 13.5, 
                disque2: 13.5, 
                disque3: 1.3
            },
            diskTotalVolume: {
                disque1: 30, 
                disque2: 30, 
                disque3: 3
            }

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
                                <h5>{this.state.session.firstname + ' ' + this.state.session.lastname}</h5>
                                <p className="rank">{RankService.translate(this.state.session.rank)}</p>
                                <AdministrationSideMenu />
                            </div>
                        </Col>
                        <Col md="9" className="no-margin-left no-margin-right">
                            <div className="user-container no-center admin-dashboard">
                                <h4>État du Bitsky</h4>
                                <div className="flex-row-left">
                                    <div className="connection-state">En ligne</div>
                                    <AdministrationInfos measureTitle="Température" measuredValue={this.state.temperature + ' °C'} measuredValueState="Optimale"/>
                                    <AdministrationInfos measureTitle="Utilisation du CPU" measuredValue={this.state.cpuPercentage + ' %'} measuredValueState="Optimale"/>
                                </div>
                                <h4>Espace de stockage utilisé</h4>
                                <div className="flex-row-left">
                                    <AdministrationUsedStorage diskNumber="Disque 1" usedVolume={this.state.diskStorage['disque1']} totalVolume={this.state.diskTotalVolume['disque1']}/>
                                    <AdministrationUsedStorage diskNumber="Disque 2" usedVolume={this.state.diskStorage['disque2']} totalVolume={this.state.diskTotalVolume['disque2']}/>
                                    <AdministrationUsedStorage diskNumber="Disque 3" usedVolume={this.state.diskStorage['disque3']} totalVolume={this.state.diskTotalVolume['disque3']}/>
                                </div>
                                <h4>Derniers logs</h4>
                                <div className="admin-logs-container">
                                    <div className="admin-log"></div>
                                    <div className="admin-log pink-gradient"></div>
                                    <div className="admin-log"></div>
                                </div>
                                <Button color="info" className="see-more-button">Voir plus</Button>{' '}      
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
