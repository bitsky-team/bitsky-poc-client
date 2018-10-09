import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileArchive } from '@fortawesome/free-solid-svg-icons';
import { faStickyNote, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

export default class SideMenu extends Component {
  render() {
    return (
      <div className="side-menu">
        <ul>
            <li><a href={null}><FontAwesomeIcon icon={faHome} /> Accueil</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faFileArchive} /> Fichiers</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faStickyNote} /> Mémos</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faCalendarAlt} /> Calendrier</a></li>
        </ul>
      </div>
    )
  }
}
