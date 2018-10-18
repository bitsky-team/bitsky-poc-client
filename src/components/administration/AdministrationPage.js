import React, { Component } from 'react'
import {
    Container,
    Row,
    Col,
    Button,
} from 'reactstrap'
import AdministrationSideMenu from './common/AdministrationSideMenu'
import AdministrationUsedStorage from './common/AdministrationUsedStorage'
import AdministrationInfos from './common/AdministrationInfos'
import jwtDecode from 'jwt-decode'
import RankService from '../../services/RankService'
import Navbar from '../common/template/Navbar'
import axios from 'axios'
import qs from 'qs'
import {config} from '../../config'

export default class AdministrationPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            session: (localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null),
            temperature: '?',
            cpuPercentage: 30,
            diskStorage: {
                disque1: 13.5, 
                disque2: 13.5, 
                disque3: 1.3,
                disque4: 2.5
            },
            diskTotalVolume: {
                disque1: 30, 
                disque2: 30, 
                disque3: 3,
                disque4: 3
            }

        }
    }

    getTemp = async () => {
        const response = await axios.post(`${config.API_ROOT}/get_temp`, qs.stringify({ token: localStorage.getItem('token'), uniq_id: localStorage.getItem('id')}))
        const temperature = (response.data.success) ? response.data.temperature : '?'
        this.setState({temperature})
    }

    componentWillMount() {
        this.getTemp()
    }

    render() {
        return (
            <div>
                <Navbar />
                <Container className="main-container">
                    <Row>
                        <Col md="3" className="no-margin-left no-margin-right">
                            <div className="user-container">
                                <img src={localStorage.getItem('avatar')} alt="Avatar" />
                                <h5>{this.state.session.firstname + ' ' + this.state.session.lastname}</h5>
                                <p className="rank">{RankService.translate(this.state.session.rank)}</p>
                                <AdministrationSideMenu />
                            </div>
                        </Col>
                        <Col md="9" className="no-margin-left no-margin-right">
                            <div className="user-container no-center admin-dashboard">
                                <h4>État du Bitsky</h4>
                                <Container className="margin-top-10">
                                    <Row>
                                        <Col md="3">
                                            <Col md="12">
                                                <div className="connection-state">En ligne</div>
                                            </Col>
                                        </Col>
                                        <Col md="4">
                                            <Col md="12">
                                                <AdministrationInfos measureTitle="Température" measuredValue={this.state.temperature + '°C'} measuredValueState="Optimale"/>
                                            </Col>
                                        </Col>
                                        <Col md="4">
                                            <Col md="12">
                                                <AdministrationInfos measureTitle="Utilisation du CPU" measuredValue={this.state.cpuPercentage + '%'} measuredValueState="Optimale"/>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            <div className="user-container no-center admin-dashboard">
                                <h4>Espace de stockage utilisé</h4>
                                <Container className="margin-top-10">
                                    <Row>
                                        <Col md="3" className="no-padding-left no-padding-right">
                                            <Col md="12">
                                                <AdministrationUsedStorage diskNumber="Disque 1" usedVolume={this.state.diskStorage['disque1']} totalVolume={this.state.diskTotalVolume['disque1']}/>
                                            </Col>
                                        </Col>
                                        <Col md="3" className="no-padding-left no-padding-right">
                                            <Col md="12">
                                                <AdministrationUsedStorage diskNumber="Disque 2" usedVolume={this.state.diskStorage['disque2']} totalVolume={this.state.diskTotalVolume['disque2']}/>
                                            </Col>
                                        </Col>
                                        <Col md="3" className="no-padding-left no-padding-right">
                                            <Col md="12">
                                                <AdministrationUsedStorage diskNumber="Disque 3" usedVolume={this.state.diskStorage['disque3']} totalVolume={this.state.diskTotalVolume['disque3']}/>
                                            </Col>
                                        </Col>
                                        <Col md="3" className="no-padding-left no-padding-right">
                                            <Col md="12">
                                                <AdministrationUsedStorage diskNumber="Disque 4" usedVolume={this.state.diskStorage['disque4']} totalVolume={this.state.diskTotalVolume['disque4']} warning/>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            <div className="user-container no-center admin-dashboard">
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
