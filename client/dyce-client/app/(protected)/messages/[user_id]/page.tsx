'use client'

import ChatView from "@/components/ChatView";
import { axiosClient } from "@/lib/axios-client";
import { Profile } from "@/types/profile";
import { Loader } from "lucide-react";
import { use, useEffect, useState } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ user_id: string }>
}) {
  const { user_id } = use(params)
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get(`/profile/${user_id}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [user_id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <Loader className="animate-spin w-8 h-8 inline-block" />
      </div>
    )
  }
  return <ChatView otherUser={user} />;
}



// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Send, 
//   Smile, 
//   Paperclip, 
//   Mic, 
//   Phone, 
//   MoreVertical, 
//   ArrowLeft,
//   Play,
//   Pause,
//   MessageCircle,
//   Unlink
// } from 'lucide-react';
// import { Match, Message } from '@/types/messages';
// import { useRouter } from 'next/navigation';


// const MessagingPage = () => {
//   const [matches] = useState<Match[]>([
//     {
//       id: '1',
//       name: 'Priya',
//       avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
//       lastMessage: 'Hey! Loved your fest photos 📸',
//       timestamp: '2m ago',
//       unread: 2,
//       isOnline: true,
//       isNewMatch: true
//     },
//     {
//       id: '2',
//       name: 'Arjun',
//       avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
//       lastMessage: 'That coding session was intense! 💻',
//       timestamp: '1h ago',
//       unread: 0,
//       isTyping: true
//     },
//     {
//       id: '3',
//       name: 'Sneha',
//       avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
//       lastMessage: 'Coffee at the tea point? ☕',
//       timestamp: '3h ago',
//       unread: 1
//     }
//   ]);

//   const [selectedMatch, setSelectedMatch] = useState<Match | null>(matches[0]);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       senderId: '1',
//       content: 'Hey! Just saw your profile and loved your fest photos! 📸',
//       type: 'text',
//       timestamp: '2:14 PM',
//       status: 'seen'
//     },
//     {
//       id: '2',
//       senderId: 'me',
//       content: 'Thanks! That was from the tech fest last month. Are you into photography too?',
//       type: 'text',
//       timestamp: '2:16 PM',
//       status: 'seen'
//     },
//     {
//       id: '3',
//       senderId: '1',
//       content: 'Absolutely! I love capturing campus moments. Maybe we could do a photo walk sometime? 📷',
//       type: 'text',
//       timestamp: '2:18 PM',
//       status: 'delivered',
//       reactions: ['❤️']
//     }
//   ]);

//   const [newMessage, setNewMessage] = useState('');
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showUnmatchModal, setShowUnmatchModal] = useState(false);
//   const [showCallModal, setShowCallModal] = useState(false);
//   const [playingVoice, setPlayingVoice] = useState<string | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const router = useRouter()

//   const emojis = ['😊', '😂', '❤️', '👍', '🔥', '💯', '😍', '🤔', '😎', '🎉'];
//   const reactions = ['❤️', '👍', '😂'];

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const message: Message = {
//       id: Date.now().toString(),
//       senderId: 'me',
//       content: newMessage,
//       type: 'text',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       status: 'sent'
//     };

//     setMessages(prev => [...prev, message]);
//     setNewMessage('');
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const startRecording = () => {
//     setIsRecording(true);
//     // Simulate recording
//     setTimeout(() => {
//       setIsRecording(false);
//       const voiceMessage: Message = {
//         id: Date.now().toString(),
//         senderId: 'me',
//         content: 'Voice message',
//         type: 'voice',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         status: 'sent',
//         duration: 5
//       };
//       setMessages(prev => [...prev, voiceMessage]);
//     }, 2000);
//   };

//   const addReaction = (messageId: string, emoji: string) => {
//     setMessages(prev => prev.map(msg => 
//       msg.id === messageId 
//         ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
//         : msg
//     ));
//   };

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="h-screen bg-dark text-light flex">

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedMatch ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 border-b border-light/10 bg-light/5">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => router.back()}
//                     className="p-2 hover:bg-light/10 rounded-full transition-colors lg:hidden"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <img
//                     src={selectedMatch.avatar}
//                     alt={selectedMatch.name}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="font-medium text-light">{selectedMatch.name}</h3>
//                     <p className="text-light/60 text-sm">
//                       {selectedMatch.isOnline ? 'Online now' : 'Last seen 2h ago'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setShowUnmatchModal(true)}
//                     className="p-2 hover:bg-light/10 rounded-full transition-colors"
//                   >
//                     <Unlink className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {messages.map(message => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div className={`max-w-xs lg:max-w-md ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
//                     <div
//                       className={`p-3 rounded-2xl ${
//                         message.senderId === 'me'
//                           ? 'bg-gradient-to-r from-primary to-emotional text-white'
//                           : 'bg-light/10 text-light'
//                       } ${message.type === 'voice' ? 'flex items-center gap-3' : ''}`}
//                     >
//                       {message.type === 'text' && (
//                         <p className="text-sm">{message.content}</p>
//                       )}
                      
//                       {message.type === 'voice' && (
//                         <>
//                           <button
//                             onClick={() => setPlayingVoice(playingVoice === message.id ? null : message.id)}
//                             className="p-2 bg-white/20 rounded-full"
//                           >
//                             {playingVoice === message.id ? (
//                               <Pause className="w-4 h-4" />
//                             ) : (
//                               <Play className="w-4 h-4" />
//                             )}
//                           </button>
//                           <div className="flex-1">
//                             <div className="flex items-center gap-1 mb-1">
//                               {[...Array(20)].map((_, i) => (
//                                 <div
//                                   key={i}
//                                   className={`w-1 bg-white/60 rounded-full ${
//                                     Math.random() > 0.5 ? 'h-4' : 'h-2'
//                                   }`}
//                                 />
//                               ))}
//                             </div>
//                             <p className="text-xs opacity-70">{formatDuration(message.duration || 0)}</p>
//                           </div>
//                         </>
//                       )}
//                     </div>
                    
//                     {/* Reactions */}
//                     {message.reactions && message.reactions.length > 0 && (
//                       <div className="flex gap-1 mt-1">
//                         {message.reactions.map((reaction, index) => (
//                           <span key={index} className="text-sm bg-light/10 px-2 py-1 rounded-full">
//                             {reaction}
//                           </span>
//                         ))}
//                       </div>
//                     )}
                    
//                     <div className={`flex items-center gap-2 mt-1 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
//                       <p className="text-light/50 text-xs">{message.timestamp}</p>
//                       {message.senderId === 'me' && (
//                         <p className="text-light/50 text-xs">
//                           {message.status === 'sent' && '✓'}
//                           {message.status === 'delivered' && '✓✓'}
//                           {message.status === 'seen' && <span className="text-primary">✓✓</span>}
//                         </p>
//                       )}
//                     </div>
                    
//                     {/* Quick Reactions */}
//                     {message.senderId !== 'me' && (
//                       <div className="flex gap-1 mt-2">
//                         {reactions.map(emoji => (
//                           <button
//                             key={emoji}
//                             onClick={() => addReaction(message.id, emoji)}
//                             className="text-sm hover:scale-110 transition-transform"
//                           >
//                             {emoji}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="p-4 border-t border-light/10 bg-light/5">
//               <div className="flex items-end gap-3">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 bg-light/10 rounded-2xl p-3">
//                     <button
//                       onClick={() => fileInputRef.current?.click()}
//                       className="p-1 hover:bg-light/10 rounded-full transition-colors"
//                     >
//                       <Paperclip className="w-5 h-5 text-light/60" />
//                     </button>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       className="hidden"
//                       accept="image/*,video/*"
//                     />
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type a message..."
//                       className="flex-1 bg-transparent focus:outline-none text-light"
//                     />
//                     <button
//                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                       className="p-1 hover:bg-light/10 rounded-full transition-colors"
//                     >
//                       <Smile className="w-5 h-5 text-light/60" />
//                     </button>
//                   </div>
                  
//                   {/* Emoji Picker */}
//                   {showEmojiPicker && (
//                     <div className="absolute bottom-20 right-4 bg-light/10 backdrop-blur-sm rounded-2xl p-4 border border-light/20">
//                       <div className="grid grid-cols-5 gap-2">
//                         {emojis.map(emoji => (
//                           <button
//                             key={emoji}
//                             onClick={() => {
//                               setNewMessage(prev => prev + emoji);
//                               setShowEmojiPicker(false);
//                             }}
//                             className="p-2 hover:bg-light/10 rounded-lg transition-colors text-xl"
//                           >
//                             {emoji}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 {newMessage.trim() ? (
//                   <button
//                     onClick={sendMessage}
//                     className="p-3 bg-gradient-to-r from-primary to-emotional rounded-full hover:scale-105 transition-transform"
//                   >
//                     <Send className="w-5 h-5 text-white" />
//                   </button>
//                 ) : (
//                   <button
//                     onMouseDown={startRecording}
//                     className={`p-3 rounded-full transition-all ${
//                       isRecording 
//                         ? 'bg-red-500 scale-110' 
//                         : 'bg-light/20 hover:bg-light/30'
//                     }`}
//                   >
//                     <Mic className="w-5 h-5 text-white" />
//                   </button>
//                 )}
//               </div>
              
//               {isRecording && (
//                 <div className="flex items-center gap-2 mt-2 text-red-400">
//                   <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                   <span className="text-sm">Recording voice message...</span>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <MessageCircle className="w-8 h-8 text-primary" />
//               </div>
//               <h3 className="font-serif text-xl text-light mb-2">Select a match to start chatting</h3>
//               <p className="text-light/60">Your conversations will appear here</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Call Modal */}
//       {showCallModal && selectedMatch && (
//         <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4">
//             <h2 className="font-serif text-xl text-light mb-2">Call {selectedMatch.name}?</h2>
//             <p className="text-light/70 text-sm mb-6">
//               Start a voice call with your match
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowCallModal(false)}
//                 className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   setShowCallModal(false);
//                   // Handle call logic here
//                 }}
//                 className="flex-1 py-3 bg-gradient-to-r from-primary to-emotional rounded-2xl text-white font-rounded"
//               >
//                 Start Call
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Unmatch Modal */}
//       {showUnmatchModal && selectedMatch && (
//         <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4">
//             <h2 className="font-serif text-xl text-light mb-2">Unmatch {selectedMatch.name}?</h2>
//             <p className="text-light/70 text-sm mb-6">
//               This will end your chat and remove you from each other's matches.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowUnmatchModal(false)}
//                 className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   setShowUnmatchModal(false);
//                   setSelectedMatch(null);
//                 }}
//                 className="flex-1 py-3 bg-red-500 rounded-2xl text-white font-rounded"
//               >
//                 Unmatch
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagingPage;