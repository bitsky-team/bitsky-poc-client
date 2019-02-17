import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faInfoCircle,
  faShieldAlt,
  faUserAlt,
  faArrowAltCircleLeft,
} from '@fortawesome/free-solid-svg-icons'

const UserPreferencesSideMenu = () => {
  return (
    <div className="side-menu">
      <ul>
        <li>
          <Link to="/user_preferences">
            <FontAwesomeIcon icon={faInfoCircle} /> Informations
          </Link>
        </li>
        <li>
          <Link to="/user_security">
            <FontAwesomeIcon icon={faShieldAlt} /> Sécurité
          </Link>
        </li>
        <li>
          <Link to="/user_account">
            <FontAwesomeIcon icon={faUserAlt} /> Compte
          </Link>
        </li>
        <li>
          <Link to="/activity_feed">
            <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Retourner à
            l'accueil
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(UserPreferencesSideMenu)
