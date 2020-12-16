import React, { Component } from 'react'
import * as constants from '../../constant.js'
import axios from 'axios'
import '../app.css'
import store from './store'

class Myboard extends Component {
    constructor(props) {
        super(props)
        this.state = { name: '' }
        this.state.myimages = []
        this.addImage = this.addImage.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
        this.getFocus = this.getFocus.bind(this)
    }
    componentDidMount() {
        if (!store.user_id) {
            axios.get(constants.serverUrl + `/api/`)
                .then(res => {
                    if (res.data != '') {
                        store.user_id = res.data._id
                        store.user_name = res.data.name
                        this.setState({ name: store.user_name })
                        axios.get(constants.serverUrl + `/api/getmyimages/${store.user_id}`)
                            .then(res => {
                                this.setState({ myimages: res.data })
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error())
        }
        else {
            this.setState({ name: store.user_name })
            axios.get(constants.serverUrl + `/api/getmyimages/${store.user_id}`)
                .then(res => {
                    this.setState({ myimages: res.data })
                })
                .catch(console.error)
        }
    }
    getFocus(e) {
        e.preventDefault()
        let el = document.getElementById('scroll')
        el.scrollIntoView(false)
        document.getElementById("input_focus").focus()
    }
    addImage(e) {
        e.preventDefault()
        let user_id = store.user_id
        let user_name = store.user_name
        let title = this.refs.title.value
        let link = this.refs.link.value
        let hearts = 0
        axios.post(constants.serverUrl + `/api/addimage`, { user_id, user_name, title, link, hearts })
            .then(res => {
                this.state.myimages.push(res.data[0])
                this.setState(this.state.myimages)
                this.refs.title.value = ''
                this.refs.link.value = ''
            })
            .catch(console.error)
    }
    deleteImage(e) {
        let user_id = store.user_id
        let pin_id = e.target.id
        axios.post(constants.serverUrl + `/api/deleteimage/`, { user_id, pin_id })
            .then(res => {
                this.setState({ myimages: res.data })
            })
            .catch(console.error)
    }
    render() {
        return (
            <div className='container text-center'><br />
                <h2 className='textshadow'>{this.state.name}'s BOARD</h2><br /><br />
                <div className="col-md-12">
                    {this.state.myimages.map((item, i) => {
                        return <div key={i} className="col-md-3 grid">
                            <div className="desc">{item.title}</div>
                            <img src={item.link} alt={item.title} height="200" width='230' />
                            <div><a id={item._id} href='#' onClick={this.deleteImage}><i className='fa fa-trash' ></i>&nbsp;Remove image</a></div>
                        </div>
                    })}
                    <br /><br /><br />
                </div>
                <a className='font' type="button" data-toggle="collapse" href="#demo" onClick={this.getFocus}>ADD IMAGES</a><br /><br />
                <div id="demo" className="collapse text-center">
                    <form id='scroll' onSubmit={this.addImage}>
                        <input id='input_focus' className='text' ref='title' placeholder='Enter image title' /><br /><br />
                        <input className='text' ref='link' placeholder='Enter image link' /><br /><br />
                        <button type='submit' className='btn btn-default'>Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Myboard