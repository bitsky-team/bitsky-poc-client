import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CommentThumbnail from './CommentThumbnail'
import PostViewer from './PostViewer'
import { config } from '../../../config'
import axios from 'axios'
import qs from 'qs'

export default class BestComments extends Component {

    _isMounted = false

    state = {
        comments: []
    }

    constructor(props) {
        super(props)
        this.postViewer = React.createRef()
    }

    getBestComments = async () => {
        const response = await axios.post(`${config.API_ROOT}/get_bestcomments`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id: this.props.id }))
        return await response
    }

    setBestComments = () => {
        this.getBestComments().then((response) => {
            const { success, comments } = response.data

            if (success && this._isMounted) {
                let stateComments = []

                comments.forEach((comment) => {
                    stateComments.push(
                        <CommentThumbnail
                            key={'comment-thumbnail-' + comment.id}
                            id={comment.id}
                            author={comment.owner}
                            content={comment.content}
                        />
                    )
                })

                this.setState({comments: stateComments})
                this.adjustMargin()
            }
        })
    }

    componentDidMount = () => {
        this._isMounted = true
        this.setBestComments()
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    adjustMargin = () => {
        if (this.postComments) {
            let height = parseInt(Math.round(parseFloat(getComputedStyle(this.postComments).height)))
            this.postComments.style.transform = 'translateY(-100%)'
            this.postComments.style.marginBottom = '-' + (height-10) + 'px'
        }
    }

    toggle = () => {
        const postComments = this.postComments;

        if (postComments && this.state.comments.length > 0) {
            let marginBottom = parseFloat(getComputedStyle(this.postComments).marginBottom.replace('px', ''))
            let translateY = this.getComputedTranslateY(this.postComments)
            let reversedHeight = parseInt('-' + Math.round(parseFloat(getComputedStyle(this.postComments).height.replace('px', '').replace(',', '.'))))

            if (translateY === reversedHeight) { // Down
                if (this.closeBox) { this.closeBox.style.display = 'block' }
                if (this.seeMoreButton) { this.seeMoreButton.style.display = 'flex' }
                let id = setInterval(() => {
                    if (translateY === 0) {
                        clearInterval(id)
                    } else {
                        translateY = translateY + 1
                        marginBottom = marginBottom + 1

                        if(this.postComments) {
                            this.postComments.style.transform = 'translateY('+ translateY +'px)'
                            this.postComments.style.marginBottom = marginBottom + 'px'
                        }
                    }
                }, 1)
            } else if (translateY === 0) { // Up
                let id = setInterval(() => {
                    if (translateY === reversedHeight) {
                        if (this.closeBox) { this.closeBox.style.display = 'none' }
                        if(this.seeMoreButton) { this.seeMoreButton.style.display = 'none' }
                        clearInterval(id)
                    } else {
                        translateY = translateY - 1
                        marginBottom = marginBottom - 1

                        if(this.postComments) {
                            this.postComments.style.transform = 'translateY('+ translateY +'px)'
                            this.postComments.style.marginBottom = marginBottom + 'px'
                        }
                    }
                }, 1)
            }
        }
    }

    getComputedTranslateY(obj) {
        if(!window.getComputedStyle) return;
        let style = getComputedStyle(obj),
            transform = style.transform || style.webkitTransform || style.mozTransform;
        let mat = transform.match(/^matrix3d\((.+)\)$/);
        if(mat) return parseFloat(mat[1].split(', ')[13]);
        mat = transform.match(/^matrix\((.+)\)$/);
        return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    }

    handleSeeMoreClick = () => {
        this.postViewer.current.toggle()
    }

    render() {
        return (
            <div className="post-comments" ref={node => this.postComments = node}>
                {this.state.comments}

                <div style={{ display: 'none', justifyContent: 'center', alignItems: 'center' }} ref={node => this.seeMoreButton = node}>
                    <div className="buttonBox">
                        <Button color="info" className="see-more-button" onClick={this.handleSeeMoreClick}>Voir plus</Button>
                    </div>
                </div>
                <span className="closebox" ref={node => this.closeBox = node} onClick={this.toggle}><FontAwesomeIcon icon={faChevronUp} /></span>

                <PostViewer 
                    ref={this.postViewer} 
                    id={this.props.id} 
                    toggleFavoriteFromActivityFeed={this.props.toggleFavoriteFromActivityFeed} 
                    increaseCommentCounterFromActivityFeed={this.props.increaseCommentCounterFromActivityFeed}
                    decreaseCommentCounterFromActivityFeed={this.props.decreaseCommentCounterFromActivityFeed} 
                    toggleBestComments={this.toggle}
                    refreshBestComments={this.setBestComments} 
                    adjustBestComments={this.adjustMargin}
                    setCommentsCount={this.props.setCommentsCount}
                />
            </div>
        )
    }

}
