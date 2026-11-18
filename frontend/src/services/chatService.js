
import api from "../api/axios";

/*
 * Get all conversations of the logged-in user
 */
export const getMyConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data;
};

/*
 * Get messages for a particular conversation
 */
export const getChatMessages = async (
  conversationId,
  page = 0,
  size = 30
) => {
  const response = await api.get(
    `/chat/conversations/${conversationId}/messages`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return response.data;
};

/*
 * Send a text message
 */
export const sendChatMessage = async (
  conversationId,
  content
) => {
  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    {
      content,
    }
  );

  return response.data;
};

/*
 * Mark conversation messages as read
 */
export const markChatAsRead = async (conversationId) => {
  const response = await api.put(
    `/chat/conversations/${conversationId}/read`
  );

  return response.data;
};

/*
 * Close a conversation
 */
export const closeChatConversation = async (conversationId) => {
  const response = await api.put(
    `/chat/conversations/${conversationId}/close`
  );

  return response.data;
};
