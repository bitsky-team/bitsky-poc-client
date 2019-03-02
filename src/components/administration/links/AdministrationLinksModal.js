import React, {useState} from 'react'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {faHandshake} from '@fortawesome/free-regular-svg-icons/faHandshake'

export const AdministrationLinksModal = props => {
  const [linkName, setLinkName] = useState('')
  const [bitskyKey, setBitskyKey] = useState('')

  const [linkNameError, setLinkNameError] = useState(false)
  const [bitskyKeyError, setBitskyKeyError] = useState(false)

  const {open, toggleLinkModal} = props

  const etablishLink = () => {
    setLinkNameError(false)
    setBitskyKeyError(false)

    let isLinkCorrect = linkName && linkName.length >= 2
    let isKeyCorrect = bitskyKey && bitskyKey.length === 32

    if (isLinkCorrect && isKeyCorrect) {
      console.log('ok')
    } else {
      setLinkNameError(!isLinkCorrect)
      setBitskyKeyError(!isKeyCorrect)
    }
  }

  return (
    <Modal isOpen={open} toggle={toggleLinkModal} className="user-modal">
      <ModalHeader style={{background: 'white'}}>
        Établir une liaison
      </ModalHeader>
      <ModalBody style={{background: 'white'}}>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="linksName">Nom de la liaison</Label>
                <Input
                  type="text"
                  name="linksName"
                  id="linksName"
                  className={linkNameError ? 'is-invalid' : ''}
                  onChange={e => setLinkName(e.target.value)}
                  defaultValue={linkName || ''}
                />
                <FormFeedback>
                  Le nom de la liaison doit contenir au moins 2 caractères
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="bitskyToJoinKey">Clé du Bitsky à joindre</Label>
                <Input
                  type="text"
                  name="bitskyToJoinKey"
                  id="bitskyToJoinKey"
                  className={bitskyKeyError ? 'is-invalid' : ''}
                  onChange={e => setBitskyKey(e.target.value)}
                  defaultValue={bitskyKey || ''}
                />
                <FormFeedback>La clé du Bitsky est incorrecte</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter style={{background: 'white'}}>
        <Button className="modal-choice" color="primary" onClick={etablishLink}>
          <FontAwesomeIcon icon={faHandshake} />
        </Button>{' '}
        <Button
          className="modal-choice"
          color="secondary"
          onClick={toggleLinkModal}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </ModalFooter>
    </Modal>
  )
}
