import React, { Component } from 'react';
import logo from '../../assets/img/logo.png';
import logo_small from '../../assets/img/logo-small.png';
import $ from 'jquery';
import { config } from '../../config';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import qs from 'qs';

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorModal: false,
      confirmModal: false
    };
  }

  componentDidMount() {
    setInterval(() => {
      let container = $('.single-form-subcontainer.right .container');
      let img = $('.single-form-subcontainer.right .container img');
      let subcontainer = $('.single-form-subcontainer.right');

      container.width(subcontainer.width());
      img.css('top',(subcontainer.height()-img.height())/2 + 'px');
      img.css('left',(subcontainer.width()-img.width())/2 + 'px');

      container.fadeIn();
      img.fadeIn();
    }, 300);
  }

  toggleError = (e) => {
    this.setState({
      errorModal: !this.state.errorModal
    });
  }

  toggleConfirm = (e) => {
    e.preventDefault();

    this.setState({
      confirmModal: !this.state.confirmModal
    });
  }

  handleSubmit = (e) => {
    this.toggleConfirm(e);
    let email = this.emailInput.value;
    let password =  this.passwordInput.value;
    let repeatPassword = this.repeatPasswordInput.value;
    let lastname = this.lastnameInput.value;
    let firstname = this.firstnameInput.value;

    // eslint-disable-next-line
    let emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailCheck = emailReg.test(email);
    let passwordCheckLength = password.length >= 8;
    let repeatPasswordCheckLength = repeatPassword.length >= 8;
    let passwordCheckEquality = password.length > 0 && password === repeatPassword && repeatPassword.length > 0;
    let lastnameCheck = lastname.length >= 2;
    let firstnameCheck = firstname.length >= 2;

    if(emailCheck && passwordCheckLength && repeatPasswordCheckLength && passwordCheckEquality && lastnameCheck && firstnameCheck) {
      axios.post(`${config.API_ROOT}/register`, qs.stringify({ email: this.emailInput.value, password: this.passwordInput.value, repeatPassword: this.repeatPasswordInput.value, lastname: this.lastnameInput.value, firstname: this.firstnameInput.value}))
      .then(function( response ) {
        response = response.data;

        if(response.success) {
          localStorage.setItem('id', response.uniq_id);
          localStorage.setItem('token', response.message);
          this.props.history.push('/register_confirmation');
        }else {
          this.toggleError();
          $('#errorMessage').html(response.message);
        }
      }.bind(this));
    }else {
      this.toggleError();

      if(!email || !password || !repeatPassword || !lastname || !firstname) {
        setTimeout(function(){$('#errorMessage').html('<p>Veuillez remplir tous les champs !</p>');}, 1);
      }else {
        setTimeout(function(){
          $('#errorMessage').html('<p>Veuillez vérifier les points suivants:</p><ul id=\'errorsList\'></ul>');
          if(!emailCheck) $('#errorsList').append('<li>Votre adresse email est incorrecte</li>');
          if(!passwordCheckLength || !repeatPasswordCheckLength) $('#errorsList').append('<li>Les mots de passe doivent comporter au moins 8 caractères</li>');
          if(!passwordCheckEquality) $('#errorsList').append('<li>Les mots de passe ne sont pas identiques</li>');
          if(!lastnameCheck) $('#errorsList').append('<li>Votre nom doit comporter au moins 2 caractères</li>');
          if(!firstnameCheck) $('#errorsList').append('<li>Votre prénom doit comporter au moins 2 caractères</li>');
        }, 1);
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Modal isOpen={this.state.errorModal} toggle={this.toggleError} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleError}>Erreur lors de l'inscription</ModalHeader>
          <ModalBody>
            <div id="errorContent">
              <p id="errorMessage"></p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={this.toggleError}>J'ai compris</button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.confirmModal} toggle={this.toggleConfirm} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleConfirm}>Conditions d'utilisation</ModalHeader>
          <ModalBody>
            <p>En vous inscrivant, vous acceptez nos <a href>conditions d'utilisation</a> et notre <a href>politique de confidentialité</a>.</p>
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={this.handleSubmit}>Continuer</button>
          </ModalFooter>
        </Modal>
        <div className="single-form-container">
          <div className="single-form-subcontainer left">

          <div className="slogan register-title">
            <img src={logo_small} alt="logo"/>
            <h2>Inscription</h2>
          </div>

          <form method="post">
            <label>Adresse email<input id="email" type="email" placeholder="john.doe@bitsky.be" ref={(input) => this.emailInput = input}/></label>
            <label>Mot de passe<input id="password" type="password" placeholder="••••••••" ref={(input) => this.passwordInput = input}/></label>
            <label>Répétez le mot de passe<input id="repeatPassword" type="password" placeholder="••••••••" ref={(input) => this.repeatPasswordInput = input}/></label>
            <label>Nom<input id="lastname" type="text" placeholder="Doe" ref={(input) => this.lastnameInput = input}/></label>
            <label>Prénom<input id="firstname" type="text" placeholder="John" ref={(input) => this.firstnameInput = input}/></label>

            <div className="button-group">
              <button className="primary" onClick={this.toggleConfirm}><span>Inscription</span></button>
              <button className="secondary register-secondary" type="button" onClick={ () => this.props.history.push('/login') }>Déjà inscrit ?</button>
            </div>
          </form>
          </div>
          <div className="single-form-subcontainer right">
            <div className="overlay"></div>
            <div className="container">
              <nav>
                <ul>
                  <li><a href>À propos</a></li>
                  <li><a href>Support</a></li>
                  <li><a href>Mises à jour</a></li>
                  <li><a href>Documentation</a></li>
                </ul>
              </nav>
              <img src={logo} alt="logo"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}