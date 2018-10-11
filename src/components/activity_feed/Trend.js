import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class Trend extends Component {
    getContent() {
        return {__html: this.props.content.trunc(80)};
    }

    render() {
        return (
            <div>
                <p>{this.props.name}</p>
                <div className="trend-content">
                    <p dangerouslySetInnerHTML={this.getContent()}></p>
                    <small>Par <a href={null}>{this.props.author}</a></small>
                </div>
                <Button color="info" className="see-more-button">Voir plus</Button>{' '}      
            </div>
        )
    }
}