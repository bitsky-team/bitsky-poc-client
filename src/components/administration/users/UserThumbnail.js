import React, { Component } from 'react'
import {Container, Col, Row} from 'reactstrap';
import avatar from '../../../assets/img/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

export default class UserThumbnail extends Component {
  render() {
    return (
        <Col md="4" className={(this.props.margin ? this.props.margin : null)}>
            <Col md="12" className={(this.props.rank === 'Utilisateur') ? 'user-thumbnail' : 'user-thumbnail admin'}>
                <div className="infos">
                    <img src={avatar} alt="avatar" />
                    <h4>{this.props.firstname + ' ' + this.props.lastname}</h4>
                    <h5>{this.props.rank}</h5>
                    <small>({this.props.uniq_id})</small>
                </div>
                <hr />
                <Container>
                    <Row>
                        <Col md="4" className="action"><FontAwesomeIcon icon={faEye} /></Col>
                        <Col md="4" className="action"><FontAwesomeIcon icon={faPencilAlt} /></Col>
                        <Col md="4" className="action"><FontAwesomeIcon icon={faTrash} /></Col>
                    </Row>
                </Container>
            </Col>
        </Col>
    )
  }
}
