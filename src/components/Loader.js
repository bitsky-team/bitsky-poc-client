import {Spinner} from 'reactstrap'
import React from 'react'
import styled from 'styled-components'

const SpinnerContainer = styled.div`
  display: ${({display}) => display ? 'flex' : 'none'};
  justify-content: center;
  
  div {
    color: rgb(131, 178, 224) !important;
  }
`

const Loader = ({display}) => {
  return (
    <SpinnerContainer display={display}>
      <Spinner type="grow" color="info" className="info-message" style={{display: 'block'}}/>
    </SpinnerContainer>
  )
}

export default Loader;