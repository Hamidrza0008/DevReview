import Chat from "@/Components/DevReviewLayout/chat/Chat";
import { useParams } from "next/navigation"

export default function UserChatPage() {
    const userId = useParams();
    return(
        <>
            <Chat receiverId={userId} conversationId={null}/>
        </>
    )
}