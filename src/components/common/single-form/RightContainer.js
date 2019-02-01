import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/img/logo.png'

export default class RightContainer extends Component {

    render() {
        return (
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
                    <div className="image">
                        <img src={logo} alt="logo" ref={node => this.img = node} />
                    </div>
                </div>
            </div>
        )
    
    }
    
}
