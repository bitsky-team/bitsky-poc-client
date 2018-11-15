import React, { Component } from 'react'
import { Col } from 'reactstrap';
import { config } from '../../../../config';

export default class UserDocumentationRightContainer extends Component {
  render() {
    return (
        <Col md="9" className="no-padding-left no-padding-right">
            <div className="docs-right-subcontainer">
                <h2>Documentation du Bitsky (v{config.APP_VERSION})</h2>
            </div>
        </Col>
    )
  }
}
