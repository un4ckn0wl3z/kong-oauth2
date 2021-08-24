const fs = require('fs')
const SSL_KEY = fs.readFileSync('./certificate/key.pem')
const SSL_CERT = fs.readFileSync('./certificate/cert.pem')
const https = require('https')

const port = 3000
const express = require('express')
const app = express()

const data = require('./data.json')

const getCurrentUser = ({ headers }) => {
    return headers['mock-logged-in-as'] || headers['x-authenticated-userid']
}

app.get('/stepcounts', (req, res, next) => {
    console.log(req.headers)
    const user = getCurrentUser(req)
    if(!user){
        res.status(401).send('Not authorized')
        return
    }
    res.send(data[user] || [])
})

const server = https.createServer({
    key: SSL_KEY,
    cert: SSL_CERT,
}, app)

server.listen(port, () => {
    console.log(`Server is listening on https://localhost:${port}`)
})

