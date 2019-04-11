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
import AdministrationFileRowTable from './common/AdministrationFileRowTable'
import AdministrationFileUploadModal from './AdministrationFileUploadModal'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'
import {toast} from 'react-toastify'
import Loader from '../../Loader'
import AdministrationFileCreateFolderModal from './AdministrationFileCreateFolderModal'
import FormGroup from 'reactstrap/es/FormGroup'
import FormFeedback from 'reactstrap/es/FormFeedback'
import removeAccents from 'remove-accents'
import AdministrationImgViewer from './AdministrationImgViewer'
import AdministrationFileDownloadModal from './AdministrationFileDownloadModal'

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

const MainFilesContainer = styled(Col)`
  padding: 0 !important;
`

const BreadCrumbItem = styled(BreadcrumbItem)`
  cursor: pointer;
  
  :hover {
      text-decoration: underline;
  }
`

const AdministrationManageFilesPage = () => {

  const [session] = useState(localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null)
  const [toggelLabel, setToggleLabel] = useState(false)
  const [filesComponent, setFilesComponent] = useState([])
  const [fileModalState, setFileModalState] = useState(false)
  const [createFolderModalState, setCreateFolderModalState] = useState(false)
  const [fileDownloadState, setFileDownloadState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [path, setPath] = useState(null)
  const [breadcrumbItem, setBreadCrumbItem] = useState(null)

  const [toggleDates, setTogglesDates] = useState(false)
  const [toggleNames, setToggleNames] = useState(false)
  const [toggleOwner, setToggleOwner] = useState(false)
  const [toggleType, setToggleType] = useState(false)
  const [toggleSize, setToggleSize] = useState(false)
  const [dataContent, setDataContent] = useState(null)

  const [searchValue, setSearchValue] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
  const [imgViewerState, setImgViewerState] = useState(false)

  const [fileName, setFileName] = useState(null)

  const BreadCrumbContainer = styled(Breadcrumb)`
    display: ${path ? 'block' : 'none'} !important;
  `

  const openFolder = (type, name) => {
    if (type === 'dossier') {
      const newPath = `${path || ''}/${name}`
      setPath(newPath)
      setBreadcrumb(newPath)
    }
  }

  const sendInfoToDownload = name => {
    setFileName(name)
    toggleModalFileDownloadState()
  }

  const setBreadcrumb = (newPath) => {
    const splittedPath = newPath ? newPath.split('/') : ['']
    const lastItem = splittedPath.pop()
    const breadcrumb = []

    splittedPath.forEach((item, index) => {
      if (!item.trim()) item = 'Home'
      breadcrumb.push(<BreadCrumbItem key={index} onClick={() => goTo(index)}>{item}</BreadCrumbItem>)
    })

    breadcrumb.push(<BreadCrumbItem key={'breadcrumb-last'} active>{lastItem}</BreadCrumbItem>)

    setBreadCrumbItem(breadcrumb)
  }

  const sendImgSrc = blob => {
    setImgSrc(blob)
  }

  const goTo = limit => {
    const completePath = `Home${path}`
    const splittedPath = completePath.split('/')
    splittedPath[0] = null

    let newPath = ''

    splittedPath.forEach((item, index) => {
      if (index > limit) return
      if (item) {
        newPath += `/${item}`
      }
    })

    if (!newPath.trim()) newPath = null

    setPath(newPath)
    setBreadcrumb(newPath)
  }

  const toggleModalState = () => {
    setFileModalState(!fileModalState)
  }

  const toggleFolderModalState = () => {
    setCreateFolderModalState(!createFolderModalState)
  }

  const toggleModalViewerState = () => {
    setImgViewerState(!imgViewerState)
  }

  const toggleModalFileDownloadState = () => {
    setFileDownloadState(!fileDownloadState)
  }

  const getFiles = async () => {
    return axios.post(
      `${config.API_ROOT}/get_files`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        path: path || null,
      }),
    )
  }

  const setFiles = async () => {
    setFilesComponent(null)
    setLoading(true)

    const response = await getFiles()
    const {success, content} = response.data
    if (success) {
      if (content) {
        setDataContent(content)
        let files_result = []

        content.forEach((file, id) => {
          let date = file.updated_at.split(' ').shift()

          files_result.push(
            <AdministrationFileRowTable key={id} openFolder={openFolder} name={file.name} path={path}
                                        type={file.type} firstname={file.owner.firstname} lastname={file.owner.lastname}
                                        ownerId={file.owner.id} updated_at={date} size={file.converted_size}
                                        id={id} setFiles={setFiles} sendImageSrc={sendImgSrc} toggle={toggleModalViewerState} sendInfoToDownload={sendInfoToDownload}/>,
          )
        })
        setFilesComponent(files_result)
        setLoading(false)
      }
    } else {
      toast.error('Erreur lors du chargement des fichiers', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const toggleSortDates = () => {
    setTogglesDates(!toggleDates)
  }

  const toggleSortNames = () => {
    setToggleNames(!toggleNames)
  }

  const toggleSortOwner = () => {
    setToggleOwner(!toggleOwner)
  }

  const toggleSortType = () => {
    setToggleType(!toggleType)
  }

  const toggleSortSize = () => {
    setToggleSize(!toggleSize)
  }

  const sortColumn = type => {
    let data = dataContent
    let sortedComponents = []

    data.forEach(file => {
      file.updated_at = file.updated_at.split(' ').shift()
    })

    switch (type) {
      case 'date':
        toggleSortDates()

        data.sort((a, b) => {
          let aa = a.updated_at.split('-').reverse().join(),
            bb = b.updated_at.split('-').reverse().join()

          if (toggleDates) return aa > bb ? -1 : (aa < bb ? 1 : 0)
          else return aa < bb ? -1 : (aa > bb ? 1 : 0)
        })
        break
      case 'owner':
        toggleSortOwner()

        data.sort((a, b) => {
          let currentFirstname = removeAccents(a.owner.firstname.toLowerCase()),
            nextFirstname = removeAccents(b.owner.firstname.toLowerCase())

          if (toggleOwner) return currentFirstname < nextFirstname ? -1 : (currentFirstname > nextFirstname ? 1 : 0)
          else return currentFirstname > nextFirstname ? -1 : (currentFirstname < nextFirstname ? 1 : 0)
        })
        break
      case 'name':
        toggleSortNames()

        data.sort((a, b) => {
          let currentName = removeAccents(a.name.toLowerCase()),
            nextName = removeAccents(b.name.toLowerCase())

          if (toggleNames) return currentName < nextName ? -1 : (currentName > nextName ? 1 : 0)
          else return currentName > nextName ? -1 : (currentName < nextName ? 1 : 0)
        })
        break
      case 'type':
        toggleSortType()

        data.sort((a, b) => {
          let currentType = removeAccents(a.type.toLowerCase()),
            nextType = removeAccents(b.type.toLowerCase())

          if (toggleType) return currentType < nextType ? -1 : (currentType > nextType ? 1 : 0)
          else return currentType > nextType ? -1 : (currentType < nextType ? 1 : 0)
        })
        break
      case 'size':
        toggleSortSize()

        data.sort((a, b) => {
          let aa = a.size,
            bb = b.size

          if (toggleSize) return aa > bb ? -1 : (aa < bb ? 1 : 0)
          else return aa < bb ? -1 : (aa > bb ? 1 : 0)
        })
        break
      default:
        break
    }

    data.forEach((file, id) => {
      sortedComponents.push(
        <AdministrationFileRowTable key={id} openFolder={openFolder} name={file.name} path={path}
                                    type={file.type} firstname={file.owner.firstname} lastname={file.owner.lastname}
                                    ownerId={file.owner.id} updated_at={file.updated_at} size={file.converted_size}
                                    id={id} setFiles={setFiles} sendImageSrc={sendImgSrc} toggle={toggleModalViewerState} sendInfoToDownload={sendInfoToDownload}/>,
      )
    })

    setFilesComponent(sortedComponents)
  }

  const searchName = () => {
    let data = dataContent
    let filesComponentSought = []

    data.forEach(file => {
      file.updated_at = file.updated_at.split(' ').shift()
    })

    const filteredFiles = data.filter(file => {
      let value = file.name.toString().toLowerCase()

      value = removeAccents(value)

      let desiredValue = searchValue.toString().toLowerCase()

      desiredValue = removeAccents(desiredValue)

      return value.includes(desiredValue)
    })

    if (filteredFiles.length === 0) {
      toast.error('Votre recherche n\'a donné aucun résultat !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } else {
      filteredFiles.forEach((file, id) => {
        filesComponentSought.push(
          <AdministrationFileRowTable key={id} openFolder={openFolder} name={file.name} path={path}
                                      type={file.type} firstname={file.owner.firstname} lastname={file.owner.lastname}
                                      ownerId={file.owner.id} updated_at={file.updated_at} size={file.converted_size}
                                      id={id} setFiles={setFiles} sendImageSrc={sendImgSrc} toggle={toggleModalViewerState} sendInfoToDownload={sendInfoToDownload}/>,
        )
      })
      setFilesComponent(filesComponentSought)
    }
  }

  const checkForm = () => {
    let isOk = searchValue.length > 0

    if (isOk) {
      searchName()
    } else {
      setSearchError(true)
    }
  }

  useEffect(() => {

    setFiles()

  }, [path])

  return (
    <div>
      {fileModalState && <AdministrationFileUploadModal isOpen={fileModalState} toggle={toggleModalState} setFiles={setFiles} path={path}/>}
      <AdministrationImgViewer isOpen={imgViewerState} toggle={toggleModalViewerState} imgSrc={imgSrc} />
      <AdministrationFileDownloadModal isOpen={fileDownloadState} toggle={toggleModalFileDownloadState} fileName={fileName} path={path}/>
      <AdministrationFileCreateFolderModal isOpen={createFolderModalState} toggle={toggleFolderModalState} path={path}
                                           setFiles={setFiles}/>
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
                    <FormGroup style={{marginBottom: 0}}>
                      <InputGroup>
                        <AnimatedLabel
                          pose={toggelLabel || searchValue.length > 0 ? 'up' : 'down'}>Rechercher</AnimatedLabel>
                        <SearchInput
                          onFocus={() => {
                            setToggleLabel(true)
                            setSearchError(false)
                          }}
                          onBlur={() =>  setToggleLabel(false)}
                          className={searchError ? 'is-invalid' : ''}
                          onChange={e => {
                            setSearchError(false)
                            setSearchValue(e.target.value)
                          }}
                        />
                        <InputGroupAddon addonType="append">
                          <Button color="info" onClick={checkForm}>
                            <FontAwesomeIcon icon={faSearch}/>
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormFeedback>{''}</FormFeedback>
                    </FormGroup>
                  </ColContainer>
                  <ColContainer md="3">
                    <UploadButton color="info" onClick={toggleModalState}><FontAwesomeIcon
                      icon={faUpload}/> Uploader</UploadButton>
                  </ColContainer>
                </Row>
              </Container>
            </SearchContainer>
            <Container>
              <Row>
                <MainFilesContainer md="12">
                  <FilesContainer>
                    <div>
                      <BreadCrumbContainer>
                        {breadcrumbItem ? breadcrumbItem : null}
                      </BreadCrumbContainer>
                    </div>
                    <ButtonsContainer>
                      <AddFolderButton onClick={toggleFolderModalState}><FontAwesomeIcon
                        icon={faFolderPlus}/></AddFolderButton>
                    </ButtonsContainer>
                  </FilesContainer>
                  <FileHeaderTableContainer className="user-container admin-dashboard">
                    <Container>
                      <Row>
                        <Col md="10">
                          <Container>
                            <Row>
                              <Text md="3"><TextHeader onClick={() => sortColumn('name')}><FontAwesomeIcon
                                icon={faSort}/> Nom</TextHeader></Text>
                              <Text md="2"><TextHeader onClick={() => sortColumn('type')}><FontAwesomeIcon
                                icon={faSort}/> Type</TextHeader></Text>
                              <Text md="3"><TextHeader onClick={() => sortColumn('owner')}><FontAwesomeIcon
                                icon={faSort}/> Propriétaire</TextHeader></Text>
                              <Text md="2"><TextHeader onClick={() => sortColumn('date')}><FontAwesomeIcon
                                icon={faSort}/> Date</TextHeader></Text>
                              <Text md="2"><TextHeader onClick={() => sortColumn('size')}><FontAwesomeIcon
                                icon={faSort}/> Taille</TextHeader></Text>
                            </Row>
                          </Container>
                        </Col>
                      </Row>
                    </Container>
                  </FileHeaderTableContainer>
                  <Loader display={loading ? 1 : 0}/>
                  {filesComponent && filesComponent.length > 0 ? filesComponent :
                    !loading && <NoFile>Il n'y a pas de fichier</NoFile>}
                </MainFilesContainer>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdministrationManageFilesPage