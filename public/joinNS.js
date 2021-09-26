function joinNS(ns) {
  if (nsSocket) {
    nsSocket.close();

    document
      .querySelector('#user-input')
      .removeEventListener('submit', formSubmission);
  }

  nsSocket = io(`http://localhost:3000${ns}`);

  nsSocket.on('rooms', (rooms) => {
    const roomList = document.querySelector('.room-list');

    roomList.innerHTML = '';

    rooms.forEach((room) => {
      const locked = room.private ? 'lock' : 'globe';
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${locked}">${room.title}</span></li>`;
    });

    const roomNodes = document.getElementsByClassName('room');

    Array.from(roomNodes).forEach((el) => {
      el.addEventListener('click', () => {
        joinRoom(el.innerText);
      });
    });
  });

  document
    .querySelector('.message-form')
    .addEventListener('submit', formSubmission);

  nsSocket.on('messageFromUser', (data) => {
    document.querySelector('#messages').innerHTML += buildHTML(data);
  });
}

function formSubmission(event) {
  event.preventDefault();
  const text = document.querySelector('#user-message').value;
  nsSocket.emit('message', text);
}

function buildHTML(msg) {
  return `
  <li>
    <div class="user-image">
      <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
    <div class="user-name-time">
      ${msg.username} <span>${new Date(msg.time).toLocaleString()}</span>
    </div>
    <div class="message-text">
      ${msg.text}
    </div>
    </div>
  </li>
  `;
}
