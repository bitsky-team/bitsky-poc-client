import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileArchive, faCommentAlt, faComments, faUsers, faHdd, faServer, faLink, faCogs } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

export default class AdministrationSideMenu extends Component {
  render() {
    return (
      <div className="side-menu">
        <ul>
            <li><a href={null}><FontAwesomeIcon icon={faHome} /> Utilisateurs</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faFileArchive} /> Fichiers</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faCommentAlt} /> Publications</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faComments} /> Commentaires</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faUsers} /> Groupes</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faHdd} /> Stockage</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faServer} /> Modules</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faCalendarAlt} /> Calendrier</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faLink} /> Liaisons</a></li>
            <li><a href={null}><FontAwesomeIcon icon={faCogs} /> Paramètres</a></li>
        </ul>
      </div>
    )
  }
}
