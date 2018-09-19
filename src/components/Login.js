import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import logo_small from '../assets/img/logo-small.png';
import $ from 'jquery';
import { config } from '../config';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggleError = this.toggleError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  toggleError() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    let email = $('#email').val();
    let password =  $('#password').val();
    // eslint-disable-next-line
    let emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailCheck = emailReg.test(email);
    let passwordCheckLength = password.length >= 8;

    if(emailCheck && passwordCheckLength) {
      $.post(`${config.API_ROOT}/login`, { email: $('#email').val(), password: $('#password').val() })
      .done(function( data ) {
        let response = JSON.parse(data);
  
        if(response.success) {
          localStorage.setItem('id', response.uniq_id);
          localStorage.setItem('token', response.message);
          this.props.history.push('/register_confirmation');
        }else {
          this.toggleError();
          $('#errorMessage').text(response.message);
        }
      }.bind(this));
    }else {
      this.toggleError();

      if(!email || !password) {
        setTimeout(function(){$('#errorMessage').html('<p>Veuillez remplir tous les champs !</p>');}, 1);
      }else {
        setTimeout(function(){
          $('#errorMessage').html('<p>Veuillez vérifier les points suivants:</p><ul id=\'errorsList\'></ul>');
          if(!emailCheck) $('#errorsList').append('<li>Votre adresse email est incorrecte</li>');
          if(!passwordCheckLength) $('#errorsList').append('<li>Le mot de passe doit comporter au moins 8 caractères</li>');
        }, 1);
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Modal isOpen={this.state.modal} toggle={this.toggleError} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleError}>Erreur lors de la connexion</ModalHeader>
          <ModalBody>
            <p id="errorMessage"></p>
          </ModalBody>
          <ModalFooter>
            <button className="secondary" onClick={this.toggleError}>J'ai compris</button>
          </ModalFooter>
        </Modal>
        <div className="single-form-container">
          <div className="single-form-subcontainer left">
           <img src={logo_small} alt="logo"/>

           <div className="slogan">
            <h2><strong>Vos</strong> amis,</h2>
            <h2><strong>Vos</strong> souvenirs,</h2>
            <h2><strong>Vos</strong> données,</h2>
            <h2><strong>Chez vous.</strong></h2>
           </div>

           <form method="post">
            <label>Adresse email<input id="email" type="email" placeholder="john.doe@bitsky.be"/></label>
            <label>Mot de passe<input id="password" type="password" placeholder="••••••••"/></label>
            <label className="checkbox-container">
              <input type="checkbox"/><span className="checkmark"></span>
              <span className="text">Se souvenir de moi</span>
            </label>
            <a href="" className="password-lost">Mot de passe oublié ?</a>

            <div className="button-group">
              <button className="primary" onClick={this.handleSubmit}><span>Connexion</span></button>
              <button className="secondary" type="button" onClick={ () => this.props.history.push('/register') }>Inscription</button>
            </div>
           </form>
          </div>
          <div className="single-form-subcontainer right">
            <div className="overlay"></div>
            <div className="container">
              <nav>
                <ul>
                  <li><a href="">À propos</a></li>
                  <li><a href="">Support</a></li>
                  <li><a href="">Mises à jour</a></li>
                  <li><a href="">Documentation</a></li>
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

export default Login;
