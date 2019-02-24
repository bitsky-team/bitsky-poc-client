import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faComments, faUsers, faServer, faArchive, faUserAlt, faArrowAltCircleLeft, faTh } from '@fortawesome/free-solid-svg-icons'

class AdministrationSideMenu extends Component {

  render() {
    return (
      <div className="side-menu">
        <ul>
            <li><Link to='/administration'><FontAwesomeIcon icon={faTh} /> Tableau de bord</Link></li>
            <li><Link to='/admin_manage_users'><FontAwesomeIcon icon={faUserAlt} /> Utilisateurs</Link></li>
            <li><Link to='/admin_manage_files'><FontAwesomeIcon icon={faArchive} /> Fichiers</Link></li>
            <li><Link to='/admin_manage_posts'><FontAwesomeIcon icon={faCommentAlt} /> Publications</Link></li>
            <li><Link to='/admin_manage_comments'><FontAwesomeIcon icon={faComments} /> Commentaires</Link></li>
            <li><Link to='/admin_manage_groups'><FontAwesomeIcon icon={faUsers} /> Groupes</Link></li>
            <li><Link to='/admin_manage_settings'><FontAwesomeIcon icon={faServer} /> Modules</Link></li>
            <li><Link to='/activity_feed'><FontAwesomeIcon icon={faArrowAltCircleLeft} /> Retourner à l'accueil</Link></li>
        </ul>
      </div>
    )
    
  }
  
}

export default withRouter(AdministrationSideMenu)