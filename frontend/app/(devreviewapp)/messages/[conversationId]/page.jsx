"use client";
import { useParams } from "next/navigation";
import Chat from "@/Components/DevReviewLayout/chat/Chat";

export default function ConversationPage() {
  const { conversationId } = useParams();

  return <Chat conversationId={conversationId} />;
}
