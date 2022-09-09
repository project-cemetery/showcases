import { createEvent, combine, sample, restore, createEffect } from "effector";
import { spec, list, h, remap, using, node, handler } from "forest";

import {
  $messages,
  $currentMessage,
  currentMessageChanged,
  messageSent,
} from "../../models/simple-chat";
import "./index.css";

function App() {
  const colorlessModeChanged = createEvent();
  const $colorlessMode = restore(colorlessModeChanged, false);

  h("main", () => {
    spec({ classList: ["container", "mx-auto"] });

    h("aside", () => {
      spec({
        classList: ["sticky", "inset-0", "bg-white", "py-1", "flex gap-8"],
      });

      h("form", () => {
        spec({
          classList: ["bg-slate-300", "rounded-xl", "p-4", "flex gap-4"],
        });

        handler({ prevent: true }, { submit: messageSent });

        h("label", () => {
          spec({ classList: ["flex", "gap-4"] });
          spec({ text: "Message " });

          h("input", {
            attr: { value: $currentMessage },
            handler: {
              input: currentMessageChanged.prepend((e) => e.target.value),
            },
          });

          h("button", { text: "Send" });
        });
      });

      h("label", () => {
        spec({
          classList: [
            "bg-slate-300",
            "rounded-xl",
            "p-4",
            "flex",
            "gap-4",
            "items-center",
          ],
          text: "No colors",
        });

        h("input", {
          attr: { type: "checkbox", checked: $colorlessMode },
          handler: {
            change: colorlessModeChanged.prepend((e) => e.target.checked),
          },
        });
      });
    });

    h("section", () => {
      list($messages, ({ store: $message }) => {
        const $user = remap($message, "user");

        const $hightlight = combine(
          [$colorlessMode, $user],
          ([noColors, user]) => (noColors ? "black" : user.hightlight)
        );

        h("div", () => {
          h("b", {
            classList: ["pr-2"],
            style: {
              color: $hightlight,
            },
            text: remap($user, "name"),
          });

          h("span", { text: remap($message, "body") });
        });
      });

      node((messagesRef) => {
        const scrollIntoViewFx = createEffect(() => {
          messagesRef.lastElementChild?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        });

        sample({
          clock: $messages,
          target: scrollIntoViewFx,
        });
      });
    });
  });
}

using(document.getElementById("root"), App);
