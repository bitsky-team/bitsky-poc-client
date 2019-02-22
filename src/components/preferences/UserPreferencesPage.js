import React, {Fragment, Component} from 'react'
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Form,
  Alert,
  Button,
} from 'reactstrap'
import Navbar from '../common/template/Navbar'
import UserPreferencesSideMenu from './common/UserPreferencesSideMenu'
import styled from 'styled-components'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {config} from '../../config'
import qs from 'qs'
import {toast} from 'react-toastify'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencilAlt} from '@fortawesome/free-solid-svg-icons'
import AuthService from '../../services/AuthService'
import {withRouter} from 'react-router'

const UserUpdateContainer = styled.div`
  &&& {
    text-align: left;
  }
`

const LoaderContainer = styled(Container)`
  display: flex;
  justify-content: center;
  width: 50vw !important;
  * {
    flex: 1;
  }
`

const UpdateButton = styled(Button)`
  margin: 0px 15px;
`

class UserPreferencesPage extends Component {
  state = {
    session: jwtDecode(localStorage.getItem('token')),
    user: null,
    ranks: [],
    lastname: null,
    lastnameError: false,
    firstname: null,
    firstnameError: false,
    email: null,
    emailError: false,
    rank: 'Utilisateur',
    rankError: false,
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

  getBirthdate = () => {
    if (this.state.birthdate) {
      return this.state.birthdate.replace(' 00:00:00', '')
    }
  }

  getUser = () => {
    const userId = this.state.session.id

    return axios.post(
      `${config.API_ROOT}/get_user`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
        user_id: userId,
      })
    )
  }

  prepareUser = () => {
    this.getUser().then(response => {
      const {success, user} = response.data

      if (success) {
        this.setState({
          user,
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email,
          rank: user.rank,
          biography: user.biography,
          sex: user.sex,
          job: user.job,
          birthdate: user.birthdate,
          birthplace: user.birthplace,
          relationshipstatus: user.relationshipstatus,
          livingplace: user.livingplace,
        })
      } else {
        toast.error('Erreur lors du chargement des informations du profil', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }

  getRanks = async () => {
    const response = await axios.get(`${config.API_ROOT}/get_ranks`)
    const {success, ranks} = response.data
    if (success) {
      let stateRanks = ranks

      ranks.forEach(rank => {
        stateRanks.push(rank.name)
      })

      this.setState({ranks: stateRanks})
    }
  }

  getRankNumber = () => {
    return (
      this.state.ranks.findIndex(actualRank => actualRank === this.state.rank) +
      1
    )
  }

  checkRank = async () => {
    if (typeof this.state.rank === 'number') await this.getRanks()
    return this.state.ranks.includes(this.state.rank)
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

  checkForm = () => {
    this.setState({
      lastnameError: false,
      firstnameError: false,
      emailError: false,
      rankError: false,
      biographyError: false,
      sexError: false,
      jobError: false,
      birthdateError: false,
      birthplaceError: false,
      relationshipstatusERror: false,
      livingplaceError: false,
    })

    let isLastnameOk = this.state.lastname && this.state.lastname.length >= 2,
      isFirstnameOk = this.state.firstname && this.state.firstname.length >= 2,
      isEmailOk =
        this.state.email &&
        this.state.email.match(
          /^[a-zA-Z]\w+(?:\.[a-zA-Z]\w+){0,3}@[a-zA-Z]\w+(?:\.[a-zA-Z]\w+){1,3}$/
        ),
      isRankOk = this.checkRank(),
      isBiographyOk = this.state.biography && this.state.biography.length >= 10,
      isSexOk = this.checkSex(),
      isJobOk = this.state.job && this.state.job.length >= 3,
      isBirthdateFilled =
        this.state.birthdate && this.state.birthdate.length === 10,
      splittedBirthdate = this.state.birthdate.split('-'),
      isBirthdateCorrect =
        Number(splittedBirthdate[0]) > 1899 &&
        Number(splittedBirthdate[0]) <= new Date().getFullYear() &&
        Number(splittedBirthdate[1]) > 0 &&
        Number(splittedBirthdate[1]) <= 12 &&
        Number(splittedBirthdate[2]) > 0 &&
        Number(splittedBirthdate[2]) <= 31,
      isBirthdateOk = isBirthdateFilled && isBirthdateCorrect,
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
        isBiographyOk &&
        isSexOk &&
        isJobOk &&
        isBirthdateOk &&
        isBirthplaceOk &&
        isRelationshipstatusOk &&
        isLivingplaceOk

    if (isFormOk) {
      this.updateUser()
    }
  }

  updateUser = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/create_user`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        user_id: this.state.user.id ? this.state.user.id : null,
        lastname: this.state.lastname,
        firstname: this.state.firstname,
        email: this.state.email,
        rank:
          typeof this.state.rank !== 'number'
            ? this.getRankNumber()
            : this.state.rank,
        biography: this.state.biography,
        sex: this.state.sex,
        job: this.state.job,
        birthdate: this.state.birthdate,
        birthplace: this.state.birthplace,
        relationshipstatus: this.state.relationshipstatus,
        livingplace: this.state.livingplace,
        type: 'UPDATE',
        password: null,
        repeatPassword: null,
        avatar: this.state.user.avatar,
      })
    )

    if (response.data.success) {
      AuthService.clearStorage()
      window.location.href = '/login'
    } else {
      toast.error('Impossible de modifier vos informations !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  componentDidMount() {
    this.prepareUser()
  }

  render() {
    if (!this.state.user) {
      return (
        <Fragment>
          <Navbar />
          <LoaderContainer className="main-container">
            <Alert
              color="info"
              className="info-message"
              style={{display: 'block', height: 'fit-content'}}
            >
              Chargement...
            </Alert>
          </LoaderContainer>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <Navbar />
        <Container>
          <Row>
            <Col>
              <Container className="main-container">
                <Row>
                  <Col md="3" className="no-margin-left no-margin-right">
                    <UserPreferencesSideMenu />
                  </Col>
                  <Col md="9" className="no-margin-left no-margin-right">
                    <Container>
                      <Row>
                        <Col>
                          <UserUpdateContainer className="user-container margin-top-10">
                            <h4 style={{marginBottom: '15px'}}>
                              Modifier vos informations
                            </h4>
                            <Form>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateLastname">Nom</Label>
                                    <Input
                                      type="text"
                                      name="userUpdateLastname"
                                      id="userUpdateLastname"
                                      className={
                                        this.state.lastnameError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({
                                          lastname: e.target.value,
                                        })
                                      }
                                      defaultValue={this.state.lastname || ''}
                                    />
                                    <FormFeedback>
                                      Le nom doit contenir au moins 2 caractères
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateFirstname">
                                      Prénom
                                    </Label>
                                    <Input
                                      type="text"
                                      name="userUpdateFirstname"
                                      id="userUpdateFirstname"
                                      className={
                                        this.state.firstnameError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({
                                          firstname: e.target.value,
                                        })
                                      }
                                      defaultValue={this.state.firstname || ''}
                                    />
                                    <FormFeedback>
                                      Le prénom doit contenir au moins 2
                                      caractères
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateEmail">
                                      Adresse email
                                    </Label>
                                    <Input
                                      type="email"
                                      name="userUpdateEmail"
                                      id="userUpdateEmail"
                                      className={
                                        this.state.emailError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({email: e.target.value})
                                      }
                                      defaultValue={this.state.email || ''}
                                    />
                                    <FormFeedback>
                                      L'adresse email est incorrecte
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateRank">Rang</Label>
                                    <Input
                                      type="select"
                                      name="select"
                                      id="userUpdateRank"
                                      className={
                                        this.state.rankError ? 'is-invalid' : ''
                                      }
                                      onChange={e => {
                                        this.setState({rank: e.target.value})
                                      }}
                                      disabled
                                    >
                                      <option selected={this.state.rank === 1}>
                                        Utilisateur
                                      </option>
                                      <option selected={this.state.rank === 2}>
                                        Administrateur
                                      </option>
                                    </Input>
                                    <FormFeedback>
                                      Le rang est incorrect
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <FormGroup row>
                                <Label for="userUpdateBiography" sm={2}>
                                  Biographie
                                </Label>
                                <Col sm={10}>
                                  <Input
                                    type="textarea"
                                    name="userUpdateBiography"
                                    id="userUpdateBiography"
                                    className={
                                      this.state.biographyError
                                        ? 'is-invalid'
                                        : ''
                                    }
                                    onChange={e =>
                                      this.setState({biography: e.target.value})
                                    }
                                    value={this.state.biography || ''}
                                  />
                                  <FormFeedback>
                                    La biographie doit contenir au moins 10
                                    caractères
                                  </FormFeedback>
                                </Col>
                              </FormGroup>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateSex">Genre</Label>
                                    <Input
                                      type="select"
                                      name="userUpdateSex"
                                      id="userUpdateSex"
                                      className={
                                        this.state.sexError ? 'is-invalid' : ''
                                      }
                                      onChange={e =>
                                        this.setState({sex: e.target.value})
                                      }
                                    >
                                      <option
                                        selected={this.state.sex === 'Homme'}
                                      >
                                        Homme
                                      </option>
                                      <option
                                        selected={this.state.sex === 'Femme'}
                                      >
                                        Femme
                                      </option>
                                      <option
                                        selected={this.state.sex === 'Autre'}
                                      >
                                        Autre
                                      </option>
                                    </Input>
                                    <FormFeedback>
                                      Le genre est invalide
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateJob">Emploi</Label>
                                    <Input
                                      type="text"
                                      name="userUpdateJob"
                                      id="userUpdateJob"
                                      className={
                                        this.state.jobError ? 'is-invalid' : ''
                                      }
                                      onChange={e =>
                                        this.setState({job: e.target.value})
                                      }
                                      defaultValue={this.state.job || ''}
                                    />
                                    <FormFeedback>
                                      L'emploi doit contenir au moins 3
                                      caractères
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateBirthdate">
                                      Date de naissance
                                    </Label>
                                    <Input
                                      type="date"
                                      name="userUpdateBirthdate"
                                      id="userUpdateBirthdate"
                                      className={
                                        this.state.birthdateError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({
                                          birthdate: e.target.value,
                                        })
                                      }
                                      defaultValue={this.getBirthdate() || ''}
                                    />
                                    <FormFeedback>
                                      La date de naissance est incorrecte
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateBirthplace">
                                      Ville d'origine
                                    </Label>
                                    <Input
                                      type="text"
                                      name="userUpdateBirthplace"
                                      id="userUpdateBirthplace"
                                      className={
                                        this.state.birthplaceError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({
                                          birthplace: e.target.value,
                                        })
                                      }
                                      defaultValue={this.state.birthplace || ''}
                                    />
                                    <FormFeedback>
                                      La ville d'origine doit contenir au moins
                                      3 caractères
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label for="userUpdateRelationshipstatus">
                                      Situation amoureuse
                                    </Label>
                                    <Input
                                      type="select"
                                      name="userUpdateRelationshipstatus"
                                      id="userUpdateRelationshipstatus"
                                      className={
                                        this.state.relationshipstatusError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({
                                          relationshipstatus: e.target.value,
                                        })
                                      }
                                    >
                                      <option
                                        selected={
                                          this.state.relationshipstatus ===
                                          'Célibataire'
                                        }
                                      >
                                        Célibataire
                                      </option>
                                      <option
                                        selected={
                                          this.state.relationshipstatus ===
                                          'En couple'
                                        }
                                      >
                                        En couple
                                      </option>
                                      <option
                                        selected={
                                          this.state.relationshipstatus ===
                                          'Marié(e)'
                                        }
                                      >
                                        Marié(e)
                                      </option>
                                      <option
                                        selected={
                                          this.state.relationshipstatus ===
                                          'Veuf(ve)'
                                        }
                                      >
                                        Veuf(ve)
                                      </option>
                                      <option
                                        selected={
                                          this.state.relationshipstatus ===
                                          'Non précisé'
                                        }
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
                                    <Label for="userUpdateLivingplace">
                                      Ville actuelle
                                    </Label>
                                    <Input
                                      type="text"
                                      name="userUpdateLivingplace"
                                      id="userUpdateLivingplace"
                                      className={
                                        this.state.livingplaceError
                                          ? 'is-invalid'
                                          : ''
                                      }
                                      onChange={e =>
                                        this.setState({
                                          livingplace: e.target.value,
                                        })
                                      }
                                      defaultValue={
                                        this.state.livingplace || ''
                                      }
                                    />
                                    <FormFeedback>
                                      La ville actuelle doit contenir au moins 3
                                      caractères
                                    </FormFeedback>
                                  </FormGroup>
                                </Col>
                                <UpdateButton
                                  className="modal-choice"
                                  color="primary"
                                  onClick={this.checkForm}
                                >
                                  <FontAwesomeIcon icon={faPencilAlt} />
                                </UpdateButton>
                              </Row>
                            </Form>
                          </UserUpdateContainer>
                        </Col>
                      </Row>
                    </Container>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

export default withRouter(UserPreferencesPage)
