import React, {useState} from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import {config} from '../../config'
import axios from 'axios'
import qs from 'qs'
import jwtDecode from "jwt-decode";
import {toast} from "react-toastify";

const DeleteModal = (props) => {

    const [error, setError] = useState(false)
    const [session] = useState(jwtDecode(localStorage.getItem('token')))

    const deleteAccount = async () => {
        const userId = session.id
        const response = await axios.post(`${config.API_ROOT}/delete_user`, qs.stringify({
            token: localStorage.getItem('token'),
            uniq_id: localStorage.getItem('id'),
            user_id: userId
        }))
        const {success} = response.data

        if (success) {
            window.location.href = '/login'
        } else {
            setError(true)
            toast.error('Votre compte n\'a pas pu être supprimé !', {
                autoClose: 5000,
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
    }

    return (
        <Modal isOpen={props.open} toggle={props.toggleDeleteModal} className="user-modal">
            <ModalHeader style={{background: 'white'}}>
                Suppression de mon compte
            </ModalHeader>
            <ModalBody style={{background: 'white'}}>
                {!error ?
                    <div>
                        <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>

                        <p>
                            En supprimant votre compte, vous perdez l'accès à celui-ci et cela entraine la suppression de toutes les données vous concernant (publications, commentaires, fichiers, messages, etc).
                            Si ces données n'ont pas été sauvegardées ou enregistrées à un autre emplacement, elles seront perdues.
                        </p>
                    </div>
                    : <Alert color='danger'>Impossible d'effectuer cette opération</Alert>
                }
            </ModalBody>
            <ModalFooter style={{background: 'white'}}>
                <Button className="modal-choice" color="primary" onClick={deleteAccount}><FontAwesomeIcon
                    icon={faCheck}/></Button>{' '}
                <Button className="modal-choice" color="secondary"
                        onClick={props.toggleDeleteModal}><FontAwesomeIcon icon={faTimes}/></Button>
            </ModalFooter>
        </Modal>
    )
}

export default DeleteModal