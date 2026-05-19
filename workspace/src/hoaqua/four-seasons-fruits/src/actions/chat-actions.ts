"use server";

// Server Actions for Chat system

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Create or get existing conversation for a customer
 */
export async function getOrCreateConversation(data: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}) {
  // Try to find existing open conversation by email or phone
  if (data.customerEmail) {
    const existing = await db.chatConversation.findFirst({
      where: { customerEmail: data.customerEmail, status: "open" },
    });
    if (existing) return existing;
  }

  // Create new conversation
  const conversation = await db.chatConversation.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone || null,
    },
  });

  revalidatePath("/admin/chat");
  return conversation;
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, sender: "customer" | "admin", content: string) {
  const message = await db.chatMessage.create({
    data: {
      conversationId,
      sender,
      content,
    },
  });

  // Update conversation metadata
  await db.chatConversation.update({
    where: { id: conversationId },
    data: {
      lastMessage: content.slice(0, 100),
      lastAt: new Date(),
      unreadAdmin: sender === "customer" ? { increment: 1 } : undefined,
    },
  });

  revalidatePath("/admin/chat");
  return message;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string) {
  return db.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Get all conversations for admin
 */
export async function getConversations() {
  return db.chatConversation.findMany({
    orderBy: { lastAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });
}

/**
 * Mark conversation as read by admin
 */
export async function markAsRead(conversationId: string) {
  await db.chatConversation.update({
    where: { id: conversationId },
    data: { unreadAdmin: 0 },
  });
  revalidatePath("/admin/chat");
}

/**
 * Close a conversation
 */
export async function closeConversation(conversationId: string) {
  await db.chatConversation.update({
    where: { id: conversationId },
    data: { status: "closed" },
  });
  revalidatePath("/admin/chat");
}

/**
 * Reopen a conversation
 */
export async function reopenConversation(conversationId: string) {
  await db.chatConversation.update({
    where: { id: conversationId },
    data: { status: "open" },
  });
  revalidatePath("/admin/chat");
}
