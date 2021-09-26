const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(3000, () =>
  console.log('Server started on 3000')
);
const io = socketio(expressServer);

io.on('connection', (socket) => {
  const nsData = namespaces.map((namespace) => {
    return {
      img: namespace.img,
      endpoint: namespace.endpoint,
    };
  });

  socket.emit('nsList', nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    console.log(`${socket.id} joined ${namespace.title}`);

    socket.emit('rooms', namespace.rooms);

    socket.on('joinRoom', (room, numberOfUsers) => {
      console.log(`Room ${room}`);

      // const leave = Object.keys(socket.rooms)[1];
      // socket.leave(leave);
      // updateUsers(namespace, leave, numberOfUsers);

      socket.join(room);

      const foundRoom = namespace.rooms.find((r) => r.title === room);

      socket.emit('history', foundRoom.history);
      updateUsers(namespace, room, numberOfUsers);
    });

    socket.on('message', (data) => {
      const msg = {
        text: data,
        time: Date.now(),
        username: 'random',
        avatar: 'https://via.placeholder.com/30',
      };

      const room = Object.keys(socket.rooms)[1];
      const foundRoom = namespace.rooms.find((r) => r.title === room);
      foundRoom.addMessage(msg);
      socket.emit('history', foundRoom.history);

      socket.broadcast.emit('messageFromUser', msg);
    });
  });
});

function updateUsers(namespace, room, numberOfUsers) {
  io.of(namespace.endpoint)
    .in(room)
    .clients((error, clients) => {
      numberOfUsers(clients.length);
    });
}
