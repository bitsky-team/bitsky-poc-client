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
import Loader from '../../Loader'
import styled from 'styled-components'
import {toast} from 'react-toastify'
import Comment from '../../common/post/Comment'
import AdministrationUpdateCommentModal from './AdministrationUpdateCommentModal'

const CommentsContainer = styled.div`
    margin-top: 30px;
    background: #F5F7F8;
    padding-top: 30px;
    padding-bottom: 30px;
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

const AlertInfo = styled(Alert)`

  &.alert {
    margin-bottom: 0px !important;
  }
`

const initialState = {
  session: localStorage.getItem('token')
    ? jwtDecode(localStorage.getItem('token'))
    : null,
  loading: false,
  commentsComponents: [],
  open: false,
  content: null,
  comment_id: null,
}

const ACTIONS = {
  START_LOADING: 'START_LOADING',
  SET_COMMENTS: 'SET_COMMENTS',
  REMOVE_COMMENT: 'REMOVE_COMMENT',
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
    case ACTIONS.SET_COMMENTS:
      return {
        ...initialState,
        loading: false,
        commentsComponents: action.payload,
      }
    case ACTIONS.REMOVE_COMMENT:
      return {
        ...state,
        commentsComponents: state.commentsComponents.filter(c => c.props.id !== action.payload),
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
        comment_id: action.payload.comment_id,
      }
    default:
      throw new Error('Action type not found')
  }
}

const AdministrationCommentsPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const PostComments = styled.div`
    width: 50%;
  `

  const update = (content, comment_id) => {
    dispatch({type: ACTIONS.TOGGLE_MODAL})
    dispatch({
      type: ACTIONS.SET_CONTENT,
      payload: {
        content,
        comment_id,
      },
    })
  }

  const deleteComment = async id => {
    const response = await axios.post(
      `${config.API_ROOT}/post_remove_comment`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        comment_id: id,
      }),
    )
    return await response
  }

  const handleDeleteButtonClick = id => {

    deleteComment(id).then(response => {
      const {success} = response.data
      if (success) {
        dispatch({
          type: ACTIONS.REMOVE_COMMENT,
          payload: id,
        })

        toast.success('Le commentaire a été supprimé !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
      } else {
        toast.error('Impossible de supprimer le commentaire !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }

  const getComments = async () => {
    dispatch({type: ACTIONS.START_LOADING})

    const response = await axios.post(
      `${config.API_ROOT}/get_allcomments`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      }),
    )

    const {success} = response.data

    if (success) {
      pushCommentsToState(response.data.comments)
    } else {
      toast.error('Impossible de charger les commentaires !', {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const pushCommentsToState = comments => {
    let commentsResult = []

    comments = _.orderBy(comments, ['created_at'], ['desc'])

    comments.forEach((comment, index) => {
      commentsResult.push(
        <Fade key={'post-' + comment.post_id + '.comment-' + comment.id} id={comment.id} delay={500 * (index)}>
          <div className="postComments">
            <Comment
              style={{marginTop: '5px'}}
              id={comment.id}
              owner={comment.owner}
              content={comment.content}
              favorites={comment.favorites}
              date={comment.created_at}
              remove={handleDeleteButtonClick}
              update={update}
              admin={true}
            />
          </div>
        </Fade>,
      )
    })

    dispatch({
      type: ACTIONS.SET_COMMENTS,
      payload: commentsResult,
    })
  }

  useEffect(() => {
    getComments().catch(err => `An error has occurred : ${err}`)
  }, [])

  return (
    <Fragment>
      <AdministrationUpdateCommentModal isOpen={state.open} toggleUpdateModal={update}
                                     commentContent={state.content} commentId={state.comment_id} getComments={getComments}/>
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
              <h4>Commentaires</h4>
              <CommentsContainer className="postViewer">
                <Loader display={state.loading ? 1 : 0}/>
                <PostComments>
                  {state.commentsComponents && state.commentsComponents.length > 0 ? state.commentsComponents : (
                    !state.loading ? (
                      <AlertInfo id="posts-message" color="info">
                        Il n'y a aucun commentaire pour le moment
                      </AlertInfo>
                    ) : null
                  )}
                </PostComments>
              </CommentsContainer>
            </MainContainer>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default AdministrationCommentsPage