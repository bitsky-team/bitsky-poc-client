import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CommentThumbnail from './CommentThumbnail';

export default class Comments extends Component {

    state = {
        comments: []
    }

    componentWillMount = () => {
        let comments = [
            {
                'id': 1,
                'author': {
                    'avatar': 'https://static-cdn.jtvnw.net/jtv_user_pictures/dogdog-profile_image-5550ade194780dfc-300x300.jpeg',
                    'firstname': 'Snoop',
                    'lastname': 'Doggydog'
                },
                'content': 'Je suis complètement d\'accord'
            },
            {
                'id': 2,
                'author': {
                    'avatar': 'https://static-cdn.jtvnw.net/jtv_user_pictures/dogdog-profile_image-5550ade194780dfc-300x300.jpeg',
                    'firstname': 'Snoop',
                    'lastname': 'Doggydog'
                },
                'content': 'Je suis complètement pas d\'accord'
            },
            {
                'id': 3,
                'author': {
                    'avatar': 'https://static-cdn.jtvnw.net/jtv_user_pictures/dogdog-profile_image-5550ade194780dfc-300x300.jpeg',
                    'firstname': 'Snoopazeaze',
                    'lastname': 'Doggydogazeazeaze'
                },
                'content': 'Je suis complètement très d\'accord'
            }
        ]

        let  stateComments = this.state.comments

        comments.forEach((comment) => {
            stateComments.push(
                <CommentThumbnail
                    key={'comment-thumbnail-' + comment.id}
                    id={comment.id}
                    author={comment.author}
                    content={comment.content}
                />
            )
        })
    }

    componentDidMount = () => {
        if (this.postComments) {
            this.postComments.style.marginBottom = '-' + getComputedStyle(this.postComments).height
        }
    }

    toggle = () => {
        const postComments = this.postComments;

        if (postComments) {
            let marginBottom = parseFloat(getComputedStyle(this.postComments).marginBottom.replace('px', ''))
            let translateY = this.getComputedTranslateY(this.postComments)
            let reversedHeight = parseFloat('-' + getComputedStyle(this.postComments).height)

            if (translateY === reversedHeight) { // Down
                if (this.closeBox) { this.closeBox.style.display = 'block' }
                if (this.seeMoreButton) { this.seeMoreButton.style.display = 'flex' }
                let id = setInterval(() => {
                    if (translateY === 0) {
                        clearInterval(id)
                    } else {
                        translateY = translateY + 2
                        marginBottom = marginBottom + 2

                        this.postComments.style.transform = 'translateY('+ translateY +'px)'
                        this.postComments.style.marginBottom = marginBottom + 'px'
                    }
                }, 5)
            } else if (translateY === 0) { // Up
                let id = setInterval(() => {
                    if (translateY === reversedHeight) {
                        if (this.closeBox) { this.closeBox.style.display = 'none' }
                        if(this.seeMoreButton) { this.seeMoreButton.style.display = 'none' }
                        clearInterval(id)
                    } else {
                        translateY = translateY - 2
                        marginBottom = marginBottom - 2

                        this.postComments.style.transform = 'translateY('+ translateY +'px)'
                        this.postComments.style.marginBottom = marginBottom + 'px'
                    }
                }, 5)
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

    render() {
        return (
            <div className="post-comments-container">
                <div className="post-comments" ref={node => this.postComments = node}>
                    {this.state.comments}

                    <div style={{ display: 'none', justifyContent: 'center', alignItems: 'center' }} ref={node => this.seeMoreButton = node}>
                        <div className="buttonBox">
                            <Button color="info" className="see-more-button">Voir plus</Button>
                        </div>
                    </div>
                    <span className="closebox" ref={node => this.closeBox = node} onClick={this.toggle}><FontAwesomeIcon icon={faChevronUp} /></span>
                </div>
            </div>
        )
    }
}
