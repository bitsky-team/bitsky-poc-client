import React, {Component} from 'react'
import {toast} from 'react-toastify'
import {config} from '../../config'
import TextareaAutosize from 'react-autosize-textarea'
import _ from 'lodash'
import jwtDecode from 'jwt-decode'
import Post from '../common/post/Post'
import Navbar from '../common/template/Navbar'
import axios from 'axios'
import qs from 'qs'
import Rank from '../common/Rank'
import Image from 'react-bootstrap/Image'
import ImgViewer from '../files/ImgViewer'

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

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {
  faCamera,
  faPencilAlt,
  faTimes,
  faPaperPlane,
  faSync,
  faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons'
import SideMenu from './SideMenu'
import Trend from './Trend'
import Loader from '../Loader'
import Fade from 'react-reveal/Fade';
import {emojify} from 'react-emojione'
import {path} from 'ramda'
import styled from 'styled-components'

const ImageToPost = styled(Image)`
  margin-top: 20px;
  padding: 20px !important;
  width: 100%;
  max-height: 270px;
  object-fit: contain;
`

const PicToPostContainer = styled.div`
  position: relative;
`

const ClosePicToPostContainer = styled.span`
  cursor: pointer;
  transition: 0.3s ease-in-out;
  
  :hover {
    color: rgb(162,162,162);
  }
`

const ClosePicToPost = styled(FontAwesomeIcon)`
  position: absolute;
  right: 6px;
  top: 24px;
`

export default class ActivityFeedPage extends Component {
  _isMounted = false

  picturesFormat = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
  ]

  state = {
    session: localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null,
    postModal: false,
    tagValue: '',
    postsLoading: true,
    posts: [],
    trendsLoading: true,
    trends: [],
    trend: null,
    picture: null,
    pictureModalState: false,
    pictureViewer: null,
  }

  getFirstTime = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/get_firsttime`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
    return await response
  }
  
  getPosts = async trend => {
    return await axios.post(
      `${config.API_ROOT}/get_allposts`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        trend: trend,
      })
    )
  }

  getTrends = async () => {
    return axios.post(
      `${config.API_ROOT}/get_trends`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }

  storePost = async content => {
    const response = await axios.post(
      `${config.API_ROOT}/store_post`,
      qs.stringify({
        token: localStorage.getItem('token'),
        owner_uniq_id: localStorage.getItem('id'),
        content: content.value,
        picture: this.state.picture ? this.state.picture : undefined,
        tag: this.state.trend ? this.state.trend : this.state.tagValue,
      })
    )
    return await response
  }

  deletePost = async id => {
    const response = await axios.post(
      `${config.API_ROOT}/remove_post`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: id,
      })
    )
    return await response
  }

  resetTrends = () => {
    if (this._isMounted) this.setState({trends: []})
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
    if (!postContentValue) {
      postContent.style.height = '24px'
      this.refs.publishButton.style.display = 'none'
    } else {
      this.refs.publishButton.style.display = 'block'
    }

    this.refs.publishContainer.style.height = postContent.style.height
  }

  handlePictureButtonClick = () => {
    this.refs.fileUploader.click()
  }

  handlePublishButtonClick = () => {
    let content = this.postContent.textarea

    let isContentFilled = _.trim(content.value).length > 0
    let isTagFilled = _.trim(this.state.tagValue).length > 0 || this.state.trend

    if (isContentFilled && isTagFilled) {
      this.storePost(content).then(response => {
        const {success, postId, ownerRank} = response.data

        if (success && this._isMounted) {
          let posts = this.state.posts
          const tag = this.state.tagValue
            ? this.state.tagValue.charAt(0).toUpperCase() +
              this.state.tagValue.slice(1)
            : null

          const tagTrend = this.state.trend
            ? this.state.trend.charAt(0).toUpperCase() +
              this.state.trend.slice(1)
            : null

          let newPost = (
            <Post
              id={postId}
              key={'post-' + postId}
              ownerId={this.state.session.id}
              ownerAvatar={localStorage.getItem('avatar')}
              ownerName={
                this.state.session.firstname + ' ' + this.state.session.lastname
              }
              ownerRank={ownerRank}
              content={content.value}
              tag={tagTrend ? tagTrend : tag}
              filled={false}
              favorites={0}
              comments={0}
              date={new Date()}
              isOwner={true}
              handleDeleteButtonClick={this.handleDeleteButtonClick}
              refreshTrends={this.setTrends}
              picture={this.state.picture}
              togglePictureModal={this.togglePictureModal}
            />
          )

          posts.unshift(newPost)
          this.setState({posts: posts, tagValue: null, picture: null})
          this.setTrends()
          this.closeTextArea()
          this.adjustPublishContainer()
          this.togglePostModal()

          if (this.postsContainer) {
            this.postsContainer.childNodes[0].style.display = 'none'
          }

          toast.success('Votre publication a été postée !', {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'notification-success',
          })
        }
      })
    }
  }

  handleDeleteButtonClick = e => {
    e.preventDefault()
    let element = e.target.parentElement.parentElement
    let str_id = element.id
    let id = str_id.split('-')[1]
    let posts = this.state.posts
    posts = posts.filter(p => {
      return p.key !== str_id
    })

    this.deletePost(id).then(response => {
      const {success} = response.data
      if (success) {
        this.setState({posts})
        this.setTrends()
        this.checkEmpty()
        toast.success('La publication a été supprimée !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
      }
    })
  }

  togglePostModal = () => {
    // Checking if textarea's content is not empty
    if (this.state.postModal || /\S/.test(this.postContent.textarea.value)) {
      this.setState({
        postModal: !this.state.postModal,
      })
    }
  }

  handlePublishType = () => {
    !this.state.trend ? this.togglePostModal() : this.handlePublishButtonClick()
  }

  togglePictureModal = picture => {
    this.setState({
      pictureModalState: !this.state.pictureModalState,
      pictureViewer: picture,
    })
  }
  checkEmpty = () => {
    setTimeout(() => {
      if (this.postsContainer && this.trendsContainer) {
        if (this.state.posts.length === 0) {
          this.postsContainer.childNodes[0].style.display = 'block'
          this.postsContainer.childNodes[1].style.display = 'none'
        } else {
          this.postsContainer.childNodes[0].style.display = 'none'
        }
      }
    }, 1000)
  }

  removeLoading = element => {
    if (element === 'posts') {
      if (this.postsContainer) {
        this.postsContainer.childNodes[1].style.display = 'none'
      }
    }
  }
  
  setPosts = async trend => {
    this.setState({postsLoading: true})
    const {data} = await this.getPosts(trend)
    if(data.success) {
      this.pushPostsToState(data.posts)
    } else {
      toast.error('Impossible de charger les posts !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }
  
  pushPostsToState = (posts) => {
    let statePosts = this.state.posts
    
    posts = _.orderBy(posts, ['created_at'], ['desc'])
    
    posts.forEach((post, index) => {
      statePosts.push(
        <Fade key={'post-' + post.id} bottom delay={500 * (index - 1)}>
          <Post
            id={post.id}
            ownerId={post.owner.id}
            ownerAvatar={post.owner.avatar}
            ownerName={post.owner.firstname + ' ' + post.owner.lastname}
            ownerRank={post.owner.rank}
            content={post.content}
            tag={post.tag}
            filled={false}
            favorites={post.favorites}
            comments={post.comments}
            date={post.created_at}
            isOwner={
              post.owner.firstname + ' ' + post.owner.lastname ===
              this.state.session.firstname +
              ' ' +
              this.state.session.lastname || this.state.session.rank === 2
            }
            handleDeleteButtonClick={this.handleDeleteButtonClick}
            refreshTrends={this.setTrends}
            fromStranger={post.from_stranger}
            picture={post.picture}
            togglePictureModal={this.togglePictureModal}
          />
        </Fade>
      )
    
      this.setState({posts: statePosts, postsLoading: false})
      this.checkEmpty()
    })
  }

  setTrends = () => {
    if (this._isMounted) this.resetTrends()
    this.setState({trendsLoading: true})

    this.getTrends().then(response => {
      const {success, trends} = response.data
      if (success && this._isMounted) {
        let stateTrends = this.state.trends

        trends.forEach((trend, index) => {
          stateTrends.push(
            <Fade key={'trend-' + trend.name} bottom delay={500 * (index - 1)}>
              <Trend
                name={trend.name}
                post_id={trend.post.id}
                content={trend.post.content}
                author={trend.post.owner}
                score={trend.score}
                updateFilter={this.updateFilter}
                fromStranger={trend.fromStranger || null}
              />
            </Fade>
          )
        })

        this.setState({trends: stateTrends, trendsLoading: false})
      } else if (this._isMounted) {
        console.log('Failed loading trends: ', response)
      }
    })
  }

  updateFilter = trend => {
    this.setState({posts: [], trend})
    this.setPosts(trend)
    this.props.history.push('/activity_feed')
  }
  
  getPost = async (id, fromStranger) => {
    return axios.post(
      `${config.API_ROOT}/get_post`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: id,
        bitsky_ip: fromStranger
      })
    )
  }
  
  componentDidMount = async () => {
    this._isMounted = true

    const { location } = this.props
    
    if (location.state) {
      if(location.state.trend) {
        this.setState({trend: location.state.trend})
      }
      
      if(location.state.post) {
        const {data} = await this.getPost(location.state.post.id, location.state.post.fromStranger)

        if(data.success) {
          this.setState({posts: []}, () => {
            this.pushPostsToState([data.post])
          })
        } else {
          toast.error(`Impossible de charger la publication !`, {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
        
      }
    }

    // Checking first time
    this.getFirstTime().then(response => {
      const {success, message} = response.data
      if (success) {
        let firstTime = Boolean(parseInt(message, 10))
        localStorage.setItem('firsttime', firstTime)
        if (firstTime) this.props.history.push('/register_confirmation')
        else {
          // Retrieving posts & trends
          if(!path(['state', 'post'], location)) {
            this.setPosts(this.state.trend)
          }
          this.setTrends()
        }
      }
    })
  }

  postPicture = () => {
    const fileType = this.refs.fileUploader.files[0].type
    const file = this.refs.fileUploader.files[0]

    if(this.picturesFormat.includes(fileType)) {
      const reader  = new FileReader()

      reader.onload = e => {
        this.setState({picture: e.target.result}, () => {
          this.adjustPublishContainer()
        })
      }

      reader.readAsDataURL(file)
    }else {
      toast.error('Veuillez importer une image (jpg, jpeg, png, gif) !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  cancelPostPicture = () => {
    this.setState({picture: null})
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render() {
    const { location } = this.props
  
    return (
      <div>
        <ImgViewer isOpen={this.state.pictureModalState} toggle={this.togglePictureModal} imgSrc={this.state.pictureViewer} />
        <Modal
          isOpen={this.state.postModal}
          toggle={this.togglePostModal}
          className={this.props.className}
        >
          <ModalBody style={{background: 'white'}}>
            <Label for="post-tag">
              Veuillez indiquer le sujet de votre publication
            </Label>
            <Input
              type="text"
              name="post-tag"
              id="post-tag"
              onChange={e => this.setState({tagValue: `${e.target.value}`})}
              placeholder="Sujet de la publication"
            />
          </ModalBody>
          <ModalFooter style={{background: 'white'}}>
            <Button
              className="modal-choice"
              color="primary"
              onClick={this.handlePublishButtonClick}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>{' '}
            <Button
              className="modal-choice"
              color="secondary"
              onClick={this.togglePostModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </ModalFooter>
        </Modal>

        <Navbar />

        <Container className="main-container">
          <Row>
            <Col md="3" className="no-margin-left no-margin-right">
              <div className="user-container">
                <img src={localStorage.getItem('avatar')} alt="Avatar" />
                <h5>
                  {this.state.session.firstname +
                    ' ' +
                    this.state.session.lastname}
                </h5>
                <p className="rank">
                  <Rank id={this.state.session.rank} />
                </p>
              </div>

              <SideMenu />
            </Col>
            <Col md="5" className="no-margin-left no-margin-right">
              {(this.state.trend || path(['state', 'post'], location)) && (
                <div
                  className="activity-feed-trend-title"
                  style={{marginBottom: '15px'}}
                >
                  <Button
                    color="info"
                    className="see-more-button"
                    onClick={e => this.updateFilter(null)}
                  >
                    <FontAwesomeIcon icon={faArrowCircleLeft} />
                  </Button>{' '}
                  
                  {this.state.trend && (
                    <p>Publications du sujet <span>{emojify(this.state.trend, {output: 'unicode'})}</span></p>
                  )}
  
                  {path(['state', 'post'], location) && (
                    <p>Publication concernée</p>
                  )}
                </div>
              )}
              <div className="publish-container" ref="publishContainer">
                <input
                  type="file"
                  id="file"
                  ref="fileUploader"
                  onChange={this.postPicture}
                  style={{display: 'none'}}
                />
                <TextareaAutosize
                  id="post-content"
                  ref={postContent => (this.postContent = postContent)}
                  placeholder="Poster une publication"
                  onKeyUp={this.adjustPublishContainer}
                  disabled
                />
                <div
                  className="icons"
                  ref={iconsBox => (this.iconsBox = iconsBox)}
                >
                  <span onClick={this.handlePictureButtonClick}>
                    <FontAwesomeIcon icon={faCamera} />
                  </span>
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
                  ref="publishButton"
                  className="publish-button"
                  onClick={this.handlePublishType}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </span>
              </div>
              {this.state.picture && (
                <Fade>
                  <PicToPostContainer>
                    <ClosePicToPostContainer>
                      <ClosePicToPost icon={faTimes} onClick={this.cancelPostPicture}/>
                    </ClosePicToPostContainer>
                    <ImageToPost src={this.state.picture} alt="Picture to post" thumbnail fluid rounded/>
                  </PicToPostContainer>
                </Fade>
              )}
              <div
                className="posts-container"
              >
                <Alert id="posts-message" color="info" className="info-message">
                  Il n'y a aucune publication pour le moment
                </Alert>
                <Loader display={this.state.postsLoading ? 1 : 0}/>
                <div>{this.state.posts}</div>
              </div>
            </Col>
  
            <Col md="4" className="no-margin-left no-margin-right">
              <div className="user-container right-container">
                <div className="right-container-header">
                  <h5>Sujets du moment</h5>
                  <Button
                    color="info"
                    className="refresh-trends"
                    onClick={this.setTrends}
                  >
                    <FontAwesomeIcon icon={faSync} />
                  </Button>
                </div>
                <hr />
                <div style={{display: "block !important"}}>
                  <Loader display={this.state.trendsLoading ? 1 : 0} />
                  <div>
                    {this.state.trends}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
