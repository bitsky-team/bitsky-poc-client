import React, { Component } from 'react'

import {
  Container,
  Row
} from 'reactstrap'

import UserDocumentationTopContainer from './common/UserDocumentationTopContainer';
import UserDocumentationLeftContainer from './common/UserDocumentationLeftContainer';
import UserDocumentationRightContainer from './common/UserDocumentationRightContainer';

export default class UserDocumentationPage extends Component {
  render() {
    return (
      <Container className="docs-container">
        <Row className="no-margin-right">
            <UserDocumentationTopContainer />
        </Row>
        <Row className="no-margin-right">
            <UserDocumentationLeftContainer />
            <UserDocumentationRightContainer />
        </Row>
      </Container>
    )
  }
}
