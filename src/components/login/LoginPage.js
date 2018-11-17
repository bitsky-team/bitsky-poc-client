import React, { Component } from 'react'
import logo from '../../assets/img/logo.png'
import logo_small from '../../assets/img/logo-small.png'
import { config } from '../../config'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'

export default class LoginPage extends Component {
  state = {
    modal: false
  }

  componentDidMount() {
    setInterval(() => {
      let container = this.container
      let img = this.img
      let subcontainer = this.subcontainerRight

      if(container && img && subcontainer) {
        container.style.width = subcontainer.clientWidth
        img.style.top = ((subcontainer.clientHeight - img.clientHeight)/2) + 'px'
        img.style.left = ((subcontainer.clientWidth - img.clientWidth)/2) + 'px'
        img.style.display = 'block'
        container.style.display = 'flex'
      }
    }, 50)
  }

  toggleError = (e) => {
    this.setState({
      modal: !this.state.modal
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    let email = this.loginInput.value
    let password =  this.passwordInput.value
    let emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/
    let emailCheck = emailReg.test(email)
    let passwordCheckLength = password.length >= 8

    if(emailCheck && passwordCheckLength) {
      this.loginButton.innerHTML = 'Chargement...';
      
      const response = await axios.post(`${config.API_ROOT}/login`, qs.stringify({ email: this.loginInput.value, password: this.passwordInput.value }))
      const { success, avatar, message, uniq_id } = response.data

      if(success) {
        localStorage.setItem('avatar', avatar)          
        localStorage.setItem('token', message)
        localStorage.setItem('id', uniq_id)
        this.props.history.push('/activity_feed')
      }else {
        this.loginButton.innerHTML = 'Connexion';
        this.toggleError()
        if(this.errorMessage) this.errorMessage.innerHTML = message
      }
    }else {
      this.toggleError()

      if(!email || !password) {
        setTimeout(() => {
          if(this.errorMessage) {
            this.errorMessage.innerHTML = 'Veuillez remplir tous les champs !'
          }
        }, 100)
      }else {
        setTimeout(() => {
          if(this.errorMessage && this.errorsList) {
            this.errorMessage.innerHTML = 'Veuillez vérifier les points suivants:'
            if(!emailCheck) this.errorsList.innerHTML += '<li>Votre adresse email est incorrecte</li>'
            if(!passwordCheckLength) this.errorsList.innerHTML += '<li>Le mot de passe doit comporter au moins 8 caractères</li>'
            this.errorsList.style.display = 'block'
          }
        }, 100)
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Modal isOpen={this.state.modal} toggle={this.toggleError} className={this.props.className + ' login-error-modal'}>
          <ModalHeader toggle={this.toggleError}>Erreur lors de la connexion</ModalHeader>
          <ModalBody>
            <div>
              <p id="errorMessage" ref={node => this.errorMessage = node}></p>
              <ul id="errorsList" style={{display: 'none'}} ref={node => this.errorsList = node}></ul>
            </div>
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
            <label>Adresse email<input id="email" type="email" placeholder="john.doe@bitsky.be" ref={(input) => this.loginInput = input }/></label>
            <label>Mot de passe<input id="password" type="password" placeholder="••••••••" ref={(input) => this.passwordInput = input }/></label>
            <label className="checkbox-container">
              <input type="checkbox"/><span className="checkmark"></span>
              <span className="text">Se souvenir de moi</span>
            </label>
            <Link to="/" className="password-lost">Mot de passe oublié ?</Link>

            <div className="button-group">
              <button className="primary" onClick={this.handleSubmit}><span ref={(btn) => this.loginButton = btn }>Connexion</span></button>
              <button className="secondary" type="button" onClick={ () => this.props.history.push('/register') }>Inscription</button>
            </div>
           </form>
          </div>
          <div className="single-form-subcontainer right" ref={node => this.subcontainerRight = node}>
            <div className="overlay"></div>
            <div className="container" ref={node => this.container = node}>
              <nav>
                <ul>
                  <li><Link to='/'>À propos</Link></li>
                  <li><Link to='/'>Support</Link></li>
                  <li><Link to='/'>Mises à jour</Link></li>
                  <li><Link to='/docs'>Documentation</Link></li>
                </ul>
              </nav>
              <img src={logo} alt="logo" ref={node => this.img = node} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}