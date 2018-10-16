import React, { Component } from 'react';
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
    faPaperPlane,
    faSync
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
        document.getElementById('post-content').disabled = false;
        document.querySelectorAll('.main-container .publish-container .remove-box')[0].style.display = 'block';
        document.querySelectorAll('.main-container .publish-container .icons')[0].style.display = 'none';
        document.getElementById('post-content').focus();
    }

    closeTextArea() {
        document.getElementById('post-content').value = '';
        document.getElementById('post-content').height = '';
        document.getElementById('post-content').disabled = true;
        document.querySelectorAll('.main-container .publish-container .remove-box')[0].style.display = 'none';
        document.querySelectorAll('.main-container .publish-container .icons')[0].style.display = 'block';
    }

    adjustPublishContainer = () => {
        let postContent = document.getElementById('post-content');
        let postContentValue = postContent.value;
        
        if(!postContentValue) {
            postContent.style.height = '24px';
            this.refs.publishButton.style.display = 'none';
        }else
        {
            this.refs.publishButton.style.display = 'block';
        }

        this.refs.publishContainer.style.height = postContent.style.height;
    }

    handlePictureButtonClick = (e) => {
        this.refs.fileUploader.click();
    }

    handlePublishButtonClick = (e) => {
        let content = document.getElementById('post-content');
        let tag = document.getElementById('post-tag');

        let isContentFilled = $.trim(content.value).length > 0;
        let isTagFilled = $.trim(tag.value).length > 0;

        if(isContentFilled && isTagFilled)
        {
            axios.post(`${config.API_ROOT}/store_post`, qs.stringify({ token: localStorage.getItem('token'), owner_uniq_id: localStorage.getItem('id'), content: content.value,  tag: tag.value }))
            .then(function(response) {
                response = response.data;
                if(response.success) {
                    let posts = this.state.posts;
                    let newPost = (
                        <Post 
                            id={response.postId} 
                            key={"post-" + response.postId}
                            ownerAvatar={localStorage.getItem('avatar')}
                            ownerName={this.state.session.firstname + " " + this.state.session.lastname}
                            ownerRank={RankService.translate(response.ownerRank)}
                            content={content.value}
                            tag={tag.value.charAt(0).toUpperCase() + tag.value.slice(1)}
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
        let element = e.target.parentElement.parentElement;
        let str_id = element.id;
        let id = str_id.split('-')[1];
        let posts = this.state.posts;
        posts = posts.filter((p) => { return p.key !== str_id });
        axios.post(`${config.API_ROOT}/remove_post`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id:  id}))
          .then(function(response) {
            response = response.data;
            if(response.success) {
                this.setState({posts});
                this.getTrends();
                toast.success('La publication a été supprimée !', {
                    autoClose: 5000,
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'notification-success'
                });
            }
        }.bind(this));
    }

    togglePostModal = (e) => {
        // Checking if textarea's content is not empty
        if(this.state.postModal || /\S/.test(document.getElementById('post-content').value)) {
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
                        ownerAvatar={post.owner.avatar}
                        ownerName={post.owner.firstname + " " + post.owner.lastname}
                        ownerRank={RankService.translate(post.owner.rank)}
                        content={post.content}
                        tag={post.tag}
                        filled={false}
                        favorites={post.favorites}
                        comments={post.comments}
                        date={post.created_at}
                        isOwner={(post.owner.firstname + " " + post.owner.lastname) === (this.state.session.firstname + " " + this.state.session.lastname) || this.state.session.rank === 2}
                        handleDeleteButtonClick={this.handleDeleteButtonClick}
                    />);
                });

                this.setState({posts: statePosts});
                let postsLoading = document.getElementById('posts-loading');
                if(postsLoading) postsLoading.style.display = 'none';
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

                let trendsLoading = document.getElementById('trends-loading');
                if(trendsLoading) trendsLoading.style.display = 'none';
            }else {
                console.log("Failed loading trends: " + response.message);
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
              else {
                // Retrieving posts & trends
                this.getPosts();
                this.getTrends();
              }
            }
        }.bind(this));
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
                            <img src={localStorage.getItem('avatar')} alt="Avatar" />
                            <h5>{ this.state.session.firstname + ' ' + this.state.session.lastname }</h5>
                            <p className="rank">{ RankService.translate(this.state.session.rank) }</p>
                            <SideMenu />
                        </div>
                    </Col>
                    <Col md="5" className="no-margin-left no-margin-right">
                        <div className="publish-container" ref="publishContainer">
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
                            <span ref='publishButton' className="publish-button" onClick={this.togglePostModal}><FontAwesomeIcon icon={faPaperPlane} /></span>
                        </div>
                        <div className="posts-container">
                            <Alert id="posts-message" color="info" className="info-message">Il n'y a aucune publication pour le moment</Alert>
                            <Alert id="posts-loading" color="info" className="info-message" style={{display:'block'}}>Chargement...</Alert>
                            <div>{ this.state.posts }</div>
                        </div>
                    </Col>
                    <Col md="4" className="no-margin-left no-margin-right">
                        <div className="user-container right-container">
                            <div className="right-container-header">
                                <h5>Sujets du moment</h5>
                                <Button color="info" className="refresh-trends" onClick={this.getTrends}><FontAwesomeIcon icon={faSync} /></Button>
                            </div>
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