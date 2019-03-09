import React, {useState, useEffect, Fragment} from 'react'
import {Container, Row, Col, Alert} from 'reactstrap'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import jwtDecode from 'jwt-decode'
import Navbar from '../../common/template/Navbar'
import Rank from '../../common/Rank'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCopy, faPlus, faTimes} from '@fortawesome/free-solid-svg-icons'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {toast} from 'react-toastify'
import {AdministrationLinksModal} from './AdministrationLinksModal'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'

const ModuleContainer = styled.div`
  && {
    padding: 10px 30px !important;
    display: flex;
    flex-direction: column;

    :not(:first-child) {
      margin-top: 16px;
    }
  }
`

const KeyModuleContainer = styled(ModuleContainer)`
  width: fit-content;
  margin: 0 auto;
  background: linear-gradient(45deg, #83b2e0 0, #a5cdf5 100%);
  border-radius: 5px;
  color: #fff;
`

const KeyTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const KeyContainer = styled.div`
  padding: 10px;
  background-color: #f5f7f8;
  color: #83b2e0;
  border-radius: 5px 0 0 5px;
  width: initial;
  font-size: 20px;
  margin-left: 16px;
`

const KeyMainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const KeyButton = styled.button`
  && {
    height: 50px;
    border-radius: 0 5px 5px 0;
    font-size: 16px;

    :hover {
      background-color: #f5f7f8;
      border-color: #f5f7f8;
      border-left-color: #83b2e0;
      color: #83b2e0;
    }
  }
`

const Link = styled.p`
  display: flex;
  align-content: center;
  margin-top: 10px !important;
  font-size: 18px;
  color: #83b2e0;
  
  span {
    margin-left: 10px;
    align-self: center;
    font-size: 14px;
    font-style: italic;
    color: #bebfc4;
  }
`

const DeleteLink = styled.span`
  && {
    color: #CF94CA;
    cursor: pointer;
  }
`

export const AdministrationLinksPage = () => {
  const [session] = useState(
    localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null
  )

  const [links, setLinks] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const [value, setValue] = useState('?')
  
  useEffect(() => {
    getKey().then(({data}) => {
      if (data.success) {
        setValue(data.key)
        displayLinks(data.key)
      } else {
        setValue('?')
      }
    })
  }, [])

  const toggleLinkModal = () => {
    setIsOpen(!isOpen)
  }

  const getKey = async () => {
    return axios.post(
      `${config.API_ROOT}/get_key`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }

  const getLinks = async key => {
    return axios.post(
      `${config.API_ROOT}/get_active_links`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }
  
  const displayLinks = async key => {
    getLinks(key).then(({data}) => {
      if (data.success) {
        const dataLinks = data.key
        const componentsLink = dataLinks.map(dataLink => (
          <Link key={dataLink.id}>
            {dataLink.name} <span>({dataLink.bitsky_key})</span>
            <DeleteLink onClick={() => deleteLink(dataLink.id, dataLink.bitsky_key)}><FontAwesomeIcon icon={faTimes}/></DeleteLink>
          </Link>
        ))
        setLinks(componentsLink)
      } else {
        toast.error(`Impossible de récupérer les liens ! (${data})`, {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }
  const deleteLink = async (id, key) => {
    const {data: myKey} = await getKey()
    
    await axios.post(
      `https://bitsky.be/deleteLink`,
      qs.stringify({
        senderKey: myKey.key,
        receiverKey: key,
      })
    )
  
    await axios.post(
      `${config.API_ROOT}/delete_link`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        bitsky_key: key
      })
    )
    
    const stateLinks = links.filter(e => e.key !== id)
    setLinks(stateLinks)
  }

  return (
    <div>
      {value && (
        <Fragment>
          <AdministrationLinksModal
            open={isOpen}
            toggleLinkModal={toggleLinkModal}
            senderKey={value}
            displayLinks={displayLinks}
          />
          <Navbar />
          <Container className="main-container">
            <Row>
              <Col md="3" className="no-margin-left no-margin-right">
                <div className="user-container">
                  <img src={localStorage.getItem('avatar')} alt="Avatar" />
                  <h5>{session.firstname + ' ' + session.lastname}</h5>
                  <p className="rank">
                    <Rank id={session.rank} />
                  </p>
                </div>

                <AdministrationSideMenu />
              </Col>
              <Col md="9" className="no-margin-left no-margin-right">
                <KeyModuleContainer className="user-container no-center admin-dashboard">
                  <KeyTitleContainer>
                    <h4>Votre clé de liaison</h4>
                    <KeyMainContainer>
                      <KeyContainer>
                        <span>{value}</span>
                      </KeyContainer>
                      <CopyToClipboard
                        text={value}
                        onCopy={() =>
                          toast.success('La clé a bien été copiée !', {
                            autoClose: 5000,
                            position: toast.POSITION.BOTTOM_RIGHT,
                            className: 'notification-success',
                          })
                        }
                      >
                        <KeyButton className="btn btn-info">
                          <FontAwesomeIcon icon={faCopy} />
                        </KeyButton>
                      </CopyToClipboard>
                    </KeyMainContainer>
                  </KeyTitleContainer>
                </KeyModuleContainer>
                <ModuleContainer className="user-container no-center admin-top-bar">
                  <Container className="no-padding-left no-padding-right">
                    <Row className="align-items-center">
                      <Col className="text-left">
                        <h4>Liaisons</h4>
                      </Col>
                      <Col className="text-right">
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={toggleLinkModal}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Ajouter
                        </button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {links.length > 0 ? (
                          links
                        ) : (
                          <Alert
                            color="info"
                            style={{
                              width: '50%',
                              margin: '16px auto',
                              textAlign: 'center',
                            }}
                          >
                            Il n'y a aucune liaison pour le moment.
                          </Alert>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </ModuleContainer>
              </Col>
            </Row>
          </Container>
        </Fragment>
      )}
    </div>
  )
}
