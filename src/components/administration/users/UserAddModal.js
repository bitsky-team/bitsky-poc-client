import React, { Component } from 'react'
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class UserAddModal extends Component {

  render() {
    return (
        <Modal isOpen={this.props.open} toggle={this.props.toggleUserAddModal} className="user-add-modal">
            <ModalHeader>
                <h2>Ajouter un utilisateur</h2>
            </ModalHeader>
            <ModalBody>
                <Form>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddLastname">Nom</Label>
                                <Input type="text" name="userAddLastname" id="userAddLastname" placeholder="Nom" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddFirstname">Prénom</Label>
                                <Input type="text" name="userAddFirstname" id="userAddFirstname" placeholder="Prénom" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddEmail">Adresse email</Label>
                                <Input type="email" name="userAddEmail" id="userAddEmail" placeholder="Adresse email" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddPassword">Mot de passe</Label>
                                <Input type="password" name="userAddPassword" id="userAddPassword" placeholder="Mot de passe" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup row>
                        <Label for="userAddRank" sm={2}>Rang</Label>
                        <Col sm={3}>
                            <Input type="select" name="select" id="userAddRank">
                                <option>Utilisateur</option>
                                <option>Administrateur</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="userAddBiography" sm={2}>Biographie</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="userAddBiography" id="userAddBiography" />
                        </Col>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button className="modal-choice" color="primary" onClick={(e) => console.log('ok')}><FontAwesomeIcon icon={ faPlus } /></Button>{' '}
                <Button className="modal-choice" color="secondary" onClick={this.props.toggleUserAddModal}><FontAwesomeIcon icon={ faTimes }/></Button>
            </ModalFooter>
        </Modal>
    )
  }
  
}