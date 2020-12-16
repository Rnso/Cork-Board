import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import store from './store'

class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state = { showmsg: false }
        this.state.isloggedin = false
        this.showLoginModal = this.showLoginModal.bind(this)
        this.LogIn = this.LogIn.bind(this)
        this.logInWithGoogle = this.logInWithGoogle.bind(this)
        this.logout = this.logout.bind(this)
        axios.defaults.withCredentials = true
    }
    componentDidMount() {
        axios.get(constants.serverUrl + `/api/`)
            .then(res => {
                if (res.data != '') {
                    store.user_id = res.data._id
                    store.user_name = res.data.name
                }
                res.data != '' ? this.setState({ isloggedin: true }) : this.setState({ isloggedin: false })
            })
            .catch(console.error())
    }
    showLoginModal() {
        $('#loginModal').modal('show')
    }
    LogIn(e) {
        e.preventDefault()
        let email = this.refs.email.value
        let pwd = this.refs.pwd.value
        axios.post(constants.serverUrl + `/api/login`, { email, pwd })
            .then(res => {
                if (res.data != '') {
                    store.user_id = res.data._id
                    store.user_name = res.data.name
                    this.setState({ showmsg: false })
                    this.setState({ isloggedin: true })
                    $('#loginModal').modal('hide')
                }
                else {
                    this.setState({ showmsg: true })
                }
            })
            .catch(console.error)
    }
    logInWithGoogle() {
        let GoogleAuth = gapi.auth2.getAuthInstance()
        GoogleAuth.signIn()
            .then(GoogleUser => {
                let name, email
                if (GoogleUser) {
                    var profile = GoogleUser.getBasicProfile()
                    name = profile.getName()
                    email = profile.getEmail()
                }
                else {
                    this.setState({ isloggedin: false })
                }
                if(name !== '' && email !== ''){
                    axios.post(constants.serverUrl + `/api/loginwithgoogle`, { name, email })
                        .then(res => {
                            store.user_id = res.data._id
                            store.user_name = res.data.name
                            this.setState({ isloggedin: true })
                            $('#loginModal').modal('hide')
                        })
                        .catch(console.error)
                }
            })

    }
    logout() {
        axios.get(constants.serverUrl + `/api/logout`)
            .then(res => {
                store.user_id = res.data
                store.user_name = res.data
                res.data != '' ? this.setState({ isloggedin: true }) : this.setState({ isloggedin: false })
            })
            .catch(console.error())
        var GoogleAuth = gapi.auth2.getAuthInstance()
        GoogleAuth.signOut()
    }
    render() {
        return (
            <div>
                <div id="loginModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-body">
                                <form onSubmit={this.LogIn}>
                                    <div className="form-group">
                                        <label >EMAIL:</label>
                                        <input type="email" className="form-control" ref="email" placeholder='Enter your email' />
                                    </div>
                                    <div className="form-group">
                                        <label>PASSWORD:</label>
                                        <input type="password" className="form-control" ref="pwd" placeholder='Enter your password' />
                                    </div><br />
                                    <div className='text-center'>
                                        <button type='submit' className="btn btn-primary">LogIn</button>
                                        <h4>OR</h4>
                                    </div>
                                </form>
                                <div className='text-center'>
                                    <div className="btn-group">
                                        <button className="btn btn-default google_btn"><i className='fa fa-google google'></i></button>
                                        <button className="btn btn-primary" onClick={this.logInWithGoogle}>Sign in with Google</button><br /><br />
                                    </div>
                                    {this.state.showmsg ? <div className='alert alert-danger'>Enter the corect details</div> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link className="navbar-brand" to="/">Cork-Board</Link>
                        </div>
                        <div className="collapse navbar-collapse" id="myNavbar">
                            {this.state.isloggedin ? <ul className="nav navbar-nav navbar-right">
                                <li><Link to='/board'>BOARD</Link></li>
                                <li><Link to='/myboard'>MY BOARD</Link></li>
                                <li><Link to='/' onClick={this.logout}>LOGOUT</Link></li>
                            </ul> :
                                <ul className="nav navbar-nav navbar-right">
                                    <li><Link to='/board'>BOARD</Link></li>
                                    <li><Link to='/board' onClick={this.showLoginModal}>LOGIN</Link></li>
                                    <li><Link to='/register'>SIGN UP</Link></li>
                                </ul>
                            }
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
export default Menu