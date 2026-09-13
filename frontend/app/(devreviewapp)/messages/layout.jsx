import MessagesLayoutWrapper from "@/Components/DevReviewLayout/chat/MessagesLayoutWrapper";

export default function MessagesLayout({ children }) {
  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-screen p-0 sm:p-4 md:p-6 lg:p-8">
      <div className="h-full bg-surface border-0 sm:border border-line rounded-none sm:rounded-2xl overflow-hidden">
        <MessagesLayoutWrapper>{children}</MessagesLayoutWrapper>
      </div>
    </div>
  );
}
