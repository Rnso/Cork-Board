import React, { Component } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Menu from './component/menu'
import Board from './component/board'
import Myboard from './component/myboard'
import Register from './component/register'


class Index extends Component {
    render() {
        return (
            <Router >
                <div>
                    <Menu />
                    <div>
                        <Route exact path="/" component={Board} />
                        <Route path="/board" component={Board} />
                        <Route path="/register" component={Register} />
                        <Route path="/myboard" component={Myboard} />
                    </div>
                </div>
            </Router>
        )
    }
}
render(<Index />, document.getElementById('app'))
