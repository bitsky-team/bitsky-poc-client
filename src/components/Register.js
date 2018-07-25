import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import logo_small from '../assets/img/logo-small.png';
import $ from 'jquery';
import { config } from '../config';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Register extends Component {
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
    $.post(`${config.API_ROOT}/register`, { username: $('#username').val(), password: $('#password').val(), repeatPassword: $('#repeatPassword').val(), lastname: $('#lastname').val(), firstname: $('#firstname').val()})
    .done(function( data ) {
      let response = JSON.parse(data);

      if(response.success) {
        alert('ok');
      }else {
        this.toggleError();
        $('#errorMessage').text(response.message);
      }
    }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <Modal isOpen={this.state.modal} toggle={this.toggleError} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleError}>Erreur lors de l'inscription</ModalHeader>
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

           <div className="slogan register-title">
            <h2>Inscription</h2>
           </div>

           <form method="post">
            <label>Adresse email<input id="email" type="email" placeholder="john.doe@bitsky.be"/></label>
            <label>Mot de passe<input id="password" type="password" placeholder="••••••••"/></label>
            <label>Répétez le mot de passe<input id="repeatPassword" type="password" placeholder="••••••••"/></label>
            <label>Nom<input id="lastname" type="text" placeholder="Doe"/></label>
            <label>Prénom<input id="firstname" type="text" placeholder="John"/></label>
           
            <div className="button-group">
              <button className="primary" onClick={this.handleSubmit}><span>Inscription</span></button>
              <button className="secondary" onClick={ () => this.props.history.push('/login') }>Déjà inscrit ?</button>
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

export default Register;
