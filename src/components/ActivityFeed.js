import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import logo_small from '../assets/img/logo-small.png';

class ActivityFeed extends Component {

  render() {
    return (
      <div className="main-container">
        <div className="search-container">
            <img src={logo_small} alt="logo"/>
            <div className="search-bar">
            <i class="fa fa-search" aria-hidden="true"></i> test
            </div>
        </div>
      </div>
    );
  }
  
}

export default ActivityFeed;
