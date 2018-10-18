import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faArchive } from '@fortawesome/free-solid-svg-icons'
import { faStickyNote, faCalendarAlt } from '@fortawesome/free-regular-svg-icons'

export default class SideMenu extends Component {
  render() {
    return (
      <div className="side-menu">
        <ul>
            <li><a href><FontAwesomeIcon icon={faHome} /> Accueil</a></li>
            <li><a href><FontAwesomeIcon icon={faArchive} /> Fichiers</a></li>
            <li><a href><FontAwesomeIcon icon={faStickyNote} /> Mémos</a></li>
            <li><a href><FontAwesomeIcon icon={faCalendarAlt} /> Calendrier</a></li>
        </ul>
      </div>
    )
  }
}
