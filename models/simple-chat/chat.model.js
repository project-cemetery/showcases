import { createEvent, createStore, createEffect, sample } from "effector";

// Model

export const $currentMessage = createStore("");
export const $messages = createStore([]);

export const currentMessageChanged = createEvent();
const clearCurrentMessage = createEvent();
export const messageSent = createEvent();
const messageReceived = createEvent();

const sentMessageToSocketFx = createEffect();

$messages.on(messageReceived, (state, message) => [...state, message]);

$currentMessage
  .on(currentMessageChanged, (_, message) => message)
  .reset(clearCurrentMessage);

sample({
  clock: messageSent,
  source: $currentMessage,
  filter: (message) => message.trim().length > 0,
  target: [sentMessageToSocketFx, clearCurrentMessage],
});

// WS connection

const socket = new WebSocket("ws://localhost:8080");

sentMessageToSocketFx.use((messageText) => {
  socket.send(messageText);
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case "message":
      messageReceived(message);
      break;
  }
});
