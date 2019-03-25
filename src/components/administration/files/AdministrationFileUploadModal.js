import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

const AdministrationLogModal = ({isOpen, toggle}) => {

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className="user-modal">
        <ModalHeader toggle={toggle}>Uploader</ModalHeader>
        <ModalBody>
          Test
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AdministrationLogModal