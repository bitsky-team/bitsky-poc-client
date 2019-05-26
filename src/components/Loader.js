import {Spinner} from 'reactstrap'
import React from 'react'
import styled from 'styled-components'

const SpinnerContainer = styled.div`
  display: ${({display, row}) => display ? (row ? 'inline-block' : 'flex') : 'none'};
  justify-content: center;
  
  .spinner-grow {
    width: ${({row}) => row ? '10px' : '2rem'};
    height: ${({row}) => row ? '10px' : '2rem'};
  }
  
  div {
    color: rgb(131, 178, 224) !important;
  }
`

const Loader = ({display, row, ...rest}) => {
  return (
    <SpinnerContainer display={display} row={row} {...rest}>
      <Spinner type="grow" color="info" className="info-message" style={{display: 'block'}}/>
    </SpinnerContainer>
  )
}

export default Loader;