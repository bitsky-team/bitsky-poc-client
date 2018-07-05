import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import logo_small from '../assets/img/logo-small.png';
import $ from 'jquery';

class Login extends Component {

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

  render() {
    return (
      <div className="App">
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
            <label>Adresse email<input type="email" placeholder="john.doe@bitsky.be"/></label>
            <label>Mot de passe<input type="password" placeholder="••••••••"/></label>
            <label className="checkbox-container">
              <input type="checkbox"/><span className="checkmark"></span>
              <span className="text">Se souvenir de moi</span>
            </label>
            <a href="" className="password-lost">Mot de passe oublié ?</a>

            <div className="button-group">
              <button className="primary"><span>Connexion</span></button>
              <button className="secondary" onClick={ () => this.props.history.push('/register') }>Inscription</button>
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
