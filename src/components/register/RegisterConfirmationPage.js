import React, { Component } from 'react';
import { Container, Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import jwtDecode from 'jwt-decode';
import $ from 'jquery';
import { config } from '../../config';
import logo from '../../assets/img/logo-small.png';
import avatarDefault from '../../assets/img/avatar-default.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import qs from 'qs';

export default class RegisterConfirmationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          session: jwtDecode(localStorage.getItem('token'))
        }
        this.checkForm = this.checkForm.bind(this);
    }

    checkForm() {
      let biography = $('#biography'),
          sex = $('#sex'),
          job = $('#job'),
          birthdate = $('#birthdate'),
          birthplace = $('#birthplace'),
          relationshipstatus = $('#relationshipstatus'),
          livingplace = $('#livingplace');

      biography.removeClass('is-invalid');
      sex.removeClass('is-invalid');
      job.removeClass('is-invalid');
      birthdate.removeClass('is-invalid');
      birthplace.removeClass('is-invalid');
      relationshipstatus.removeClass('is-invalid');
      livingplace.removeClass('is-invalid');

      let isBiographyFilled = biography.val().length >= 10,
          isSexChoosen = sex.val() === 'Homme' || sex.val() === 'Femme' || sex.val() === 'Autre',
          isJobFilled = job.val().length >= 3,
          isBirthdateCorrect = birthdate.val().length === 10,
          isBirthplaceFilled = birthplace.val().length >= 3,
          isRelationshipstatusCorrect = relationshipstatus.val() === 'Célibataire' || relationshipstatus.val() === 'En couple' || relationshipstatus.val() === 'Marié(e)' || relationshipstatus.val() === 'Veuf(ve)' || relationshipstatus.val() === 'Non précisé',
          isLivingplaceFilled = livingplace.val().length >= 3;
      
      if(isBiographyFilled && isSexChoosen && isJobFilled && isBirthdateCorrect && isBirthplaceFilled && isRelationshipstatusCorrect && isLivingplaceFilled) {
        axios.post(`${config.API_ROOT}/register_confirmation`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), biography: biography.val(), sex: sex.val(), job: job.val(), birthdate: birthdate.val(), birthplace: birthplace.val(), relationshipstatus: relationshipstatus.val(), livingplace: livingplace.val()}))
        .then(function( response ) {
          response = response.data;
          if(response.success) {
            this.props.history.push('/activity_feed');
          }
        }.bind(this));
      }else {
        if(!isBiographyFilled) biography.addClass('is-invalid');
        if(!isSexChoosen) sex.addClass('is-invalid');
        if(!isJobFilled) job.addClass('is-invalid');
        if(!isBirthdateCorrect) birthdate.addClass('is-invalid');
        if(!isBirthplaceFilled) birthplace.addClass('is-invalid');
        if(!isRelationshipstatusCorrect) relationshipstatus.addClass('is-invalid');
        if(!isLivingplaceFilled) livingplace.addClass('is-invalid');
      }
    }

    render() {
      return (
          <div>
            <Container className="main-container cloudsBackground" style={{ minHeight: '100vh' }}>
              <Row style={{ justifyContent: 'center' }}>
                <Col sm="12" md="8" className="headerLogo">
                  <img src={logo} alt="logo" height="128" />
                </Col>
                <Col sm="12" md="8" className="infos-container">
                  <h4>Parlez-nous de vous, {this.state.session.firstname} !</h4>
                  <hr/>
                  <Container>
                    <Row>
                      <Col md="12">
                        <div className="register-title">
                          <div className="register-confirmation-image">
                            <img src={avatarDefault} alt="avatar" height="128" />
                            <span>Modifier</span>
                          </div>
                          <h3>{this.state.session.firstname} {this.state.session.lastname}</h3>
                          <FormGroup>
                            <Input type="textarea" name="biography" id="biography" placeholder="Décrivez-vous"/>
                            <FormFeedback>Votre biographie doit compter au minimum 10 caractères</FormFeedback>
                          </FormGroup>
                        </div>
                      </Col>  
                      <Col md="6" style={{paddingTop: '10px'}}>
                        <FormGroup>
                          <Label for="sex">Sexe</Label>
                          <Input type="select" name="sex" id="sex">
                            <option>Homme</option>
                            <option>Femme</option>
                            <option>Autre</option>
                          </Input>
                          <FormFeedback>Veuillez choisir une option disponible</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="birthdate">Date de naissance</Label>
                          <Input type="date" name="birthdate" id="birthdate" placeholder="Date de naissance" />
                          <FormFeedback>Veuillez indiquer votre date de naissance</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="relationshipstatus">Situation amoureuse</Label>
                          <Input type="select" name="relationshipstatus" id="relationshipstatus">
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
                          <Input type="text" name="job" id="job" placeholder="Emploi" />
                          <FormFeedback>Votre emploi doit au moins compter 3 caractères</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="birthplace">Ville d'origine</Label>
                          <Input type="text" name="birthplace" id="birthplace" placeholder="Ville d'origine" />
                          <FormFeedback>Votre ville d'origine doit au moins compter 3 caractères</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                          <Label for="livingplace">Ville actuelle</Label>
                          <Input type="text" name="livingplace" id="livingplace" placeholder="Ville actuelle" />
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
      );
    }
}