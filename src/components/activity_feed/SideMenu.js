import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faArchive } from "@fortawesome/free-solid-svg-icons";
import { faStickyNote } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

export default class SideMenu extends Component {
    render() {
    return (
      <div className="side-menu">
        <ul>
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} /> Accueil
            </Link>
          </li>
          <li>
            <Link to="/admin_files">
              <FontAwesomeIcon icon={faArchive} /> Fichiers
            </Link>
          </li>
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faStickyNote} /> Mémos
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
