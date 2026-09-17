import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Messages",
  description: "Chat with other developers on DevReview.",
};

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-w-0 text-center px-6 py-8 md:py-12" role="status" aria-label="Select a conversation">
      <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-line flex items-center justify-center mb-4">
        <MessageSquare className="w-6 h-6 text-muted" />
      </div>
      <h2 className="text-base font-bold text-ink">Select a conversation</h2>
      <p className="text-sm text-muted mt-1">Choose a conversation from the list to start chatting.</p>
    </div>
  );
}
