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
let music = {artist: 'celine dion', title: "pour que tu m'aime encore"}

io.on('connection', (socket) => {
    
    console.log('a user connected');
    socket.on('disconnect', () => {
        currentPlayer = players.find((user) => user.id == socket.id)
        players = players.filter((user) => user.id != socket.id) || []
        console.log('user disconnected '+socket.id, players);
        io.emit('userList', {players});
        io.emit('message', {message : {text : currentPlayer.name+' vient de se deconnecter de la partie'}});
    });

    socket.on('addPlayer', (name) => {
        players.push({name, id: socket.id})
        console.log('salut '+name, players);
        socket.join(ROOM);
        io.emit('userList', {players});
        io.emit('message', {message : {text : name+' vient de rejoindre la partie'}});
    })

    socket.on('addMusic', (musicValue) => {
      music=musicValue
      console.log('new music : '+musicValue);
      io.emit('newMusic');
    })

  socket.on('soluce', (value) => {
    let messagesend = value
    currentPlayer = players.find((user) => user.id == socket.id)
    console.log('soluce de '+ currentPlayer + ' : ' + musicValue);
    //check de la solution
    if (similarity(value, `${music.artist} ${music.title}`) >= 75 ) {
      messagesend = "***** good !!"
    }else{
      if(similarity(value, music.artist) >= 75 ){
        messagesend = "artiste trouvé ! "
      }else{
        if(similarity(value, music.title) >= 75 ){
          messagesend = "titre trouvé ! "
        }
      }
    }
    io.emit('message', {message : {user: currentPlayer.name, text : messagesend}});
  })

    socket.on('messageUser', (values) => {
        io.emit('message', values);
    })


  });

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}


const port = process.env.PORT || 4000
http.listen(port, () => {
  console.log('listening on *:'+port);
})
