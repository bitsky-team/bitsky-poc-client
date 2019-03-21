import React from 'react'
import {Card, CardBody, CardImg, CardSubtitle, CardText, Col, Row} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFilePdf, faImage, faFile} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

const ImgFileViewer = styled(CardImg)`
  border-radius: 5px 5px 0px 0px !important;
  height: 100% !important;
  width: 100% !important;
  margin-bottom: 0px !important;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
`
const FileViewer = styled(Card)`
  border-radius: 5px !important;
  border-top: none !important;
  -webkit-box-shadow: 5.5px 8.5px 60px -26px rgba(0,0,0,0.75);
  -moz-box-shadow: 5.5px 8.5px 60px -26px rgba(0,0,0,0.75);
  box-shadow: 5.5px 8.5px 60px -26px rgba(0,0,0,0.75);
  height: 190px !important;
  cursor: pointer;
  
  &&&:hover #overlay {
   opacity: 1;
  }
`

const ContainerOverlay = styled.div`
  position: relative;
  height: 100%;  
`

const Overlay = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 5px 5px 0px 0px;
  color: #FFF;
  opacity: 0;
  transition: 0.2s ease-in-out;
  padding: 10px;
`

const FileTitle = styled(CardBody)`
  border-top: 1px solid rgba(0,0,0,.125);
`

const FileSize = styled.small`
  position: absolute;
  right: 10px;
  bottom: 10px;
`

const AdministrationFileViewer = ({type, src, size, title, author, date}) => {

  const switchType = (type) => {
    switch (type) {
      case 'png':
        return '#83B2E0'
      case 'pdf':
        return '#EF4136'
      default:
        return '#616161'
    }
  }

  const switchIcon = (type) => {
    switch (type) {
      case 'png':
        return faImage
      case 'pdf':
        return faFilePdf
      default:
        return faFile
    }
  }

  const Icon = styled(FontAwesomeIcon)`
    color: ${switchType(type)}
  `

  return (
    <Col md="4">
      <FileViewer>
        <ContainerOverlay>
          <ImgFileViewer top width="100%"
                         src={src}
                         alt="Card image cap"/>
          <Overlay id="overlay">
            <CardText>
              <small>Uploadé par {author} le {date}</small>
              <FileSize>{size}</FileSize>
            </CardText>
          </Overlay>
        </ContainerOverlay>
        <FileTitle>
          <CardSubtitle><Icon icon={switchIcon(type)}/> {title}</CardSubtitle>
        </FileTitle>
      </FileViewer>
    </Col>
  )
}

export default AdministrationFileViewer