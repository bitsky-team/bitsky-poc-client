import React, { Component } from 'react';
import logo_small from '../assets/img/logo-small.png';
import avatar from '../assets/img/avatar.png';
import TextareaAutosize from 'react-autosize-textarea';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
import { Container, Row, Col, Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, 
    Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faClipboardList, faCamera, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

class ActivityFeed extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };

        if(localStorage.getItem('token')){
            this.state = {
                session: jwtDecode(localStorage.getItem('token'))
            }
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentDidMount() {
        $('#post-content').parent().height($('#post-content').outerHeight());
        console.log(this.state);
    }

    render() {
    return (
        <div>
            <Navbar light expand="md">
                <NavbarBrand href="/"><img src={logo_small} height="40" alt="Logo"/></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav>
                                { this.state.session.firstname + ' ' + this.state.session.lastname } <FontAwesomeIcon icon={faCaretDown} />
                            </DropdownToggle>
                            <DropdownMenu right>
                            <DropdownItem>
                                Option 1
                            </DropdownItem>
                            <DropdownItem>
                                Option 2
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={(e) => {localStorage.removeItem('id'); localStorage.removeItem('token'); this.props.history.push('/login');}}>
                                Déconnexion
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
            <Container className="main-container">
            <Row>
                <Col md="3" className="no-margin-left no-margin-right">
                    <div className="user-container">
                        <img src={avatar} alt="Logo" />
                        <h5>Jason Van Malder</h5>
                        <p className="rank">Administrateur</p>
                        <hr/>
                        <p className="text-left">Activité</p>
                        <div className="badge pink text-left">
                            <span><strong>174</strong></span>
                            <span>Publications postées</span>
                        </div>
                        <div className="badge blue text-left">
                            <span><strong>225</strong></span>
                            <span>Fichiers téléchargés</span>
                        </div>
                    </div>
                </Col>
                <Col md="5" className="no-margin-left no-margin-right">
                    <div className="publish-container">
                        <TextareaAutosize id="post-content" placeholder="Poster une publication" disabled></TextareaAutosize>
                        <div className="icons">
                            <span><FontAwesomeIcon icon={faClipboardList} /></span>
                            <span><FontAwesomeIcon icon={faCamera} /></span>
                            <span><FontAwesomeIcon icon={faPencilAlt} /></span>
                        </div>
                    </div>
                </Col>
                <Col md="4" className="no-margin-left no-margin-right">
                    <div className="user-container right-container">
                        <h5>Sujets du moment</h5>
                        <hr/>
                        <p>Famille</p>
                        <div>
                            <p>Lorem LoremLoremLoremLorem Loremvv LoremLorem Lorem...</p>
                            <small>Par <a href={null}>Sylvain Urbain</a></small>
                        </div>
                        <Button color="info" className="see-more-button">Voir plus</Button>{' '}
                        <p>Anniversaire de Rara</p>
                        <div>
                            <p>Lorem LoremLoremLoremLorem Loremvv LoremLorem Lorem...</p>
                            <small>Par <a href={null}>Sylvain Urbain</a></small>
                        </div>
                        <Button color="info" className="see-more-button">Voir plus</Button>{' '}
                    </div>
                </Col>
            </Row>
            </Container>
        </div>
    );
    }
  
}

export default ActivityFeed;
