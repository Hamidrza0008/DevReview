"use client";

import { usePathname } from "next/navigation";
import ConversationList from "./ConversationList";

export default function MessagesLayoutWrapper({ children }) {
  const pathname = usePathname();
  const hasConversation = /\/messages\/[^/]+/.test(pathname);

  return (
    <div className="h-full flex flex-col md:flex-row">
      <div
        className={`h-full ${
          hasConversation ? "hidden md:flex" : "flex flex-1 min-h-0 md:flex-none"
        } w-full md:w-80 lg:w-96 shrink-0`}
      >
        <ConversationList />
      </div>
      <div
        className={`h-full flex-1 min-w-0 ${
          hasConversation ? "flex" : "flex border-t md:border-t-0 border-line shrink-0 md:shrink"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
