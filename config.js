require('dotenv').config()

const env = process.env

export const nodeEnv = env.NODE_ENV || 'development'


export default {
    mongodbUri : `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@ds129434.mlab.com:29434/fcc-corkboard`,
    //mongodbUri : 'mongodb://localhost:27017/pintrestClone',
    port: env.PORT || 9000,
    host: env.HOST || '0.0.0.0'
}




