import { server } from "websocket";
import { createServer } from "http";

const http = createServer();

const ws = new server({ httpServer: http });

function sendMessage(message) {
  ws.broadcast(JSON.stringify(message));
}

function randomMessageTick() {
  setTimeout(() => {
    sendMessage({
      type: "message",
      body: randomBody(),
      user: randomUser(),
    });

    randomMessageTick();
  }, randomDelay({ min: 300, max: 1000 }));
}

ws.on("request", (request) => {
  const connection = request.accept();

  connection.on("message", ({ utf8Data: body }) => {
    sendMessage({
      type: "message",
      body,
      user: { name: "The best developer", hightlight: "red" },
    });
  });
});

http.listen(8080, "0.0.0.0", () => {
  randomMessageTick();
});

function randomUser() {
  return randomElement([
    { name: "Alice", hightlight: "green" },
    { name: "Bob", hightlight: "blue" },
    { name: "Charlie", hightlight: "red" },
    { name: "Dave", hightlight: "yellow" },
    { name: "Eve", hightlight: "purple" },
    { name: "Frank", hightlight: "orange" },
    { name: "Grace", hightlight: "pink" },
  ]);
}

function randomBody() {
  return randomElement([
    "Hello!",
    "How are you?",
    "I'm fine, thanks!",
    "Bye!",
    "See you later!",
    "I'm going to the store, do you need anything?",
    "What's up?",
    "What's new?",
    "What's going on?",
    "What's happening?",
    "How's it going?",
    "How's life?",
    "How's it hanging?",
    "How's your day?",
  ]);
}

function randomElement(array) {
  return array.at(Math.floor(Math.random() * array.length));
}

function randomDelay({ min, max }) {
  return Math.random() * (max - min) + min;
}
