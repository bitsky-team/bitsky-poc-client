import axios from 'axios'
import {config} from '../config'
import qs from 'qs'

class LinkService {
  static getKey = async () => {
    return axios.post(
      `${config.API_ROOT}/get_key`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
      })
    )
  }
  
  static getLinks = async () => {
    const key = await LinkService.getKey()

    if (key.data.success) {
      return axios.post(
        'https://bitsky.be/getActiveLinks',
        qs.stringify({
          bitsky_key: key.data.key,
        })
      )
    }
  }
}

export default LinkService
