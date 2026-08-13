import { Send } from "lucide-react";

const messages = [
  { id: 1, sender: "them", text: "Hey! I checked out your latest commit.", time: "09:12 AM" },
  { id: 2, sender: "them", text: "That refactor looks clean, nice work!", time: "09:13 AM" },
  { id: 3, sender: "me", text: "Thanks! Took a while to untangle the old state logic.", time: "09:20 AM" },
];

export default function Chat() {
  return (
    <div className="flex flex-col h-full flex-1 min-w-0">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-xs font-extrabold text-accent">
            AC
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-ok ring-2 ring-surface" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink truncate">Ava Chen</p>
          <p className="text-xs text-muted">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] sm:max-w-[65%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                message.sender === "me"
                  ? "bg-accent text-accent-ink rounded-br-sm"
                  : "bg-surface-2 text-ink border border-line rounded-bl-sm"
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-[10px] mt-1 ${message.sender === "me" ? "text-accent-ink/70" : "text-muted"}`}>{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-line">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-page border border-line text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40"
        />
        <button
          type="button"
          className="w-10 h-10 shrink-0 rounded-xl bg-accent text-accent-ink flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
