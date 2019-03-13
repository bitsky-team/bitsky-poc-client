import React, {Component} from 'react'
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
import Navbar from '../common/template/Navbar'
import axios from 'axios'
import qs from 'qs'
import {config} from '../../config'
import Rank from '../common/Rank'
import AdministrationLog from './common/AdministrationLog'
import _ from 'lodash'
import styled from 'styled-components'
import AdministrationLogModal from './logs/AdministrationLogModal'

const SeeMoreButton = styled(Button)`
    background-color: rgb(131, 178, 224);
    border-color: rgb(131, 178, 224);
    padding: 3px 12px 3px 12px;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 30px;
`

export default class AdministrationPage extends Component {

  _isMounted = false
  interval = null

  state = {
    session: (localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null),
    temperature: '?',
    cpuPercentage: '?',
    diskStorage: {
      disque1: 13.5,
      disque2: 13.5,
      disque3: 1.3,
      disque4: 2.5,
    },
    diskTotalVolume: {
      disque1: 30,
      disque2: 30,
      disque3: 3,
      disque4: 3,
    },
    logs: [],
    logsModalState: false,
  }

  getTemp = async () => {
    const response = await axios.post(`${config.API_ROOT}/get_temp`, qs.stringify({
      token: localStorage.getItem('token'),
      uniq_id: localStorage.getItem('id'),
    }))
    const temperature = (response.data.success) ? response.data.temperature : '?'
    if (this._isMounted) this.setState({temperature})
  }

  getCpu = async () => {
    const response = await axios.post(`${config.API_ROOT}/get_cpu`, qs.stringify({
      token: localStorage.getItem('token'),
      uniq_id: localStorage.getItem('id'),
    }))
    const cpuPercentage = (response.data.success) ? Math.round(response.data.cpu_usage, 2) : '?'
    if (this._isMounted) this.setState({cpuPercentage})
  }

  getLogs = async () => {
    return axios.post(
      `${config.API_ROOT}/get_logs`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
      }),
    )
  }

  setLogs = () => {
    this.getLogs()
      .then(response => {
        let logs_result = []
        const {logs} = response.data

        logs.forEach((log, i) => {
          logs_result.push(
            <AdministrationLog key={i} log={log}/>,
          )
        })
        logs_result.reverse()
        this.setState({logs: logs_result})
      })
  }

  toggleLogsModalState = () => {
    this.setState({logsModalState: !this.state.logsModalState})
  }

  componentDidMount() {
    this._isMounted = true

    this.getTemp()
    this.getCpu()
    this.setLogs()

    this.interval = setInterval(() => {
      this.getTemp()
      this.getCpu()
    }, 5000)
  }

  componentWillUnmount() {
    this._isMounted = false
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
        <AdministrationLogModal isOpen={this.state.logsModalState} toggle={this.toggleLogsModalState}
                                logs={this.state.logs}/>
        <Navbar/>
        <Container className="main-container">
          <Row>
            <Col md="3" className="no-margin-left no-margin-right">
              <div className="user-container">
                <img src={localStorage.getItem('avatar')} alt="Avatar"/>
                <h5>{this.state.session.firstname + ' ' + this.state.session.lastname}</h5>
                <p className="rank"><Rank id={this.state.session.rank}/></p>
              </div>

              <AdministrationSideMenu/>
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
                        <AdministrationInfos measureTitle="Température" measuredValue={this.state.temperature + '°C'}
                                             measuredValueState={this.state.temperature < 60 ? 'Optimale' : 'Élevée'}/>
                      </Col>
                    </Col>
                    <Col md="4">
                      <Col md="12">
                        <AdministrationInfos measureTitle="Utilisation du CPU"
                                             measuredValue={this.state.cpuPercentage + '%'}
                                             measuredValueState={this.state.cpuPercentage < 70 ? 'Optimale' : 'Élevée'}/>
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
                        <AdministrationUsedStorage diskNumber="Disque 1" usedVolume={this.state.diskStorage['disque1']}
                                                   totalVolume={this.state.diskTotalVolume['disque1']}/>
                      </Col>
                    </Col>
                    <Col md="3" className="no-padding-left no-padding-right">
                      <Col md="12">
                        <AdministrationUsedStorage diskNumber="Disque 2" usedVolume={this.state.diskStorage['disque2']}
                                                   totalVolume={this.state.diskTotalVolume['disque2']}/>
                      </Col>
                    </Col>
                    <Col md="3" className="no-padding-left no-padding-right">
                      <Col md="12">
                        <AdministrationUsedStorage diskNumber="Disque 3" usedVolume={this.state.diskStorage['disque3']}
                                                   totalVolume={this.state.diskTotalVolume['disque3']}/>
                      </Col>
                    </Col>
                    <Col md="3" className="no-padding-left no-padding-right">
                      <Col md="12">
                        <AdministrationUsedStorage diskNumber="Disque 4" usedVolume={this.state.diskStorage['disque4']}
                                                   totalVolume={this.state.diskTotalVolume['disque4']} warning/>
                      </Col>
                    </Col>
                  </Row>
                </Container>
              </div>
              <div className="user-container no-center admin-dashboard">
                <h4>Derniers logs</h4>
                <div className="admin-logs-container">
                  {this.state.logs.length > 0 ? _.take(this.state.logs, 5) : 'Il n\'y a aucun log'}
                </div>
                <SeeMoreButton color="info" onClick={this.toggleLogsModalState}>Voir plus</SeeMoreButton>{' '}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
