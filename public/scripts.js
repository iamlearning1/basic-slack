const socket = io('http://localhost:3000');

let nsSocket = '';

socket.on('nsList', (nsData) => {
  const namespace = document.querySelector('.namespaces');
  namespace.innerHTML = '';

  nsData.forEach((ns) => {
    namespace.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}" /></div>`;
  });

  const firstNS = document.querySelector('.namespace');
  joinNS(firstNS.getAttribute('ns'));

  Array.from(document.getElementsByClassName('namespace')).forEach((el) => {
    el.addEventListener('click', () => {
      const ns = el.getAttribute('ns');

      joinNS(ns);
    });
  });
});
