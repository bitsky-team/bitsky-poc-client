import React from 'react'
import {Col, Container, Row, UncontrolledPopover, PopoverBody} from 'reactstrap'
import {faEye, faTrashAlt, faEllipsisV} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const EyeButton = styled(FontAwesomeIcon)`
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
  
  :hover #trash {
    color: rgb(204, 70, 70);
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

const EyeIconContainer = styled.div`
  padding-right: 5px;
  border-right: 1px solid #ebebeb;
`

const TrashIconContainer = styled.div`
  padding-left: 5px;
`

const PopoverContainer = styled(UncontrolledPopover)`
  border: 1px solid rgba(20,20,20,0.1) !important;
`

const AdministrationFileRowTable = ({title, type, author, date, size, id}) => {

  return (
    <FileRow className="user-container admin-dashboard">
      <Container>
        <Row>
          <Text md="2">{title}</Text>
          <Text md="2">{type}</Text>
          <Text md="2">{author}</Text>
          <Text md="2">{date}</Text>
          <Text md="2">{size}</Text>
          <Options md="2" id={`file${String(id)}`}>
            <OptionsHover>
              <FontAwesomeIcon icon={faEllipsisV}/>
            </OptionsHover>
          </Options>
          <PopoverContainer trigger="legacy" placement="top" target={`file${String(id)}`}>
            <PopoverContent>
              <EyeIconContainer>
                <IconHover><EyeButton icon={faEye} id="eye"/></IconHover>
              </EyeIconContainer>
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