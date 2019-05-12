import React, {useState, useEffect} from 'react'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import AdministrationSideMenu from '../administration/common/AdministrationSideMenu'
import Navbar from '../common/template/Navbar'
import Rank from '../common/Rank'
import jwtDecode from 'jwt-decode'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {withRouter} from 'react-router'
import SideMenu from '../activity_feed/SideMenu'
import axios from 'axios'
import {config} from '../../config'
import qs from 'qs'
import Loader from '../Loader'

const SpanBitsky = styled.span`
  font-size: 25px;
`

const Icon = styled.span`
  position: absolute;
  right: 50px;
  background: #75a1cc;
  color: #FFF;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease-in-out;
`

const Bitsky = styled(Row)`
  border: 2px solid #75a1cc;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  border-radius: 5px;

  &&& {
    padding: 15px 30px 15px 30px;
  }
  
  :hover #icon {
    right: 30px !important;
  }
  
  &&:hover {
    background-color: rgba(141,187,232,0.2);
  }
  
  :not(:first-child) {
    margin-top: 15px;
  }
`

const FilesPage = props => {
  const [session] = useState(localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null)
  const [loading, setLoading] = useState(false)
  const [devices, setDevices] = useState([])
  
  const getDevices = async () => {
    return axios.post(
      `${config.API_ROOT}/get_active_devices`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }
  
  useEffect(() => {
    setLoading(true)
  
    getDevices()
      .then(({data}) => {
        if(data.success) {
          setDevices(data.links)
        } else {
          console.log('Cannot load devices data: ', data.error, data.message)
        }
        
        setLoading(false)
      })
      .catch(e => {
        console.log('Cannot load devices data: ', e)
        setLoading(false)
      })
  }, [])
  
  return (
      <div>
        <Navbar/>
        <Container className="main-container">
          <Row>
            <Col md="3" className="no-margin-left no-margin-right">
              <div className="user-container">
                <img src={localStorage.getItem('avatar')} alt="Avatar"/>
                <h5>{session.firstname + ' ' + session.lastname}</h5>
                <p className="rank"><Rank id={session.rank}/></p>
              </div>
              {session.rank === 2 ? <AdministrationSideMenu/> : <SideMenu/>}
            </Col>
            <Col md="9" className="no-margin-left no-margin-right">
              <div className="user-container no-center admin-dashboard">
                <h4>Choix du Bitsky</h4>
                <Container className="margin-top-10">
                  <Bitsky key='local' onClick={() => {
                    localStorage.removeItem('selected_device')
                    props.history.push('/admin_manage_files')
                  }}>
                    <SpanBitsky>Votre Bitsky</SpanBitsky>
                    <Icon id="icon"><FontAwesomeIcon icon={faArrowRight}/></Icon>
                  </Bitsky>
                  
                  {!loading
                    ? (
                      <>
                      {devices.map((device) => (
                        <Bitsky key={device.id} onClick={() => {
                          localStorage.setItem('selected_device', device.ip)
                          props.history.push('/admin_manage_files')}
                        }>
                          <SpanBitsky>{device.name}</SpanBitsky>
                          <Icon id="icon"><FontAwesomeIcon icon={faArrowRight}/></Icon>
                        </Bitsky>
                      ))}
                    </>
                  ) : <Loader display={1} /> }
                </Container>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

export default withRouter(FilesPage)