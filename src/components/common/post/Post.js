import React, { Component } from 'react'
import { config } from '../../../config'
import DateService from '../../../services/DateService'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faStar as faFullStar, faClock, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faStar as faEmptyStar, faComments } from '@fortawesome/free-regular-svg-icons'

import { Container, Row, Col } from 'reactstrap'
import axios from 'axios'
import qs from 'qs'
import Rank from '../../common/Rank'
import Comments from './Comments';

class Post extends Component {

    state = {
        favoriteFilled: this.props.favoriteFilled,
        favorites: this.props.favorites,
        comments: this.props.comments
    }

    constructor(props) {
        super(props)
        this.postComments = React.createRef()
    }

    isOwner() {
        if(this.props.isOwner) {
            return <FontAwesomeIcon className="delete" icon={faTimes} onClick={this.props.handleDeleteButtonClick}/>
        }
    }

    handleFavoriteButtonClick = (e) => {
        this.setState({favoriteFilled: !this.state.favoriteFilled})
        if(this.state.favoriteFilled) {
            this.removeFavorite().then(() => {
                this.setState({favorites: this.state.favorites - 1})
            })
        }else {
            this.addFavorite().then(() => {
                this.setState({favorites: this.state.favorites + 1})
            })
        }
    }

    addFavorite = async () => {
        await axios.post(`${config.API_ROOT}/post_add_favorite`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id: this.props.id }))
    }

    removeFavorite = async () => {
        await axios.post(`${config.API_ROOT}/post_remove_favorite`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id: this.props.id }))
    }

    checkFavorite = async () => {
        const response = await axios.post(`${config.API_ROOT}/post_get_user_favorite`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id: this.props.id }))
        const { success, favorite } = response.data
       
        if (success && favorite) {
            this.setState({ favoriteFilled: true })
        }
    }

    getContent() {
        return {__html: this.props.content}
    }

    handleCommentCounterClick = () => {
        if (this.state.comments > 0) {
            this.postComments.current.toggle()
        }
    }

    componentDidMount() {
        if (this.commentCounter && this.state.comments > 0) {
            this.commentCounter.style.cursor = 'pointer'
        }

        this.checkFavorite()
    }

    render() {
        return (
            <div className="post-container">
                <div id={"post-"+this.props.id} className="post">
                    {this.isOwner()}
                    <img src={this.props.ownerAvatar} alt="Avatar" />
                    <div className="title">
                        <h4>{this.props.ownerName}</h4>
                        <small><Rank id={this.props.ownerRank} /></small>
                    </div>
                    <p className="post-content" dangerouslySetInnerHTML={this.getContent()}></p>
                    <Container className="post-details">
                        <Row>
                            <Col md="4" className="text-left">
                                <span className="tag"><FontAwesomeIcon icon={faTag} /> {this.props.tag}</span>
                            </Col>
                            <Col md="4" className="text-center counter-container">
                                <span className="fav-counter"><i><FontAwesomeIcon icon={this.state.favoriteFilled ? faFullStar : faEmptyStar} onClick={this.handleFavoriteButtonClick} /></i> {this.state.favorites}</span>
                                {' '}
                                <span className="comment-counter" onClick={this.handleCommentCounterClick} ref={node => this.commentCounter = node}><FontAwesomeIcon icon={faComments} /> {this.state.comments}</span>
                            </Col>
                            <Col md="4" className="text-right">
                                <span className="date"><FontAwesomeIcon icon={faClock} /> {DateService.timeSince(this.props.date)}</span>
                            </Col>
                        </Row>
                    </Container>                    
                </div>
                <Comments ref={this.postComments} />
            </div>
        )
    }
    
}

export default Post