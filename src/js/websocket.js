'use strict';

window.onload = function () {
  let conn; 

  if (window["WebSocket"]) {
      conn = new WebSocket("ws://" + document.location.host + "/ws");
      conn.onerror = () => console.log('Backend Server Offline')

      conn.onopen = function (evt) {
          console.log("Websocket created.")
      }
      conn.onclose = function (evt) {
          var item = document.createElement("div");
          item.innerHTML = "<b>Connection closed.</b>";
      };
      conn.onmessage = function (evt) {
          var messages = evt.data.split('\n');
      };
  } else {
    console.log("Your browser do not support websocket.")
  }
};
