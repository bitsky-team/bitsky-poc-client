import React, {useState, useEffect} from 'react'
import {
  Container,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import Navbar from '../../common/template/Navbar'
import Rank from '../../common/Rank'
import jwtDecode from 'jwt-decode'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faUpload, faSort, faFolderPlus} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import posed from 'react-pose'
import AdministrationFileViewer from './common/AdministrationFileViewer'
import AdministrationFileRowTable from './common/AdministrationFileRowTable'
import _ from 'lodash'
import AdministrationFileUploadModal from './AdministrationFileUploadModal'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'
import {toast} from 'react-toastify'

const ContentLabel = posed.label({
  up: {
    top: '-21px',
    left: '2px',
    transform: 'scale(1.1)',
    'font-size': '13px',
    color: 'rgb(97, 97, 97)',
    transition: {duration: 400},
  },
  down: {
    top: '7px',
    left: '10px',
    transform: 'scale(1)',
    'font-size': '18px',
    color: 'rgb(160, 160, 160)',
    transition: {duration: 400},
  },
})

const AnimatedLabel = styled(ContentLabel)`
  position: absolute;
  font-size: 15px;
  z-index: 5;
`
const UploadButton = styled(Button)`
    background-color: rgb(131, 178, 224);
    border-color: rgb(131, 178, 224);
    padding: 3px 12px 3px 12px;
    font-size: 14px;
`

const SearchContainer = styled.div`
  padding: 25px !important;
`

const ColContainer = styled(Col)`
  align-self: center;
`

const SearchInput = styled(Input)`
    border-radius: 5px 0px 0px 5px !important;
`

const FileHeaderTableContainer = styled.div`
  margin-top: 5px !important;
  box-shadow: 0px 4px 34px -18px #222;
  font-weight: 500;
  
  && {
    padding-top: 20px !important;
  }
`

const Text = styled(Col)`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TextHeader = styled.span`
  :hover {
    cursor: pointer;
  }
`

const NoFile = styled.span`
  display: block;
  margin: 10px;
`

const FilesContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const AddFolderButton = styled.span`
  height: 29px;
  width: 29px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px
  background: #FFF;
  border-radius: 5px;
  cursor: pointer;
  color: rgb(131, 178, 224);
  
  &&&&:hover {
    box-shadow: 2px 3px 10px -3px rgba(100,100,100,0.6) !important;  
  }
`

const ButtonsContainer = styled.div`
  display: flex;
`

const AdministrationManageFilesPage = () => {

  const [session] = useState(localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null)
  const [toggelLabel, setToggleLabel] = useState(false)

  const [filesComponent, setFilesComponent] = useState([])
  const [filesComponentViewer, setFilesComponentViewer] = useState([])

  const [fileModalState, setFileModalState] = useState(false)

  const [files, setFilesContent] = useState([])

  /*const [files] = useState([
    {
      'name': 'Ma passion pour les chats',
      'type': 'png',
      'author': 'Sylvain',
      'updated_at': '15-02-2019',
      'size': '3 Mo',
      'src': 'http://lorempixel.com/400/200/cats/',
    },
    {
      'name': 'Mes plats',
      'type': 'png',
      'author': 'Jason',
      'updated_at': '13-01-2019',
      'size': '2 Mo',
      'src': 'http://lorempixel.com/400/200/food/',
    },
    {
      'name': 'Mon PDF',
      'type': 'pdf',
      'author': 'Sylvain',
      'updated_at': '10-01-2019',
      'size': '207 ko',
      'src': 'https://assets.awwwards.com/awards/submissions/2016/12/58415e2c44e79.jpg',
    },
    {
      'name': 'Vacances',
      'type': 'png',
      'author': 'Jason',
      'updated_at': '19-02-2019',
      'size': '3 Mo',
      'src': 'http://lorempixel.com/400/200/nature/\'',
    },
    {
      'type': 'folder',
      'size': '15 Mo',
      'name': 'mes vacances',
      'updated_at': '19-02-2019',
      'content': [
        {
          'name': 'Vacances Espagne',
          'type': 'png',
          'author': 'Jason',
          'updated_at': '19-02-2019',
          'size': '3 Mo',
          'src': 'http://lorempixel.com/400/200/nature/\'',
        },
        {
          'type': 'folder',
          'size': '15 Mo',
          'name': 'vacances Italie',
          'updated_at': '19-02-2019',
          'content': [
            {
              'name': 'Italie',
              'type': 'png',
              'author': 'Jason',
              'updated_at': '19-02-2019',
              'size': '3 Mo',
              'src': 'http://lorempixel.com/400/200/nature/\'',
            },
          ]
        }
      ]
    }
  ])*/

  const openFolder = (type, content) => {
    if(type === 'folder') {
      const items = []
      content.forEach((item, id) => {
        items.push(
          <AdministrationFileRowTable key={id} content={item.content} openFolder={openFolder} name={item.name} type={item.type} author={item.author} updated_at={item.updated_at} size={item.size} id={id} />
        )
      })
      setFilesComponent(items)
    }
  }

  const toggleModalState = () => {
    setFileModalState(!fileModalState)
  }

  const getFiles = async () => {
    return axios.post(
      `${config.API_ROOT}/get_files`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }

  const setFiles = async () => {
    const response = await getFiles()
    const {success, content} = response.data
    if(success) {
      console.log(content)
      setFilesContent(content)
      console.log(files)
    }else {
      toast.error('Erreur lors du chargement des fichiers', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  useEffect(() => {
    let files_result = []
    let files_viewer = []

    setFiles()

    files.forEach((file, id) => {
      files_result.push(
        <AdministrationFileRowTable key={id} content={file.content} openFolder={openFolder} name={file.name} type={file.type} author={file.author} updated_at={file.updated_at} size={file.size} id={id} />
      )
    })

    _.take(files, 3).forEach( (file, id) => {
      files_viewer.push(
        <AdministrationFileViewer key={id} src={file.src} name={file.name} type={file.type} author={file.author} updated_at={file.updated_at} size={file.size}/>
      )
    })

    setFilesComponent(files_result)
    setFilesComponentViewer(files_viewer)
  },[])

  return (
    <div>
      <AdministrationFileUploadModal isOpen={fileModalState} toggle={toggleModalState}/>
      <Navbar/>
      <Container className="main-container">
        <Row>
          <Col md="3" className="no-margin-left no-margin-right">
            <div className="user-container">
              <img src={localStorage.getItem('avatar')} alt="Avatar"/>
              <h5>{session.firstname + ' ' + session.lastname}</h5>
              <p className="rank"><Rank id={session.rank}/></p>
            </div>

            <AdministrationSideMenu/>
          </Col>
          <Col md="9" className="no-margin-left no-margin-right">
            <SearchContainer className="user-container">
              <Container>
                <Row>
                  <ColContainer md="2">
                    <h4>Fichiers</h4>
                  </ColContainer>
                  <ColContainer md="7">
                    <InputGroup>
                      <AnimatedLabel pose={toggelLabel ? 'up' : 'down'}>Rechercher</AnimatedLabel>
                      <SearchInput
                        onFocus={() => setToggleLabel(true)}
                        onBlur={() => setToggleLabel(false)}
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="info">
                          <FontAwesomeIcon icon={faSearch}/>
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </ColContainer>
                  <ColContainer md="3">
                    <UploadButton color="info" onClick={toggleModalState}><FontAwesomeIcon icon={faUpload}/> Uploader</UploadButton>
                  </ColContainer>
                </Row>
              </Container>
            </SearchContainer>
            <div className="user-container admin-dashboard">
              <Container>
                <Row>
                  {filesComponentViewer && filesComponentViewer.length > 0 ? filesComponentViewer : 'Il n\'y a pas de fichier'}
                </Row>
              </Container>
            </div>
            <Container>
              <Row>
                <Col md="12">
                  <FilesContainer>
                    <div>
                      <Breadcrumb>
                        <BreadcrumbItem active>Home</BreadcrumbItem>
                      </Breadcrumb>
                    </div>
                    <ButtonsContainer>
                      <AddFolderButton><FontAwesomeIcon icon={faFolderPlus}/></AddFolderButton>
                    </ButtonsContainer>
                  </FilesContainer>
                  <FileHeaderTableContainer className="user-container admin-dashboard">
                    <Container>
                      <Row>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Nom</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Type</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Propriétaire</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Date</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Taille</TextHeader></Text>
                      </Row>
                    </Container>
                  </FileHeaderTableContainer>
                  {filesComponent && filesComponent.length> 0 ? filesComponent : <NoFile>Il n'y a pas de fichier</NoFile>}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdministrationManageFilesPage