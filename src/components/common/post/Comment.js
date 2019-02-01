import React, { Component } from 'react'
import { config } from '../../../config'
import axios from 'axios'
import qs from 'qs'
import jwtDecode from 'jwt-decode'
import DateService from './../../../services/DateService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faFullStar, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faStar as faEmptyStar, faClock } from '@fortawesome/free-regular-svg-icons'

export default class Comment extends Component {

    _isMounted = false

    state = {
        session: (localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null),
        favorites: this.props.favorites,
        favoriteFilled: false
    }

    isOwner = () => {
        if((this.props.owner.firstname + " " + this.props.owner.lastname) === (this.state.session.firstname + " " + this.state.session.lastname) || this.state.session.rank === 2) {
            return <span className="remove"><FontAwesomeIcon icon={faTimes} onClick={this.remove} /></span>
        }
    }

    remove = () => {
        this.props.remove(this.props.id)
    }

    getContent = () => {
        return {__html: this.props.content}
    }

    addFavorite = async () => {
        const response = await axios.post(`${config.API_ROOT}/post_add_comment_favorite`, qs.stringify({ 
            uniq_id: localStorage.getItem('id'), 
            token: localStorage.getItem('token'), 
            post_comment_id: this.props.id
        }))

        if(response.data.success) {
            this.setState({favorites: this.state.favorites + 1, favoriteFilled: true})            
        } else {
            console.error(response.data)
        }
    }

    removeFavorite = async () => {
        const response = await axios.post(`${config.API_ROOT}/post_remove_comment_favorite`, qs.stringify({ 
            uniq_id: localStorage.getItem('id'), 
            token: localStorage.getItem('token'), 
            post_comment_id: this.props.id
        }))

        if(response.data.success) {
            this.setState({favorites: this.state.favorites - 1, favoriteFilled: false})            
        }
    }

    toggleFavorite = () => {
        if(!this.state.favoriteFilled) {
            this.addFavorite()
        } else {
            this.removeFavorite()
        }
    }

    checkFavorite = async () => {
        const response = await axios.post(`${config.API_ROOT}/post_get_user_comment_favorite`, qs.stringify({ 
            uniq_id: localStorage.getItem('id'), 
            token: localStorage.getItem('token'), 
            post_comment_id: this.props.id
        }))

        const { success, favorite } = response.data

        if(success && this._isMounted) {
            this.setState({ favoriteFilled: favorite })
        } else {
            console.error(response.data)
        }
    }

    componentDidMount = () => {
        this._isMounted = true

        if (this.authorBox) {
            let left = parseFloat(getComputedStyle(this.authorBox).width.replace('px', '')) + 12
            this.authorBox.style.left = '-' + left + 'px'
        }

        this.checkFavorite()
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    render = () => {
        return (
            <div className="comment">
                <img src={this.props.owner.avatar} alt="avatar" />
                <span className='author' ref={node => this.authorBox = node}>{this.props.owner.firstname + ' ' + this.props.owner.lastname}</span>
                <div className="content">
                    <p dangerouslySetInnerHTML={this.getContent()} />
                    {this.isOwner()}
                </div>
                <div className="comment-infos">
                    <span className="favorites"><FontAwesomeIcon style={{cursor:'pointer'}} icon={(this.state.favoriteFilled) ? faFullStar : faEmptyStar}  onClick={this.toggleFavorite} /> {this.state.favorites}</span>
                    <span className="date"><FontAwesomeIcon icon={faClock} /> {DateService.timeSince(this.props.date)}</span>
                </div>
            </div>
        )
    }

}