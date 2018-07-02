import React, { Component } from 'react';
import logo from './assets/img/logo.png';
import $ from 'jquery';

class App extends Component {

  componentDidMount() {
    setInterval(() => {
      $('.single-form-subcontainer.right .container').width($('.single-form-subcontainer.right').width());
      let img = $('.single-form-subcontainer.right .container img');
      let container = $('.single-form-subcontainer.right');

      img.css('top',(container.height()-img.height())/2 + 'px');
      img.css('left',(container.width()-img.width())/2 + 'px');

    }, 300);
  }

  render() {
    return (
      <div className="App">
        <div className="single-form-container">
          <div className="single-form-subcontainer left">
           <img src={logo} alt="logo"/>
           <div className="slogan">
            <h2><strong>Vos</strong> amis,</h2>
            <h2><strong>Vos</strong> souvenirs,</h2>
            <h2><strong>Vos</strong> données,</h2>
            <h2><strong>Chez vous.</strong></h2>
           </div>
          </div>
          <div className="single-form-subcontainer right">
            <div className="overlay"></div>
            <div className="container">
              <nav>
                <ul>
                  <li><a href="#">À propos</a></li>
                  <li><a href="#">Support</a></li>
                  <li><a href="#">Mises à jour</a></li>
                  <li><a href="#">Documentation</a></li>
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

export default App;
