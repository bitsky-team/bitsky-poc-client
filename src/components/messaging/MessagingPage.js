import React, {Fragment, useRef, useEffect} from 'react'
import Navbar from '../common/template/Navbar'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'
import {Message, MessagePositions} from './Message'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 71px); // 71 => 66 = navbar's height + 5 = margin top
  background-color: #f5f5f5;
  margin-top: 5px;
  padding: 24px 32px;
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
  background-color: #FFF;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0px 5px 25px -5px rgba(0,0,0,0.05);
  padding: 20px 10px;
  margin-top: 16px;
  transition: 0.2s;
  
  :hover {
    transform: scale(1.02);
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

export const MessagingPage = () => {
  const scrollEnd = useRef(null)
  
  useEffect(() => {
    scrollEnd.current.scrollIntoView();
  }, [])
  
  return (
    <Fragment>
      <Navbar />

      <Container>
        <MessagingTitle>Messagerie</MessagingTitle>
        <ColumnContainer>
          <LeftColumn>
            <ColumnTitle>
              <SearchContainer>
                <FontAwesomeIcon icon={faSearch} />
                <SearchField placeholder="Rechercher" />
              </SearchContainer>
            </ColumnTitle>
            
            <ConversationList>
              <Conversation>
                <ConversationAvatar src={localStorage.getItem('avatar')} alt='avatar' />
                <ConversationDescription>
                  <ConversationName>Jason Van Malder</ConversationName>
                  <ConversationLastMessage>Super, à bientôt !</ConversationLastMessage>
                </ConversationDescription>
              </Conversation>
            </ConversationList>
          </LeftColumn>
          <RightColumn>
            <ColumnTitle>
              <Text>
                Conversation avec <ReceiverLink to="/">Sylvain Urbain</ReceiverLink>
              </Text>
            </ColumnTitle>
            <ScrollableContent>
              <MessagesContainer>
                <Message position={MessagePositions.LEFT} />
                <Message position={MessagePositions.RIGHT} />
                <Message position={MessagePositions.LEFT} />
                <Message position={MessagePositions.RIGHT} />
                <Message position={MessagePositions.LEFT} />
                <Message position={MessagePositions.RIGHT} />
                <Message position={MessagePositions.LEFT} />
                <Message position={MessagePositions.RIGHT} />
                <Message position={MessagePositions.LEFT} />
                <Message position={MessagePositions.RIGHT} />
                <Message position={MessagePositions.LEFT} />
                <Message position={MessagePositions.RIGHT} />
                <Message position={MessagePositions.LEFT} />
              </MessagesContainer>
              <div ref={scrollEnd} />
            </ScrollableContent>
          </RightColumn>
        </ColumnContainer>
      </Container>
    </Fragment>
  )
}
