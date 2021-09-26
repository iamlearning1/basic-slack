class Room {
  constructor(id, title, namespace, locked = false) {
    this.id = id;
    this.title = title;
    this.namespace = namespace;
    this.private = locked;
    this.history = [];
  }

  addMessage(msg) {
    this.history.push(msg);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
