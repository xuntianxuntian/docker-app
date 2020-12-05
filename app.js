const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

const _ENV = process.env

const HOST_NAME = _ENV.HOST_NAME || '127.0.0.1'
const HOST_PORT = _ENV.HOST_PORT || '3000'

app.use(require('cors')())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(
    express.Router().get('/',(req,res) => {
        const responseStr = 'hello,there!'
        responseStr.concat(`Your IP address is ${req.ip}.\n`)
        responseStr.concat(`Your client is ${req.headers["user-agent"]}.\n`)
        res.json(responseStr)
    })
)


app.listen(HOST_PORT,HOST_NAME,(err) => {
    console.log(`App is running on http://${HOST_NAME}:${HOST_PORT}`)
})