import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chat as chatApi } from '../api/client';
import './Messages.css';

export default function Messages() {
  const { id: conversationId } = useParams();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    chatApi.getConversations()
      .then(setConversations)
      .catch(() => setError('Could not load conversations'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    chatApi.getMessages(conversationId)
      .then(setMessages)
      .catch(() => setError('Could not load messages'))
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentConversation = conversations.find((c) => c.id === Number(conversationId));

  const handleSend = (e) => {
    e.preventDefault();
    const body = reply.trim();
    if (!body || sending) return;
    setSending(true);
    chatApi.sendMessage(conversationId, body)
      .then((newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
        setReply('');
      })
      .catch((err) => setError(err.message || 'Failed to send'))
      .finally(() => setSending(false));
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (loading && !conversationId) return <p>Loading...</p>;
  if (error && !conversationId) return <p>{error}</p>;

  if (conversationId) {
    return (
      <div className="messages-page thread-view">
        <div className="thread-header">
          <Link to="/messages" className="back-link">← Messages</Link>
          {currentConversation && (
            <div className="thread-title">
              <span className="thread-with">{currentConversation.otherUserDisplayName}</span>
              <Link to={`/listings/${currentConversation.listingId}`} className="thread-listing">
                {currentConversation.listingTitle}
              </Link>
            </div>
          )}
        </div>
        {loading && messages.length === 0 ? (
          <p>Loading messages...</p>
        ) : (
          <>
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-bubble ${msg.senderId === user?.id ? 'mine' : ''}`}>
                  <div className="message-meta">
                    <span className="message-sender">{msg.senderDisplayName || 'User'}</span>
                    <span className="message-time">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="message-body">{msg.body}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="message-form">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a message..."
                rows={2}
                maxLength={4000}
                disabled={sending}
              />
              <button type="submit" className="btn btn-primary" disabled={sending || !reply.trim()}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="messages-page">
      <h1>Messages</h1>
      {conversations.length === 0 ? (
        <p className="empty-state">No conversations yet. Message a listing owner from a listing page to start.</p>
      ) : (
        <ul className="conversations-list">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link to={`/messages/${c.id}`} className="conversation-card">
                <div className="conv-other">{c.otherUserDisplayName}</div>
                <div className="conv-listing">{c.listingTitle}</div>
                {c.lastMessagePreview && (
                  <div className="conv-preview">{c.lastMessagePreview}</div>
                )}
                {c.lastMessageAt && (
                  <div className="conv-time">{formatTime(c.lastMessageAt)}</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
