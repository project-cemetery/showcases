import ReactDOM from "react-dom/client";
import { useState, useRef, useEffect } from "react";
import { useList, useUnit } from "effector-react";

import {
  $messages,
  $currentMessage,
  currentMessageChanged,
  messageSent,
} from "../../libs/simple-chat";
import "./index.css";

function App() {
  // Colorless mode is an UI logic, React handles it
  const [colorlessMode, setColorlessMode] = useState(false);

  // All chat-related stuff is business logic, Effector handles it
  // here we just send events and render the list of messages
  const [currentMessage, onCurrentMessageChanged, onMessageSent] = useUnit([
    $currentMessage,
    currentMessageChanged,
    messageSent,
  ]);
  const messages = useList($messages, {
    fn: (message) => (
      <div>
        <b style={{ color: colorlessMode ? "" : message.user.hightlight }}>
          {message.user.name}
        </b>{" "}
        <span>{message.body}</span>
      </div>
    ),
    keys: [colorlessMode],
  });

  // Prevent form from default behavior is an UI logic, React handles it
  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSent();
  };

  // Scroling to last message is an UI logic, React handles it
  const messagesRef = useRef(null);
  useEffect(() => {
    messagesRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <main className="container mx-auto">
      <aside className="sticky inset-0 bg-white py-1 flex gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-300 rounded-xl p-4 flex gap-4"
        >
          <label className="flex gap-4">
            Message
            <input
              value={currentMessage}
              onChange={(e) => onCurrentMessageChanged(e.target.value)}
            />
          </label>
          <button>Send</button>
        </form>
        <label className="bg-slate-300 rounded-xl p-4 flex gap-4 items-center">
          No colors{" "}
          <input
            type="checkbox"
            checked={colorlessMode}
            onChange={(e) => setColorlessMode(e.target.checked)}
          />
        </label>
      </aside>
      <section ref={messagesRef}>{messages}</section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
