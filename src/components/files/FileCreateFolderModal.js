import React, {useState} from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback, Form,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faFolderPlus} from '@fortawesome/free-solid-svg-icons'
import {config} from '../../config'
import qs from 'qs'
import axios from 'axios'
import {toast} from 'react-toastify'

const FileCreateFolderModal = ({isOpen, toggle, path, setFiles}) => {

  const [createError, setCreateError] = useState(false)
  const [name, setName] = useState('')

  const createFolder = async () => {

    let isOk = name.length > 0

    if (isOk) {
      const response = await axios.post(
        `${config.API_ROOT}/create_folder`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          token: localStorage.getItem('token'),
          path: path || null,
          name,
        }),
      )
      const {success} = response.data
      if (success) {
        setFiles()
        toggle()
      } else {
        toast.error('Le dossier n\'a pas pu être créé !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } else {
      setCreateError(true)
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className="user-modal">
        <ModalHeader toggle={toggle}>Créer un dossier</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="create">Nom du dossier</Label>
                  <Input
                    type="text"
                    name="create"
                    id="create"
                    className={createError ? 'is-invalid' : ''}
                    onChange={e => {
                      setCreateError(false)
                      setName(e.target.value)
                    }}
                  />
                  <FormFeedback>Veuillez remplir correctement ce champ</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="modal-choice"
                  color="primary"
                  onClick={createFolder}>
            <FontAwesomeIcon icon={faFolderPlus}/>
          </Button>
          <Button className="modal-choice"
                  color="secondary" onClick={toggle}>
            <FontAwesomeIcon icon={faTimes}/></Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default FileCreateFolderModal