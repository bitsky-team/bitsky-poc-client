import React, { Component } from 'react'

export default class CommentThumbnail extends Component {

    componentDidMount = () => {
        if (this.authorBox) {
            let left = parseFloat(getComputedStyle(this.authorBox).width.replace('px', '')) + 15
            this.authorBox.style.left = '-' + left + 'px'
        }
    }

    render() {
        return (
        <div className="post-comment-thumbnail">
                <img id={'post-comment-thumnail-'+this.props.id+'-image'} src={this.props.author.avatar} alt='avatar' />
                <span className='author' ref={node => this.authorBox = node}>{this.props.author.firstname + ' ' + this.props.author.lastname}</span>
                <p>{this.props.content}</p>
        </div>
        )
    }
}
