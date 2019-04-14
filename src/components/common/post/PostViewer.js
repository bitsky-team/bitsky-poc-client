import React from 'react'
import {Modal, ModalBody} from 'reactstrap'
import DateService from '../../../services/DateService'
import {config} from '../../../config'
import jwtDecode from 'jwt-decode'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faTag,
  faStar as faFullStar,
  faClock,
  faTimes,
  faPencilAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import {
  faStar as faEmptyStar,
  faComments,
} from '@fortawesome/free-regular-svg-icons'
import {Container, Row, Col} from 'reactstrap'
import Rank from '../../common/Rank'
import axios from 'axios'
import qs from 'qs'
import TextareaAutosize from 'react-autosize-textarea'
import {toast} from 'react-toastify'
import Comment from './Comment'
import Loader from '../../Loader'
import Fade from 'react-reveal/Fade';
import {emojify} from 'react-emojione'

export default class PostViewer extends React.Component {
  _isMounted = false

  state = {
    session: localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null,
    open: false,
    post: null,
    favoriteFilled: false,
    favorites: 0,
    loadingComments: true,
    commentsCount: 0,
    comments: [],
    score: '?',
  }

  toggle = () => {
    if (this._isMounted) {
      if (!this.state.open) {
        this.resetComments()
        this.setComments()
        this.setCommentsCount()
        this.setScore()
        if (this.props.refreshTrends) this.props.refreshTrends()
        this.props.toggleBestComments()
      }

      this.setState({open: !this.state.open})
    }
  }

  getContent() {
    return {__html: emojify(this.state.post.content, {output: 'unicode'})}
  }

  getPost = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/get_post`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
        bitsky_ip: this.props.fromStranger
      })
    )
    return await response
  }

  setPost = () => {
    this.getPost().then(response => {
      const {success, post} = response.data

      if (success && this._isMounted) {
        this.setState({
          post,
          favorites: post.favorites,
          commentsCount: post.comments,
        })
        this.setComments()
        this.checkFavorite()
      }
    })
  }

  getScore = async () => {
    return await axios.post(
      `${config.API_ROOT}/get_post_score`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
        bitsky_ip: this.props.fromStranger
      })
    )
  }

  setScore = () => {
    this.getScore().then(response => {
      const {success, score} = response.data

      if (success && this._isMounted) {
        this.setState({score})
      }
    })
  }

  getCommentsCount = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/get_commentscount`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
        bitsky_ip: this.props.fromStranger
      })
    )
    return await response
  }

  setCommentsCount = () => {
    this.getCommentsCount().then(response => {
      const {success, commentsCount} = response.data

      if (success && this._isMounted) {
        this.props.setCommentsCount()
        this.setState({commentsCount})
      }
    })
  }

  handleFavoriteButtonClick = e => {
    this.setState({favoriteFilled: !this.state.favoriteFilled})

    if (this.state.favoriteFilled) {
      this.removeFavorite().then(() => {
        this.setState({favorites: this.state.favorites - 1})
        this.setScore()
        if (this.props.refreshTrends) this.props.refreshTrends()
        this.props.toggleFavoriteFromActivityFeed()
      })
    } else {
      this.addFavorite().then(() => {
        this.setState({favorites: this.state.favorites + 1})
        this.setScore()
        if (this.props.refreshTrends) this.props.refreshTrends()
        this.props.toggleFavoriteFromActivityFeed()
      })
    }
  }

  addFavorite = async () => {
    await axios.post(
      `${config.API_ROOT}/post_add_favorite`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
      })
    )
  }

  removeFavorite = async () => {
    await axios.post(
      `${config.API_ROOT}/post_remove_favorite`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
      })
    )
  }

  checkFavorite = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/post_get_user_favorite`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
        bitsky_ip: this.props.fromStranger
      })
    )
    const {success, favorite} = response.data

    if (success && favorite && this._isMounted) {
      this.setState({favoriteFilled: true})
    }
  }

  toggleFavorite = () => {
    this.setState({favoriteFilled: !this.state.favoriteFilled})
    if (this.state.favoriteFilled)
      this.setState({favorites: this.state.favorites + 1})
    if (!this.state.favoriteFilled)
      this.setState({favorites: this.state.favorites - 1})
  }

  increaseCommentCounter = () => {
    this.setState({commentsCount: this.state.commentsCount + 1})
    this.props.increaseCommentCounterFromActivityFeed()
  }

  decreaseCommentCounter = () => {
    this.setState({commentsCount: this.state.commentsCount - 1})
    this.props.decreaseCommentCounterFromActivityFeed()
  }

  openTextArea = () => {
    this.commentContent.textarea.disabled = false
    this.removeBox.style.display = 'block'
    this.iconsBox.style.display = 'none'
    this.commentContent.textarea.focus()
  }

  closeTextArea = () => {
    this.commentContent.textarea.value = ''
    this.commentContent.textarea.height = ''
    this.commentContent.textarea.disabled = true
    this.removeBox.style.display = 'none'
    this.iconsBox.style.display = 'block'
  }

  adjustPublishContainer = () => {
    let commentContent = this.commentContent.textarea
    let commentContentValue = commentContent.value

    if (!commentContentValue) {
      commentContent.style.height = '24px'
      this.publishButton.style.display = 'none'
    } else {
      this.publishButton.style.display = 'block'
    }

    this.postComment.style.height = commentContent.style.height
  }

  addComment = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/post_add_comment`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
        content: this.commentContent.textarea.value,
        bitsky_ip: this.props.fromStranger
      })
    )
    
    console.log(response.data)
    
    const {success, comment, message} = response.data

    if (success && this._isMounted) {
      toast.success('Votre commentaire a été posté !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
        className: 'notification-success',
      })

      this.closeTextArea()
      this.adjustPublishContainer()

      let stateComments = this.state.comments

      stateComments.push(
        <Comment
          key={'post-' + this.props.id + '.comment-' + comment.id}
          id={comment.id}
          owner={comment.owner}
          content={comment.content}
          favorites={0}
          date={comment.created_at}
          remove={this.removeComment}
          refreshBestComments={this.props.refreshBestComments}
          refreshTrends={this.props.refreshTrends}
          refreshPostScore={this.setScore}
        />
      )

      this.setState({comments: stateComments})
      if (this.props.refreshTrends) this.props.refreshTrends()
      this.setScore()
      this.increaseCommentCounter()
      this.props.refreshBestComments()
      this.props.adjustBestComments()
    } else {
      if (message === 'notFilled' || message === 'contentEmpty') {
        toast.error('Veuillez écrire quelque chose !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      } else {
        toast.error(
          "Votre commentaire n'a pas pu être posté: " + message + ' !',
          {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        )
      }
    }
  }

  removeComment = async id => {
    const response = await axios.post(
      `${config.API_ROOT}/post_remove_comment`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        comment_id: id,
        bitsky_ip: this.props.fromStranger
      })
    )

    if (response.data.success && this._isMounted) {
      toast.success('Le commentaire a été supprimé !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
        className: 'notification-success',
      })

      this.decreaseCommentCounter()
      this.setState({
        comments: this.state.comments.filter(
          comment => comment.props.id !== id
        ),
      })
      this.setScore()
      if (this.props.refreshTrends) this.props.refreshTrends()
      this.props.refreshBestComments()
      this.props.adjustBestComments()
    }
  }

  getComments = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/post_get_comments`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
        bitsky_ip: this.props.fromStranger
      })
    )

    return await response
  }

  resetComments = () => {
    if (this._isMounted) {
      this.setState({comments: []})
    }
  }

  setComments = () => {
    this.setState({loadingComments: true})
    
    this.getComments().then(response => {
      const {success, comments} = response.data

      if (success && this._isMounted) {
        let stateComments = this.state.comments

        comments.forEach((comment, index) => {
          stateComments.push(
            <Fade key={'post-' + this.props.id + '.comment-' + comment.id} id={comment.id} delay={500 * (index)}>
              <Comment
                style={{marginTop: '5px'}}
                id={comment.id}
                owner={comment.owner}
                content={comment.content}
                favorites={comment.favorites}
                date={comment.created_at}
                remove={this.removeComment}
                refreshBestComments={this.props.refreshBestComments}
                refreshTrends={this.props.refreshTrends}
                refreshPostScore={this.setScore}
                fromStranger={comment.fromStranger}
                strangerPost={this.props.fromStranger}
              />
            </Fade>
          )
        })

        this.setState({comments: stateComments, loadingComments: false})
      }
    })
  }

  componentDidMount = () => {
    this._isMounted = true
    this.setPost()
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        {this.state.post ? (
          <Modal isOpen={this.state.open} toggle={this.toggle}>
            <ModalBody
              style={{background: 'none', border: 0, padding: 0}}
              className="postViewer"
            >
              <div className="post-container">
                <div id={'post-' + this.props.id} className="post">
                  <div className="score">
                    <span>{this.state.score}</span>
                  </div>
                  <img
                    src={this.state.post.owner.avatar}
                    alt="Avatar"
                    onClick={() => {
                      if(this.props.fromStranger) {
                        window.location.href = `/profile/${this.state.post.owner.id}/${this.props.fromStranger}`
                      } else {
                        window.location.href = `/profile/${this.state.post.owner.id}`
                      }
                    }}
                  />
                  <div className="title">
                    <h4>
                      {this.state.post.owner.firstname +
                        ' ' +
                        this.state.post.owner.lastname}
                    </h4>
                    <small>
                      <Rank id={this.state.post.owner.rank} />
                    </small>
                  </div>
                  <p
                    className="post-content"
                    dangerouslySetInnerHTML={this.getContent()}
                  />
                  <Container className="post-details">
                    <Row>
                      <Col md="4" className="text-left">
                        <span className="tag">
                          <FontAwesomeIcon icon={faTag} /> {emojify(this.state.post.tag, {output: 'unicode'})}
                        </span>
                      </Col>
                      <Col md="4" className="text-center counter-container">
                        <span className="fav-counter">
                          <i>
                            <FontAwesomeIcon
                              icon={
                                this.state.favoriteFilled
                                  ? faFullStar
                                  : faEmptyStar
                              }
                              onClick={this.handleFavoriteButtonClick}
                            />
                          </i>{' '}
                          {this.state.favorites}
                        </span>{' '}
                        <span
                          className="comment-counter"
                          onClick={this.handleCommentCounterClick}
                          ref={node => (this.commentCounter = node)}
                        >
                          <FontAwesomeIcon icon={faComments} />{' '}
                          {this.state.commentsCount}
                        </span>
                      </Col>
                      <Col md="4" className="text-right">
                        <span className="date">
                          <FontAwesomeIcon icon={faClock} />{' '}
                          {DateService.timeSince(this.state.post.created_at)}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>

              <div
                className="postComment"
                ref={postComment => (this.postComment = postComment)}
              >
                <TextareaAutosize
                  id="comment-content"
                  ref={commentContent => (this.commentContent = commentContent)}
                  placeholder="Ajouter un commentaire"
                  onKeyUp={this.adjustPublishContainer}
                  disabled
                />

                <div
                  className="icons"
                  ref={iconsBox => (this.iconsBox = iconsBox)}
                >
                  <span onClick={this.openTextArea}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                </div>

                <div
                  className="remove-box"
                  ref={removeBox => (this.removeBox = removeBox)}
                >
                  <span onClick={this.closeTextArea}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                </div>

                <span
                  ref={publishButton => (this.publishButton = publishButton)}
                  className="publish-button"
                  onClick={this.addComment}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </span>
              </div>
              
              {this.state.loadingComments ? (
                <div style={{marginTop: '10px'}}>
                  <Loader display={1} />
                </div>
              ) : (
                <div
                  className="postComments"
                  style={{
                    display: this.state.comments.length > 0 ? 'block' : 'none',
                  }}
                >
                  {this.state.comments}
                </div>
              )}
            </ModalBody>
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}
