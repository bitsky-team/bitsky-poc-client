import React, { Component } from 'react'
import logo_small from '../../assets/img/logo-small.png'
import { config } from '../../config'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import SingleFormRightContainer from '../common/single-form/RightContainer'

import axios from 'axios'
import qs from 'qs'
import {withRouter} from 'react-router'

class RegisterPage extends Component {
  state = {
    errorModal: false,
    confirmModal: false
  }
  
  componentDidMount() {
    this.getRegistrationState()
  }
  
  getRegistrationState = async () => {
    const response = await axios.get(
      `${config.API_ROOT}/get_registration_module_state`
    )
    
    const {success, state} = response.data
    
    if (success) {
      if(!state) {
        this.props.history.push('/login')
      }
    }
  }

  toggleError = (e) => {
    this.setState({
      errorModal: !this.state.errorModal
    })
  }

  toggleConfirm = (e) => {
    e.preventDefault()

    this.setState({
      confirmModal: !this.state.confirmModal
    })
  }

  handleSubmit = async (e) => {
    this.toggleConfirm(e)
    let email = this.emailInput.value
    let password =  this.passwordInput.value
    let repeatPassword = this.repeatPasswordInput.value
    let lastname = this.lastnameInput.value
    let firstname = this.firstnameInput.value
    let emailReg = /^[a-zA-Z]\w+(?:\.[a-zA-Z]\w+){0,3}@[a-zA-Z]\w+(?:\.[a-zA-Z]\w+){1,3}$/
    let emailCheck = emailReg.test(email)
    let passwordCheckLength = password.length >= 8
    let repeatPasswordCheckLength = repeatPassword.length >= 8
    let passwordCheckEquality = password.length > 0 && password === repeatPassword && repeatPassword.length > 0
    let lastnameCheck = lastname.length >= 2
    let firstnameCheck = firstname.length >= 2

    if(emailCheck && passwordCheckLength && repeatPasswordCheckLength && passwordCheckEquality && lastnameCheck && firstnameCheck) {
      const response = await axios.post(`${config.API_ROOT}/register`, qs.stringify({ email: this.emailInput.value, password: this.passwordInput.value, repeatPassword: this.repeatPasswordInput.value, lastname: this.lastnameInput.value, firstname: this.firstnameInput.value}))
      const { success, uniq_id, message } = response.data

      if(success) {
        localStorage.setItem('id', uniq_id)
        localStorage.setItem('token', message)
        window.location.href = '/register_confirmation'
      }else {
        this.toggleError()
        this.errorMessage.innerHTML = message
      }
    }else {
      this.toggleError()

      if(!email || !password || !repeatPassword || !lastname || !firstname) {
        setTimeout(() => {
          if(this.errorMessage) {
            this.errorMessage.innerHTML = 'Veuillez remplir tous les champs !'
          }
        }, 100)
      }else {
        setTimeout(() => {
          if(this.errorMessage && this.errorsList) {
            console.log(this.errorsList)
            this.errorMessage.innerHTML = 'Veuillez vérifier les points suivants:'
            if(!emailCheck) this.errorsList.innerHTML += '<li>Votre adresse email est incorrecte</li>'
            if(!passwordCheckLength || !repeatPasswordCheckLength) this.errorsList.innerHTML += '<li>Les mots de passe doivent comporter au moins 8 caractères</li>'
            if(!passwordCheckEquality) this.errorsList.innerHTML += '<li>Les mots de passe ne sont pas identiques</li>'
            if(!lastnameCheck) this.errorsList.innerHTML += '<li>Votre nom doit comporter au moins 2 caractères</li>'
            if(!firstnameCheck) this.errorsList.innerHTML += '<li>Votre prénom doit comporter au moins 2 caractères</li>'
            this.errorsList.style.display = 'block'            
          }
        }, 100)
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Modal isOpen={this.state.errorModal} toggle={this.toggleError} className={this.props.className + ' login-error-modal'}>
          <ModalHeader style={{background: 'white'}} toggle={this.toggleError}>Erreur lors de l'inscription</ModalHeader>
          <ModalBody style={{background: 'white'}}>
            <div>
              <p id="errorMessage" ref={node => this.errorMessage = node}></p>
              <ul id="errorsList" style={{display: 'none'}} ref={node => this.errorsList = node}></ul>
            </div>
          </ModalBody>
          <ModalFooter style={{background: 'white'}}>
            <button className="secondary" onClick={this.toggleError}>J'ai compris</button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.confirmModal} toggle={this.toggleConfirm} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleConfirm} style={{background:'white'}}>Conditions d'utilisation</ModalHeader>
          <ModalBody style={{background:'white'}}>
            <p>En vous inscrivant, vous acceptez nos <a href>conditions d'utilisation</a> et notre <a href>politique de confidentialité</a>.</p>
          </ModalBody>
          <ModalFooter style={{background:'white'}}>
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
          <SingleFormRightContainer />
        </div>
      </div>
    )
  }
}

export default withRouter(RegisterPage)