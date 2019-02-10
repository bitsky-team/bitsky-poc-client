import React, {Component} from 'react'
import Navbar from '../../common/template/Navbar'
import {
  Container,
  Row,
  Col,
  Table,
  Alert,
} from 'reactstrap'
import jwtDecode from 'jwt-decode'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faTh,
  faList,
  faPlus,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import qs from 'qs'
import {config} from '../../../config'
import UserThumbnail from './UserThumbnail'
import UserTableEntry from './UserTableEntry'
import _ from 'lodash'
import UserManageModal from './UserManageModal'
import UserDeleteModal from './UserDeleteModal'
import UserSearchModal from './UserSearchModal'
import Rank from '../../common/Rank'

export default class UsersAdministrationPage extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.userManageModal = React.createRef()
  }

  state = {
    session: localStorage.getItem('token')
      ? jwtDecode(localStorage.getItem('token'))
      : null,
    users: [],
    filteredUsers: [],
    displayType: 'thumbnails',
    userManageModal: {
      toggle: false,
      type: null,
      user: null,
    },
    userDeleteModal: false,
    deletedUser: null,
    userSearchModal: false,
  }

  toggleUserManageModal = async (type, id) => {
    let userManageModal = {
      toggle: false,
      type: null,
      user: null,
    }

    if (type === 'ADD') {
      userManageModal = {
        toggle: !this.state.userManageModal.toggle,
        type,
      }
    } else {
      const response = await axios.post(
        `${config.API_ROOT}/get_user`,
        qs.stringify({
          uniq_id: localStorage.getItem('id'),
          token: localStorage.getItem('token'),
          user_id: id,
        })
      )

      const {success, user} = response.data

      if (success && this._isMounted) {
        user.password = null

        userManageModal = {
          toggle: !this.state.userManageModal.toggle,
          type,
          user,
        }
      }
    }

    this.setState({userManageModal})
    this.userManageModal.current.resetUser()
    this.userManageModal.current.setUser()
  }

  toggleUserDeleteModal = (id, firstname, lastname) => {
    if (id && firstname && lastname) {
      this.setState({
        deletedUser: {id: id, firstname: firstname, lastname: lastname},
      })
    }
    this.setState({userDeleteModal: !this.state.userDeleteModal})
  }

  toggleUserSearchModal = () => {
    this.setState({userSearchModal: !this.state.userSearchModal})
  }

  filterUsers = action => {
    let displayType = this.state.displayType
    if (
      action ===
      'filter' + displayType[0].toUpperCase() + displayType.slice(1)
    )
      return

    if (this.usersLoading) {
      let usersLoading = this.usersLoading.firstChild
      if (usersLoading) usersLoading.style.display = 'block'
    }

    switch (action) {
      case 'filterThumbnails':
        this.refs.filterToList.classList.remove('active')
        this.refs.filterToThumbnails.classList.add('active')
        this.getUsers('thumbnails')
        break

      case 'filterList':
        this.refs.filterToList.classList.add('active')
        this.refs.filterToThumbnails.classList.remove('active')
        this.getUsers('list')
        break

      default:
        console.log('Erreur lors du filtrage: ', action)
        break
    }
  }

  setFilteredUsers = (users) => {
    this.setState({ filteredUsers: users })
  }

  getUsers = async displayType => {
    this.setState({users: [], filteredUsers: []})

    const response = await axios.post(
      `${config.API_ROOT}/get_allusers`,
      qs.stringify({
        token: localStorage.getItem('token'),
        uniq_id: localStorage.getItem('id'),
      })
    )
    const {success, users} = response.data

    let usersData = success ? users : null

    usersData.forEach(user => {if(user.password) user.password = null})

    let usersList = []

    if (this._isMounted && usersData) {
      switch (displayType) {
        case 'thumbnails':
          this.setState({displayType: displayType})
          let i = 0
          usersData.forEach(user => {
            i++
            usersList.push(
              <UserThumbnail
                margin={i > 3 ? 'margin-top-10' : null}
                key={'user-' + user.id}
                avatar={user.avatar}
                id={user.id}
                firstname={user.firstname}
                lastname={user.lastname}
                uniq_id={user.uniq_id}
                rank={user.rank}
                {...user}
                toggleUserDeleteModal={this.toggleUserDeleteModal}
                toggleUserManageModal={() =>
                  this.toggleUserManageModal('UPDATE', user.id)
                }
                type={this.state.userManageModal.type}
              />
            )
          })
          break

        case 'list':
          this.setState({displayType: displayType})
          usersData.forEach(user => {
            usersList.push(
              <UserTableEntry
                key={'user-' + user.id}
                id={user.id}
                uid={_.truncate(user.uniq_id, {length: 8, separator: /,? +/})}
                lastname={user.lastname}
                firstname={user.firstname}
                email={user.email}
                rank={user.rank}
                {...user}
                toggleUserDeleteModal={this.toggleUserDeleteModal}
                toggleUserManageModal={() =>
                  this.toggleUserManageModal('UPDATE', user.id)
                }
                type={this.state.userManageModal.type}
              />
            )
          })
          break

        default:
          console.log(
            "Erreur lors de l'affichage des utilisateurs: ",
            displayType
          )
          break
      }

      this.setState({users: usersList})
    }

    if (this.usersLoading) {
      let usersLoading = this.usersLoading.firstChild
      if (usersLoading) usersLoading.style.display = 'none'
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getUsers('thumbnails')
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        <Navbar />
        <UserManageModal
          ref={this.userManageModal}
          open={this.state.userManageModal.toggle}
          toggleUserManageModal={this.toggleUserManageModal}
          refreshUsers={e => this.getUsers(this.state.displayType)}
          type={this.state.userManageModal.type}
          user={
            this.state.userManageModal.user
              ? this.state.userManageModal.user
              : null
          }
        />
        <UserDeleteModal
          open={this.state.userDeleteModal}
          user={this.state.deletedUser}
          toggleUserDeleteModal={this.toggleUserDeleteModal}
          refreshUsers={e => this.getUsers(this.state.displayType)}
        />
        <UserSearchModal
          isOpen={this.state.userSearchModal}
          toggle={this.toggleUserSearchModal}
          users={this.state.users}
          setFilteredUsers={this.setFilteredUsers}
        />

        <Container className="main-container">
          <Row>
            <Col md="3" className="no-margin-left no-margin-right">
              <div className="user-container">
                <img src={localStorage.getItem('avatar')} alt="Avatar" />
                <h5>
                  {this.state.session.firstname +
                    ' ' +
                    this.state.session.lastname}
                </h5>
                <p className="rank">
                  <Rank id={this.state.session.rank} />
                </p>
              </div>

              <AdministrationSideMenu />
            </Col>
            <Col md="9" className="no-margin-left no-margin-right">
              <div className="user-container no-center admin-top-bar">
                <Container className="no-padding-left no-padding-right">
                  <Row className="align-items-center">
                    <Col className="text-left">
                      <h4>Utilisateurs</h4>
                    </Col>
                    <Col className="text-center">
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => this.toggleUserManageModal('ADD', null)}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Ajouter
                      </button>{' '}
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={this.toggleUserSearchModal}
                      >
                        <FontAwesomeIcon icon={faSearch} /> Rechercher
                      </button>
                    </Col>
                    <Col className="text-right">
                      <span
                        ref="filterToThumbnails"
                        className="filter-button active"
                        onClick={e => this.filterUsers('filterThumbnails')}
                      >
                        <FontAwesomeIcon icon={faTh} />
                      </span>{' '}
                      <span
                        ref="filterToList"
                        className="filter-button"
                        onClick={e => this.filterUsers('filterList')}
                      >
                        <FontAwesomeIcon icon={faList} />
                      </span>
                    </Col>
                  </Row>
                </Container>
              </div>

              <div
                className="user-container no-center"
                style={{marginTop: '15px'}}
              >
                <Container className="no-padding-left no-padding-right">
                  <div ref={node => (this.usersLoading = node)}>
                    <Alert
                      id="users-loading"
                      color="info"
                      className="info-message"
                      style={{display: 'block'}}
                    >
                      Chargement...
                    </Alert>
                  </div>
                  <Row>
                    {this.state.displayType === 'list' ?
                      (this.state.filteredUsers.length > 0 || this.state.users.length > 0) && (
                        <Table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>UID</th>
                              <th>Nom</th>
                              <th>Prénom</th>
                              <th>Email</th>
                              <th>Rang</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{this.state.filteredUsers.length > 0 ? this.state.filteredUsers : this.state.users}</tbody>
                        </Table>
                      ) : this.state.filteredUsers.length > 0 ? this.state.filteredUsers : this.state.users
                    }
                  </Row>
                </Container>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
