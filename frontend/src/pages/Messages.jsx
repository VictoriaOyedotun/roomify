import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chat as chatApi } from '../api/client';

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

  if (loading && !conversationId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (error && !conversationId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center text-red-600">{error}</div>
    );
  }

  if (conversationId) {
    return (
      <div className="max-w-2xl mx-auto px-4 flex flex-col min-h-[80vh]">
        <div className="border-b border-slate-100 py-4 mb-4">
          <Link to="/messages" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-950 text-sm font-medium mb-3">
            <ArrowLeft className="w-4 h-4" /> Messages
          </Link>
          {currentConversation && (
            <div>
              <p className="font-display font-bold text-lg text-slate-950">{currentConversation.otherUserDisplayName}</p>
              <Link to={`/listings/${currentConversation.listingId}`} className="text-sm text-primary-600 hover:text-primary-700">
                {currentConversation.listingTitle}
              </Link>
            </div>
          )}
        </div>
        {loading && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">Loading messages...</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.senderId === user?.id
                      ? 'ml-auto bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-90">{msg.senderDisplayName || 'User'}</span>
                    <span className="text-xs opacity-75">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a message..."
                rows={2}
                maxLength={4000}
                disabled={sending}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
              />
              <button type="submit" className="btn btn-primary self-end" disabled={sending || !reply.trim()}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-950">Messages</h1>
          <p className="text-slate-600 text-sm">Your conversations with listing owners.</p>
        </div>
      </motion.div>
      {conversations.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          No conversations yet. Message a listing owner from a listing page to start.
        </div>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link to={`/messages/${c.id}`} className="block card p-5 hover:shadow-soft-lg transition-shadow">
                <p className="font-semibold text-slate-950">{c.otherUserDisplayName}</p>
                <p className="text-sm text-primary-600 mt-0.5">{c.listingTitle}</p>
                {c.lastMessagePreview && <p className="text-slate-500 text-sm mt-2 truncate">{c.lastMessagePreview}</p>}
                {c.lastMessageAt && <p className="text-slate-400 text-xs mt-1">{formatTime(c.lastMessageAt)}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
