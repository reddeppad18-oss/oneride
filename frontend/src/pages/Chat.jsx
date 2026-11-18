
import { useEffect, useRef, useState } from "react";

import {
  getMyConversations,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
  closeChatConversation,
  editChatMessage,
  deleteChatMessage,
  deleteChatConversation,
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

  const [contextMenu, setContextMenu] = useState(null);

  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    loadChatData();

    return () => {
      clearTimeout(longPressTimer.current);
    };
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

  const openConversation = async (conversation) => {
    try {
      setContextMenu(null);
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

      // Backend returns newest first; display oldest first.
      setMessages([...messageList].reverse());

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

  const handleBackToConversations = () => {
    setSelectedConversation(null);
    setMessages([]);
    setMessageText("");
    setError("");
    setContextMenu(null);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = messageText.trim();

    if (!content || !selectedConversation || sending) return;

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
            ? { ...item, lastMessageAt: response.sentAt }
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

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;

    if (!window.confirm(
      "Are you sure you want to close this conversation?"
    )) return;

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
      setError(
        err.response?.data?.message ||
        "Unable to close conversation."
      );
    }
  };

  // Long press and right-click menu helpers.
  const startLongPress = (menu) => {
    clearTimeout(longPressTimer.current);
    longPressTriggered.current = false;

    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setContextMenu(menu);
    }, 550);
  };

  const cancelLongPress = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleConversationClick = (conversation) => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }

    openConversation(conversation);
  };

  const showConversationMenu = (event, conversation) => {
    event.preventDefault();
    cancelLongPress();

    setContextMenu({
      type: "conversation",
      conversation,
    });
  };

  const showMessageMenu = (event, message) => {
    event.preventDefault();
    cancelLongPress();

    setContextMenu({
      type: "message",
      message,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteConversation = async () => {
    const conversation = contextMenu?.conversation;
    if (!conversation) return;

    const confirmed = window.confirm(
      "Delete this conversation for you? The other participant will still have their chat."
    );

    if (!confirmed) {
      closeContextMenu();
      return;
    }

    try {
      await deleteChatConversation(conversation.conversationId);

      setConversations((previous) =>
        previous.filter(
          (item) =>
            item.conversationId !== conversation.conversationId
        )
      );

      if (
        selectedConversation?.conversationId ===
        conversation.conversationId
      ) {
        setSelectedConversation(null);
        setMessages([]);
        setMessageText("");
      }

      closeContextMenu();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete conversation."
      );
      closeContextMenu();
    }
  };

  const handleCopyMessage = async () => {
    const message = contextMenu?.message;
    if (!message || !message.content) return;

    try {
      await navigator.clipboard.writeText(message.content);
      closeContextMenu();
    } catch (err) {
      console.error("Copy failed:", err);
      setError("Unable to copy message on this device.");
      closeContextMenu();
    }
  };

  const handleEditMessage = async () => {
    const message = contextMenu?.message;

    if (!message || !selectedConversation) return;

    const updatedContent = window.prompt(
      "Edit your message:",
      message.content || ""
    );

    closeContextMenu();

    if (updatedContent === null) return;

    if (!updatedContent.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    try {
      const updatedMessage = await editChatMessage(
        selectedConversation.conversationId,
        message.messageId,
        updatedContent.trim()
      );

      setMessages((previous) =>
        previous.map((item) =>
          item.messageId === updatedMessage.messageId
            ? updatedMessage
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to edit message."
      );
    }
  };

  const handleDeleteMessage = async (forEveryone) => {
    const message = contextMenu?.message;

    if (!message || !selectedConversation) return;

    const actionText = forEveryone
      ? "Delete this message for everyone?"
      : "Delete this message only for you?";

    if (!window.confirm(actionText)) {
      closeContextMenu();
      return;
    }

    try {
      await deleteChatMessage(
        selectedConversation.conversationId,
        message.messageId,
        forEveryone
      );

      setMessages((previous) =>
        previous.map((item) => {
          if (item.messageId !== message.messageId) return item;

          if (forEveryone) {
            return {
              ...item,
              content: null,
              deletedForEveryone: true,
              deletedForMe: true,
            };
          }

          return {
            ...item,
            content: null,
            deletedForMe: true,
          };
        })
      );

      closeContextMenu();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete message."
      );
      closeContextMenu();
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
    <div className="chat-page" onClick={() => {
      if (contextMenu) closeContextMenu();
    }}>

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
                Your ride and rental conversations will appear here.
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
                  onClick={(event) => {
                    event.stopPropagation();
                    handleConversationClick(conversation);
                  }}
                  onContextMenu={(event) =>
                    showConversationMenu(event, conversation)
                  }
                  onTouchStart={() =>
                    startLongPress({
                      type: "conversation",
                      conversation,
                    })
                  }
                  onTouchEnd={cancelLongPress}
                  onTouchMove={cancelLongPress}
                  onTouchCancel={cancelLongPress}
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
          selectedConversation
            ? "mobile-chat-visible"
            : "mobile-chat-hidden"
        }`}
      >
        {!selectedConversation ? (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <span>💬</span>
            </div>

            <h2>Your Alridez Messages</h2>

            <p>
              Select a conversation to communicate with your ride
              or rental partner.
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
                    {getServiceLabel(selectedConversation.serviceType)}
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
                <p className="chat-status">Loading messages...</p>
              ) : messages.length === 0 ? (
                <div className="chat-no-messages">
                  <h3>Start a conversation</h3>
                  <p>Send your first message.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMine =
                    String(message.senderId) === String(currentUser?.id);

                  const isDeleted =
                    message.deletedForMe ||
                    message.deletedForEveryone;

                  return (
                    <div
                      key={message.messageId}
                      className={`chat-message-row ${
                        isMine ? "mine" : "theirs"
                      }`}
                      onContextMenu={(event) =>
                        showMessageMenu(event, message)
                      }
                      onTouchStart={() =>
                        startLongPress({
                          type: "message",
                          message,
                        })
                      }
                      onTouchEnd={cancelLongPress}
                      onTouchMove={cancelLongPress}
                      onTouchCancel={cancelLongPress}
                    >
                      <div className="chat-message-bubble">
                        {!isMine && (
                          <span className="chat-sender-name">
                            {message.senderName}
                          </span>
                        )}

                        {isDeleted ? (
                          <p className="chat-deleted-message">
                            {message.deletedForEveryone
                              ? "This message was deleted"
                              : "You deleted this message"}
                          </p>
                        ) : (
                          <p>{message.content}</p>
                        )}

                        <div className="chat-message-meta">
                          {message.editedAt && !isDeleted && (
                            <span>Edited</span>
                          )}

                          <span>{formatTime(message.sentAt)}</span>

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

      {/* CONTEXT MENU */}
      {contextMenu && (
        <div
          className="chat-context-overlay"
          onClick={closeContextMenu}
        >
          <div
            className="chat-context-menu"
            onClick={(event) => event.stopPropagation()}
          >
            {contextMenu.type === "conversation" ? (
              <>
                <button
                  type="button"
                  className="danger"
                  onClick={handleDeleteConversation}
                >
                  <span>🗑</span>
                  Delete conversation
                </button>

                <button
                  type="button"
                  onClick={closeContextMenu}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {!contextMenu.message.deletedForMe &&
                  !contextMenu.message.deletedForEveryone && (
                    <>
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                      >
                        <span>📋</span>
                        Copy
                      </button>

                      {String(contextMenu.message.senderId) ===
                        String(currentUser?.id) && (
                        <button
                          type="button"
                          onClick={handleEditMessage}
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        className="danger"
                        onClick={() => handleDeleteMessage(false)}
                      >
                        <span>🗑</span>
                        Delete for me
                      </button>

                      {String(contextMenu.message.senderId) ===
                        String(currentUser?.id) && (
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteMessage(true)}
                        >
                          <span>🗑</span>
                          Delete for everyone
                        </button>
                      )}
                    </>
                  )}

                <button
                  type="button"
                  onClick={closeContextMenu}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

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
