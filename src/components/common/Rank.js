import React, { Component } from 'react'
import axios from 'axios'
import { config } from '../../config'

export default class Rank extends Component {

    _isMounted = false

    state = {
        rank: '?'
    }

    getRank = async () => {
        return await axios.get(`${config.API_ROOT}/get_ranks`)
    }

    setRank = () => {
        this.getRank().then((response) => {
            const { success, ranks } = response.data
            if(this._isMounted) {
                if(success) {
                    let rank = ranks.filter(rank => rank.id === parseInt(this.props.id))
                    
                    if(rank.length) {
                        this.setState({ rank: rank[0].name })
                    }else {
                        this.setState({ rank: "?"})
                    }
                }else {
                    this.setState({rank: "?"})
                }
            }
        })
    }

    componentDidMount = () => {
        this._isMounted = true
        this.setRank()
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    render() {
        return <span>{this.state.rank}</span>
    }
}
