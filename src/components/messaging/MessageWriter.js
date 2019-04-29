import React, {useState, useRef, Fragment} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import TextareaAutosize from 'react-autosize-textarea'
import Loader from '../Loader'

const Textarea = styled(TextareaAutosize)`
  display: block;
  width: 100%;
  border: none;
  padding: 10px;
  border-radius: 5px;
`

const Writer = styled.div`
  position: relative;
`

const SendIcon = styled.span`
  position: absolute;
  right: 6px;
  top: 6px;
  background: rgb(131, 178, 224);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 8px 5px 5px;
  cursor: pointer;
  transition: 0.2s;

  :hover {
    transform: scale(1.15);
  }
`

const LoaderContainer = styled.span`
  position: absolute;
  right: 6px;
  top: 6px;
`

export const MessageWriter = ({onSubmit, loading}) => {
  const [message, setMessage] = useState(null)
  const contentRef = useRef(null)
  
  return (
    <Writer>
      <Textarea
        ref={contentRef}
        placeholder="Écrivez votre message..."
        onChange={e => setMessage(e.target.value)}
      />
      {message && (
        <Fragment>
          {!loading ? (
            <SendIcon onClick={async () => {
              await onSubmit(contentRef, message)
              setMessage(null)
            }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </SendIcon>
          ) : (
            <LoaderContainer>
              <Loader display={1} />
            </LoaderContainer>
          )}
        </Fragment>
      )}
    </Writer>
  )
}