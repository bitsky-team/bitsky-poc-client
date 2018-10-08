import React, { Component } from 'react';
import avatar from '../../../assets/img/avatar.png';
import DateService from '../../../services/DateService';
import { config } from '../../../config';
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faStar as faFullStar, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faStar as faEmptyStar, faComments } from '@fortawesome/free-regular-svg-icons';

import { Container, Row, Col } from 'reactstrap';

class Post extends Component {

    constructor(props) {
        super(props);

        this.state = {
            favoriteFilled: this.props.favoriteFilled,
            favorites: this.props.favorites,
            comments: this.props.comments
        }
    }

    isOwner() {
        // TODO: vérifier
        if(true) {
            return <FontAwesomeIcon className="delete" icon={faTimes} onClick={this.handleDeleteButtonClick}/>
        }
    }

    handleFavoriteButtonClick = (e) => {
        this.setState({favoriteFilled: !this.state.favoriteFilled});
        if(this.state.favoriteFilled) this.setState({favorites: this.state.favorites - 1});
        else this.setState({favorites: this.state.favorites + 1});
    }

    handleDeleteButtonClick = (e) => {
        $.post(`${config.API_ROOT}/remove_post`, { uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token'), post_id:  this.props.id})
          .done(function( data ) {
            let response = JSON.parse(data);
            if(response.success) {
                $('#post-'+this.props.id).fadeOut(function(){ $(this).remove() });
            }
        }.bind(this));
    }

    render() {
        return (
            <div id={"post-"+this.props.id} className="post">
                {this.isOwner()}
                <img src={avatar} alt="Avatar" />
                <div className="title">
                    <h4>{this.props.ownerName}</h4>
                    <small>{this.props.ownerRank}</small>
                </div>
                <p className="post-content">
                    {this.props.content}
                </p>
                <Container className="post-details">
                    <Row>
                        <Col md="4">
                            <span className="tag"><FontAwesomeIcon icon={faTag} /> {this.props.tag}</span>
                        </Col>
                        <Col md="4">
                            <span className="fav-counter"><i><FontAwesomeIcon icon={this.state.favoriteFilled ? faFullStar : faEmptyStar} onClick={this.handleFavoriteButtonClick} /></i> {this.state.favorites}</span>
                            {' '}
                            <span className="comment-counter"><FontAwesomeIcon icon={faComments} /> {this.state.comments}</span>
                        </Col>
                        <Col md="4">
                            <span className="date"><FontAwesomeIcon icon={faClock} /> {DateService.timeSince(this.props.date)}</span>
                        </Col>
                    </Row>
                </Container>                    
            </div>
        );
    }
}

export default Post;