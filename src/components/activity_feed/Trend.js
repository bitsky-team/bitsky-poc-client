import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import _ from 'lodash'

class Trend extends Component {
    getContent() {
        return {
            __html: _.truncate(this.props.content, {
                'length': 80,
                'separator': /,? +/
            })
        }
    }

    filterActivityFeed = () => {
        this.props.updateFilter(this.props.name)
    }

    render() {
        return (
            <div>
                <div className="trend-title">
                    <p>{this.props.name}</p>
                    <div className="score">
                        <span>{ this.props.score }</span>
                    </div>
                </div>
                <div className="trend-content">
                    <p dangerouslySetInnerHTML={this.getContent()} />
                    <small>Par <a href="/profile/USER">{this.props.author}</a></small>
                </div>
                <Button color="info" className="see-more-button" onClick={this.filterActivityFeed}>Voir plus</Button>{' '}
            </div>
        )
    }
}

export default withRouter(Trend)