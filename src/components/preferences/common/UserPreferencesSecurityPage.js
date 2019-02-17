import React, {Fragment} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Navbar from '../../common/template/Navbar'
import UserPreferencesSideMenu from '../common/UserPreferencesSideMenu'

const UserPreferencesSecurityPage = () => {
  return (
    <Fragment>
      <Navbar />
      <Container>
        <Row>
          <Col>
            <Container className="main-container">
              <Row>
                <Col md="3" className="no-margin-left no-margin-right">
                  <UserPreferencesSideMenu />
                </Col>
                <Col md="9" className="no-margin-left no-margin-right">
                  <Container>
                    <Row>
                      <Col>
                        <div className="user-container margin-top-10">
                          Security
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default UserPreferencesSecurityPage
