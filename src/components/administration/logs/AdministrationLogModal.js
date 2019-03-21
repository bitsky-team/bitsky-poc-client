import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

const AdministrationLogModal = ({isOpen, toggle, logs}) => {

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className="user-modal">
        <ModalHeader toggle={toggle}>Logs</ModalHeader>
        <ModalBody>
          {logs.length > 0 ? logs : 'Il n\'y a aucun log'}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AdministrationLogModal