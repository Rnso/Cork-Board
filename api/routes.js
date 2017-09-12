import express from 'express'
//import passport from 'passport'
import { MongoClient, ObjectID } from 'mongodb'
import assert from 'assert'
import config from '../config'

let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
    assert.equal(null, err)
    mdb = db
})
const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.user)
        res.send(req.session.user)
    else {
        res.send('')
    }
    // mdb.collection('sessions').findOne({ _id: req.sessionID }).then(sess => {       
    // })
})

router.post('/register', (req, res) => {
    mdb.collection('users').findOne({ email: req.body.email }).then(user => {
        if (user == null) {
            mdb.collection("users").insert(req.body).then((result) => {
                res.send(result.ops)
            })
        }
        else {
            res.send('Already Registered')
        }
    })

})

router.post('/login', (req, res) => {
    mdb.collection('users').findOne({ email: req.body.email, pwd: req.body.pwd }).then(user => {
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
    mdb.collection('users').findOne({ email: req.body.email }).then(user => {
        if (user == null) {
            mdb.collection('users').insert(req.body).then(result => {
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
    mdb.collection('pins').insert(req.body).then(result => {
        res.send(result.ops)
    })
})

router.get('/getmyimages/:user_id', (req, res) => {
    mdb.collection('pins').find({ user_id: req.params.user_id }).toArray((err, pins) => {
        res.send(pins)
    })
})

router.post('/deleteimage/', (req, res) => {
    console.log(req.body)
    mdb.collection('pins').remove({ _id: ObjectID(req.body.pin_id) }).then(result => {
        mdb.collection('pins').find({ user_id: req.body.user_id }).toArray((err, pins) => {
            res.send(pins)
        })

    })
})

router.get('/getallimages', (req, res) => {
    mdb.collection('pins').find().toArray((err, pins) => {
        res.send(pins)
    })
})

router.post('/updatehearts', (req, res) => {
    mdb.collection('pins').findOne({ _id: ObjectID(req.body.pinid), heart_by: req.body.heart_by }).then(result1 => {
        if (!result1) {
            mdb.collection('pins').update({ _id: ObjectID(req.body.pinid) }, { $set: { hearts: req.body.hearts, heart_by: req.body.heart_by } }).then(result2 => {
                mdb.collection('pins').findOne({ _id: ObjectID(req.body.pinid) }).then(pin => {
                    res.send(pin)
                })
            })
        }
        else{
           res.send('Already liked') 
        }
    })
})

router.post('/filterbyuser/:user', (req, res) => {
    mdb.collection('pins').find({user_name: req.params.user}).toArray((err, pins) => {
        res.send(pins)
    })
})

export default router