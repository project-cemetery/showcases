import { render, For } from "solid-js/web";
import { createSignal, createEffect, on } from "solid-js";
import { useUnit } from "effector-solid";

import {
  $messages,
  $currentMessage,
  currentMessageChanged,
  messageSent,
} from "../../libs/simple-chat";
import "./index.css";

function App() {
  // All chat-related stuff is business logic, Effector handles it
  // here we just send events and render the list of messages
  const [currentMessage, messages, onCurrentMessageChanged, onMessageSent] =
    useUnit([$currentMessage, $messages, currentMessageChanged, messageSent]);

  // Colorless mode is an UI logic, Solid handles it
  const [colorlessMode, setColorlessMode] = createSignal(false);

  // Prevent form from default behavior is an UI logic, Solid handles it
  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSent();
  };

  // Scroling to last message is an UI logic, Solid handles it
  let messagesRef = null;
  createEffect(
    on(messages, () => {
      messagesRef?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    })
  );

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
              value={currentMessage()}
              onChange={(e) => onCurrentMessageChanged(e.target.value)}
            />
          </label>
          <button>Send</button>
        </form>
        <label className="bg-slate-300 rounded-xl p-4 flex gap-4 items-center">
          No colors{" "}
          <input
            type="checkbox"
            checked={colorlessMode()}
            onChange={(e) => setColorlessMode(e.target.checked)}
          />
        </label>
      </aside>
      <section ref={messagesRef}>
        <For each={messages()}>
          {(message) => (
            <div>
              <b
                style={{
                  color: colorlessMode() ? "" : message.user.hightlight,
                }}
              >
                {message.user.name}
              </b>{" "}
              <span>{message.body}</span>
            </div>
          )}
        </For>
      </section>
    </main>
  );
}

render(() => <App />, document.getElementById("root"));
