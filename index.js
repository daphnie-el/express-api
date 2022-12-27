const express = require('express')
const fs = require('fs')
const app = express()
const {users} = require('./db.json');

const _users = users.slice();

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.get(`/users/:id`, (req, res) => {
  let response = users.find(user => user.id === Number(req.params.id))
  if (response === undefined) {
    res.status(404).send("User not found")
  } else {
    res.json(response)
  }
})
// if you dont close your middleware it would run infinitely

app.post('/users', (req, res) => {
  let index = _users.findIndex(user => user.id === req.body.id) 
  if (index === -1) {
    _users.push(req.body)
    fs.writeFile('./db.json', JSON.stringify({users: _users}), (err)  => {
      console.log(err)
    })
    res.status(201).send(req.body)
  } else {
    res.status(400).send("user id already exists")
  }
})

app.delete('/users/:id', (req, res) => {
  let index = _users.findIndex(user => user.id === Number(req.params.id)) 
  if (index >= 0) {
    _users.splice(index, 1)
    fs.writeFile('./db.json', JSON.stringify({users: _users}), (err)  => {
      console.error(err)
    })
    res.status(204).send("Deleted")
  } else {
    res.status(404).send("User with ID not found")
  }
})

app.put('/users/:id', (req, res) => {
  let index = _users.findIndex(user => user.id === Number(req.params.id)) 
  if (index >= 0) {
    _users.splice(index, 1, req.body)
    fs.writeFile('./db.json', JSON.stringify({users: _users}), (err)  => {
      console.error(err)
    })
    res.status(200).send(req.body)
  } else {
    res.status(404).send("Modification failed")
  }
})
app.listen(3000)