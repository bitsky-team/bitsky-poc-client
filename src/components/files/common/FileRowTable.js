import React, {Fragment} from 'react'
import {Col, Container, Row, UncontrolledPopover, PopoverBody} from 'reactstrap'
import {faEye, faTrashAlt, faEllipsisV, faDownload, faFolder} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'
import {toast} from 'react-toastify'
import {withRouter} from 'react-router'

const OptionsButton = styled(FontAwesomeIcon)`
  color: rgb(131, 178, 224);
`

const TrashButton = styled(FontAwesomeIcon)`
  color: rgb(238,117,117);
`

const Text = styled(Col)`
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const OwnerHover = styled.span`
  z-index: 3;
  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const IconHover = styled(Text)`
  cursor: pointer;
  
  :hover #eye {
    color: rgb(94, 145 , 195);
  }
  
  :hover #download {
      color: rgb(94, 145 , 195);
  }
  
  :hover #trash {
    color: rgb(204, 70, 70);
  }
`

const Options = styled(Text)`
  text-align: right;
`

const OptionsHover = styled.span`
  cursor: pointer;
  padding: 10px;
`

const PopoverContent = styled(PopoverBody)`
  display: flex;
  justify-content: center;
`

const IconContainer = styled.div`
  padding-right: 5px;
  border-right: 1px solid #ebebeb;
`

const PopoverContainer = styled(UncontrolledPopover)`
  border: 1px solid rgba(20,20,20,0.1) !important;
  
  && .popover {
    z-index: 1;
  }
`

const FileRow = styled.div`
  margin-top: 30px;
  
  && {
    padding-top: 15px !important;
    padding-bottom: 15px !important;
  }
  
  :hover {
    box-shadow: 0px 4px 34px -16px #222;
    border-left: 1px solid rgba(100, 100, 100, 0.3);
    border-right: 1px solid rgba(100, 100, 100, 0.3);
  }
`

const FileRowTable = ({name, type, firstname, lastname, ownerId, updated_at, size, id, openFolder, path, setFiles, history: {push}, sendImageSrc, toggle, sendInfoToDownload, chosenDevice}) => {

  const imageFormat = [
    'jpg',
    'jpeg',
    'png',
    'gif',
  ]

  const cursor = type => {
    switch (type) {
      case 'dossier':
        return 'pointer'
      default:
        return 'default'
    }
  }

  const TrashIconContainer = styled.div`
    padding-left: ${type === 'dossier' ? 'none' : '5px'};
    border-left: ${type === 'dossier' ? 'none' : '1px solid #ebebeb'};
  `

  const FolderHover = styled(Col)`
    z-index: 2;
    cursor: ${cursor(type)};
    transition: 0.3s ease-in-out !important;
    
    :hover {
      color: rgb(62, 58, 58);
    }
  `

  const deleteItem = async name => {
    const response = await axios.post(
      `${config.API_ROOT}/delete_item`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        path: path || null,
        name,
        device: chosenDevice,
      }),
    )
    const {success} = response.data

    if (success) {
      setFiles()
    } else {
      toast.error('L\'item n\'a pas pu être supprimé !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const getImageFile = async name => {
    const response = await axios.post(
      `${config.API_ROOT}/download_item`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        path: path || null,
        name,
        device: chosenDevice,
      }), {
        responseType: 'blob',
      },
    )
    if (response.data) {
      sendImageSrc(URL.createObjectURL(response.data))
      toggle()
    } else {
      toast.error('Le(s) fichier(s) n\'a/ont pas pu être téléchargé(s) !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  return (
    <FileRow className="user-container admin-dashboard">
      <Container>
        <Row>
          <FolderHover md="10" onClick={() => openFolder(type, name)}>
            <Container>
              <Row>
                <Text md="3">
                  {type === 'dossier' ? <FontAwesomeIcon icon={faFolder}/> : ''} {name}
                </Text>
                <Text md="2">{type ? type : 'fichier'}</Text>
                <Text md="3"><OwnerHover
                  onClick={() => push(`/profile/${ownerId}`)}>{firstname && lastname ? `${firstname} ${lastname}` : 'Inconnu'}</OwnerHover></Text>
                <Text md="2">{updated_at}</Text>
                <Text md="2">{size}</Text>
              </Row>
            </Container>
          </FolderHover>
          <Col md="2">
            <Container>
              <Row>
                <Options>
                  <OptionsHover id={`file${String(id)}`}>
                    <FontAwesomeIcon icon={faEllipsisV}/>
                  </OptionsHover>
                </Options>
              </Row>
            </Container>
          </Col>
          <PopoverContainer trigger="legacy" placement="top" target={`file${String(id)}`}>
            <PopoverContent>
              {type === 'dossier' ? ' ' : (
                <Fragment>
                  {imageFormat.includes(type) ? (
                    <IconContainer>
                      <IconHover><OptionsButton icon={faEye} id="eye" onClick={() => getImageFile(name)}/></IconHover>
                    </IconContainer>
                  ) : ''}
                  <IconContainer>
                    <IconHover><OptionsButton icon={faDownload} id="download"
                                              onClick={() => sendInfoToDownload(name)}/></IconHover>
                  </IconContainer>
                </Fragment>
              )}
              <TrashIconContainer>
                <IconHover><TrashButton icon={faTrashAlt} id="trash" onClick={() => deleteItem(name)}/></IconHover>
              </TrashIconContainer>
            </PopoverContent>
          </PopoverContainer>
        </Row>
      </Container>
    </FileRow>
  )
}

export default withRouter(FileRowTable)