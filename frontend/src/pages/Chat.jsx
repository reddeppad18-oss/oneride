
import { useEffect, useState } from "react";

import {
  getMyConversations,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
  closeChatConversation,
} from "../services/chatService";

import { getCurrentUser } from "../services/userService";

import "./Chat.css";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadChatData();
  }, []);

  const loadChatData = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await getCurrentUser();
      setCurrentUser(user);

      const data = await getMyConversations();

      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load chat:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load conversations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Identify the other participant
  const getOtherParticipant = (conversation) => {
    if (!currentUser || !conversation) return {};

    if (String(conversation.customerId) === String(currentUser.id)) {
      return {
        id: conversation.providerId,
        name: conversation.providerName,
      };
    }

    return {
      id: conversation.customerId,
      name: conversation.customerName,
    };
  };

  // Open a conversation
  const openConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      setMessages([]);
      setMessagesLoading(true);
      setMessageText("");
      setError("");

      const data = await getChatMessages(
        conversation.conversationId,
        0,
        30
      );

      const messageList = Array.isArray(data)
        ? data
        : data?.content || [];

      setMessages(messageList);

      await markChatAsRead(conversation.conversationId);

      setConversations((previous) =>
        previous.map((item) =>
          item.conversationId === conversation.conversationId
            ? { ...item, unreadCount: 0 }
            : item
        )
      );
    } catch (err) {
      console.error("Failed to open conversation:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load messages."
      );
    } finally {
      setMessagesLoading(false);
    }
  };

  // Return to conversation list on mobile
  const handleBackToConversations = () => {
    setSelectedConversation(null);
    setMessages([]);
    setMessageText("");
    setError("");
  };

  // Send a message
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = messageText.trim();

    if (!content || !selectedConversation || sending) {
      return;
    }

    if (content.length > 2000) {
      setError("Message cannot exceed 2000 characters.");
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await sendChatMessage(
        selectedConversation.conversationId,
        content
      );

      setMessages((previous) => [...previous, response]);
      setMessageText("");

      setConversations((previous) =>
        previous.map((item) =>
          item.conversationId === selectedConversation.conversationId
            ? {
                ...item,
                lastMessageAt: response.sentAt,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Message sending failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // Close conversation
  const handleCloseConversation = async () => {
    if (!selectedConversation) return;

    const confirmed = window.confirm(
      "Are you sure you want to close this conversation?"
    );

    if (!confirmed) return;

    try {
      await closeChatConversation(
        selectedConversation.conversationId
      );

      setConversations((previous) =>
        previous.map((item) =>
          item.conversationId === selectedConversation.conversationId
            ? { ...item, status: "CLOSED" }
            : item
        )
      );

      setSelectedConversation((previous) => ({
        ...previous,
        status: "CLOSED",
      }));
    } catch (err) {
      console.error("Failed to close conversation:", err);

      setError(
        err.response?.data?.message ||
        "Unable to close conversation."
      );
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getServiceLabel = (serviceType) => {
    const labels = {
      RIDE_SHARING: "Ride Sharing",
      INSTANT_RIDE: "Instant Ride",
      RENTAL_LISTING: "Rental Listing",
      RENTAL_REQUEST: "Rental Request",
    };

    return labels[serviceType] || serviceType || "Alridez";
  };

  if (loading) {
    return (
      <div className="chat-loading">
        Loading your conversations...
      </div>
    );
  }

  return (
    <div className="chat-page">

      {/* CONVERSATION SIDEBAR */}

      <aside
        className={`chat-sidebar ${
          selectedConversation ? "mobile-sidebar-hidden" : ""
        }`}
      >
        <div className="chat-sidebar-header">
          <div>
            <h2>Messages</h2>
            <p>Connect with your ride and rental partners</p>
          </div>

          <span className="chat-total">
            {conversations.length}
          </span>
        </div>

        <div className="chat-conversation-list">
          {conversations.length === 0 ? (
            <div className="chat-empty-inbox">
              <h3>No conversations yet</h3>
              <p>
                Your ride and rental conversations will
                appear here.
              </p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const participant = getOtherParticipant(conversation);

              const isActive =
                selectedConversation?.conversationId ===
                conversation.conversationId;

              return (
                <button
                  type="button"
                  key={conversation.conversationId}
                  className={`chat-conversation-item ${
                    isActive ? "selected" : ""
                  }`}
                  onClick={() => openConversation(conversation)}
                >
                  <div className="chat-avatar">
                    {(participant.name || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="chat-conversation-info">
                    <div className="chat-conversation-top">
                      <strong>
                        {participant.name || "Alridez User"}
                      </strong>

                      <span>
                        {formatDate(conversation.lastMessageAt)}
                      </span>
                    </div>

                    <div className="chat-conversation-bottom">
                      <span>
                        {getServiceLabel(conversation.serviceType)}
                      </span>

                      {conversation.unreadCount > 0 && (
                        <span className="chat-unread">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* MAIN CHAT WINDOW */}

      <main
        className={`chat-main ${
          selectedConversation ? "mobile-chat-visible" : "mobile-chat-hidden"
        }`}
      >
        {!selectedConversation ? (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <span>💬</span>
            </div>

            <h2>Your Alridez Messages</h2>

            <p>
              Select a conversation to communicate with
              your ride or rental partner.
            </p>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}

            <div className="chat-header">

              <div className="chat-header-user">

                <button
                  type="button"
                  className="chat-back-button"
                  onClick={handleBackToConversations}
                  aria-label="Back to conversations"
                >
                  ←
                </button>

                <div className="chat-avatar">
                  {(
                    getOtherParticipant(selectedConversation).name || "?"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="chat-header-user-info">
                  <h3>
                    {
                      getOtherParticipant(selectedConversation).name ||
                      "Alridez User"
                    }
                  </h3>

                  <p>
                    {getServiceLabel(
                      selectedConversation.serviceType
                    )}
                    {" "}#{selectedConversation.serviceReferenceId}
                  </p>
                </div>
              </div>

              {selectedConversation.status === "ACTIVE" && (
                <button
                  type="button"
                  className="chat-close-button"
                  onClick={handleCloseConversation}
                >
                  Close Chat
                </button>
              )}

              {selectedConversation.status === "CLOSED" && (
                <span className="chat-closed-label">
                  Conversation Closed
                </span>
              )}

            </div>

            {/* MESSAGES */}

            <div className="chat-messages">

              {messagesLoading ? (
                <p className="chat-status">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <div className="chat-no-messages">
                  <h3>Start a conversation</h3>
                  <p>Send your first message.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMine =
                    String(message.senderId) === String(currentUser?.id);

                  return (
                    <div
                      key={message.messageId}
                      className={`chat-message-row ${
                        isMine ? "mine" : "theirs"
                      }`}
                    >
                      <div className="chat-message-bubble">

                        {!isMine && (
                          <span className="chat-sender-name">
                            {message.senderName}
                          </span>
                        )}

                        <p>{message.content}</p>

                        <div className="chat-message-meta">
                          <span>
                            {formatTime(message.sentAt)}
                          </span>

                          {isMine && message.readAt && (
                            <span className="chat-read-status">
                              Read
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}

            </div>

            {/* MESSAGE INPUT */}

            <form
              className="chat-composer"
              onSubmit={handleSendMessage}
            >
              <textarea
                value={messageText}
                onChange={(event) =>
                  setMessageText(event.target.value.slice(0, 2000))
                }
                placeholder={
                  selectedConversation.status === "CLOSED"
                    ? "This conversation is closed"
                    : "Type your message..."
                }
                maxLength={2000}
                rows={2}
                disabled={
                  selectedConversation.status === "CLOSED" ||
                  sending
                }
              />

              <div className="chat-composer-footer">
                <span>{messageText.length}/2000</span>

                <button
                  type="submit"
                  disabled={
                    !messageText.trim() ||
                    sending ||
                    selectedConversation.status === "CLOSED"
                  }
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </>
        )}
      </main>

      {/* ERROR MESSAGE */}

      {error && (
        <div className="chat-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}

export default Chat;
