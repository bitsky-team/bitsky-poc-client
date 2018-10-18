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
                <p>{this.props.name}</p>
                <div className="trend-content">
                    <p dangerouslySetInnerHTML={this.getContent()}></p>
                    <small>Par <a href>{this.props.author}</a></small>
                </div>
                <Button color="info" className="see-more-button">Voir plus</Button>{' '}      
            </div>
        )
    }
}