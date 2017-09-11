import config from './config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import connectMongo from 'connect-mongo';
import router from './api/routes'
import path from 'path'
import bodyParser from 'body-parser'

const server = express()
require('dotenv').config()
const MongoStore = connectMongo(session)

server.use(bodyParser.json())
server.use(cors({
    origin: [
        'http://localhost:8080'
    ],
    credentials: true 
}))
server.use(express.static('dist'))
server.use(session(
    {
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 2628000000
        },
        store: new MongoStore({ url: config.mongodbUri })
    }))

server.use('/api', router)

server.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
 })

server.listen(config.port, () => {
    console.info('Express Listening on port:', config.port)
})
