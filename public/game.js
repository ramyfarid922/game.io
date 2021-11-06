"use strict";
(function () {
  const socket = io();

  //Elements
  const $messageForm = document.querySelector("#message-form");
  const $messageFormInput = $messageForm.querySelector("#message");
  const $sendMessageButton = document.querySelector("#send-message");
  const $sendLocationButton = document.querySelector("#send-location");
  const $messagesDiv = document.querySelector("#messages");

  //Templates
  const messageTemplate = document.querySelector("#message-template").innerHTML;
  const locationMessageTemplate = document.querySelector(
    "#location-message-template"
  ).innerHTML;

  socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messagesDiv.insertAdjacentHTML("beforeend", html);
  });

  socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
      url: message.url,
      createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messagesDiv.insertAdjacentHTML("beforeend", html);
  });

  $sendMessageButton.addEventListener("click", (e) => {
    e.preventDefault();

    $sendMessageButton.setAttribute("disabled", "disabled");

    const message = document.querySelector("#message").value;

    socket.emit("sendMessage", message, (error) => {
      $sendMessageButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();

      if (error) {
        console.log(error);
        return;
      }

      console.log("Message delivered");
    });
  });

  $sendLocationButton.addEventListener("click", () => {
    $sendLocationButton.setAttribute("disabled", "disabled");

    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.latitude,
        },
        () => {
          $sendLocationButton.removeAttribute("disabled");
          console.log("location shared");
        }
      );
    });
  });
})();

function mountGame() {
  socket.on("countUpdated", (count) => {
    console.log("The count has been updated", count);
  });

  document.querySelector("#increment").addEventListener("click", () => {
    console.log("Clicked!");
    socket.emit("increment");
  });
}
