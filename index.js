const express = require('express')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const lib = require('./lib')

let userList = [],
    wordlist = [],
    exist = []

function updateUsers(user){
  userList[userList.indexOf(user)].score = user.score
  userList.sort(function (a, b){
    return b.score - a.score
  })
  io.emit('update leaderboard', userList)
}

function randWord(){
  let w = ''
  do{
    w = lib[parseInt(Math.random() * (lib.length - 1))]
  }while (exist[w] !== undefined)
  return w
}

function updateWordList(){
  wordlist = []
  exist = []
  for (let i = 0; i < 5; i++){
    let w = randWord()
    exist[w] = i
    wordlist.push(w)
  }
  io.emit('new wordlist', wordlist)
}
updateWordList()

io.on('connection', function (socket){
  let user
  console.log('new connection')

  socket.on('new user', function (nickname){
    const d = new Date()
    user = {id: d.getTime().toString(), nickname, score: 0}
    userList.push(user)
    socket.emit('new user', user.id)
    socket.emit('new wordlist', wordlist)
    updateUsers(user)
  })

  socket.on('input word', function (word){
    if (exist[word] !== undefined){
      user.score += 10
      wordlist = wordlist.filter(w => w != word)
      if (wordlist.length === 0){
        updateWordList()
      } else {
        exist[word] = false
        io.emit('new wordlist', wordlist)
      }
      socket.emit('point up')
    } else {
      user.score = 0
    }
    updateUsers(user)
  })

  socket.on('disconnect', function (){
    if (user){
      userList = userList.filter(function (u){
        return u.id != user.id
      })
      io.emit('update leaderboard', userList)
    }
  })
})

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3001;

http.listen(port, function (){
  console.log(`Listen on port ${port}`)
})