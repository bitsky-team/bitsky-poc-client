import styled from 'styled-components'
import React, {useState, useEffect} from 'react'
import DateService from '../../services/DateService'
import LoopService from '../../services/LoopService'

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
  width: 100%;
  justify-content: ${({position}) =>
  position === MessagePositions.RIGHT ? 'flex-end' : 'initial'};
  img {
    height: 48px;
    width: 48px;
    border-radius: 50%;
  }
`

const MessageContent = styled.div`
  max-width: 45%;
  white-space: pre-wrap;
  word-wrap: break-word;
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

export const Message = ({position, content, user, date}) => {
  const [dynamicDate, setDynamicDate] = useState(DateService.timeSince(date))

  useEffect(() => {
    const timeLoop = LoopService.loop(1000, () =>
      setDynamicDate(DateService.timeSince(date))
    )
    return () => LoopService.stop(timeLoop)
  }, [])

  return (
    <MessageContainer position={position}>
      <MessageAvatarAndContent position={position}>
        {position === MessagePositions.LEFT && (
          <img src={user.avatar} alt="avatar" />
        )}

        <MessageContent position={position}>{content}</MessageContent>

        {position === MessagePositions.RIGHT && (
          <img src={localStorage.getItem('avatar')} alt="avatar" />
        )}
      </MessageAvatarAndContent>
      <span>Il y a {dynamicDate}</span>
    </MessageContainer>
  )
}
