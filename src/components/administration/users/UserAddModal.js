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
                                <Label for="userAddRank">Rang</Label>
                                <Input type="select" name="select" id="userAddRank">
                                    <option>Utilisateur</option>
                                    <option>Administrateur</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddPassword">Mot de passe</Label>
                                <Input type="password" name="userAddPassword" id="userAddPassword" placeholder="Mot de passe" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddPassword">Répétez le mot de passe</Label>
                                <Input type="password" name="userAddRepeatPassword" id="userAddRepeatPassword" placeholder="Répétez le mot de passe" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup row>
                        <Label for="userAddBiography" sm={2}>Biographie</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="userAddBiography" id="userAddBiography" />
                        </Col>
                    </FormGroup>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddSex">Sexe</Label>
                                <Input type="select" name="userAddSex" id="userAddSex">
                                    <option>Homme</option>
                                    <option>Femme</option>
                                    <option>Autre</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddJob">Emploi</Label>
                                <Input type="text" name="userAddJob" id="userAddJob" placeholder="Emploi" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddBirthdate">Date de naissance</Label>
                                <Input type="date" name="userAddBirthdate" id="userAddBirthdate" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddBirthplace">Ville d'origine</Label>
                                <Input type="text" name="userAddBirthplace" id="userAddBirthplace" placeholder="Ville d'origine" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row form>
                        <Col md={6}>
                            <FormGroup>
                                 <Label for="userAddRelationshipstatus">Situation amoureuse</Label>
                                <Input 
                                    type="select" 
                                    name="userAddRelationshipstatus" 
                                    id="userAddRelationshipstatus"
                                >
                                    <option>Célibataire</option>
                                    <option>En couple</option>
                                    <option>Marié(e)</option>
                                    <option>Veuf(ve)</option>
                                    <option>Non précisé</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="userAddLivingplace">Ville actuelle</Label>
                                <Input type="text" name="userAddLivingplace" id="userAddLivingplace" placeholder="Ville actuelle" />
                            </FormGroup>
                        </Col>
                    </Row>
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