import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import fs from 'fs'
import https from 'https'
import morgan from 'morgan'
import { AppDataSource } from './db'
import { UserRoute } from './routes/user.route'
import { UserService } from './services/user.service'
import { TaskRoute } from './routes/task.route'

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.use(UserService.verifyToken)
app.use('/api/user', UserRoute)
app.use('/api/task', TaskRoute)

app.get('*', (req, res) => {
    res.status(404).json({
        message: 'NOT_FOUND',
        timestamp: new Date()
    })
})

const sslOptions = {
    key: fs.readFileSync('./src/crypto/key.pem'),
    cert: fs.readFileSync('./src/crypto/cert.pem')
}

configDotenv()
AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database')
        const port = process.env.SERVER_PORT || 3000

        https.createServer(sslOptions, app)
            .listen(port, () =>
                console.log(`Application started on port ${port}`)
            )
    })
    .catch(e => {
        console.log('Database server connection failed')
        console.log(e)
    })