import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { config } from '../../../config'
import axios from 'axios'
import qs from 'qs'

export default class UserDeleteModal extends Component {

    state = {
        error: false
    }

    deleteUser = async () => {
        const response = await axios.post(`${config.API_ROOT}/delete_user`, qs.stringify({ token: localStorage.getItem('token'), uniq_id: localStorage.getItem('id'), user_id: this.props.user.id}))
        const { success } = response.data

        if(success) {
            this.props.toggleUserDeleteModal(null, null, null)
            this.props.refreshUsers()
        }else {
            this.setState({ error: true })
            setTimeout(() => {
                this.setState({ error: false })
            }, 1500)
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.open} toggle={this.props.toggleUserDeleteModal} className="user-modal">
                <ModalHeader style={{background: 'white'}}>
                    Suppression d'un utilisateur
                </ModalHeader>
                <ModalBody style={{background: 'white'}}>
                    {!this.state.error ?
                        <div>
                            Êtes-vous sûr de vouloir supprimer {this.props.user ? this.props.user.firstname + ' ' + this.props.user.lastname : null} 
                        </div>    
                        : <Alert color='danger'>Impossible d'effectuer cette opération</Alert>
                    }
                </ModalBody>
                <ModalFooter style={{background: 'white'}}>
                    <Button className="modal-choice" color="primary" onClick={this.deleteUser}><FontAwesomeIcon icon={faCheck} /></Button>{' '}
                    <Button className="modal-choice" color="secondary" onClick={e => this.props.toggleUserDeleteModal(null, null, null)}><FontAwesomeIcon icon={faTimes} /></Button>
                </ModalFooter>
            </Modal>
        )
    }
}
