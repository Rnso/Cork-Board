import React, { Component } from 'react'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import store from './store'

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        //this.state.hearts = ''
        this.state.images = []
        this.updateHearts = this.updateHearts.bind(this)
    }
    componentDidMount() {
        axios.get(constants.serverUrl + `/api/getallimages`)
            .then(res => {
                console.log(res)
                this.setState({ images: res.data })
            })
            .catch(console.error)
    }
    updateHearts(e) {
        e.preventDefault()
        if (store.user_id == '') {
            $('#loginModal').modal('show')
        }
        else {
            let i = e.target.id
            let images = this.state.images[e.target.id]
            let pinid = images._id
            let hearts = images.hearts + 1
            let heart_by = store.user_name
            axios.post(constants.serverUrl + `/api/updatehearts`, { pinid, hearts, heart_by })
                .then(res => {
                    if (res.data == 'Already liked') {
                        console.log(res.data)
                    }
                    else {
                        this.state.images[i] = res.data
                        this.setState(this.state.images)
                    }
                })
                .catch(console.error)
        }
    }
    render() {
        return (
            <div className='container-fluid'>
                <div className="masonry_layout">
                    {this.state.images.map((item, i) => {
                        return <div key={i} className="masonry_layout_panel_content">
                            <img src={item.link} alt={item.title} width='99%' />
                            <h4>{item.title}</h4>
                            <p>{item.user_name}&nbsp;&nbsp;&nbsp;&nbsp;
                                <a href=''><i id={i} className="fa fa-heart-o" onClick={this.updateHearts}></i>&nbsp;&nbsp;{item.hearts}</a>
                            </p>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
export default Board