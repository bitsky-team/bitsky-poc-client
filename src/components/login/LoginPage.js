import React, {Component, Fragment} from 'react'
import logo_small from '../../assets/img/logo-small.png'
import {config} from '../../config'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {Link} from 'react-router-dom'
import axios from 'axios'
import qs from 'qs'
import SingleFormRightContainer from '../common/single-form/RightContainer'
import {toast} from 'react-toastify'

export default class LoginPage extends Component {
  state = {
    modal: false,
    registrationState: true,
  }

  getRegistrationState = async () => {
    const response = await axios.get(
      `${config.API_ROOT}/get_registration_module_state`
    )

    const {success, state} = response.data

    if (success) {
      this.setState({registrationState: state})
    }
  }

  toggleError = e => {
    this.setState({
      modal: !this.state.modal,
    })
  }

  handleSubmit = async e => {
    e.preventDefault()

    let email = this.loginInput.value
    let password = this.passwordInput.value
    let emailReg = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/
    let emailCheck = emailReg.test(email)
    let passwordCheckLength = password.length >= 8

    if (emailCheck && passwordCheckLength) {
      this.loginButton.innerHTML = 'Chargement...'

      const response = await axios.post(
        `${config.API_ROOT}/login`,
        qs.stringify({
          email: this.loginInput.value,
          password: this.passwordInput.value,
        })
      )
      const {success, avatar, message, uniq_id} = response.data

      if (success) {
        localStorage.setItem('avatar', avatar)
        localStorage.setItem('token', message)
        localStorage.setItem('id', uniq_id)
        window.location.href = '/activity_feed'
      } else {
        this.loginButton.innerHTML = 'Connexion'
        this.toggleError()
        if (this.errorMessage) this.errorMessage.innerHTML = message
      }
    } else {
      this.toggleError()

      if (!email || !password) {
        setTimeout(() => {
          if (this.errorMessage) {
            this.errorMessage.innerHTML = 'Veuillez remplir tous les champs !'
          }
        }, 100)
      } else {
        setTimeout(() => {
          if (this.errorMessage && this.errorsList) {
            this.errorMessage.innerHTML =
              'Veuillez vérifier les points suivants:'
            if (!emailCheck)
              this.errorsList.innerHTML +=
                '<li>Votre adresse email est incorrecte</li>'
            if (!passwordCheckLength)
              this.errorsList.innerHTML +=
                '<li>Le mot de passe doit comporter au moins 8 caractères</li>'
            this.errorsList.style.display = 'block'
          }
        }, 100)
      }
    }
  }

  componentDidMount() {
    this.getRegistrationState()
  
    let url = new URL(window.location.href)
    let searchParams = new URLSearchParams(url.search)
    
    switch(searchParams.get('action')) {
      case 'updated':
        toast.success('Informations modifées !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
        break;
      default: break;
    }
  }

  render() {
    return (
      <div className="App">
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleError}
          className={this.props.className + ' login-error-modal'}
        >
          <ModalHeader style={{background: 'white'}} toggle={this.toggleError}>
            Erreur lors de la connexion
          </ModalHeader>
          <ModalBody style={{background: 'white'}}>
            <div>
              <p id="errorMessage" ref={node => (this.errorMessage = node)} />
              <ul
                id="errorsList"
                style={{display: 'none'}}
                ref={node => (this.errorsList = node)}
              />
            </div>
          </ModalBody>
          <ModalFooter style={{background: 'white'}}>
            <button className="secondary" onClick={this.toggleError}>
              J'ai compris
            </button>
          </ModalFooter>
        </Modal>
        <div className="single-form-container">
          <div className="single-form-subcontainer left">
            <img src={logo_small} alt="logo" />

            <div className="slogan">
              <h2>
                <strong>Vos</strong> amis,
              </h2>
              <h2>
                <strong>Vos</strong> souvenirs,
              </h2>
              <h2>
                <strong>Vos</strong> données,
              </h2>
              <h2>
                <strong>Chez vous.</strong>
              </h2>
            </div>

            <form method="post">
              <label>
                Adresse email
                <input
                  id="email"
                  type="email"
                  placeholder="john.doe@bitsky.be"
                  ref={input => (this.loginInput = input)}
                />
              </label>
              <label>
                Mot de passe
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  ref={input => (this.passwordInput = input)}
                />
              </label>
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark" />
                <span className="text">Se souvenir de moi</span>
              </label>
              <Link to="/" className="password-lost">
                Mot de passe oublié ?
              </Link>

              <div className="button-group">
                <button className="primary" onClick={this.handleSubmit}>
                  <span ref={btn => (this.loginButton = btn)}>Connexion</span>
                </button>
                <Fragment>
                  {this.state.registrationState ? (
                    <button
                      className="secondary"
                      type="button"
                      onClick={() => this.props.history.push('/register')}
                    >
                      Inscription
                    </button>
                  ) : null}
                </Fragment>
              </div>
            </form>
          </div>
          <SingleFormRightContainer />
        </div>
      </div>
    )
  }
}
