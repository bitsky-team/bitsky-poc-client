import React from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap'
import styled from 'styled-components'

const ModalContainer = styled(Modal)`
  && .modal-content {
    background: none;
    border: none;
    color: #FFF;
  }
`

const Header = styled(ModalHeader)`
  border: none !important;
  color: #FFF !important;
  
  && span {
    color: rgb(238,117,117);
    text-shadow: none !important;
  }
`

const ImgContainer = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ImageFile = styled.img`
  object-fit: contain;
  max-height: 480px;
`

const ImgViewer = ({isOpen, toggle, imgSrc}) => {

  return (
    <div>
      <ModalContainer isOpen={isOpen} toggle={toggle} className="user-modal">
        <Header toggle={toggle}>Aperçu de l'image</Header>
        <ImgContainer>
          <ImageFile src={imgSrc} alt="Aperçu de l'image"/>
        </ImgContainer>
      </ModalContainer>
    </div>
  )
}

export default ImgViewer