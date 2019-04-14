import styled from 'styled-components'
import React from 'react'

export const MessagePositions = {
  LEFT: 'left',
  RIGHT: 'right',
}

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  align-items: ${({position}) =>
    position === MessagePositions.RIGHT ? 'flex-end' : 'initial'};

  span {
    color: #858585;
  }
`

const MessageAvatarAndContent = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 48px;
    width: 48px;
    border-radius: 50%;
  }
`

const MessageContent = styled.div`
  background-color: ${({position}) =>
    position === MessagePositions.LEFT ? '#fbfbfb' : 'rgb(131, 178, 224)'};
  color: ${({position}) =>
    position === MessagePositions.LEFT ? '#333534' : '#FFF'};
  box-shadow: 0px 5px 25px -5px rgba(0, 0, 0, 0.05);
  border-radius: 25px;
  padding: 11px 20px;
  margin: ${({position}) =>
    position === MessagePositions.LEFT ? '0 0 0 16px' : '0 16px 0 0'};
`

export const Message = ({position}) => {
  return (
    <MessageContainer position={position}>
      <MessageAvatarAndContent>
        {position === MessagePositions.LEFT && (
          <img src={localStorage.getItem('avatar')} alt="avatar" />
        )}

        <MessageContent position={position}>Super à bientôt !</MessageContent>

        {position === MessagePositions.RIGHT && (
          <img src={localStorage.getItem('avatar')} alt="avatar" />
        )}
      </MessageAvatarAndContent>
      <span>10:00</span>
    </MessageContainer>
  )
}
