import express from 'express'
//import passport from 'passport'
//import { MongoClient, ObjectID } from 'mongodb'
import assert from 'assert'
import config from '../config'
import { ObjectId } from 'mongodb'

const MongoClient = require('mongodb').MongoClient
const client = new MongoClient(config.mongodbUri, { useNewUrlParser: true })
let database
let pins
let users
client.connect((err, client) => {
    if (err) console.log('failed to connect')
    else {
        console.log('connected')
        database = client.db('fcc-corkboard')
        pins = database.collection('pins')
        users = database.collection('users')
    }
})

const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.user)
        res.send(req.session.user)
    else {
        res.send('')
    }
    // database.collection('sessions').findOne({ _id: req.sessionID }).then(sess => {       
    // })
})

router.post('/register', (req, res) => {
    users.findOne({ email: req.body.email }).then(user => {
        if (user == null) {
            users.insertOne(req.body).then((result) => {
                res.send(result.ops)
            })
        }
        else {
            res.send('Already Registered')
        }
    })

})

router.post('/login', (req, res) => {
    users.findOne({ email: req.body.email, pwd: req.body.pwd }).then(user => {
        if (user == null) {
            res.send('')
        }
        else {
            let obj = {}
            obj._id = user._id
            obj.name = user.name
            req.session.user = obj
            res.send(req.session.user)
        }
    })
})

router.post('/loginwithgoogle', (req, res) => {
    users.findOne({ email: req.body.email }).then(user => {
        if (user == null) {
            users.insertOne(req.body).then(result => {
                let obj = {}
                obj._id = result.ops[0]._id
                obj.name = result.ops[0].name
                req.session.user = obj
                res.send(req.session.user)
            })
        }
        else {
            req.session.user = user
            res.send(req.session.user)
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = ''
    res.send(req.session.user)
})

router.post('/addimage', (req, res) => {
    pins.insertOne(req.body).then(result => {
        res.send(result.ops)
    })
})

router.get('/getmyimages/:user_id', (req, res) => {
    pins.find({ user_id: req.params.user_id }).toArray((err, pins) => {
        res.send(pins)
    })
})

router.post('/deleteimage/', (req, res) => {
    console.log(req.body)
    pins.deleteOne({ _id: ObjectId(req.body.pin_id) }).then(result => {
        database.collection('pins').find({ user_id: req.body.user_id }).toArray((err, pins) => {
            res.send(pins)
        })

    })
})

router.get('/getallimages', (req, res) => {
    pins.find().toArray((err, pins) => {
        res.send(pins)
    })
})

router.post('/updatehearts', (req, res) => {
    pins.findOne({ _id: ObjectId(req.body.pinid), heart_by: req.body.heart_by }).then(result1 => {
        if (!result1) {
            pins.updateOne({ _id: ObjectId(req.body.pinid) }, { $set: { hearts: req.body.hearts, heart_by: req.body.heart_by } }).then(result2 => {
                pins.findOne({ _id: ObjectId(req.body.pinid) }).then(pin => {
                    res.send(pin)
                })
            })
        }
        else {
            res.send('Already liked')
        }
    })
})

router.post('/filterbyuser/:user', (req, res) => {
    pins.find({ user_name: req.params.user }).toArray((err, pins) => {
        res.send(pins)
    })
})

export default router