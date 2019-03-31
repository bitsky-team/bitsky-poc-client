import React from 'react'
import {Col, Container, Row, UncontrolledPopover, PopoverBody} from 'reactstrap'
import {faEye, faTrashAlt, faEllipsisV, faDownload, faFolder} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

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

const TrashIconContainer = styled.div`
  padding-left: 5px;
  border-left: 1px solid #ebebeb;
`

const PopoverContainer = styled(UncontrolledPopover)`
  border: 1px solid rgba(20,20,20,0.1) !important;
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

const AdministrationFileRowTable = ({name, type, author, updated_at, size, id, openFolder}) => {

  const cursor = type => {
    switch (type) {
      case 'dossier':
        return 'pointer'
      default:
        return 'default'
    }
  }

  const FolderHover = styled(Col)`
    cursor: ${cursor(type)};
    transition: 0.3s ease-in-out !important;
    
    :hover {
      color: rgb(62, 58, 58);
    }
  `

  const deleteItem = type => {
    // TODO: deleteItem
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
                <Text md="2">{type}</Text>
                <Text md="3">{author}</Text>
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
                <IconContainer>
                  <IconHover><OptionsButton icon={faEye} id="eye"/></IconHover>
                </IconContainer>
              )}
              <IconContainer>
                <IconHover><OptionsButton icon={faDownload} id="download"/></IconHover>
              </IconContainer>
              <TrashIconContainer>
                <IconHover><TrashButton icon={faTrashAlt} id="trash" onClick={() => deleteItem(type, name)}/></IconHover>
              </TrashIconContainer>
            </PopoverContent>
          </PopoverContainer>
        </Row>
      </Container>
    </FileRow>
  )
}

export default AdministrationFileRowTable