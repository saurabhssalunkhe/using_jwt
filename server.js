require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
//const bcrypt = require('bcrypt')

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Java',
        title: 'Post 2'
    }
]

app.use(express.json())

const users = []

app.get('/posts', authenticateToken,(req, res) => {
    
    res.json(posts)
  


})

app.post('/users', async (req, res) => {
    try {
      //const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = { name: req.body.name, password: req.body.password }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })

  app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(req.body.password === user.password) {
        //res.send('Success')
        
    //const username = req.body.username
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken : accessToken })
    
    
    
    } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }

    


  })

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}


app.listen(3000)