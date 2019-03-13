import React, {Component} from 'react'
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
  FormGroup,
  Label,
  FormFeedback,
  Modal,
  Form,
  Input,
  Button,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faTimes} from '@fortawesome/free-solid-svg-icons'
import removeAccents from 'remove-accents'
import {toast} from 'react-toastify'

export default class UserSearchModal extends Component {
  state = {
    search: null,
    searchError: false,
    type: 'id',
    typeError: false,
  }

  checkType = () => {
    const types = [
      'id',
      'uniq_id',
      'email',
      'lastname',
      'firstname',
      'rank',
      'firsttime',
      'sex',
      'birthdate',
      'relationshipstatus',
      'job',
      'birthplace',
      'livingplace',
    ]

    return types.includes(this.state.type)
  }

  checkForm = () => {
    this.setState(
      {
        searchError: this.state.search === null,
        typeError: !this.checkType(),
      },
      () => {
        if (!this.state.searchError && !this.state.typeError) {
          this.search()
        }
      }
    )
  }

  search = () => {
    let filteredUsers = this.props.users

    filteredUsers = filteredUsers.filter(user => {
      let value = user.props[this.state.type].toString().toLowerCase()

      value = removeAccents(value)

      let desiredValue = this.state.search.toString().toLowerCase()

      desiredValue = removeAccents(desiredValue)

      return value === desiredValue
    })

    if(filteredUsers.length === 0) {
      toast.error('Votre recherche n\'a donné aucun résultat !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }

    this.props.setFilteredUsers(filteredUsers)
    this.props.toggle()
  }

  render = () => {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className="user-modal">
        <ModalHeader>
          Rechercher un utilisateur
        </ModalHeader>

        <ModalBody>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="search">Recherche</Label>
                  <Input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Recherche"
                    className={this.state.searchError ? 'is-invalid' : ''}
                    onChange={e => {
                      this.setState({
                        searchError: false,
                        search: e.target.value,
                      })
                    }}
                    defaultValue={this.state.search || ''}
                  />
                  <FormFeedback>Veuillez remplir ce champ</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="type">Type</Label>
                  <Input
                    type="select"
                    name="type"
                    id="type"
                    placeholder="Type"
                    className={this.state.typeError ? 'is-invalid' : ''}
                    onChange={e => {
                      this.setState({
                        typeError: false,
                        type: e.target.value,
                      })
                    }}
                  >
                    <option selected={this.state.type === 'id'} value="id">
                      ID
                    </option>
                    <option
                      selected={this.state.type === 'uniq_id'}
                      value="uniq_id"
                    >
                      Uniq ID
                    </option>
                    <option
                      selected={this.state.type === 'email'}
                      value="email"
                    >
                      Adresse e-mail
                    </option>
                    <option
                      selected={this.state.type === 'lastname'}
                      value="lastname"
                    >
                      Nom
                    </option>
                    <option
                      selected={this.state.type === 'firstname'}
                      value="firstname"
                    >
                      Prénom
                    </option>
                    <option selected={this.state.type === 'rank'} value="rank">
                      Rang
                    </option>
                    <option
                      selected={this.state.type === 'firsttime'}
                      value="firsttime"
                    >
                      Première connexion
                    </option>
                    <option selected={this.state.type === 'sex'} value="sex">
                      Genre
                    </option>
                    <option
                      selected={this.state.type === 'birthdate'}
                      value="birthdate"
                    >
                      Date de naissance
                    </option>
                    <option
                      selected={this.state.type === 'relationshipstatus'}
                      value="relationshipstatus"
                    >
                      Situation amoureuse
                    </option>
                    <option selected={this.state.type === 'job'} value="job">
                      Travail
                    </option>
                    <option
                      selected={this.state.type === 'birthplace'}
                      value="birthplace"
                    >
                      Lieu de naissance
                    </option>
                    <option
                      selected={this.state.type === 'livingplace'}
                      value="livingplace"
                    >
                      Ville actuelle
                    </option>
                  </Input>
                  <FormFeedback>
                    Veuillez choisir l'une des valeurs proposées
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button
            className="modal-choice"
            color="primary"
            onClick={this.checkForm}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button
            className="modal-choice"
            color="secondary"
            onClick={this.props.toggle}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}
