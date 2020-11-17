var app = require('express')();
var http = require('http').createServer(app);
const origin = process.env.origin || "http://localhost:3000";
var io = require('socket.io')(http, {
    cors: {
    //   origin: "http://localhost:3000", "http://10.40.44.243:3000"
      origin: origin,
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

let players = []
const ROOM = 'blindtest'

io.on('connection', (socket) => {
    
    console.log('a user connected');
    socket.on('disconnect', () => {
        players = players.filter((user) => user.id != socket.id) || []
        console.log('user disconnected '+socket.id, players);
        io.emit('userList', {players});
        io.emit('message', {message : {text : players[socket.id]+' vient de se deconnecter de la partie'}});
    });

    socket.on('addPlayer', (name) => {
        players.push({name, id: socket.id})
        console.log('salut '+name, players);
        socket.join(ROOM);
        io.emit('userList', {players});
        io.emit('message', {message : {text : name+' vient de rejoindre la partie'}});
    })

    socket.on('messageUser', (values) => {
        io.emit('message', values);
    })


  });



http.listen(4000, () => {
  console.log('listening on *:4000');
});
