import React, { Component } from 'react'
import {Container, Col, Row} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Rank from '../../common/Rank'

export default class UserThumbnail extends Component {
  render() {
    return (
        <Col md="4" className={(this.props.margin ? this.props.margin : null)}>
            <Col md="12" className={(this.props.rank === 2) ? 'user-thumbnail admin' : 'user-thumbnail'}>
                <div className="infos">
                    <img src={this.props.avatar} alt="avatar" />
                    <h4>{this.props.firstname + ' ' + this.props.lastname}</h4>
                    <h5><Rank id={this.props.rank} /></h5>
                    <small>({this.props.uniq_id})</small>
                </div>
                <hr />
                <Container>
                    <Row>
                        <Col md="4" className="action"><FontAwesomeIcon icon={faEye} /></Col>
                        <Col md="4" className="action"><FontAwesomeIcon icon={faPencilAlt} /></Col>
                        <Col md="4" className="action" onClick={e => this.props.toggleUserDeleteModal(this.props.id, this.props.firstname, this.props.lastname)}><FontAwesomeIcon icon={faTrash} /></Col>
                    </Row>
                </Container>
            </Col>
        </Col>
    )
  }
}
