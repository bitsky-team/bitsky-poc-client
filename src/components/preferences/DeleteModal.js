import React, {useState} from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Alert,
    Label,
    Input,
    FormFeedback,
    FormGroup,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import {config} from '../../config'
import axios from 'axios'
import qs from 'qs'
import jwtDecode from "jwt-decode";
import {toast} from "react-toastify";

const DeleteModal = ({open, toggleDeleteModal}) => {

    const [error, setError] = useState(false)
    const [session] = useState(jwtDecode(localStorage.getItem('token')))
    const [password, setPassword] = useState(null)
    const [passwordError, setPasswordError] = useState(false)

    const deleteAccount = async () => {
        setPasswordError(false)
        setError(false)

        let checkPasswordLength = password && password.length >= 8

        if(checkPasswordLength) {
            const userId = session.id
            const response = await axios.post(`${config.API_ROOT}/delete_by_user`, qs.stringify({
                token: localStorage.getItem('token'),
                uniq_id: localStorage.getItem('id'),
                user_id: userId,
                password,
            }))
            const {success, message} = response.data

            if (success) {
                window.location.href = '/login'
            } else {
                if(message === 'incorrectPassword') {
                    toast.error('Votre mot de passe est incorrect !', {
                        autoClose: 5000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                }else {
                    setError(true)
                    toast.error('Votre compte n\'a pas pu être supprimé !', {
                        autoClose: 5000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    })
                }
            }
        }else {
            setPasswordError(true)
            toast.error('Votre mot de passe est trop court !', {
                autoClose: 5000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
    }

    return (
        <Modal isOpen={open} toggle={toggleDeleteModal} className="user-modal">
            <ModalHeader>
                Suppression de mon compte
            </ModalHeader>
            <ModalBody>
                {!error ?
                    <div>
                        <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>

                        <p>
                            En supprimant votre compte, vous perdez l'accès à celui-ci et cela entraine la suppression de toutes les données vous concernant (publications, commentaires, fichiers, messages, etc).
                            Si ces données n'ont pas été sauvegardées ou enregistrées à un autre emplacement, elles seront perdues.
                        </p>
                        <FormGroup>
                            <Label for="create">Mot de passe</Label>
                            <Input
                              type="password"
                              name="password"
                              id="password"
                              className={passwordError ? 'is-invalid' : ''}
                              onChange={e => {
                                  setPasswordError(false)
                                  setPassword(e.target.value)
                              }}
                            />
                            <FormFeedback>Veuillez remplir correctement ce champ</FormFeedback>
                        </FormGroup>
                    </div>

                    : <Alert color='danger'>Impossible d'effectuer cette opération</Alert>
                }
            </ModalBody>
            <ModalFooter>
                <Button className="modal-choice" color="primary" onClick={deleteAccount}><FontAwesomeIcon
                    icon={faCheck}/></Button>{' '}
                <Button className="modal-choice" color="secondary"
                        onClick={toggleDeleteModal}><FontAwesomeIcon icon={faTimes}/></Button>
            </ModalFooter>
        </Modal>
    )
}

export default DeleteModal