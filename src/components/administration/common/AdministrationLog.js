import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {config} from '../../../config'
import axios from 'axios'
import qs from 'qs'
import {withRouter} from 'react-router'
import {toast} from 'react-toastify'


const AdminLog = styled.div`
      background: linear-gradient(45deg, #83B2E0 0, #A5CDF5 100%);
      height: 30px;
      width: 100%;
      margin-bottom: 10px;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 5px;
      transition: 0.2s ease-in-out;
      
      :hover {
        cursor: pointer;
        padding-left: 5px;
      }
`
const LogSpan = styled.span`
      margin-right: 5px;
`

const Type = styled.span`
    background: #FFF;
    color: #83B2E0;
    border-radius: 2px;
    margin-right: 10px;
    margin-left: 2px;
    padding: 1px;
`

const Level = styled.span`
    margin-right: 5px;
    background: #83B2E0;
    color: #FFF;
    width: 25px;
    text-align: center;
    display: inline-block;
    border-radius: 50%;
`

const AdministrationLog = (props) => {

    const {log} = props

    const [level, setLevel] = useState(null)
    const [time, setTime] = useState(null)
    const [type, setType] = useState(null)
    const [message, setMessage] = useState(null)
    const [uniq_id, setUniqId] = useState(null)

    const getUserProfile = async (user_uniq_id) => {
      return await axios.post(`${config.API_ROOT}/get_user_by_uniq_id`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          token: localStorage.getItem('token'),
          user_uniq_id,
        })
      )
    }

    const toUserProfile = async (uniq_id) => {
      const response = await getUserProfile(uniq_id)
      const {user} = response.data

      if(user) {
        props.history.push(`/profile/${user.id}`)
      } else {
        toast.error('L\'uniq_id de l\'utilisateur n\'existe plus ou a été modifié !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    }

    useEffect(() => {
        let level = log.match(/(.Niveau [0-9].)/)[0].replace('Niveau ', '')
        let time = log.match(/\[([^\]]*)\]/g)[0]
        let type = log.match(/\[([^\]]*)\]/g)[1].replace(/[[\]]/g, '')
        let typeToRemove = log.match(/\[([^\]]*)\] /g)[1]
        let message = log.match(/\[[A-Z](.*?)\(/g)[0].replace(typeToRemove, '')
        let uniq_id = log.match(/[a-z,0-9]{32}/g) ? log.match(/[a-z,0-9]{32}/g)[0] : null

        if(message !== null && message.length > 0) {
          message = message.substring(0, message.length - 1)
        }

        setLevel(level)
        setTime(time)
        setType(type)
        setMessage(message)
        setUniqId(uniq_id)
    },[])

    return (
        <AdminLog onClick={() => toUserProfile(uniq_id)}>
            <div>
              <Type>{type}</Type>
              <LogSpan>{time}</LogSpan>
              <LogSpan>{message}</LogSpan>
            </div>
            <div>
              <Level>{level}</Level>
            </div>
        </AdminLog>
    )
}

export default withRouter(AdministrationLog)
