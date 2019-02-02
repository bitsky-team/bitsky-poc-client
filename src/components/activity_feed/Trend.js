import React, { Component } from 'react'
import { Button } from 'reactstrap'
import _ from 'lodash'

export default class Trend extends Component {
    getContent() {
        return {
            __html: _.truncate(this.props.content, {
                'length': 80,
                'separator': /,? +/
            })
        }
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
                    <p dangerouslySetInnerHTML={this.getContent()}></p>
                    <small>Par <a href="/profile/USER">{this.props.author}</a></small>
                </div>
                <Button color="info" className="see-more-button">Voir plus</Button>{' '}      
            </div>
        )
    }
}