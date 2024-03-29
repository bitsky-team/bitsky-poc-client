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
import axios from 'axios'
import qs from 'qs'
import {toast} from 'react-toastify'
import {config} from '../../../config'

export const AdministrationLinksModal = props => {
  const [linkName, setLinkName] = useState('')
  const [bitskyKey, setBitskyKey] = useState('')

  const [linkNameError, setLinkNameError] = useState(false)
  const [bitskyKeyError, setBitskyKeyError] = useState(false)

  const {open, toggleLinkModal} = props

  const createLink = async (name, key, active) => {
    const response = await axios.post(
      `${config.API_ROOT}/create_link`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        bitsky_name: name,
        bitsky_key: key,
        link_state: active
      })
    )
  
    const {success, link, message: error} = response.data
  
    if (success) {
      console.log(link)
    } else {
      toast.error(`Impossible de créer la liaison ! (${error})`, {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const etablishLink = async () => {
    setLinkNameError(false)
    setBitskyKeyError(false)

    let isLinkCorrect = linkName && linkName.length >= 2
    let isKeyCorrect = bitskyKey && bitskyKey.length === 32
    let checkNotSameKey = bitskyKey !== props.senderKey

    if (isLinkCorrect && isKeyCorrect && checkNotSameKey) {
      const response = await axios.post(
        `https://bitsky.be/link`,
        qs.stringify({
          senderKey: props.senderKey,
          receiverKey: bitskyKey,
        })
      )

      const {success, data, message: error} = response.data

      if (success) {
        if (data.first_agreement && data.second_agreement) {
          createLink(linkName, bitskyKey, 1)
  
          await axios.post(
            `https://bitsky.be/activeLink`,
            qs.stringify({
              alreadyActivated: props.senderKey,
              toActivate: bitskyKey,
            })
          )
          
          props.displayLinks(props.value)
          
          toast.success('La liaison est établie !', {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'notification-success',
          })
        } else if (data.first_agreement && !data.second_agreement) {
          createLink(linkName, bitskyKey, 0)
          
          toast.success('La liaison est créée et en attente de validation !', {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'notification-success',
          })
        }
      } else {
        toast.error(`Impossible de créer la liaison ! (${error})`, {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }

      toggleLinkModal()
    } else {
      setLinkNameError(!isLinkCorrect)
      setBitskyKeyError(!isKeyCorrect)
      if (!checkNotSameKey) {
        toast.error(`Veuillez entrer une clé valide !`, {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    }
  }

  return (
    <Modal isOpen={open} toggle={toggleLinkModal} className="user-modal">
      <ModalHeader>
        Établir une liaison
      </ModalHeader>
      <ModalBody>
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
      <ModalFooter>
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
