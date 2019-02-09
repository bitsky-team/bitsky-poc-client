import React, {Component} from 'react'
import {
  Alert,
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
import {faPencilAlt, faPlus, faTimes} from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-toastify'
import {config} from '../../../config'
import axios from 'axios'
import qs from 'qs'
import avatar_default from '../../../assets/img/avatar_default'

export default class UserManageModal extends Component {
  state = {
    lastname: null,
    lastnameError: false,

    firstname: null,
    firstnameError: false,

    email: null,
    emailError: false,

    ranks: [],
    rank: 'Utilisateur',
    rankError: false,

    password: null,
    passwordError: false,

    repeatPassword: null,
    repeatPasswordError: false,

    biography: null,
    biographyError: false,

    sex: 'Homme',
    sexError: false,

    job: null,
    jobError: false,

    birthdate: null,
    birthdateError: false,

    birthplace: null,
    birthplaceError: false,

    relationshipstatus: 'Célibataire',
    relationshipstatusError: false,

    livingplace: null,
    livingplaceError: false,
  }

  getRanks = async () => {
    const response = await axios.get(`${config.API_ROOT}/get_ranks`)
    const {success, ranks} = response.data
    if (success) {
      let stateRanks = this.state.ranks

      ranks.forEach(rank => {
        stateRanks.push(rank.name)
      })

      this.setState({ranks: stateRanks})
    }
  }

  checkRank = async () => {
    if(typeof this.state.rank === 'number') await this.getRanks()
    return this.state.ranks.includes(this.state.rank)
  }

  getRankNumber = () => {
    return this.state.ranks.findIndex(rank => rank === this.state.rank) + 1
  }

  checkSex = () => {
    return ['Homme', 'Femme', 'Autre'].includes(this.state.sex)
  }

  checkRelationshipstatus = () => {
    return [
      'Célibataire',
      'En couple',
      'Marié(e)',
      'Veuf(ve)',
      'Non précisé',
    ].includes(this.state.relationshipstatus)
  }

  checkForm = async () => {
    if (this.error) this.error.firstChild.style.display = 'none'
    this.setState({
      lastnameError: false,
      firstnameError: false,
      emailError: false,
      rankError: false,
      passwordError: false,
      repeatPasswordError: false,
      biographyError: false,
      sexError: false,
      jobError: false,
      birthdateError: false,
      birthplaceError: false,
      relationshipstatusError: false,
      livingplaceError: false,
    })

    let isLastnameOk = this.state.lastname && this.state.lastname.length >= 2,
      isFirstnameOk = this.state.firstname && this.state.firstname.length >= 2,
      isEmailOk =
        this.state.email &&
        this.state.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/),
      isRankOk = this.checkRank(),
      isPasswordOk = (this.state.password && this.state.password.length >= 8) || (this.props.type === 'UPDATE' && !this.state.password),
      isRepeatPasswordOk =
        (this.state.repeatPassword && this.state.repeatPassword.length >= 8) || (this.props.type === 'UPDATE' && !this.state.password),
      arePasswordsOk = (this.state.password === this.state.repeatPassword) || (this.props.type === 'UPDATE' && !this.state.password),
      isBiographyOk = this.state.biography && this.state.biography.length >= 10,
      isSexOk = this.checkSex(),
      isJobOk = this.state.job && this.state.job.length >= 3,
      isBirthdateOk =
        this.state.birthdate && this.state.birthdate.length === 10,
      isBirthplaceOk =
        this.state.birthplace && this.state.birthplace.length >= 3,
      isRelationshipstatusOk = this.checkRelationshipstatus(),
      isLivingplaceOk =
        this.state.livingplace && this.state.livingplace.length >= 3,
      isFormOk =
        isLastnameOk &&
        isFirstnameOk &&
        isEmailOk &&
        isRankOk &&
        isPasswordOk &&
        isRepeatPasswordOk &&
        arePasswordsOk &&
        isBiographyOk &&
        isSexOk &&
        isJobOk &&
        isBirthdateOk &&
        isBirthplaceOk &&
        isRelationshipstatusOk &&
        isLivingplaceOk

    if (isFormOk) {
      const response = await axios.post(
        `${config.API_ROOT}/create_user`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          token: localStorage.getItem('token'),
          id: this.props.user ? this.props.user.id : null,
          lastname: this.state.lastname,
          firstname: this.state.firstname,
          email: this.state.email,
          password: this.state.password,
          repeatPassword: this.state.repeatPassword,
          rank: (typeof this.state.rank !== 'number') ? this.getRankNumber() : this.state.rank,
          biography: this.state.biography,
          sex: this.state.sex,
          job: this.state.job,
          birthdate: this.state.birthdate,
          birthplace: this.state.birthplace,
          relationshipstatus: this.state.relationshipstatus,
          livingplace: this.state.livingplace,
          avatar: avatar_default,
          type: this.props.type
        })
      )

      const {success} = response.data

      if (success) {
        toast.success(
          `L'utilisateur ${this.state.firstname} ${
            this.state.lastname
          } a bien été ${this.props.type === 'ADD' ? 'ajouté' : 'modifié'} !`,
          {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'notification-success',
          }
        )

        this.props.refreshUsers()
        this.props.toggleUserManageModal()
      } else {
        if (this.error) {
          this.error.firstChild.innerHTML = response.data.message
          this.error.firstChild.style.display = 'block'
        }
      }
    } else {
      this.setState({
        lastnameError: !isLastnameOk,
        firstnameError: !isFirstnameOk,
        emailError: !isEmailOk,
        rankError: !isRankOk,
        passwordError: !isPasswordOk || !arePasswordsOk,
        repeatPasswordError: !isRepeatPasswordOk || !arePasswordsOk,
        biographyError: !isBiographyOk,
        sexError: !isSexOk,
        jobError: !isJobOk,
        birthdateError: !isBirthdateOk,
        birthplaceError: !isBirthplaceOk,
        relationshipstatusError: !isRelationshipstatusOk,
        livingplaceError: !isLivingplaceOk,
      })
    }
  }

  resetUser = () => {
    this.setState({
      lastname: null,
      lastnameError: false,

      firstname: null,
      firstnameError: false,

      email: null,
      emailError: false,

      rank: 'Utilisateur',
      rankError: false,

      password: null,
      passwordError: false,

      repeatPassword: null,
      repeatPasswordError: false,

      biography: null,
      biographyError: false,

      sex: 'Homme',
      sexError: false,

      job: null,
      jobError: false,

      birthdate: null,
      birthdateError: false,

      birthplace: null,
      birthplaceError: false,

      relationshipstatus: 'Célibataire',
      relationshipstatusError: false,

      livingplace: null,
      livingplaceError: false,
    })
  }

  setUser = () => {
    const {user} = this.props

    if (user) {
      user.birthdate = user.birthdate.replace(' 00:00:00', '')
      this.setState({...user})
    }
  }

  getBirthdate = () => {
    if (this.state.birthdate) {
      return this.state.birthdate.replace(' 00:00:00', '')
    }
  }

  componentWillMount = () => {
    this.getRanks()
  }

  render() {
    return (
      <Modal
        isOpen={this.props.open}
        toggle={this.props.toggleUserManageModal}
        className="user-modal"
      >
        <ModalHeader style={{background: 'white'}}>
          {this.props.type === 'ADD' ? 'Ajouter' : 'Modifier'} un utilisateur
        </ModalHeader>
        <ModalBody style={{background: 'white'}}>
          <div ref={node => (this.error = node)}>
            <Alert color="danger" style={{display: 'none'}} />
          </div>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddLastname">Nom</Label>
                  <Input
                    type="text"
                    name="userAddLastname"
                    id="userAddLastname"
                    placeholder="Nom"
                    className={this.state.lastnameError ? 'is-invalid' : ''}
                    onChange={e => this.setState({lastname: e.target.value})}
                    defaultValue={this.state.lastname || ''}
                  />
                  <FormFeedback>
                    Le nom doit contenir au moins 2 caractères
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddFirstname">Prénom</Label>
                  <Input
                    type="text"
                    name="userAddFirstname"
                    id="userAddFirstname"
                    placeholder="Prénom"
                    className={this.state.firstnameError ? 'is-invalid' : ''}
                    onChange={e => this.setState({firstname: e.target.value})}
                    defaultValue={this.state.firstname || ''}
                  />
                  <FormFeedback>
                    Le prénom doit contenir au moins 2 caractères
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddEmail">Adresse email</Label>
                  <Input
                    type="email"
                    name="userAddEmail"
                    id="userAddEmail"
                    placeholder="Adresse email"
                    className={this.state.emailError ? 'is-invalid' : ''}
                    onChange={e => this.setState({email: e.target.value})}
                    defaultValue={this.state.email || ''}
                  />
                  <FormFeedback>L'adresse email est incorrecte</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddRank">Rang</Label>
                  <Input
                    ref={node => (this.rankSelect = node)}
                    type="select"
                    name="select"
                    id="userAddRank"
                    className={this.state.rankError ? 'is-invalid' : ''}
                    onChange={e => {
                      this.setState({rank: e.target.value})
                    }}
                  >
                    <option selected={this.state.rank === 1}>
                      Utilisateur
                    </option>
                    <option selected={this.state.rank === 2}>
                      Administrateur
                    </option>
                  </Input>
                  <FormFeedback>Le rang est incorrect</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddPassword">Mot de passe</Label>
                  <Input
                    type="password"
                    name="userAddPassword"
                    id="userAddPassword"
                    placeholder="Mot de passe"
                    className={this.state.passwordError ? 'is-invalid' : ''}
                    onChange={e => this.setState({password: e.target.value})}
                  />
                  <FormFeedback>
                    Le mot de passe est trop court ou ne correspond pas
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddPassword">Répétez le mot de passe</Label>
                  <Input
                    type="password"
                    name="userAddRepeatPassword"
                    id="userAddRepeatPassword"
                    placeholder="Répétez le mot de passe"
                    className={
                      this.state.repeatPasswordError ? 'is-invalid' : ''
                    }
                    onChange={e =>
                      this.setState({repeatPassword: e.target.value})
                    }
                  />
                  <FormFeedback>
                    Le mot de passe est trop court ou ne correspond pas
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup row>
              <Label for="userAddBiography" sm={2}>
                Biographie
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  name="userAddBiography"
                  id="userAddBiography"
                  className={this.state.biographyError ? 'is-invalid' : ''}
                  onChange={e => this.setState({biography: e.target.value})}
                  value={this.state.biography || ''}
                />
                <FormFeedback>
                  La biographie doit contenir au moins 10 caractères
                </FormFeedback>
              </Col>
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddSex">Genre</Label>
                  <Input
                    type="select"
                    name="userAddSex"
                    id="userAddSex"
                    className={this.state.sexError ? 'is-invalid' : ''}
                    onChange={e => this.setState({sex: e.target.value})}
                  >
                    <option selected={this.state.sex === 'Homme'}>Homme</option>
                    <option selected={this.state.sex === 'Femme'}>Femme</option>
                    <option selected={this.state.sex === 'Autre'}>Autre</option>
                  </Input>
                  <FormFeedback>Le genre est invalide</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddJob">Emploi</Label>
                  <Input
                    type="text"
                    name="userAddJob"
                    id="userAddJob"
                    placeholder="Emploi"
                    className={this.state.jobError ? 'is-invalid' : ''}
                    onChange={e => this.setState({job: e.target.value})}
                    defaultValue={this.state.job || ''}
                  />
                  <FormFeedback>
                    L'emploi doit contenir au moins 3 caractères
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddBirthdate">Date de naissance</Label>
                  <Input
                    type="date"
                    name="userAddBirthdate"
                    id="userAddBirthdate"
                    className={this.state.birthdateError ? 'is-invalid' : ''}
                    onChange={e => this.setState({birthdate: e.target.value})}
                    defaultValue={this.getBirthdate() || ''}
                  />
                  <FormFeedback>
                    La date de naissance est incorrecte
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddBirthplace">Ville d'origine</Label>
                  <Input
                    type="text"
                    name="userAddBirthplace"
                    id="userAddBirthplace"
                    placeholder="Ville d'origine"
                    className={this.state.birthplaceError ? 'is-invalid' : ''}
                    onChange={e => this.setState({birthplace: e.target.value})}
                    defaultValue={this.state.birthplace || ''}
                  />
                  <FormFeedback>
                    La ville d'origine doit contenir au moins 3 caractères
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddRelationshipstatus">
                    Situation amoureuse
                  </Label>
                  <Input
                    type="select"
                    name="userAddRelationshipstatus"
                    id="userAddRelationshipstatus"
                    className={
                      this.state.relationshipstatusError ? 'is-invalid' : ''
                    }
                    onChange={e =>
                      this.setState({relationshipstatus: e.target.value})
                    }
                  >
                    <option
                      selected={this.state.relationshipstatus === 'Célibataire'}
                    >
                      Célibataire
                    </option>
                    <option
                      selected={this.state.relationshipstatus === 'En couple'}
                    >
                      En couple
                    </option>
                    <option
                      selected={this.state.relationshipstatus === 'Marié(e)'}
                    >
                      Marié(e)
                    </option>
                    <option
                      selected={this.state.relationshipstatus === 'Veuf(ve)'}
                    >
                      Veuf(ve)
                    </option>
                    <option
                      selected={this.state.relationshipstatus === 'Non précisé'}
                    >
                      Non précisé
                    </option>
                  </Input>
                  <FormFeedback>
                    La situation amoureuse est incorrecte
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userAddLivingplace">Ville actuelle</Label>
                  <Input
                    type="text"
                    name="userAddLivingplace"
                    id="userAddLivingplace"
                    placeholder="Ville actuelle"
                    className={this.state.livingplaceError ? 'is-invalid' : ''}
                    onChange={e => this.setState({livingplace: e.target.value})}
                    defaultValue={this.state.livingplace || ''}
                  />
                  <FormFeedback>
                    La ville actuelle doit contenir au moins 3 caractères
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter style={{background: 'white'}}>
          <Button
            className="modal-choice"
            color="primary"
            onClick={this.checkForm}
          >
            {this.state.type === 'ADD' ? (
              <FontAwesomeIcon icon={faPlus} />
            ) : (
              <FontAwesomeIcon icon={faPencilAlt} />
            )}
          </Button>{' '}
          <Button
            className="modal-choice"
            color="secondary"
            onClick={this.props.toggleUserManageModal}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}
