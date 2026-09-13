"use client";

import { usePathname } from "next/navigation";
import ConversationList from "./ConversationList";

export default function MessagesLayoutWrapper({ children }) {
  const pathname = usePathname();
  const hasConversation = /\/messages\/[^/]+/.test(pathname);

  return (
    <div className="h-full flex flex-row">
      <div
        className={`h-full ${
          hasConversation ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 shrink-0`}
      >
        <ConversationList />
      </div>
      <div
        className={`h-full flex-1 min-w-0 ${
          hasConversation ? "flex" : "hidden md:flex"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
