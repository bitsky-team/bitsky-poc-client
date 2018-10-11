import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faComments, faUsers, faServer, faCogs, faArchive, faUserAlt, faArrowAltCircleLeft, faTh } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

class AdministrationSideMenu extends Component {
  render() {
    return (
      <div className="side-menu">
        <ul>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_users') }}><FontAwesomeIcon icon={faTh} /> Tableau de bord</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_users') }}><FontAwesomeIcon icon={faUserAlt} /> Utilisateurs</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_files') }}><FontAwesomeIcon icon={faArchive} /> Fichiers</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_posts') }}><FontAwesomeIcon icon={faCommentAlt} /> Publications</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_comments') }}><FontAwesomeIcon icon={faComments} /> Commentaires</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_groups') }}><FontAwesomeIcon icon={faUsers} /> Groupes</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_modules') }}><FontAwesomeIcon icon={faServer} /> Modules</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_calendar') }}><FontAwesomeIcon icon={faCalendarAlt} /> Calendrier</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/admin_manage_parameters') }}><FontAwesomeIcon icon={faCogs} /> Paramètres</a></li>
            <li><a onClick={(e) => {e.preventDefault(); this.props.history.push('/activity_feed')}}><FontAwesomeIcon icon={faArrowAltCircleLeft} /> Retourner à l'accueil</a></li>
        </ul>
      </div>
    )
  }
}

export default withRouter(AdministrationSideMenu);