import React, {Fragment, useState, useEffect} from 'react'
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

const UserPreferencesPage = () => {
  const UserUpdateContainer = styled.div`
    text-align: left !important;
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

  const [session] = useState(jwtDecode(localStorage.getItem('token')))
  const [user, setUser] = useState(null)

  const [ranks, setRanks] = useState([])

  const [lastname, setLastname] = useState(null)
  const [lastnameError, setLastnameError] = useState(false)

  const [firstname, setFirstname] = useState(null)
  const [firstnameError, setFirstnameError] = useState(false)

  const [email, setEmail] = useState(null)
  const [emailError, setEmailError] = useState(false)

  const [rank, setRank] = useState('Utilisateur')
  const [rankError, setRankError] = useState(false)

  const [biography, setBiography] = useState(null)
  const [biographyError, setBiographyError] = useState(false)

  const [sex, setSex] = useState('Homme')
  const [sexError, setSexError] = useState(false)

  const [job, setJob] = useState(null)
  const [jobError, setJobError] = useState(false)

  const [birthdate, setBirthdate] = useState(null)
  const [birthdateError, setBirthdateError] = useState(false)

  const [birthplace, setBirthplace] = useState(null)
  const [birthplaceError, setBirthplaceError] = useState(false)

  const [relationshipstatus, setRelationshipStatus] = useState('Célibataire')
  const [relationshipstatusError, setRelationshipStatusError] = useState(false)

  const [livingplace, setLivingplace] = useState(null)
  const [livingplaceError, setLivingplaceError] = useState(false)

  const getBirthdate = () => {
    if (birthdate) {
      return birthdate.replace(' 00:00:00', '')
    }
  }

  const getUser = () => {
    const userId = session.id

    return axios.post(
      `${config.API_ROOT}/get_user`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
        user_id: userId,
      })
    )
  }

  const prepareUser = () => {
    getUser().then(response => {
      const {success, user} = response.data

      if (success) {
        setUser(user)
        setLastname(user.lastname)
        setFirstname(user.firstname)
        setEmail(user.email)
        setRank(user.rank)
        setBiography(user.biography)
        setSex(user.sex)
        setJob(user.job)
        setBirthdate(user.birthdate)
        setBirthplace(user.birthplace)
        setRelationshipStatus(user.relationshipstatus)
        setLivingplace(user.livingplace)
      } else {
        toast.error('Erreur lors du chargement des informations du profil', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }

  const getRanks = async () => {
    const response = await axios.get(`${config.API_ROOT}/get_ranks`)
    const {success, ranks} = response.data
    if (success) {
      let stateRanks = ranks

      ranks.forEach(rank => {
        stateRanks.push(rank.name)
      })

      setRanks(stateRanks)
    }
  }

  const getRankNumber = () => {
    return ranks.findIndex(actualRank => actualRank === rank) + 1
  }

  const checkRank = async () => {
    if (typeof rank === 'number') await getRanks()
    return ranks.includes(rank)
  }

  const checkSex = () => {
    return ['Homme', 'Femme', 'Autre'].includes(sex)
  }

  const checkRelationshipstatus = () => {
    return [
      'Célibataire',
      'En couple',
      'Marié(e)',
      'Veuf(ve)',
      'Non précisé',
    ].includes(relationshipstatus)
  }

  const checkForm = () => {
    setLastnameError(false)
    setFirstnameError(false)
    setEmailError(false)
    setRankError(false)
    setBiographyError(false)
    setSexError(false)
    setJobError(false)
    setBirthdateError(false)
    setBirthplaceError(false)
    setRelationshipStatusError(false)
    setLivingplaceError(false)

    let isLastnameOk = lastname && lastname.length >= 2,
      isFirstnameOk = firstname && firstname.length >= 2,
      isEmailOk =
        email &&
        email.match(
          /^[a-zA-Z]\w+(?:\.[a-zA-Z]\w+){0,3}@[a-zA-Z]\w+(?:\.[a-zA-Z]\w+){1,3}$/
        ),
      isRankOk = checkRank(),
      isBiographyOk = biography && biography.length >= 10,
      isSexOk = checkSex(),
      isJobOk = job && job.length >= 3,
      isBirthdateFilled = birthdate && birthdate.length === 10,
      splittedBirthdate = birthdate.split('-'),
      isBirthdateCorrect =
        Number(splittedBirthdate[0]) > 1899 &&
        Number(splittedBirthdate[0]) <= new Date().getFullYear() &&
        Number(splittedBirthdate[1]) > 0 &&
        Number(splittedBirthdate[1]) <= 12 &&
        Number(splittedBirthdate[2]) > 0 &&
        Number(splittedBirthdate[2]) <= 31,
      isBirthdateOk = isBirthdateFilled && isBirthdateCorrect,
      isBirthplaceOk = birthplace && birthplace.length >= 3,
      isRelationshipstatusOk = checkRelationshipstatus(),
      isLivingplaceOk = livingplace && livingplace.length >= 3,
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
      updateUser()
    }
  }

  const updateUser = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/create_user`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        user_id: user.id ? user.id : null,
        lastname,
        firstname,
        email,
        rank: typeof rank !== 'number' ? getRankNumber() : rank,
        biography,
        sex,
        job,
        birthdate,
        birthplace,
        relationshipstatus,
        livingplace,
        type: 'UPDATE',
        password: null,
        repeatPassword: null,
        avatar: user.avatar
      })
    )
  }

  useEffect(() => {
    prepareUser()
    console.log('slt')
  }, [])

  if (!user) {
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
                            Modifier mes informations
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
                                      lastnameError ? 'is-invalid' : ''
                                    }
                                    onChange={e => setLastname(e.target.value)}
                                    defaultValue={lastname || ''}
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
                                      firstnameError ? 'is-invalid' : ''
                                    }
                                    onChange={e => setFirstname(e.target.value)}
                                    defaultValue={firstname || ''}
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
                                    className={emailError ? 'is-invalid' : ''}
                                    onChange={e => setEmail(e.target.value)}
                                    defaultValue={email || ''}
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
                                    className={rankError ? 'is-invalid' : ''}
                                    onChange={e => {
                                      setRank(e.target.value)
                                    }}
                                  >
                                    <option selected={rank === 1}>
                                      Utilisateur
                                    </option>
                                    <option selected={rank === 2}>
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
                                  className={biographyError ? 'is-invalid' : ''}
                                  onChange={e => setBiography(e.target.value)}
                                  value={biography || ''}
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
                                    className={sexError ? 'is-invalid' : ''}
                                    onChange={e => setSex(e.target.value)}
                                  >
                                    <option selected={sex === 'Homme'}>
                                      Homme
                                    </option>
                                    <option selected={sex === 'Femme'}>
                                      Femme
                                    </option>
                                    <option selected={sex === 'Autre'}>
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
                                    className={jobError ? 'is-invalid' : ''}
                                    onChange={e => setJob(e.target.value)}
                                    defaultValue={job || ''}
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
                                  <Label for="userUpdateBirthdate">
                                    Date de naissance
                                  </Label>
                                  <Input
                                    type="date"
                                    name="userUpdateBirthdate"
                                    id="userUpdateBirthdate"
                                    className={
                                      birthdateError ? 'is-invalid' : ''
                                    }
                                    onChange={e => setBirthdate(e.target.value)}
                                    defaultValue={getBirthdate() || ''}
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
                                      birthplaceError ? 'is-invalid' : ''
                                    }
                                    onChange={e =>
                                      setBirthplace(e.target.value)
                                    }
                                    defaultValue={birthplace || ''}
                                  />
                                  <FormFeedback>
                                    La ville d'origine doit contenir au moins 3
                                    caractères
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
                                      relationshipstatusError
                                        ? 'is-invalid'
                                        : ''
                                    }
                                    onChange={e =>
                                      setRelationshipStatus(e.target.value)
                                    }
                                  >
                                    <option
                                      selected={
                                        relationshipstatus === 'Célibataire'
                                      }
                                    >
                                      Célibataire
                                    </option>
                                    <option
                                      selected={
                                        relationshipstatus === 'En couple'
                                      }
                                    >
                                      En couple
                                    </option>
                                    <option
                                      selected={
                                        relationshipstatus === 'Marié(e)'
                                      }
                                    >
                                      Marié(e)
                                    </option>
                                    <option
                                      selected={
                                        relationshipstatus === 'Veuf(ve)'
                                      }
                                    >
                                      Veuf(ve)
                                    </option>
                                    <option
                                      selected={
                                        relationshipstatus === 'Non précisé'
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
                                      livingplaceError ? 'is-invalid' : ''
                                    }
                                    onChange={e =>
                                      setLivingplace(e.target.value)
                                    }
                                    defaultValue={livingplace || ''}
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
                                onClick={checkForm}
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

export default UserPreferencesPage
