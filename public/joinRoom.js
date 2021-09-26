function joinRoom(room) {
  nsSocket.emit('joinRoom', room, updateNumberOfUsers);

  nsSocket.on('history', (data) => {
    const ul = document.querySelector('#messages');
    ul.innerHTML = '';

    data.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMsgs = ul.innerHTML;
      ul.innerHTML = currentMsgs + newMsg;
    });

    ul.scrollTo(0, ul.clientHeight);
  });
}

function updateNumberOfUsers(numberOfUsers) {
  console.log(numberOfUsers);
  document.querySelector(
    '.curr-room-num-users'
  ).innerHTML = `${numberOfUsers} <span class="glyphicon glyphicon-user"></span>`;
}
