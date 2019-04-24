import React, {useReducer, useEffect} from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Input,
  FormFeedback,
  FormGroup,
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencilAlt, faTimes} from '@fortawesome/free-solid-svg-icons'
import {config} from '../../../config'
import axios from 'axios'
import qs from 'qs'
import {toast} from "react-toastify";


const AdministrationUpdatePostModal = ({isOpen, toggleUpdateModal, postContent, postId, getPosts}) => {

  const initialState = {
    content: postContent,
    contentError: false,
  }

  const ACTIONS = {
    SET_CONTENT: 'SET_CONTENT',
    SET_ERROR_CONTENT: 'SET_ERROR_CONTENT',
    UNSET_ERROR_CONTENT: 'UNSET_ERROR_CONTENT',
  }

  const reducer = (state, action) => {
    switch(action.type) {
      case ACTIONS.SET_CONTENT:
        return {
          ...initialState,
          content: action.payload,
        }
      case ACTIONS.SET_ERROR_CONTENT:
        return {
          ...state,
          contentError: true,
        }
      case ACTIONS.UNSET_ERROR_CONTENT:
        return {
          ...state,
          contentError: false,
        }
      default:
        throw new Error('Action type not found')
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const updatePost = async () => {
    dispatch({type: ACTIONS.UNSET_ERROR_CONTENT})

    let isOk = state.content && state.content.length > 0

    if(isOk) {
      const response = await axios.post(
        `${config.API_ROOT}/update_post`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          token: localStorage.getItem('token'),
          post_id: postId,
          content: state.content,
        }),
      )

      const {success} = response.data

      if(success) {
        toast.success('La publication a été modifiée avec succès !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
        getPosts().catch(err => `An error has occurred : ${err}`)
      }else {
        toast.error('La publication n\'a pas pu être modifiée !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    }else {
      dispatch({type: ACTIONS.SET_ERROR_CONTENT})
    }
  }

  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_CONTENT,
      payload: postContent,
    })
  }, [postContent])

  return (
    <Modal isOpen={isOpen} toggle={toggleUpdateModal} className="user-modal">
      <ModalHeader>
        Modification de la publication
      </ModalHeader>
      <ModalBody>
          <div>
            <FormGroup>
              <Label for="create">Contenu</Label>
              <Input
                type="content"
                name="content"
                id="content"
                defaultValue={postContent}
                className={state.contentError ? 'is-invalid' : ''}
                onChange={e => {
                  dispatch({
                    type: ACTIONS.SET_CONTENT,
                    payload: e.target.value,
                  })
                }}
              />
              <FormFeedback>Veuillez remplir correctement ce champ</FormFeedback>
            </FormGroup>
          </div>
      </ModalBody>
      <ModalFooter>
        <Button className="modal-choice" color="primary" onClick={() => updatePost()}><FontAwesomeIcon
          icon={faPencilAlt}/></Button>{' '}
        <Button className="modal-choice" color="secondary"
                onClick={toggleUpdateModal}><FontAwesomeIcon icon={faTimes}/></Button>
      </ModalFooter>
    </Modal>
  )
}

export default AdministrationUpdatePostModal