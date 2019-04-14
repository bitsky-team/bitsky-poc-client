import React from 'react'
import {Col} from 'reactstrap'
import styled from 'styled-components'
import CircularProgressbar from 'react-circular-progressbar';


const StorageDeviceName = styled.h5`
  border-bottom:1px solid rgba(255,255,255,0.2);
  margin-bottom: 10px !important;
  padding-bottom: 5px;
`

const ProgressCircle = styled(CircularProgressbar)`
  height: 70px !important;
`

const TotalVolume = styled.p`
  font-weight: 100;
`

const InfoContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`

const AdministrationUsedStorage = ({name, usedVolume, totalVolume, percent}) => {

  const ProgressContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    color: #FFF;
    padding: 5px;
    background: ${(percent.substring(0, percent.length - 1)) >= 75 ? 'linear-gradient(45deg, #CF94CA 0, #E8B4E3 100%)' : 'linear-gradient(45deg, #83B2E0 0, #A5CDF5 100%)'};     
    border-radius: 5px;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
  `

  return (
    <Col md="3" className="no-padding-left no-padding-right">
      <Col md="12">
        <ProgressContainer>
          <StorageDeviceName>{name.split('/')[2]}</StorageDeviceName>
          <ProgressCircle
            percentage={percent.substring(0, percent.length - 1)}
            styles={{
              path: {
                stroke: '#FFF',
                strokeLinecap: 'round',
                transition: 'stroke-dashoffset 0.5s ease 0s',
              },
              trail: {
                stroke: 'rgba(255, 255, 255, 0.15)',
              },
              background: {
                fill: '#A5CDF5',
              },
            }}
          />
          <div>
            <InfoContainer>
              <h3>{`${usedVolume}o`}</h3>
              <TotalVolume>sur {`${totalVolume}o`}</TotalVolume>
            </InfoContainer>
          </div>
        </ProgressContainer>
      </Col>
    </Col>
  )
}
export default AdministrationUsedStorage
