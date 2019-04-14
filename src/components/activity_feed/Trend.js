import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Button } from 'reactstrap'
import _ from 'lodash'
import PostViewer from '../common/post/PostViewer'
import {emojify} from 'react-emojione'

class Trend extends Component {
    constructor(props) {
        super(props)
        this.postViewer = React.createRef()
    }

    getContent() {
        return {
            __html: _.truncate(emojify(this.props.content, {output: 'unicode'}), {
                'length': 80,
                'separator': /,? +/
            })
        }
    }

    filterActivityFeed = () => {
        this.props.updateFilter(this.props.name)
    }
    
    redirectToAuthor = (e) => {
      e.preventDefault()
      
      const {author, fromStranger, history} = this.props
      
      if(!fromStranger) {
        history.push(`/profile/${author.id}`)
      } else {
        history.push(`/profile/${author.id}/${fromStranger}`)
      }
    }

    doNothing = () => {}

    render() {
        const {name, score, author, post_id, fromStranger} = this.props
      
        return (
            <div>
                <div className="trend-title">
                    <p>{emojify(name, {output: 'unicode'})}</p>
                    <div className="score">
                        <span>{ score }</span>
                    </div>
                </div>

                <div className="trend-content" onClick={() => this.postViewer.current.toggle()}>
                    <p dangerouslySetInnerHTML={this.getContent()} />
                  <small>Par <Link to='/' onClick={this.redirectToAuthor}>{author.name}</Link></small>
                </div>
                <Button color="info" className="see-more-button" onClick={this.filterActivityFeed}>Voir plus</Button>{' '}

                <PostViewer
                    ref={this.postViewer}
                    id={post_id}
                    toggleFavoriteFromActivityFeed={this.doNothing}
                    increaseCommentCounterFromActivityFeed={this.doNothing}
                    decreaseCommentCounterFromActivityFeed={this.doNothing}
                    toggleBestComments={this.doNothing}
                    refreshBestComments={this.doNothing}
                    adjustBestComments={this.doNothing}
                    setCommentsCount={this.doNothing}
                    refreshTrends={this.doNothing}
                    fromStranger={fromStranger}
                />
            </div>
        )
    }
}

export default withRouter(Trend)