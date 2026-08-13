import ConversationList from "@/Components/DevReviewLayout/chat/ConversationList";
import Chat from "@/Components/DevReviewLayout/chat/Chat";

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-screen p-4 sm:p-6 lg:p-8">
      <div className="h-full bg-surface border border-line rounded-2xl overflow-hidden flex">
        <ConversationList />
        <Chat />
      </div>
    </div>
  );
}
