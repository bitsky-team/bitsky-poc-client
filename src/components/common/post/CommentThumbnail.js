import React, {Component} from 'react'
import {withRouter} from 'react-router'

class CommentThumbnail extends Component {
  componentDidMount = () => {
    if (this.authorBox) {
      let left =
        parseFloat(getComputedStyle(this.authorBox).width.replace('px', '')) +
        15
      this.authorBox.style.left = '-' + left + 'px'
    }
  }

  render() {
    return (
      <div className="post-comment-thumbnail">
        <img
          id={'post-comment-thumnail-' + this.props.id + '-image'}
          src={this.props.author.avatar}
          alt="avatar"
          onClick={() => this.props.history.push(`/profile/${this.props.author.id}`)}
        />
        <span className="author" ref={node => (this.authorBox = node)}>
          {this.props.author.firstname + ' ' + this.props.author.lastname}
        </span>
        <p>{this.props.content}</p>
      </div>
    )
  }
}

export default withRouter(CommentThumbnail)