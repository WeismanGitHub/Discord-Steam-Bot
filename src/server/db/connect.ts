import { config } from '../../config'
import mongoose from 'mongoose'

const connectDB = (): void => {
    mongoose.connect(config.mongoURI!, {
        maxPoolSize: config.mongoMaxPoolSize,
        wtimeoutMS: config.mongoWtimeoutMS,
    })
    .then(res => {
        console.log('connected to database...')
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })
}

export { connectDB }