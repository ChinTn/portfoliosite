import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SignInButton, SignOutButton, useUser } from '@clerk/react';
import { SendButton } from './SendButton';
import { showBanner } from './AnnouncementBanner';

const Guestbook = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/guestbook`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching guestbook:", error);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/guestbook`, {
        clerkUserId: user.id,
        name: user.fullName || user.firstName || 'Anonymous',
        imageUrl: user.imageUrl,
        message: newMessage.trim()
      });
      
      setMessages([res.data, ...messages]);
      setNewMessage('');
      showBanner("Message posted to Guestbook!", "success");
    } catch (error) {
      console.error("Error posting message:", error);
      showBanner("Failed to post message", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/guestbook/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
      showBanner("Message deleted", "success");
    } catch (error) {
      console.error("Error deleting message:", error);
      showBanner("Failed to delete message", "error");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 mb-12">
      <h2 className="text-2xl font-bold text-text-main mb-6 border-l-4 border-highlight pl-4">
        Guestbook
      </h2>

      {/* Loading State */}
      {!isLoaded && (
        <div className="bg-bg-dark p-6 rounded-xl border border-border-main flex items-center justify-center text-text-dim text-sm mb-8 animate-pulse">
          Loading authentication...
        </div>
      )}

      {/* When Signed Out: Show Login Button */}
      {isLoaded && !isSignedIn && (
        <div className="bg-bg-dark p-6 rounded-xl border border-border-main flex flex-col items-center justify-center text-center gap-4 mb-8">
          <p className="text-text-dim">Leave a message for future visitors!</p>
          <SignInButton mode="modal">
            <button className="px-4 py-1.5 bg-highlight text-bg-main font-medium rounded-full text-sm hover:opacity-90 transition-opacity">
              Sign in
            </button>
          </SignInButton>
        </div>
      )}

      {/* When Signed In: Show Input Form */}
      {isLoaded && isSignedIn && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-bg-dark p-4 rounded-xl border border-border-main flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <img src={user?.imageUrl} alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="text-text-main font-medium">{user?.fullName || 'User'}</span>
              </div>
              <SignOutButton>
                <button type="button" className="text-xs text-text-dim hover:text-red-400 transition-colors font-medium border border-border-dim px-3 py-1 rounded-md">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Leave a note or suggestion..."
              className="w-full bg-bg-main border border-border-main rounded-lg p-3 text-text-main focus:outline-none focus:border-highlight resize-none min-h-[100px]"
              maxLength={500}
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-text-dim">{newMessage.length}/500</span>
              <SendButton type="submit" disabled={isSubmitting || !newMessage.trim()} label="Send" sentLabel="Posted!" />
            </div>
          </div>
        </form>
      )}

      {/* List of Messages */}
      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
        {messages.length === 0 ? (
          <p className="text-center text-text-dim italic">No messages yet. Be the first!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-bg-dark p-4 rounded-xl border border-border-dim relative group">
              
              {/* Delete Button (Only visible if the logged in user owns the message) */}
              {isSignedIn && user?.id === msg.clerkUserId && (
                <button 
                  onClick={() => deleteMessage(msg._id)}
                  className="absolute top-4 right-4 text-text-dim opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                  title="Delete message"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}

              <div className="flex items-center gap-3 mb-3 pr-8">
                {msg.imageUrl ? (
                  <img src={msg.imageUrl} alt={msg.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-border-main flex items-center justify-center text-highlight font-bold">
                    {msg.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-text-main font-medium text-sm">{msg.name}</h4>
                  <p className="text-xs text-text-dim">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-text-dim text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Guestbook;










