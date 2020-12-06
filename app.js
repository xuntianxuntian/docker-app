const express = require('express')
const dotenv = require('dotenv')
const os = require('os')
const path = require('path')
const mongoose = require('mongoose')

const _net = os.networkInterfaces()
dotenv.config()

function getIpAddress(_net) {
    var ifaces=os.networkInterfaces()
  
    for (var dev in ifaces) {
      let iface = ifaces[dev]
  
      for (let i = 0; i < iface.length; i++) {
        let {family, address, internal} = iface[i]
  
        if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
          return address
        }
      }
    }
  }
  
function generateID(){
    let result = ''
    let array = ['A', '8', 'Z', 'E', 'M', '1', 'L', 'K', 'J', 'I', '1', 'Q', 'H', '5', 'B',
    'T', 'Y', '7', 'N', '6', 'F', 'D', 'U', '3', 'G', 'S', '2', 'P', '9', '4', 'X', 'R', 'V', 'W',]
    for (let i = 0; i < 6; i++) {
        result = result + array[Math.max(0, Math.round(Math.random() * array.length) - 1)]
    }
    return result
}

const server_ip = getIpAddress(_net)

const app = express()

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')

const _ENV = process.env

const HOST_NAME = _ENV.HOST_NAME || '0.0.0.0'
const HOST_PORT = _ENV.HOST_PORT || '3000'
const DB_HOST = _ENV.DB_HOST || 'mongodb'
const DB_PORT = _ENV.DB_PORT || '27017'
const DB_NAME = _ENV.DB_NAME || 'docker-app'

app.use(require('cors')())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

let db_status = false
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,{useNewUrlParser:true,useUnifiedTopology:true}).then(
    res => {
        db_status = true
        console.log(`Server connected to Mongod successfully at mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)
    }
).catch(err => console.log(err))

const userSchema = new mongoose.Schema(
    {
        name:String,
        id:String
    },{timestamps:true}
)
const User = mongoose.model('User',userSchema)

app.use(
    express.Router().get('/',(req,res) => {
        const user = new User()
        if(db_status){
            user.name = 'Andrew Krammer'
            user.id = generateID()
            user.save().then(
                userdoc => res.render('index',{
                    server_ip,
                    server_port:HOST_PORT,
                    client_agent:req.headers["user-agent"],
                    client_ip:req.headers["x-real-ip"],
                    user:userdoc})
            ).catch(err => console.log(err))
        }else{
            res.render('index',{
                server_ip,
                server_port:HOST_PORT,
                client_agent:req.headers["user-agent"],
                client_ip:req.headers["x-real-ip"],
                user:{
                    name:'Database connection failed!',
                    id:'Database connection failed!'
                }})
        }        
        
    })
)


app.listen(HOST_PORT,HOST_NAME,(err) => {
    console.log(`App is running on http://${HOST_NAME}:${HOST_PORT}`)
})