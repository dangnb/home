// Admin Chat Management - List conversations and reply

import { db } from "@/lib/db";
import { AdminChatPanel } from "./admin-chat-panel";

export default async function AdminChatPage() {
  const conversations = await db.chatConversation.findMany({
    orderBy: { lastAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return <AdminChatPanel conversations={conversations} />;
}
