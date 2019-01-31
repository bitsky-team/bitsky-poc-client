import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { config } from '../../config'
import TextareaAutosize from 'react-autosize-textarea'
import _ from 'lodash'
import jwtDecode from 'jwt-decode'
import Post from '../common/post/Post'
import Navbar from '../common/template/Navbar'
import axios from 'axios'
import qs from 'qs'
import Rank from '../common/Rank'

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
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { 
    faClipboardList, 
    faCamera, 
    faPencilAlt, 
    faTimes,
    faPaperPlane,
    faSync
} from '@fortawesome/free-solid-svg-icons'
import SideMenu from './SideMenu'
import Trend from './Trend'

export default class ActivityFeedPage extends Component {

    _isMounted = false

    state = {
        session: (localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null),
        postModal: false,
        tagValue: '',
        posts: [],
        trends: []
    }

    getFirstTime = async () => {
        const response = await axios.post(`${config.API_ROOT}/get_firsttime`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
        return await response
    }

    getPosts = async () => {
        const response = await axios.post(`${config.API_ROOT}/get_allposts`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
        return await response
    }

    getTrends = async () => {
        const response = await axios.post(`${config.API_ROOT}/get_trends`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
        return await response
    }

    storePost = async (content) => {
        const response = await axios.post(`${config.API_ROOT}/store_post`, qs.stringify({ token: localStorage.getItem('token'), owner_uniq_id: localStorage.getItem('id'), content: content.value,  tag: this.state.tagValue }))
        return await response
    }

    deletePost = async (id) => {
        const response = await axios.post(`${config.API_ROOT}/remove_post`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id:  id})) 
        return await response
    }

    resetTrends = () => {
        if(this.trendsContainer) {
            this.trendsContainer.childNodes[1].style.display = 'block'
        }
        
        if(this._isMounted) this.setState({trends: []})
    }

    openTextArea = () => {
        this.postContent.textarea.disabled = false
        this.removeBox.style.display = 'block'
        this.iconsBox.style.display = 'none'
        this.postContent.textarea.focus()
    }

    closeTextArea = () => {
        this.postContent.textarea.value = ''
        this.postContent.textarea.height = ''
        this.postContent.textarea.disabled = true
        this.removeBox.style.display = 'none'
        this.iconsBox.style.display = 'block'
    }

    adjustPublishContainer = () => {
        let postContent = this.postContent.textarea
        let postContentValue = postContent.value
        
        if(!postContentValue) {
            postContent.style.height = '24px'
            this.refs.publishButton.style.display = 'none'
        }else
        {
            this.refs.publishButton.style.display = 'block'
        }

        this.refs.publishContainer.style.height = postContent.style.height
    }

    handlePictureButtonClick = (e) => {
        this.refs.fileUploader.click()
    }

    handlePublishButtonClick = (e) => {
        let content = this.postContent.textarea

        let isContentFilled = _.trim(content.value).length > 0
        let isTagFilled = _.trim(this.state.tagValue).length > 0

        if(isContentFilled && isTagFilled)
        {
            this.storePost(content)
            .then((response) => {
                const {success, postId, ownerRank} = response.data

                if(success && this._isMounted) {
                    let posts = this.state.posts
                    let newPost = (
                        <Post 
                            id={postId} 
                            key={"post-" + postId}
                            ownerAvatar={localStorage.getItem('avatar')}
                            ownerName={this.state.session.firstname + " " + this.state.session.lastname}
                            ownerRank={ownerRank}
                            content={content.value}
                            tag={this.state.tagValue.charAt(0).toUpperCase() + this.state.tagValue.slice(1)}
                            filled={false}
                            favorites={0}
                            comments={0}
                            date={new Date()}
                            isOwner={true}
                            handleDeleteButtonClick={this.handleDeleteButtonClick}
                        />
                    )

                    posts.unshift(newPost)
                    this.setState({posts: posts, tagValue: null})
                    this.setTrends()
                    this.closeTextArea()
                    this.adjustPublishContainer()
                    this.togglePostModal()
                    
                    if (this.postsContainer && this.trendsContainer) {
                        this.postsContainer.childNodes[0].style.display = 'none'
                        this.trendsContainer.childNodes[0].style.display = 'none'
                    }

                    toast.success('Votre publication a été postée !', {
                        autoClose: 5000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                        className: 'notification-success'
                    })
                }
            })
        }
    }

    handleDeleteButtonClick = (e) => {
        e.preventDefault()
        let element = e.target.parentElement.parentElement
        let str_id = element.id
        let id = str_id.split('-')[1]
        let posts = this.state.posts
        posts = posts.filter((p) => { return p.key !== str_id })
        
        this.deletePost(id)
        .then((response) => {
            const { success } = response.data
            if(success) {
                this.setState({posts})
                this.setTrends()
                this.checkEmpty()
                toast.success('La publication a été supprimée !', {
                    autoClose: 5000,
                    position: toast.POSITION.BOTTOM_RIGHT,
                    className: 'notification-success'
                })
            }
        })
    }

    togglePostModal = (e) => {
        // Checking if textarea's content is not empty
        if(this.state.postModal || /\S/.test(this.postContent.textarea.value)) {
            this.setState({
                postModal: !this.state.postModal
            })
        }
    }

    checkEmpty = () => {
        setTimeout(() => {
            if(this.postsContainer && this.trendsContainer) {
                if(this.state.posts.length === 0) {
                    this.postsContainer.childNodes[0].style.display = 'block'
                    this.postsContainer.childNodes[1].style.display = 'none'
                }else {
                    this.postsContainer.childNodes[0].style.display = 'none'
                }
    
                if(this.state.trends.length === 0) {
                    this.trendsContainer.childNodes[0].style.display = 'block'
                    this.trendsContainer.childNodes[1].style.display = 'none'
                }else {
                    this.trendsContainer.childNodes[0].style.display = 'none'
                }
            }
        }, 1000)
    }

    removeLoading = (element) => {
        if(element === 'posts') {
            if(this.postsContainer) {
                this.postsContainer.childNodes[1].style.display = 'none'
            }
        }else if(element === 'trends') {
            if(this.trendsContainer) {
                this.trendsContainer.childNodes[1].style.display = 'none'
            }
        }
    }

    setPosts = () => {
        this.getPosts()
        .then((response) => {
            const { success, posts } = response.data
            if(success && this._isMounted) {
                let statePosts = this.state.posts
                
                posts.forEach((post) => {
                    statePosts.push(<Post 
                        id={post.id} 
                        key={"post-" + post.id}
                        ownerAvatar={post.owner.avatar}
                        ownerName={post.owner.firstname + " " + post.owner.lastname}
                        ownerRank={post.owner.rank}
                        content={post.content}
                        tag={post.tag}
                        filled={false}
                        favorites={post.favorites}
                        comments={post.comments}
                        date={post.created_at}
                        isOwner={(post.owner.firstname + " " + post.owner.lastname) === (this.state.session.firstname + " " + this.state.session.lastname) || this.state.session.rank === 2}
                        handleDeleteButtonClick={this.handleDeleteButtonClick}
                    />)
                })

                this.setState({posts: statePosts})
                this.removeLoading('posts')
                this.checkEmpty()
            }else if(this._isMounted) {
                console.log("Failed loading posts: " + response.message)
            }
        })
    }

    setTrends = () => {
        if(this._isMounted) this.resetTrends()

        this.getTrends()
        .then((response) => {
            const { success, trends } = response.data
            if(success && this._isMounted) {
                let stateTrends = this.state.trends
                
                trends.forEach((trend) => {
                    stateTrends.push(<Trend 
                        key={"trend-" + trend.name}
                        name={trend.name}
                        content={trend.post.content}
                        author={trend.post.owner}
                    />)
                })

                this.setState({trends: stateTrends})
                this.removeLoading('trends')
                this.checkEmpty()
            }else if(this._isMounted) {
                console.log("Failed loading trends: ",response)
            }
        })
    }

    componentDidMount = () => {
        this._isMounted = true

        // Checking firsttime
        this.getFirstTime()
        .then((response) => {
            const { success, message } = response.data
            if(success) {
                let firstTime = Boolean(parseInt(message, 10))
                localStorage.setItem('firsttime', firstTime)
                if(firstTime) this.props.history.push('/register_confirmation')
                else {
                    // Retrieving posts & trends
                    this.setPosts()
                    this.setTrends()
                }
            }
        })
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.postModal} toggle={this.togglePostModal} className={this.props.className}>
                    <ModalBody style={{background: 'white'}}>
                        <Label for="post-tag">Veuillez indiquer le sujet de votre publication</Label>
                        <Input type="text" name="post-tag" id="post-tag" onChange={(e) => this.setState({ tagValue: `${e.target.value}` })} placeholder="Sujet de la publication" />
                    </ModalBody>
                    <ModalFooter style={{background: 'white'}}>
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
                                <p className="rank"><Rank id={ this.state.session.rank } /></p>
                            </div>
                            
                            <SideMenu />
                        </Col>
                        <Col md="5" className="no-margin-left no-margin-right">
                            <div className="publish-container" ref="publishContainer">
                                <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                                <TextareaAutosize id="post-content" ref={postContent => this.postContent = postContent} placeholder="Poster une publication" onKeyUp={this.adjustPublishContainer} disabled></TextareaAutosize>
                                <div className="icons" ref={iconsBox => this.iconsBox = iconsBox}>
                                    <span><FontAwesomeIcon icon={faClipboardList} /></span>
                                    <span onClick={this.handlePictureButtonClick}><FontAwesomeIcon icon={faCamera} /></span>
                                    <span onClick={this.openTextArea}><FontAwesomeIcon icon={faPencilAlt} /></span>
                                </div>
                                <div className="remove-box" ref={removeBox => this.removeBox = removeBox}>
                                    <span onClick={this.closeTextArea}><FontAwesomeIcon icon={ faTimes }  /></span>
                                </div>
                                <span ref='publishButton' className="publish-button" onClick={this.togglePostModal}><FontAwesomeIcon icon={faPaperPlane} /></span>
                            </div>
                            <div className="posts-container" ref={postsContainer => this.postsContainer = postsContainer}>
                                <Alert id="posts-message" color="info" className="info-message">Il n'y a aucune publication pour le moment</Alert>
                                <Alert id="posts-loading" color="info" className="info-message" style={{display:'block'}}>Chargement...</Alert>
                                <div>{ this.state.posts }</div>
                            </div>
                        </Col>
                        <Col md="4" className="no-margin-left no-margin-right">
                            <div className="user-container right-container">
                                <div className="right-container-header">
                                    <h5>Sujets du moment</h5>
                                    <Button color="info" className="refresh-trends" onClick={this.setTrends}><FontAwesomeIcon icon={faSync} /></Button>
                                </div>
                                <hr/>
                                <div ref={trendsContainer => this.trendsContainer = trendsContainer}>
                                    <Alert id="trends-message" color="info" className="info-message">Aucune tendances pour le moment</Alert>
                                    <Alert id="trends-loading" color="info" className="info-message" style={{display:'block'}}>Chargement...</Alert>
                                    <div>{ this.state.trends }</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
  
}