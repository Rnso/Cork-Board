require('dotenv').config()

const env = process.env

export const nodeEnv = env.NODE_ENV || 'development'


export default {
    mongodbUri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.wipan.mongodb.net/fcc-corkboard?retryWrites=true&w=majority`,
    //mongodbUri : 'mongodb://localhost:27017/pintrestClone',
    port: env.PORT || 9001,
    host: env.HOST || '0.0.0.0'
}




