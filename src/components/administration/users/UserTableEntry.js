import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'

export default class UserTableEntry extends Component {
  render() {
    return (
        <tr>
            <th scope="row">{this.props.id}</th>
            <td>{this.props.uid}</td>
            <td>{this.props.lastname}</td>
            <td>{this.props.firstname}</td>
            <td>{this.props.email}</td>
            <td>{this.props.rank}</td>
            <td><button className="btn btn-info"><FontAwesomeIcon icon={faEye}/></button>{' '}<button className="btn btn-info"><FontAwesomeIcon icon={faPencilAlt}/></button>{' '}<button className="btn btn-info"><FontAwesomeIcon icon={faTrash}/></button>{' '}</td>
        </tr>
    )
  }
}
