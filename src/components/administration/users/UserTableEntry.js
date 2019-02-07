import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import Rank from '../../common/Rank'

export default class UserTableEntry extends Component {

  render() {
    return (
      <tr>
        <th scope="row">{this.props.id}</th>
        <td>{this.props.uid}</td>
        <td>{this.props.lastname}</td>
        <td>{this.props.firstname}</td>
        <td>{this.props.email}</td>
        <td><Rank id={this.props.rank} /></td>
        <td><button className="btn btn-info"><FontAwesomeIcon icon={faEye} /></button>{' '}<button className="btn btn-info" onClick={this.props.toggleUserManageModal}><FontAwesomeIcon icon={faPencilAlt} /></button>{' '}<button className="btn btn-info" onClick={e => this.props.toggleUserDeleteModal(this.props.id, this.props.firstname, this.props.lastname)}><FontAwesomeIcon icon={faTrash} /></button>{' '}</td>
      </tr>
    )
  }
}
