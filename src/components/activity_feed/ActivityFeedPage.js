import React, { Component } from 'react';
import avatar from '../../assets/img/avatar.png';
import { toast } from 'react-toastify';
import { config } from '../../config';
import TextareaAutosize from 'react-autosize-textarea';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
import Post from '../common/post/Post';
import RankService from '../../services/RankService';
import Navbar from '../common/template/Navbar';
import axios from 'axios';
import qs from 'qs';

import { 
    Container, 
    Row, 
    Col,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Label,
    Input, 
    Alert
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { 
    faClipboardList, 
    faCamera, 
    faPencilAlt, 
    faTimes,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import SideMenu from './SideMenu';
import Trend from './Trend';

export default class ActivityFeedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: jwtDecode(localStorage.getItem('token')),
            postModal: false,
            posts: [],
            trends: []
        };
    }

    openTextArea() {
        $('#post-content').prop("disabled", false);
        $('.main-container .publish-container .icons').slideUp(function(){
            $('.main-container .publish-container .remove-box').slideDown();
        });
        $('#post-content').focus();
    }

    closeTextArea = (e) => {
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

    handlePictureButtonClick = (e) => {
        this.refs.fileUploader.click();
    }

    handlePublishButtonClick = (e) => {
        let content = $('#post-content');
        let tag = $('#post-tag');

        let isContentFilled = $.trim(content.val()).length > 0;
        let isTagFilled = $.trim(tag.val()).length > 0;

        if(isContentFilled && isTagFilled)
        {
            axios.post(`${config.API_ROOT}/store_post`, qs.stringify({ token: localStorage.getItem('token'), owner_uniq_id: localStorage.getItem('id'), content: content.val(),  tag: tag.val() }))
            .then(function(response) {
                response = response.data;
                if(response.success) {
                    let posts = this.state.posts;
                    let newPost = (
                        <Post 
                            id={response.postId} 
                            key={"post-" + response.postId}
                            ownerName={this.state.session.firstname + " " + this.state.session.lastname}
                            ownerRank={RankService.translate(response.ownerRank)}
                            content={content.val()}
                            tag={tag.val().charAt(0).toUpperCase() + tag.val().slice(1)}
                            filled={false}
                            favorites={0}
                            comments={0}
                            date={new Date()}
                            isOwner={true}
                            handleDeleteButtonClick={this.handleDeleteButtonClick}
                        />
                    );
                    posts.unshift(newPost);
                    this.setState({posts: posts});
                    this.getTrends();
                    this.closeTextArea();
                    this.adjustPublishContainer();
                    this.togglePostModal();
                    toast.success('Votre publication a été postée !', {
                        autoClose: 5000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                        className: 'notification-success'
                    });
                }
            }.bind(this));
        }
    }

    handleDeleteButtonClick = (e) => {
        e.preventDefault();
        let str_id = e.target.parentElement.parentElement.id;
        let id = str_id.split('-')[1];
        let posts = this.state.posts;
        posts = posts.filter((p) => { return p.key !== str_id });
        axios.post(`${config.API_ROOT}/remove_post`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id:  id}))
          .then(function(response) {
            response = response.data;
            if(response.success) {
                $('#post-'+id).fadeOut(function(){ $(this).remove(); this.setState({posts}); }.bind(this));
            }
        }.bind(this));
    }

    togglePostModal = (e) => {
        // Checking if textarea's content is not empty
        if(this.state.postModal || /\S/.test($('#post-content').val())) {
            this.setState({
                postModal: !this.state.postModal
            });
        }
    }

    getPosts = () => {
        axios.post(`${config.API_ROOT}/get_allposts`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
        .then(function(response) {
            response = response.data;
            if(response.success) {
                let posts = response.posts;
                let statePosts = this.state.posts;
                
                posts.forEach((post) => {
                    statePosts.push(<Post 
                        id={post.id} 
                        key={"post-" + post.id}
                        ownerName={post.owner.firstname + " " + post.owner.lastname}
                        ownerRank={RankService.translate(post.owner.rank)}
                        content={post.content}
                        tag={post.tag}
                        filled={false}
                        favorites={post.favorites}
                        comments={post.comments}
                        date={post.created_at}
                        isOwner={(post.owner.firstname + " " + post.owner.lastname) === (this.state.session.firstname + " " + this.state.session.lastname)}
                        handleDeleteButtonClick={this.handleDeleteButtonClick}
                    />);
                });
                this.setState({posts: statePosts});

                document.getElementById('posts-loading').style.display = 'none';
            }else {
                console.log("Failed loading posts: " + response.message);
            }
        }.bind(this));
    }

    getTrends = () => {
        this.setState({trends: []})
        axios.post(`${config.API_ROOT}/get_trends`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
        .then(function(response) {
            response = response.data;
            if(response.success) {
                let trends = response.trends;
                let stateTrends = this.state.trends;
                
                trends.forEach((trend) => {
                    stateTrends.push(<Trend 
                        key={"trend-" + trend.name}
                        name={trend.name}
                        content={trend.post.content}
                        author={trend.post.owner}
                    />);
                });
                this.setState({trends: stateTrends});

                document.getElementById('trends-loading').style.display = 'none';
            }else {
                console.log("Failed loading posts: " + response.message);
            }
        }.bind(this));
    }

    componentWillMount() {
        // Checking firsttime
        axios.post(`${config.API_ROOT}/get_firsttime`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
          .then(function(response) {
            response = response.data;
            if(response.success) {
              let firstTime = Boolean(parseInt(response.message, 10));
              localStorage.setItem('firsttime', firstTime);
              if(firstTime) this.props.history.push('/register_confirmation');
            }
        }.bind(this));

        // Retrieving posts
        this.getPosts();

        // Retrieving trends
        this.getTrends();
    }

    componentDidMount() {
        $('#post-content').parent().height($('#post-content').outerHeight());
    }

    componentDidUpdate() {
        if(this.state.posts.length <= 0) {
            document.getElementById('posts-message').style.display = 'block';
        }else {
            document.getElementById('posts-message').style.display = 'none';
        }

        if(this.state.trends.length <= 0) {
            document.getElementById('trends-message').style.display = 'block';
        }else {
            document.getElementById('trends-message').style.display = 'none';
        }
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.postModal} toggle={this.togglePostModal} className={this.props.className}>
                    <ModalBody>
                        <Label for="post-tag">Veuillez indiquer le sujet de votre publication</Label>
                        <Input type="text" name="post-tag" id="post-tag" placeholder="Sujet de la publication" />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="modal-choice" color="primary" onClick={this.handlePublishButtonClick}><FontAwesomeIcon icon={ faPaperPlane } /></Button>{' '}
                        <Button className="modal-choice" color="secondary" onClick={this.togglePostModal}><FontAwesomeIcon icon={ faTimes }/></Button>
                    </ModalFooter>
                </Modal>

                <Navbar/>

                <Container className="main-container">
                <Row>
                    <Col md="3" className="no-margin-left no-margin-right">
                        <div className="user-container">
                            <img src={avatar} alt="Avatar" />
                            <h5>{ this.state.session.firstname + ' ' + this.state.session.lastname }</h5>
                            <p className="rank">{ RankService.translate(this.state.session.rank) }</p>
                            <SideMenu />
                        </div>
                    </Col>
                    <Col md="5" className="no-margin-left no-margin-right">
                        <div className="publish-container">
                            <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                            <TextareaAutosize id="post-content" placeholder="Poster une publication" onKeyUp={this.adjustPublishContainer} disabled></TextareaAutosize>
                            <div className="icons">
                                <span><FontAwesomeIcon icon={faClipboardList} /></span>
                                <span onClick={this.handlePictureButtonClick}><FontAwesomeIcon icon={faCamera} /></span>
                                <span onClick={this.openTextArea}><FontAwesomeIcon icon={faPencilAlt} /></span>
                            </div>
                            <div className="remove-box">
                                <span onClick={this.closeTextArea}><FontAwesomeIcon icon={ faTimes }  /></span>
                            </div>
                            <span className="publish-button" onClick={this.togglePostModal}><FontAwesomeIcon icon={faPaperPlane} /></span>
                        </div>
                        <div className="posts-container">
                            <Alert id="posts-message" color="info" className="info-message">Il n'y a aucune publication pour le moment</Alert>
                            <Alert id="posts-loading" color="info" className="info-message" style={{display:'block'}}>Chargement...</Alert>
                            <div>{ this.state.posts }</div>
                        </div>
                    </Col>
                    <Col md="4" className="no-margin-left no-margin-right">
                        <div className="user-container right-container">
                            <h5>Sujets du moment</h5>
                            <hr/>
                            <Alert id="trends-message" color="info" className="info-message">Aucune tendances pour le moment</Alert>
                            <Alert id="trends-loading" color="info" className="info-message" style={{display:'block'}}>Chargement...</Alert>
                            <div>{ this.state.trends }</div>
                        </div>
                    </Col>
                </Row>
                </Container>
            </div>
        );
    }
  
}