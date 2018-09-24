import React, { Component } from 'react';
import logo_small from '../assets/img/logo-small.png';
import avatar from '../assets/img/avatar.png';
import { config } from '../config';
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
import { 
        faCaretDown, 
        faClipboardList, 
        faCamera, 
        faPencilAlt, 
        faTimes,
        faTag,
        faStar as faFullStar,
        faClock,
        faPaperPlane
    } from '@fortawesome/free-solid-svg-icons';

import { faStar as faEmptyStar, faComments } from '@fortawesome/free-regular-svg-icons';

class ActivityFeed extends Component {
    constructor(props) {
        super(props);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.closeTextArea = this.closeTextArea.bind(this);
        this.handlePictureButtonClick = this.handlePictureButtonClick.bind(this);
        this.handleFavoriteButtonClick = this.handleFavoriteButtonClick.bind(this);
        this.state = {
            isOpen: false,
            session: jwtDecode(localStorage.getItem('token')),
            favoriteFilled: false
        };
    }

    toggleNavbar() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    openTextArea() {
        $('#post-content').prop("disabled", false);
        $('.main-container .publish-container .icons').slideUp(function(){
            $('.main-container .publish-container .remove-box').slideDown();
        });
        $('#post-content').focus();
    }

    closeTextArea() {
        $('#post-content').val('');
        $('#post-content').css('height', '');
        $('#post-content').prop("disabled", true);
        $('.main-container .publish-container .remove-box').slideUp(function(){
            $('.main-container .publish-container .icons').slideDown();
        });
    }

    adjustPublishContainer() {
        // Height
        let postContentContent = $('#post-content').val();
        
        if(!postContentContent) {
            $('#post-content').height('24px');
            $('.publish-button').hide();
        }else
        {
            $('.publish-button').show();
        }

        $('.publish-container').height($('#post-content').height());
    }

    handlePictureButtonClick(e) {
        this.refs.fileUploader.click();
    }

    handleFavoriteButtonClick(e) {
        this.setState({favoriteFilled: !this.state.favoriteFilled});
    }

    componentWillMount() {
        $.post(`${config.API_ROOT}/get_firsttime`, { uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') })
          .done(function( data ) {
            let response = JSON.parse(data);
            if(response.success) {
              let firstTime = Boolean(parseInt(response.message, 10));
              localStorage.setItem('firsttime', firstTime);
              if(firstTime) this.props.history.push('/register_confirmation');
            }
          }.bind(this));
    }

    componentDidMount() {
        $('#post-content').parent().height($('#post-content').outerHeight());
    }

    render() {
    return (
        <div>
            <Navbar light expand="md">
                <NavbarBrand href="/"><img src={logo_small} height="40" alt="Logo"/></NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />
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
                        <img src={avatar} alt="Avatar" />
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
                        <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                        <TextareaAutosize id="post-content" placeholder="Poster une publication" onKeyUp={this.adjustPublishContainer} disabled></TextareaAutosize>
                        <div className="icons">
                            <span><FontAwesomeIcon icon={faClipboardList} /></span>
                            <span><FontAwesomeIcon icon={faCamera} onClick={this.handlePictureButtonClick} /></span>
                            <span><FontAwesomeIcon icon={faPencilAlt} onClick={this.openTextArea} /></span>
                        </div>
                        <div className="remove-box">
                            <span><FontAwesomeIcon icon={ faTimes } onClick={this.closeTextArea} /></span>
                        </div>
                        <span className="publish-button"><FontAwesomeIcon icon={faPaperPlane} /></span>
                    </div>
                    <div className="posts-container">
                    <div id="post-1" className="post">
                            <img src={avatar} alt="Avatar" />
                            <div className="title">
                                <h4>Sylvain Urbain</h4>
                                <small>Administrateur</small>
                            </div>
                            <p className="post-content">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius enim lorem, nec posuere dui fermentum eget. Sed semper dignissim nibh, et rhoncus enim volutpat non. Proin condimentum orci id libero facilisis, nec porta nisl fringilla.
                            </p>
                            <Container className="post-details">
                                <Row>
                                    <Col md="3">
                                        <span className="tag"><FontAwesomeIcon icon={faTag} /> Famille</span>
                                    </Col>
                                    <Col md="3">
                                        <span className="fav-counter"><i><FontAwesomeIcon icon={this.state.favoriteFilled ? faFullStar : faEmptyStar} onClick={this.handleFavoriteButtonClick} /></i> 41</span>
                                    </Col>
                                    <Col md="3">
                                        <span className="comment-counter"><FontAwesomeIcon icon={faComments} /> 7</span>    
                                    </Col>
                                    <Col md="3">
                                        <span className="date"><FontAwesomeIcon icon={faClock} /> 14 min.</span>
                                    </Col>
                                </Row>
                            </Container>                    
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
