import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {emojify} from 'react-emojione'

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
          onClick={() => {
            if(this.props.fromStranger) {
              this.props.history.push(`/profile/${this.props.author.id}/${this.props.fromStranger}`)
            } else {
              this.props.history.push(`/profile/${this.props.author.id}`)
            }
          }}
        />
        <span className="author" ref={node => (this.authorBox = node)}>
          {this.props.author.firstname + ' ' + this.props.author.lastname}
        </span>
        <p>{emojify(this.props.content, {output: 'unicode'})}</p>
      </div>
    )
  }
}

export default withRouter(CommentThumbnail)