import React, {Fragment, useReducer, useEffect} from 'react'
import Navbar from '../../common/template/Navbar'
import jwtDecode from 'jwt-decode'
import {Alert, Col, Container, Row} from 'reactstrap'
import Rank from '../../common/Rank'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import axios from 'axios'
import {config} from '../../../config'
import qs from 'qs'
import _ from 'lodash'
import Fade from 'react-reveal/Fade'
import Post from '../../common/post/Post'
import Loader from '../../Loader'
import styled from 'styled-components'
import {toast} from 'react-toastify'
import AdministrationUpdatePostModal from './AdministrationUpdatePostModal'

const PostContainer = styled.div`
    margin-bottom: 30px;
    width: 75%;
`
const PostsContainer = styled.div`
    background: #F5F7F8;
    padding-top: 30px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const MainContainer = styled.div`
    background: #FFF;
    border-radius: 5px;
`

const initialState = {
  session: localStorage.getItem('token')
    ? jwtDecode(localStorage.getItem('token'))
    : null,
  loading: false,
  postsComponents: [],
  open: false,
  content: null,
  post_id: null,
}

const ACTIONS = {
  START_LOADING: 'START_LOADING',
  SET_POSTS: 'SET_POSTS',
  REMOVE_POST: 'REMOVE_POST',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  SET_CONTENT: 'SET_CONTENT',
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_LOADING:
      return {
        ...initialState,
        loading: true,
      }
    case ACTIONS.SET_POSTS:
      return {
        ...initialState,
        loading: false,
        postsComponents: action.payload,
      }
    case ACTIONS.REMOVE_POST:
      return {
        ...state,
        postsComponents: state.postsComponents.filter(p => p.key !== action.payload.id),
      }
    case ACTIONS.TOGGLE_MODAL:
      return {
        ...state,
        open: !state.open,
      }
    case ACTIONS.SET_CONTENT:
      return {
        ...state,
        content: action.payload.content,
        post_id: action.payload.post_id,
      }
    default:
      throw new Error('Action type not found')
  }
}

const AdministrationPostsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const toggleUpdateModal = (content, post_id) => {
    dispatch({type: ACTIONS.TOGGLE_MODAL})
    dispatch({
      type: ACTIONS.SET_CONTENT,
      payload: {
        content,
        post_id,
      },
    })
  }

  const deletePost = async id => {
    const response = await axios.post(
      `${config.API_ROOT}/remove_post`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: id,
      }),
    )
    return await response
  }

  const handleDeleteButtonClick = e => {
    e.preventDefault()
    let element = e.target.parentElement.parentElement
    let str_id = element.id
    let id = str_id.split('-')[1]

    deletePost(id).then(response => {
      const {success} = response.data
      if (success) {
        dispatch({
          type: ACTIONS.REMOVE_POST,
          payload: {id: str_id},
        })

        toast.success('La publication a été supprimée !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
      } else {
        toast.error('Impossible de supprimer le post !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }

  const getPosts = async () => {
    dispatch({type: ACTIONS.START_LOADING})

    const response = await axios.post(
      `${config.API_ROOT}/get_localposts`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      }),
    )

    const {success} = response.data

    if (success) {
      pushPostsToState(response.data.posts)
    } else {
      toast.error('Impossible de charger les posts !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const pushPostsToState = posts => {
    let postsResult = []

    posts = _.orderBy(posts, ['created_at'], ['desc'])

    posts.forEach((post, index) => {
      postsResult.push(
        <PostContainer key={'post-' + post.id}>
          <Fade bottom delay={500 * (index - 1)}>
            <Post
              id={post.id}
              ownerId={post.owner.id}
              ownerAvatar={post.owner.avatar}
              ownerName={`${post.owner.firstname} ${post.owner.lastname}`}
              ownerRank={post.owner.rank}
              content={post.content}
              tag={post.tag}
              filled={false}
              favorites={post.favorites}
              comments={post.comments}
              date={post.created_at}
              isOwner={
                post.owner.firstname + ' ' + post.owner.lastname ===
                state.session.firstname +
                ' ' +
                state.session.lastname || state.session.rank === 2
              }
              fromStranger={post.from_stranger}
              handleDeleteButtonClick={handleDeleteButtonClick}
              handleUpdateButtonClick={toggleUpdateModal}
              admin={true}
            />
          </Fade>
        </PostContainer>,
      )
    })

    dispatch({
      type: ACTIONS.SET_POSTS,
      payload: postsResult,
    })
  }

  useEffect(() => {
    getPosts().catch(err => `An error has occurred : ${err}`)
  }, [])

  return (
    <Fragment>
      <AdministrationUpdatePostModal isOpen={state.open} toggleUpdateModal={toggleUpdateModal} postContent={state.content} postId={state.post_id} getPosts={getPosts}/>
      <Navbar/>
      <Container className="main-container">
        <Row>
          <Col md="3" className="no-margin-left no-margin-right">
            <div className="user-container">
              <img src={localStorage.getItem('avatar')} alt="Avatar"/>
              <h5>
                {state.session.firstname +
                ' ' +
                state.session.lastname}
              </h5>
              <p className="rank">
                <Rank id={state.session.rank}/>
              </p>
            </div>
            <AdministrationSideMenu/>
          </Col>
          <Col md="9" className="no-margin-left no-margin-right">
            <MainContainer className="admin-dashboard">
              <h4>Publications</h4>
              <PostsContainer className="posts-container">
                <Loader display={state.loading ? 1 : 0}/>
                <Fragment>
                  {state.postsComponents && state.postsComponents.length > 0 ? state.postsComponents : (
                    !state.loading ? (
                      <Alert id="posts-message" color="info">
                        Il n'y a aucune publication pour le moment
                      </Alert>
                      ) : null
                  )}
                </Fragment>
              </PostsContainer>
            </MainContainer>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default AdministrationPostsPage