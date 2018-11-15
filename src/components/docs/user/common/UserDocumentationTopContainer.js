import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons'
import {
    Col,
    Button
} from 'reactstrap'
import { withRouter } from 'react-router-dom'

class UserDocumentationTopContainer extends Component {
  render() {
    return (
        <Col md="12" className="no-padding-right">
            <div className="docs-top-subcontainer">
                <Button color="info" onClick={(e) => this.props.history.push('/')}><FontAwesomeIcon icon={faArrowAltCircleLeft}/> Retourner à l'accueil</Button>
            </div>
        </Col>
    )
  }
}

export default withRouter(UserDocumentationTopContainer);