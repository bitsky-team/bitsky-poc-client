import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

export default class UserAddModal extends Component {
  render() {
    return (
        <Modal isOpen={this.props.open} toggle={this.props.toggleUserAddModal}>
            <ModalBody>
            <Form>
                <FormGroup row>
                    <Label for="userAddEmail" sm={2}>Adresse email</Label>
                    <Col sm={10}>
                        <Input type="email" name="email" id="userAddEmail" placeholder="Adresse email" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="userAddPassword" sm={2}>Mot de passe</Label>
                    <Col sm={10}>
                        <Input type="password" name="password" id="userAddPassword" placeholder="Mot de passe" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="userAddRank" sm={2}>Rang</Label>
                    <Col sm={10}>
                        <Input type="select" name="select" id="userAddRank">
                            <option>Utilisateur</option>
                            <option>Administrateur</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleSelectMulti" sm={2}>Select Multiple</Label>
                    <Col sm={10}>
                        <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleText" sm={2}>Text Area</Label>
                    <Col sm={10}>
                        <Input type="textarea" name="text" id="exampleText" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="exampleFile" sm={2}>File</Label>
                    <Col sm={10}>
                        <Input type="file" name="file" id="exampleFile" />
                        <FormText color="muted">
                        This is some placeholder block-level help text for the above input.
                        It's a bit lighter and easily wraps to a new line.
                        </FormText>
                    </Col>
                </FormGroup>
                <FormGroup tag="fieldset" row>
                    <legend className="col-form-label col-sm-2">Radio Buttons</legend>
                    <Col sm={10}>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio2" />{' '}
                                Option one is this and that—be sure to include why it's great
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="radio2" />{' '}
                                Option two can be something else and selecting it will deselect option one
                            </Label>
                        </FormGroup>
                            <FormGroup check disabled>
                            <Label check>
                                <Input type="radio" name="radio2" disabled />{' '}
                                Option three is disabled
                            </Label>
                        </FormGroup>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="checkbox2" sm={2}>Checkbox</Label>
                    <Col sm={{ size: 10 }}>
                        <FormGroup check>
                        <Label check>
                            <Input type="checkbox" id="checkbox2" />{' '}
                            Check me out
                        </Label>
                        </FormGroup>
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Button>Submit</Button>
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