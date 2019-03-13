import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

const AdministrationLogModal = (props) => {

  const {isOpen, toggle, logs} = props

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className="user-modal">
        <ModalHeader toggle={toggle}>Logs</ModalHeader>
        <ModalBody>
          {logs}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AdministrationLogModal