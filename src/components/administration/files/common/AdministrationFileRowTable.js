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

const cursor = type => {
  switch (type) {
    case 'folder':
      return 'pointer'
    default:
      return 'default'
  }
}

const AdministrationFileRowTable = ({name, type, author, updated_at, size, id, openFolder, content}) => {

  const FolderCursor = styled.span`
    cursor: ${cursor(type)}
  `

  return (
    <FileRow className="user-container admin-dashboard">
      <Container>
        <Row>
          <Text md="2" onClick={() => openFolder(type, content)}>
            <FolderCursor>
              {type === 'folder' ? <FontAwesomeIcon icon={faFolder}/> : ''} {name}
            </FolderCursor>
          </Text>
          <Text md="2">{type}</Text>
          <Text md="2">{author}</Text>
          <Text md="2">{updated_at}</Text>
          <Text md="2">{size}</Text>
          <Options md="2">
            <OptionsHover id={`file${String(id)}`}>
              <FontAwesomeIcon icon={faEllipsisV}/>
            </OptionsHover>
          </Options>
          <PopoverContainer trigger="legacy" placement="top" target={`file${String(id)}`}>
            <PopoverContent>
              {type === 'folder' ? ' ' : (
                <IconContainer>
                  <IconHover><OptionsButton icon={faEye} id="eye"/></IconHover>
                </IconContainer>
              )}
              <IconContainer>
                <IconHover><OptionsButton icon={faDownload} id="download"/></IconHover>
              </IconContainer>
              <TrashIconContainer>
                <IconHover><TrashButton icon={faTrashAlt} id="trash"/></IconHover>
              </TrashIconContainer>
            </PopoverContent>
          </PopoverContainer>
        </Row>
      </Container>
    </FileRow>
  )
}

export default AdministrationFileRowTable