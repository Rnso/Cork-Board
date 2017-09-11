import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import Index from '../index'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = { errormsg: false }
        this.state.existmsg = false
        this.submit = this.submit.bind(this)
        this.redirectToLogin = this.redirectToLogin.bind(this)
    }
    submit(e) {
        e.preventDefault()
        let name = this.refs.name.value
        let email = this.refs.email.value
        let pwd = this.refs.pwd.value
        if (name !== '' && email !== '' && pwd !== '') {
            axios.post(constants.serverUrl + `/api/register`, { name, email, pwd })
                .then(res => {
                    if (res.data == 'Already Signed up') {
                        this.setState({ existmsg: true })
                        this.setState({ errormsg: false })
                    }
                    else if (res.data != '') {
                        $('#myModal').modal('show')
                        this.setState({errormsg: false})
                    }
                })
                .catch(console.error)
        }
        else {
            this.setState({errormsg: true})
        }
    }
    redirectToLogin() {
        this.refs.name.value = ''
        this.refs.email.value = ''
        this.refs.pwd.value = ''
        this.props.history.push('/wall')
        $('#loginModal').modal('show')
    }
    render() {
        const { history } = this.props
        return (
            <div className='container font'><br />
                <div className='text-center'>
                    <h2 className='textshadow'>SIGN UP FORM</h2><br /><br />
                </div>
                <div className='container form'>
                    <form onSubmit={this.submit}>
                        <div className="form-group">
                            <label >NAME:</label>
                            <input type="text" className="form-control" ref="name" placeholder='Ex. John Smith' />
                        </div>
                        <div className="form-group">
                            <label >EMAIL:</label>
                            <input type="email" className="form-control" ref="email" placeholder='Ex. john@gmail.com' />
                        </div>
                        <div className="form-group">
                            <label>PASSWORD:</label>
                            <input type="password" className="form-control" ref="pwd" placeholder='password' />
                        </div>
                        <div className='text-center'>
                            <button type='submit' className="btn btn-primary">Submit</button>
                        </div>
                    </form><br />
                    {this.state.errormsg ? <div className='alert alert-danger'>Enter all the fields</div> : ''}
                    {this.state.existmsg ? <div className='alert alert-success'>Already Signed Up!</div> : ""}
                    <div id="myModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='alert alert-success'>Sign Up Successful!</div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.redirectToLogin}>Continue to Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Register