import React, { Component } from 'react';
import { 
    Container, 
    Row, 
    Col, 
} from 'reactstrap';

export default class AdministrationPage extends Component {
  render() {
    return (
      <div>
        <Container className="main-container">
            <Row>
                <Col md="3" className="no-margin-left no-margin-right">
                    <div className="user-container">
                       
                    </div>
                </Col>
                <Col md="9" className="no-margin-left no-margin-right">
                    <div className="user-container no-center">
                       
                    </div>
                </Col>
            </Row>
        </Container>
      </div>
    )
  }
}
