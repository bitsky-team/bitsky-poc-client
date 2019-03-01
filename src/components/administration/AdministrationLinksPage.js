import React, {useState} from 'react'
import {Container, Row, Col} from 'reactstrap'
import AdministrationSideMenu from './common/AdministrationSideMenu'
import jwtDecode from 'jwt-decode'
import Navbar from '../common/template/Navbar'
import Rank from '../common/Rank'
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

const ModuleContainer = styled.div`
  && {
    padding: 10px 30px !important;
    display: flex;
  }
`

const KeyTitleContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
`

const KeyContainer = styled.div`
    padding: 10px;
    background-color: #f5f7f8;
    border-radius: 5px 0 0 5px;
    margin: 10px 0 0 0;
    width: initial;
    font-size: 30px;
`

const KeyMainContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`

const KeyButton = styled.button`
    && {
        height: 65px;
        margin-top: 10px;
        border-radius: 0 5px 5px 0;
        font-size: 18px;
    }
`

export const AdministrationLinksPage = () => {

    const [session] = useState(
        localStorage.getItem('token')
            ? jwtDecode(localStorage.getItem('token'))
            : null
    )

    return (
        <div>
            <Navbar />
            <Container className="main-container">
                <Row>
                    <Col md="3" className="no-margin-left no-margin-right">
                        <div className="user-container">
                            <img src={localStorage.getItem('avatar')} alt="Avatar" />
                            <h5>{session.firstname + ' ' + session.lastname}</h5>
                            <p className="rank">
                                <Rank id={session.rank} />
                            </p>
                        </div>

                        <AdministrationSideMenu />
                    </Col>
                    <Col md="9" className="no-margin-left no-margin-right">
                        <ModuleContainer className="user-container no-center admin-dashboard">
                            <KeyTitleContainer>
                                <h4>Votre clé</h4>
                                <KeyMainContainer>
                                    <KeyContainer>
                                        <span>aba5fd11e54F5EZF</span>
                                    </KeyContainer>
                                    <KeyButton className="btn btn-info"><FontAwesomeIcon icon={faCopy} /></KeyButton>
                                </KeyMainContainer>
                            </KeyTitleContainer>
                        </ModuleContainer>
                        <ModuleContainer className="user-container no-center admin-dashboard">
                            <h4>Se lier avec un autre Bitsky</h4>
                        </ModuleContainer>
                        <ModuleContainer className="user-container no-center admin-dashboard">
                            <h4>Liaisons</h4>
                        </ModuleContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
