import React, {Fragment, useRef, useEffect, useReducer, useState} from 'react'
import Navbar from '../common/template/Navbar'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'
import {Message, MessagePositions} from './Message'
import {MessageWriter} from './MessageWriter'
import axios from 'axios'
import {config} from '../../config'
import qs from 'qs'
import Loader from '../Loader'
import {path} from 'ramda'
import {toast} from 'react-toastify'
import jwtDecode from 'jwt-decode'
import Emojify, {emojify} from 'react-emojione'
import {Alert} from 'reactstrap'
import LoopService from '../../services/LoopService'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 71px); // 71 => 66 = navbar's height + 5 = margin top
  background-color: #f5f5f5;
  margin-top: 5px;
  padding: 24px 32px 0 32px;
`

const ColumnContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex: 1;
`

const Column = styled.div`
  flex: 1;
  padding: 16px;
`

const LeftColumn = styled(Column)`
  margin-right: 16px;
`

const RightColumn = styled(Column)`
  flex: 2;
`

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e2e2;
  padding-bottom: 16px;
  min-height: 50px;
  font-weight: bold;
`

const MessagingTitle = styled.h2`
  font-weight: 400;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`

const SearchField = styled.input`
  margin-left: 16px;
  background: none;
  border: none;
  flex: 1;
  font-weight: lighter;
`

const Text = styled.p`
  font-size: 18px;
  margin: 0;
  font-weight: lighter;
`

const ReceiverLink = styled(Link)`
  color: #83b2e0;
  transition: 0.2s;

  :hover {
    text-decoration: none;
    color: #6186aa;
  }
`

const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Conversation = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0px 5px 25px -5px rgba(0, 0, 0, 0.05);
  padding: 20px 10px;
  margin-top: 16px;
  transition: 0.2s;
  border: ${({active, bold}) => (active ? 'solid 2px rgb(131,178,224)' : bold ? 'solid 2px #929292' : 'none')};

  :hover {
    margin-left: 10px;
    cursor: pointer;
  }
`

const ConversationAvatar = styled.img`
  height: 56px;
  border-radius: 50%;
`

const ConversationDescription = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 20px;
`

const ConversationName = styled.div`
  font-size: 20px;
`

const ConversationLastMessage = styled.div`
  font-size: 18px;
  font-weight: lighter;
`

const ScrollableContent = styled.div`
  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #83b2e0;
    border-radius: 15px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6186aa;
  }
  overflow-y: scroll;
  max-height: 60vh;
`

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
`

const Separator = styled.hr`
  background-color: #f5f5f5;
`

const NoMessage = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  div,
  div p {
    margin: 0;
  }
`

const initialState = {
  session: localStorage.getItem('token')
    ? jwtDecode(localStorage.getItem('token'))
    : null,
  loading: {
    conversations: false,
    conversation: false,
    send_message: false,
  },
  emptyConversations: false,
  noSelection: true,
  conversations: null,
  filteredConversations: null,
  renderedConversations: null,
  selectedConversation: null,
}

const ACTIONS = {
  START_ACTION: 'START_ACTION',
  GET_CONVERSATIONS: 'GET_CONVERSATIONS',
  SELECT_CONVERSATION: 'SELECT_CONVERSATION',
  SET_FILTERED_CONVERSATIONS: 'SET_FILTERED_CONVERSATIONS',
  RENDER_CONVERSATIONS: 'RENDER_CONVERSATIONS',
  APPEND_MESSAGE: 'APPEND_MESSAGE',
  NO_CONVERSATIONS: 'NO_CONVERSATIONS',
  NO_SELECTION: 'NO_SELECTION',
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_ACTION:
      return {...state, loading: {...state.loading, ...action.payload}}
    case ACTIONS.GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
        loading: {...state.loading, conversations: false},
      }
    case ACTIONS.SELECT_CONVERSATION:
      return {
        ...state,
        selectedConversation: action.payload.conversation,
        conversations: action.payload.conversations,
        noSelection: false,
        loading: {...state.loading, conversation: false},
      }
    case ACTIONS.SET_FILTERED_CONVERSATIONS:
      return {
        ...state,
        filteredConversations: action.payload,
      }
    case ACTIONS.RENDER_CONVERSATIONS:
      return {
        ...state,
        renderedConversations: action.payload,
      }
    case ACTIONS.APPEND_MESSAGE:
      return {
        ...state,
        conversations: action.payload.conversations,
        selectedConversation: {
          ...state.selectedConversation,
          messages: [
            ...state.selectedConversation.messages,
            action.payload.message,
          ],
        },
        loading: {...state.loading, send_message: false},
      }
    case ACTIONS.NO_CONVERSATIONS:
      return {
        ...state,
        emptyConversations: true,
        loading: initialState.loading,
      }
    case ACTIONS.NO_SELECTION:
      return {
        ...state,
        noSelection: true,
        loading: initialState.loading,
      }
    default:
      throw new Error('Action type not found')
  }
}

export const MessagingPage = ({location}) => {
  const scrollEnd = useRef(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [messagesLoader, setMessageLoader] = useState(null)
  let messagesLength = 0
  
  useEffect(() => {
    getConversations()
  }, [])
  
  useEffect(() => {
    dispatch({
      type: ACTIONS.RENDER_CONVERSATIONS,
      payload: renderConversations(
        state.filteredConversations || state.conversations
      ),
    })
    
    scrollEnd.current.scrollIntoView()
  }, [
    state.filteredConversations,
    state.conversations,
    state.conversation,
    state.selectedConversation,
  ])
  
  useEffect(() => {
    return () => LoopService.stop(messagesLoader)
  }, [messagesLoader])
  
  const selectConversation = async (id, conversations = undefined, linkID = null) => {
    
    const {
      data: {success, conversation},
    } = await axios.post(
      `${config.API_ROOT}/get_conversation`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        conversation_id: id,
        link_id: linkID
      })
    )
    
    if (success) {
      dispatch({type: ACTIONS.SELECT_CONVERSATION, payload: {
          conversation,
          conversations: conversations || state.conversations
        }})
      messagesLength = conversation.messages.length
      
      // Loop who will load new received messages
      const interval = LoopService.loop(5000, () => {
        axios
          .post(
            `${config.API_ROOT}/get_conversation`,
            qs.stringify({
              uniq_id: localStorage.getItem('id'),
              token: localStorage.getItem('token'),
              conversation_id: id,
              link_id: linkID
            })
          )
          .then(response => {
            const {success, conversation} = response.data
            
            if (success) {
              
              if (conversation.messages.length !== messagesLength) {
                // Preparing new conversations list item for updating the last message
                const conversationsListItem = conversation
                conversationsListItem.lastMessage = conversationsListItem.messages[conversationsListItem.messages.length - 1]
                
                let conversationsList = [conversationsListItem]
                
                if(state.conversations) {
                  conversationsList = [
                    ...state.conversations.filter(c => c.id !== conversation.id),
                    conversationsListItem
                  ]
                }
                
                conversationsList.sort((a, b) => {
                  return a.id - b.id
                })
                
                dispatch({
                  type: ACTIONS.SELECT_CONVERSATION,
                  payload: {
                    conversation,
                    conversations: state.conversations
                  },
                })
                
                dispatch({
                  type: ACTIONS.GET_CONVERSATIONS,
                  payload: conversationsList,
                })
                
                messagesLength = conversation.messages.length
              }
            }
          })
      })
      
      setMessageLoader(interval)
    } else {
      toast.error(`Impossible de charger cette conversation`, {
        autoClose: 5000,
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }
  
  const renderConversations = conversations => {
    if (!conversations) {
      return <Fragment />
    }
    
    return conversations.map((conversation, index) => {
      if(conversation.lastMessage) {
        conversation.lastMessage.content = emojify(conversation.lastMessage.content, {output: 'unicode'})
      }
      
      return <Conversation
        key={index}
        active={
          state.selectedConversation &&
          state.selectedConversation.id === conversation.id
            ? 1
            : 0
        }
        bold={conversation.unread}
        onClick={() => selectConversation(conversation.id, undefined, conversation.link_id)}
        stranger={conversation.link_id}
      >
        <ConversationAvatar src={conversation.user.avatar} alt="avatar"/>
        <ConversationDescription>
          <ConversationName>{`${conversation.user.firstname} ${
            conversation.user.lastname
            }`}</ConversationName>
          <ConversationLastMessage>
            {conversation.lastMessage
              ? conversation.lastMessage.content.length > 30
                ? conversation.lastMessage.content.substring(0, 30) + '...'
                : conversation.lastMessage.content
              : 'Aucun message'}
          </ConversationLastMessage>
        </ConversationDescription>
      </Conversation>
    })
  }
  
  const filterConversations = e => {
    const name = e.target.value.toString().toLowerCase()
    const conversations = state.conversations.filter(
      conversation =>
        conversation.user.firstname.toLowerCase().includes(name) ||
        conversation.user.lastname.toLowerCase().includes(name)
    )
    
    dispatch({
      type: ACTIONS.SET_FILTERED_CONVERSATIONS,
      payload: name ? conversations : state.conversations,
    })
  }
  
  const renderMessages = conversation => {
    return conversation.messages.length > 0 ? (
      conversation.messages.map((message, index) => (
        <Message
          key={index}
          position={
            conversation.user.uniq_id !== message.sender_uniq_id
              ? MessagePositions.RIGHT
              : MessagePositions.LEFT
          }
          content={emojify(message.content, {output: 'unicode'})}
          user={conversation.user}
          date={message.created_at}
        />
      ))
    ) : (
      <NoMessage>
        <Alert color="info">
          <Emojify>
            Vous n'avez jamais parlé avec {conversation.user.firstname},
            envoyez-lui un message ! ✍️
          </Emojify>
        </Alert>
      </NoMessage>
    )
  }
  
  const getConversations = async () => {
    dispatch({
      type: ACTIONS.START_ACTION,
      payload: {conversations: true, conversation: true},
    })
    
    const {
      data: {success, conversations},
    } = await axios.post(
      `${config.API_ROOT}/get_conversations`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
    
    if (success) {
      if (conversations.length > 0) {
        dispatch({type: ACTIONS.GET_CONVERSATIONS, payload: conversations})
        if (path(['state', 'conversation', 'id'], location)) {
          await selectConversation(
            path(['state', 'conversation', 'id'], location),
            conversations,
            path(['state', 'conversation', 'link_id'], location)
          )
        } else {
          dispatch({type: ACTIONS.NO_SELECTION})
        }
      } else {
        dispatch({type: ACTIONS.NO_CONVERSATIONS})
      }
    }
  }
  
  const onSubmit = async (e, content) => {
    dispatch({type: ACTIONS.START_ACTION, payload: {send_message: true}})
    
    const {
      data: {success, message},
    } = await axios.post(
      `${config.API_ROOT}/send_message`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        conversation_id: state.selectedConversation.id,
        receiver_uniq_id: state.selectedConversation.user.uniq_id,
        conversation_link_id: state.selectedConversation.link_id,
        content,
      })
    )
    
    if (success) {
      message.content = emojify(message.content, {output: 'unicode'})
      
      const conversations = state.conversations.map(c => {
        message.conversation_id = Number(message.conversation_id)
        
        if (c.id === message.conversation_id) {
          c.lastMessage = message
        }
        
        return c
      })
      
      dispatch({
        type: ACTIONS.APPEND_MESSAGE,
        payload: {conversations, message},
      })
      
      e.current.textarea.value = ''
    }
  }
  
  return (
    <Fragment>
      <Navbar hideMessagesCount />
      <Container>
        <MessagingTitle>Messagerie</MessagingTitle>
        <ColumnContainer>
          <LeftColumn>
            {!state.emptyConversations && (
              <ColumnTitle>
                <SearchContainer>
                  <FontAwesomeIcon icon={faSearch} />
                  <SearchField
                    placeholder="Rechercher"
                    onChange={e => filterConversations(e)}
                  />
                </SearchContainer>
              </ColumnTitle>
            )}
            
            <ConversationList>
              <Loader display={state.loading.conversations ? 1 : 0} />
              {state.renderedConversations}
              {state.emptyConversations && (
                <Alert color="info">
                  <h3>Oops ! Il n'y a rien ici !</h3>
                  <p style={{margin: '10px 0 0 0'}}>
                    Il semble que vous n'ayiez pas encore engagé de
                    conversation.
                    <br />
                    Rendez-vous sur le profil d'un utilisateur et cliquez sur
                    "Envoyer un message" afin de démarrer une conversation.
                  </p>
                </Alert>
              )}
            </ConversationList>
          </LeftColumn>
          {!state.emptyConversations && (
            <RightColumn>
              <ColumnTitle>
                {state.selectedConversation && (
                  <Text>
                    Conversation avec{' '}
                    <ReceiverLink
                      to={`/profile/${state.selectedConversation.user.id}`}
                    >{`${state.selectedConversation.user.firstname} ${
                      state.selectedConversation.user.lastname
                      }`}</ReceiverLink>
                  </Text>
                )}
              </ColumnTitle>
              <ScrollableContent>
                <MessagesContainer>
                  <Loader display={state.loading.conversation ? 1 : 0} />
                  {state.selectedConversation &&
                  renderMessages(state.selectedConversation)}
                  {state.noSelection && !state.loading.conversation && (
                    <Alert color="info" style={{margin: '15px 0 0 0'}}>
                      <h3>Sélectionnez une conversation</h3>
                      <p style={{margin: '10px 0 0 0'}}>
                        Vous pouvez sélectionner la conversation que vous
                        souhaitez consulter via le menu de gauche.
                      </p>
                    </Alert>
                  )}
                </MessagesContainer>
                <div ref={scrollEnd} />
              </ScrollableContent>
              {!state.noSelection && (
                <Fragment>
                  <Separator />
                  <MessageWriter
                    onSubmit={onSubmit}
                    loading={state.loading.send_message}
                  />
                </Fragment>
              )}
            </RightColumn>
          )}
        </ColumnContainer>
      </Container>
    </Fragment>
  )
}