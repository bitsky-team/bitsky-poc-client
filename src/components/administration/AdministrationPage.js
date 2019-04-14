import React, {Component} from 'react'
import {Container, Row, Col, Button} from 'reactstrap'
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
import Loader from '../Loader'
import {toast} from 'react-toastify'

const SeeMoreButton = styled(Button)`
  background-color: rgb(131, 178, 224);
  border-color: rgb(131, 178, 224);
  padding: 3px 12px 3px 12px;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 30px;
`

const ConnectionState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 200;
  font-size: 20px;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background: ${({online}) =>
    online === '?'
      ? 'darkgrey'
      : online === 'online'
      ? 'linear-gradient(45deg, #84DE86 0, #68B06A 100%)'
      : 'linear-gradient(45deg, #CF94CA 0, #E8B4E3 100%)'};
`

export default class AdministrationPage extends Component {
  _isMounted = false
  interval = null

  state = {
    session: localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null,
    online: '?',
    temperature: '?',
    cpuPercentage: '?',
    devices: [],
    deviceLoading: false,
    logsLoading: true,
    logs: [],
    logsModalState: false,
  }

  getOnline = async () => {
    try {
      await axios.get(`${config.API_ROOT}`)
      this.setState({online: 'online'})
    } catch (e) {
      this.setState({online: 'offline'})
    }
  }

  getTemp = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/get_temp`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
      })
    )
    const temperature = response.data.success ? response.data.temperature : '?'
    if (this._isMounted) this.setState({temperature})
  }

  getCpu = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/get_cpu`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
      })
    )
    const cpuPercentage = response.data.success
      ? Math.round(response.data.cpu_usage, 2)
      : '?'
    if (this._isMounted) this.setState({cpuPercentage})
  }

  getLogs = async () => {
    return axios.post(
      `${config.API_ROOT}/get_logs`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
      })
    )
  }

  getStorageMemory = async () => {
    this.setState({devicesLoading: true})
    const response = await axios.post(
      `${config.API_ROOT}/get_devices_memory`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
      }),
    )

    const {success, devices} = response.data

    if(success) {
      let devices_result = []

      if(devices) {
        devices.forEach((device, i) => {
          devices_result.push(
            <AdministrationUsedStorage key={i} name={device.name} usedVolume={device.usedMem}
                                       totalVolume={device.totalMem} percent={device.percent}/>
          )
        })

        this.setState({
            devices: devices_result,
            devicesLoading: false,
          }
        )
      }
    }else {
      toast.error('L\'état des périphériques de stockage n\'a pas pu être récupéré !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  setLogs = () => {
    this.setState({logsLoading: true})
    this.getLogs().then(response => {
      let logs_result = []
      const {logs} = response.data

      if (logs) {
        logs.forEach((log, i) => {
          logs_result.push(<AdministrationLog key={i} log={log} />)
        })
      }

      logs_result.reverse()
      this.setState({logs: logs_result, logsLoading: false})
    })
  }

  toggleLogsModalState = () => {
    this.setState({logsModalState: !this.state.logsModalState})
  }

  componentDidMount() {
    this._isMounted = true

    this.getOnline()
    this.getTemp()
    this.getCpu()
    this.setLogs()
    this.getStorageMemory()

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
        <AdministrationLogModal
          isOpen={this.state.logsModalState}
          toggle={this.toggleLogsModalState}
          logs={this.state.logs}
        />
        <Navbar />
        <Container className="main-container">
          <Row>
            <Col md="3" className="no-margin-left no-margin-right">
              <div className="user-container">
                <img src={localStorage.getItem('avatar')} alt="Avatar" />
                <h5>
                  {this.state.session.firstname +
                    ' ' +
                    this.state.session.lastname}
                </h5>
                <p className="rank">
                  <Rank id={this.state.session.rank} />
                </p>
              </div>

              <AdministrationSideMenu />
            </Col>
            <Col md="9" className="no-margin-left no-margin-right">
              <div className="user-container no-center admin-dashboard">
                <h4>État du Bitsky</h4>
                <Container className="margin-top-10">
                  <Row>
                    <Col md="3">
                      <Col md="12">
                        <ConnectionState online={this.state.online}>
                          {this.state.online === '?' && '?'}
                          {this.state.online === 'online' && 'En ligne'}
                          {this.state.online === 'offline' && 'Hors ligne'}
                        </ConnectionState>
                      </Col>
                    </Col>
                    <Col md="4">
                      <Col md="12">
                        <AdministrationInfos
                          measureTitle="Température"
                          measuredValue={this.state.temperature + '°C'}
                          measuredValueState={
                            this.state.temperature < 60 ? 'Optimale' : 'Élevée'
                          }
                        />
                      </Col>
                    </Col>
                    <Col md="4">
                      <Col md="12">
                        <AdministrationInfos
                          measureTitle="Utilisation du CPU"
                          measuredValue={this.state.cpuPercentage + '%'}
                          measuredValueState={
                            this.state.cpuPercentage < 70
                              ? 'Optimale'
                              : 'Élevée'
                          }
                        />
                      </Col>
                    </Col>
                  </Row>
                </Container>
              </div>
              <div className="user-container no-center admin-dashboard">
                <h4>Espace de stockage utilisé</h4>
                <Container className="margin-top-10">
                  <Row>
                    <Loader display={this.state.devicesLoading ? 1 : 0}/>
                    {this.state.devices && this.state.devices.length > 0 ? this.state.devices : null}
                  </Row>
                </Container>
              </div>
              <div className="user-container no-center admin-dashboard">
                <h4>Derniers logs</h4>
                <div className="admin-logs-container margin-top-10">
                  <Loader display={this.state.logsLoading ? 1 : 0} />
                  {this.state.logs.length > 0
                    ? _.take(this.state.logs, 5)
                    : undefined}
                </div>
                {this.state.logs.length > 0 && (
                  <SeeMoreButton
                    color="info"
                    onClick={this.toggleLogsModalState}
                  >
                    Voir plus
                  </SeeMoreButton>
                )}{' '}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
