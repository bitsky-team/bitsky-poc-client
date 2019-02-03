import React, { Component } from 'react'
import { 
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback ,
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import jwtDecode from 'jwt-decode'
import logo from '../../assets/img/logo-small.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'cropperjs/dist/cropper.css'
import Cropper from 'react-cropper'
import {  faUserCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { config } from '../../config'
import axios from 'axios'
import qs from 'qs'
import downscale from 'downscale'
import avatar_default from '../../assets/img/avatar_default'

export default class RegisterConfirmationPage extends Component {
    state = {
      session: jwtDecode(localStorage.getItem('token')),
      cropModal: false,
      avatarSrc: null,
      cropResult: avatar_default,
      
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
      livingplaceError: false
    }

    toggleCropModal = (e) => {
      this.setState({
        cropModal: !this.state.cropModal
      })
    }

    onAvatarChange = (e) => {
      e.preventDefault()
      let files
      if (e.dataTransfer) {
        files = e.dataTransfer.files
      } else if (e.target) {
        files = e.target.files
      }
      const reader = new FileReader()
      reader.onload = () => {
        let image = new Image()
        image.onload = () => {
          const width = (image.width / image.width) * 400
          const height = (image.height / image.width) * 400
          downscale(reader.result, width, height)
          .then((dataURL) => {
            fetch(dataURL)
            .then((response) => {
              return response.blob()
            })
            .then((blob) => {
              const blobDataURI = window.URL.createObjectURL(blob)
              this.setState({ avatarSrc:  blobDataURI})
            })
          })
        }
        image.src = reader.result
      }
      reader.readAsDataURL(files[0])
    }

    cropImage = () => {
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
        return
      }
      this.setState({
        cropResult: this.cropper.getCroppedCanvas().toDataURL(),
      })
      this.toggleCropModal()
    }

    clearAllError = () => {
      this.setState({
        biographyError: false,
        sexError: false,
        jobError: false,
        birthdateError: false,
        birthplaceError: false,
        relationshipstatusError: false,
        livingplaceError: false
      })
    }

    displayError = (input) => {
      let stateKey = input + 'Error'
      this.setState({[stateKey]: true})
    }
    
    checkForm = async () => {
      this.clearAllError()

      let isBiographyFilled = this.state.biography && this.state.biography.length >= 10,
          isSexChoosen = this.state.sex && (this.state.sex === 'Homme' || this.state.sex === 'Femme' || this.state.sex === 'Autre'),
          isJobFilled = this.state.job && this.state.job.length >= 3,
          isBirthdateCorrect = this.state.birthdate && this.state.birthdate.length === 10,
          isBirthplaceFilled = this.state.birthplace && this.state.birthplace.length >= 3,
          isRelationshipstatusCorrect = this.state.relationshipstatus && (this.state.relationshipstatus === 'Célibataire' || this.state.relationshipstatus === 'En couple' || this.state.relationshipstatus === 'Marié(e)' || this.state.relationshipstatus === 'Veuf(ve)' || this.state.relationshipstatus === 'Non précisé'),
          isLivingplaceFilled = this.state.livingplace && this.state.livingplace.length >= 3
      
      if(isBiographyFilled && isSexChoosen && isJobFilled && isBirthdateCorrect && isBirthplaceFilled && isRelationshipstatusCorrect && isLivingplaceFilled) {
        const response = await axios.post(`${config.API_ROOT}/register_confirmation`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), avatar: this.state.cropResult, biography: this.state.biography, sex: this.state.sex, job: this.state.job, birthdate: this.state.birthdate, birthplace: this.state.birthplace, relationshipstatus: this.state.relationshipstatus, livingplace: this.state.livingplace}))
        const { success } = response.data

        if(success) {
          localStorage.setItem('avatar', this.state.cropResult)
          this.props.history.push('/activity_feed')
        }
      }else {
        if(!isBiographyFilled) this.displayError('biography')
        if(!isSexChoosen) this.displayError('sex')
        if(!isJobFilled) this.displayError('job')
        if(!isBirthdateCorrect) this.displayError('birthdate')
        if(!isBirthplaceFilled) this.displayError('birthplace')
        if(!isRelationshipstatusCorrect) this.displayError('relationshipstatus')
        if(!isLivingplaceFilled) this.displayError('livingplace')
      }
    }

    render() {
      return (
          <div>
            <Modal isOpen={this.state.cropModal} toggle={this.toggleCropModal}>
                <ModalBody style={{background: 'white'}}>
                    <Label for="avatar">Veuillez sélectionner votre avatar</Label>
                    <Input type="file" name="avatar" id="avatar" onChange={this.onAvatarChange} />
                    <Cropper
                      style={{ height: 400, width: '100%' }}
                      aspectRatio={1 / 1}
                      preview=".img-preview"
                      guides={false}
                      src={this.state.avatarSrc}
                      ref={cropper => { this.cropper = cropper }}
                    />
                    <div className="img-preview" style={{ width: '100%' }} />
                </ModalBody>
                <ModalFooter  style={{background: 'white'}}>
                    <Button className="modal-choice" color="primary" onClick={this.cropImage}><FontAwesomeIcon icon={ faSave } /></Button>{' '}
                    <Button className="modal-choice" color="secondary" onClick={this.toggleCropModal}><FontAwesomeIcon icon={ faTimes }/></Button>
                </ModalFooter>
            </Modal>
            <Container className="main-container register-confirmation cloudsBackground" style={{ minHeight: '100vh', padding: '0' }}>
              <Row style={{ justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.6)', padding: '20px 0', margin: '0', minHeight: '100vh', minWidth: '100vw' }}>
                <Col sm="12" md="8" className="infos-container">
                  <Container>
                    <Row>
                      <Col md="12">
                        <div className="register-title">
                          <img className="logo" src={logo} alt="logo" height="128" />
                          <div className="register-confirmation-image">
                            <img src={this.state.cropResult} alt="avatar" height="128" />
                            <span onClick={this.toggleCropModal}>Modifier</span>
                          </div>
                          <h3>{this.state.session.firstname} {this.state.session.lastname}</h3>
                          <FormGroup>
                            <Input 
                              type="textarea" 
                              name="biography" 
                              id="biography" 
                              placeholder="Décrivez-vous"
                              className={(this.state.biographyError) ? 'is-invalid' : ''}
                              onChange={e => this.setState({biography: e.target.value})}
                            />
                            <FormFeedback>Votre biographie doit compter au minimum 10 caractères</FormFeedback>
                          </FormGroup>
                        </div>
                      </Col>  
                      <Col md="6" style={{paddingTop: '10px'}}>
                        <FormGroup>
                          <Label for="sex">Genre</Label>
                          <Input 
                            type="select" 
                            name="sex" 
                            id="sex"
                            className={(this.state.sexError) ? 'is-invalid' : ''}
                            onChange={e => this.setState({sex: e.target.value})}>
                            <option>Homme</option>
                            <option>Femme</option>
                            <option>Autre</option>
                          </Input>
                          <FormFeedback>Veuillez choisir une option disponible</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="birthdate">Date de naissance</Label>
                          <Input 
                            type="date" 
                            name="birthdate" 
                            id="birthdate" 
                            className={(this.state.birthdateError) ? 'is-invalid' : ''}
                            onChange={e => this.setState({birthdate: e.target.value})}
                          />
                          <FormFeedback>Veuillez indiquer votre date de naissance</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="relationshipstatus">Situation amoureuse</Label>
                          <Input 
                            type="select" 
                            name="relationshipstatus" 
                            id="relationshipstatus"
                            className={(this.state.relationshipstatusError) ? 'is-invalid' : ''}
                            onChange={e => this.setState({relationshipstatus: e.target.value})}
                          >
                            <option>Célibataire</option>
                            <option>En couple</option>
                            <option>Marié(e)</option>
                            <option>Veuf(ve)</option>
                            <option>Non précisé</option>
                          </Input>
                          <FormFeedback>Veuillez choisir une option disponible</FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md="6" style={{paddingTop: '10px'}}>
                        <FormGroup>
                          <Label for="job">Emploi</Label>
                          <Input 
                            type="text" 
                            name="job" 
                            id="job" 
                            className={(this.state.jobError) ? 'is-invalid' : ''}
                            onChange={e => this.setState({job: e.target.value})}
                          />
                          <FormFeedback>Votre emploi doit au moins compter 3 caractères</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="birthplace">Ville d'origine</Label>
                          <Input 
                            type="text" 
                            name="birthplace" 
                            id="birthplace" 
                            className={(this.state.birthplaceError) ? 'is-invalid' : ''}
                            onChange={e => this.setState({birthplace: e.target.value})} 
                          />
                          <FormFeedback>Votre ville d'origine doit au moins compter 3 caractères</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="livingplace">Ville actuelle</Label>
                          <Input 
                            type="text" 
                            name="livingplace" 
                            id="livingplace" 
                            className={(this.state.livingplaceError) ? 'is-invalid' : ''}
                            onChange={e => this.setState({livingplace: e.target.value})}
                          />
                          <FormFeedback>Votre ville actuelle doit au moins compter 3 caractères</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <Button className="confirmRegisterButton" color="primary" size="lg" block onClick={this.checkForm}><FontAwesomeIcon icon={faUserCheck} /> Terminer l'inscription</Button>            
                      </Col>
                    </Row>  
                  </Container>
                </Col>
              </Row>
            </Container>
          </div>
      )
    }
}