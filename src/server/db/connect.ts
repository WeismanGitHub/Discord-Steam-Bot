import { Config } from '../../config'
import mongoose from 'mongoose'

const connectDB = (): void => {
    mongoose.connect(Config.mongoURI!, {
        maxPoolSize: Config.mongoMaxPoolSize,
        wtimeoutMS: Config.mongoWtimeoutMS,
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