import React, {Fragment, useState, useEffect} from 'react'
import {
  Button,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'
import Navbar from '../common/template/Navbar'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faCommentAlt, faLink,
  faMapMarkerAlt,
  faPencilAlt,
  faCrown,
} from '@fortawesome/free-solid-svg-icons'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {config} from '../../config'
import qs from 'qs'
import {toast} from 'react-toastify'
import Post from '../common/post/Post'
import {withRouter} from 'react-router'
import Loader from '../Loader'
import Fade from 'react-reveal/Fade';
import {emojify} from 'react-emojione'
import ImgViewer from '../files/ImgViewer'

export const CenteredRow = styled(Row)`
  display: flex;
  justify-content: center;
`
const ProfileContainer = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
`
const Avatar = styled.img`
  border-radius: 50%;
  height: 128px;
  border: 5px solid #f5f7f8;
  margin: -50px 0 15px 0;
`
const LeftColumnContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`
const RightColumnHeader = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
`
const LivingPlace = styled.h5`
  color: #b7b7b7;
  font-size: 18px;
  margin: 0 15px 8px;

  svg {
    margin-right: 5px;
  }
`
const Job = styled.h5`
  color: rgb(131, 178, 224);
  font-size: 16px;
  margin-bottom: 16px;
`
const PostsRow = styled(Row)`
  background-color: #f5f7f8;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 20px 0 30px 0;
  border-left: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  border-radius: 0 0 10px 10px;
`
const PostsContainer = styled.div`
  max-width: 85%;
  margin: 0 auto;
`
const NoPosts = styled.p`
  color: rgb(97, 97, 97);
  margin-top: -15px;
  text-align: center;
`
const DescriptionContainer = styled(Col)`
  display: flex;
`
const AboutContainer = styled.p`
  padding: 10px;
  background-color: #f5f7f8;
  border-radius: 5px;
  margin: ${({margin}) => (margin ? '0 0 0 30px' : 0)};
  width: ${({margin}) => (margin ? '100%' : 'initial')};
`
const AboutItem = styled.div`
  margin-top: 15px;
`
const FavoritesTrendsTitle = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;

  small {
    color: #b7b7b7;
    font-size: 14px;
  }

  hr {
    flex: 1;
    margin-left: 10px;
  }
`
const FavoritesTrendsContainer = styled.div``
const FavoriteTrend = styled.h5`
  color: rgb(131, 178, 224);
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;

  :hover {
    transform: translateX(5px);
  }
`

const LinkedLogo = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #b7b7b7;
  font-size: 18px;
`

const AdminCrown = styled.span`
  color: #FFF;
  background: #FFA630;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 50px;
`

const AvatarContainer = styled.div`
  position: relative;
`


const ProfilePage = props => {
  const [session] = (localStorage.getItem('token')) ? useState(jwtDecode(localStorage.getItem('token'))) : useState(null)
  const [user, setUser] = useState(null)
  const [userPosts, setPosts] = useState(null)
  const [favoritesTrendsLoader, setFavoritesTrendsLoader] = useState(true)
  const [favoritesTrends, setFavoritesTrends] = useState(null)
  const [tab, setTab] = useState(1)
  const [pictureModalState, setPictureModalState] = useState(false)
  const [pictureViewer, setPictureViewer] = useState(null)

  useEffect(() => {
    Promise.all([getUser(), getPosts()]).then(
      ([userResponse, postsResponse]) => {
        const {success: userSuccess, user} = userResponse.data
        const {success: postsSuccess, posts} = postsResponse.data
        
        if (userSuccess && postsSuccess) {
          // Setting user
          setUser(user)

          // Setting posts
          setPosts(convertPosts(posts))
  
          // Setting trends
          convertFavoritesTrends()
        } else {
          toast.error('Erreur lors du chargement du profil', {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      }
    )
  }, [props.match.params.id])

  const getUser = async () => {
    const userId = props.match.params.id || session.id
    
    if(!props.match.params.fromStranger) {
      return await axios.post(
        `${config.API_ROOT}/get_user`,
        qs.stringify({
          token: localStorage.getItem('token'),
          uniq_id: localStorage.getItem('id'),
          user_id: userId,
        })
      )
    } else {
      return await axios.post(
        `${config.API_ROOT}/get_stranger_user`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          bitsky_ip: props.match.params.fromStranger,
          user_id: userId,
        })
      )
    }
  }
  
  const getPosts = async () => {
    const userId = props.match.params.id || session.id
    
    if (!props.match.params.fromStranger) {
      return axios.post(
        `${config.API_ROOT}/get_allpostsofuser`,
        qs.stringify({
          token: localStorage.getItem('token'),
          uniq_id: localStorage.getItem('id'),
          user_id: userId,
        })
      )
    } else {
      return axios.post(
        `${config.API_ROOT}/get_allpostsofstrangeruser`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          bitsky_ip: props.match.params.fromStranger,
          user_id: userId,
        })
      )
    }
  }

  const togglePictureModal = picture => {
    setPictureModalState(!pictureModalState)
    setPictureViewer(picture)
  }
  
  const convertPosts = posts => {
    let statePosts = []
    posts.forEach(post => {
      statePosts.push(
        <Post
          id={post.id}
          key={'post-' + post.id}
          ownerId={post.owner.id}
          ownerAvatar={post.owner.avatar}
          ownerName={post.owner.firstname + ' ' + post.owner.lastname}
          ownerRank={post.owner.rank}
          content={post.content}
          tag={post.tag}
          filled={false}
          favorites={post.favorites}
          comments={post.comments}
          date={post.created_at}
          fromStranger={props.match.params.fromStranger}
          isOwner={
            post.owner.firstname + ' ' + post.owner.lastname ===
              session.firstname + ' ' + session.lastname || session.rank === 2
          }
          handleDeleteButtonClick={handleDeleteButtonClick}
          picture={post.picture}
          togglePictureModal={togglePictureModal}
        />
      )
    })
    return statePosts
  }
  
  const getFavoritesTrends = async () => {
    const userId = props.match.params.id || session.id

    if(!props.match.params.fromStranger) {
      return axios.post(
        `${config.API_ROOT}/get_favoritestrends`,
        qs.stringify({
          token: localStorage.getItem('token'),
          uniq_id: localStorage.getItem('id'),
          user_id: userId,
        })
      )
    } else {
      return axios.post(
        `${config.API_ROOT}/get_strangerfavoritestrends`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          bitsky_ip: props.match.params.fromStranger,
          user_id: userId,
        })
      )
    }
  }
  
  const convertFavoritesTrends = async () => {
    setFavoritesTrendsLoader(true)
    const response = await getFavoritesTrends()
    const {success, favoritesTrends} = response.data
    const sortArray = (a, b) => {
      if (a.count > b.count) return -1
      if (a.count < b.count) return 1
      return 0
    }
    
    if(success) {
      // Setting trends
      const stateTrends = []
      
      if(favoritesTrends) {
        favoritesTrends.sort(sortArray)
        favoritesTrends.slice(0, 3).forEach(favoriteTrend => {
          stateTrends.push(
            <FavoriteTrend
              key={favoriteTrend.id}
              onClick={() =>
                props.history.push('/activity_feed', {
                  trend: favoriteTrend.name,
                })
              }
            >
              {emojify(favoriteTrend.name, {output: 'unicode'})}
            </FavoriteTrend>
          )
        })
      }
      
      setFavoritesTrends(stateTrends)
      setFavoritesTrendsLoader(false)
    }
  }
  
  const deletePost = async id => {
    const response = await axios.post(
      `${config.API_ROOT}/remove_post`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: id,
      })
    )
    return await response
  }
  
  const handleDeleteButtonClick = async e => {
    let element = e.target.parentElement.parentElement
    let str_id = element.id
    let id = str_id.split('-')[1]
    let posts = await getPosts()
    posts = posts.data.posts

    deletePost(id).then(response => {
      const {success} = response.data
      if (success) {
        setPosts(
          convertPosts(posts).filter(p => {
            return p.key !== str_id
          })
        )
        
        convertFavoritesTrends()
        
        toast.success('La publication a été supprimée !', {
          autoClose: 5000,
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'notification-success',
        })
      }
    })
  }
  
  const createConversation = async () => {
    const data = {
      uniq_id: localStorage.getItem('id'),
      token: localStorage.getItem('token'),
      first_user_id: session.id,
      second_user_id: user.id,
      bitsky_ip: (props.match && props.match.params) ? props.match.params.fromStranger : undefined
    }
  
    const {data: {success, conversation}} = await axios.post(
      `${config.API_ROOT}/create_conversation`,
      qs.stringify(data)
    )
    
    if(success) {
      props.history.push({
        pathname: '/messaging',
        state: { conversation }
      })
    }
  }
  
  const getDate = () => {
    const date = new Date(user.birthdate)
    return `${date.getDate()}/${
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    }/${date.getFullYear()}`
  }
  
  const toggle = nextTab => {
    if (tab !== nextTab) {
      setTab(nextTab)
    }
  }

  if (!user || !userPosts) {
    return (
      <Fragment>
        <Navbar />

        <div style={{marginTop: '40px'}}>
          <Loader display={(!user || !userPosts) ? 1 : 0}/>
        </div>
      </Fragment>
    )
  }

  return (
    <div>
      <ImgViewer isOpen={pictureModalState} toggle={togglePictureModal} imgSrc={pictureViewer}/>
      <Navbar />

      <Fade>
        <Container className="main-container" style={{paddingTop: '55px'}}>
          <CenteredRow>
            <Col md="10">
              <ProfileContainer>
                <Row>
                  <Col md="3">
                    <LeftColumnContainer>
                      <AvatarContainer>
                        <Avatar src={user.avatar} alt="Avatar"/>
                        {user.rank === 2 ? <AdminCrown><FontAwesomeIcon icon={faCrown}/></AdminCrown>: null}
                      </AvatarContainer>
                      {(user.id !== session.id || props.match.params.fromStranger)  ? (
                        <Button color="info" className="see-more-button" onClick={createConversation}>
                          <FontAwesomeIcon icon={faCommentAlt} /> Envoyer un message
                        </Button>
                      ) : (
                        <Button color="info" className="see-more-button" onClick={() => props.history.push('/user_preferences')}>
                          <FontAwesomeIcon icon={faPencilAlt} /> Modifier mon
                          profil
                        </Button>
                      )}
                    </LeftColumnContainer>
              
                    <FavoritesTrendsTitle>
                      <small>Sujets préférés</small>
                      <hr />
                    </FavoritesTrendsTitle>
                    <FavoritesTrendsContainer>
                      <Loader display={favoritesTrendsLoader ? 1 : 0}/>
                      {favoritesTrends}
                    </FavoritesTrendsContainer>
                  </Col>
                  <Col md="9">
                    <RightColumnHeader>
                      <h1>{`${user.firstname} ${user.lastname}`}</h1>
                      <LivingPlace>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        {user.livingplace}
                      </LivingPlace>
                      {props.match.params.fromStranger && <LinkedLogo><FontAwesomeIcon icon={faLink} /></LinkedLogo>}
                    </RightColumnHeader>
              
                    <Job>{user.job}</Job>
              
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={tab === 1 ? 'active' : null}
                          onClick={() => {
                            toggle(1)
                          }}
                        >
                          Publications
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={tab === 2 ? 'active' : null}
                          onClick={() => {
                            toggle(2)
                          }}
                        >
                          À propos
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={tab}>
                      <TabPane tabId={1}>
                        <PostsRow>
                          <Col sm="12">
                            <PostsContainer className="posts-container">
                              {userPosts && userPosts.length > 0 ? (
                                <div>{userPosts}</div>
                              ) : (
                                <NoPosts>
                                  {user.firstname} n'a jamais publié.
                                </NoPosts>
                              )}
                            </PostsContainer>
                          </Col>
                        </PostsRow>
                      </TabPane>
                      <TabPane tabId={2}>
                        <Row style={{padding: '10px'}}>
                          <DescriptionContainer sm="12">
                            <strong>Biographie</strong>
                            <AboutContainer margin>
                              {user.biography}
                            </AboutContainer>
                          </DescriptionContainer>
                          <Col sm="6">
                            <AboutItem>
                              <strong>Lieu de naissance</strong>
                              <AboutContainer>{user.birthplace}</AboutContainer>
                            </AboutItem>
                            <AboutItem>
                              <strong>Situation amoureuse</strong>
                              <AboutContainer>
                                {user.relationshipstatus}
                              </AboutContainer>
                            </AboutItem>
                          </Col>
                          <Col sm="6">
                            <AboutItem>
                              <strong>Genre</strong>
                              <AboutContainer>{user.sex}</AboutContainer>
                            </AboutItem>
                            <AboutItem>
                              <strong>Date de naissance</strong>
                              <AboutContainer>{getDate()}</AboutContainer>
                            </AboutItem>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
              </ProfileContainer>
            </Col>
          </CenteredRow>
        </Container>
      </Fade>
    </div>
  )
}

export default withRouter(ProfilePage)
