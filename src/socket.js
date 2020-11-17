import io from 'socket.io-client';
const socketserver = process.env.REACT_APP_SOCKETSERVER || "http://localhost:4000";
export const socket = io(socketserver);
// export const socket = io('http://localhost:4000');'http://10.40.44.243:4000'
const currentUsersArray = []
export function sendMessage(id, value) {
  socket.emit(id, value)
}

// export function currentUsers(){
//   socket.on('gameStart', players => {
//     store.dispatch({ type: MULTIGAME_STARTED, payload:{players} })
//   })
// }

export function addPlayer(name){
    socket.emit('addPlayer', name)
}

export function updateUserList(callBack) {
  socket.on('userList', ({players, text}) => {
    callBack(players)
  })
}

export function updateMessageList(callBack) {
  socket.on('message', ({message}) => {
      console.log('socket!!!',message)
    callBack(message)
  })
}

// export function startGame(){
//   socket.on('gameStart', players => {
//     store.dispatch({ type: MULTIGAME_STARTED, payload:{players} })
//   })
// }


// export function playerQuitMulti(){
//   socket.emit('playerQuitMulti')
// }

// export function updateBoardMulti(callBack) {
//   socket.on('updateBoard', (position) => {
//     callBack(position.position.col, true)
//   })
// }