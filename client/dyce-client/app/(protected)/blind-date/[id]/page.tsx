"use client";


import { notFound } from 'next/navigation';

export default function Page() {
  // This will block access and show the 404 page
  notFound();
}

// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Eye, Flag, Clock, Heart, Smile, ArrowLeft, Sparkles, VenetianMask as Mask } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// interface Message {
//   id: string;
//   senderId: 'A' | 'B';
//   content: string;
//   timestamp: string;
//   type: 'text' | 'system' | 'reveal-request';
// }

// const BlindDatePage = () => {
//   const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       senderId: 'A',
//       content: 'Welcome to your blind date! You have 15 minutes to chat anonymously. Have fun! 🎭',
//       timestamp: '15:00',
//       type: 'system'
//     }
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [currentUser] = useState<'A' | 'B'>('A');
//   const [hasRequestedReveal, setHasRequestedReveal] = useState(false);
//   const [otherRequestedReveal, setOtherRequestedReveal] = useState(false);
//   const [isRevealed, setIsRevealed] = useState(false);
//   const [showEndModal, setShowEndModal] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [showRevealModal, setShowRevealModal] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);

//   const router = useRouter()

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setShowEndModal(true);
//     }
//   }, [timeLeft]);

//   // Simulate typing indicator
//   useEffect(() => {
//     const typingTimer = setInterval(() => {
//       if (Math.random() > 0.8) {
//         setIsTyping(true);
//         setTimeout(() => setIsTyping(false), 2000);
//       }
//     }, 5000);
//     return () => clearInterval(typingTimer);
//   }, []);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const message: Message = {
//       id: Date.now().toString(),
//       senderId: currentUser,
//       content: newMessage,
//       timestamp: formatTime(timeLeft),
//       type: 'text'
//     };

//     setMessages(prev => [...prev, message]);
//     setNewMessage('');

//     // Simulate response after a delay
//     setTimeout(() => {
//       const responses = [
//         "That's so interesting! Tell me more 😊",
//         "Haha, I totally get that!",
//         "Really? That's cool!",
//         "Same here! What a coincidence",
//         "I've never thought about it that way",
//         "You seem really fun to talk to!"
//       ];
      
//       const response: Message = {
//         id: (Date.now() + 1).toString(),
//         senderId: currentUser === 'A' ? 'B' : 'A',
//         content: responses[Math.floor(Math.random() * responses.length)],
//         timestamp: formatTime(timeLeft - 30),
//         type: 'text'
//       };
      
//       setMessages(prev => [...prev, response]);
//     }, 2000);
//   };

//   const requestReveal = () => {
//     setHasRequestedReveal(true);
//     const revealMessage: Message = {
//       id: Date.now().toString(),
//       senderId: currentUser,
//       content: `Stranger ${currentUser} wants to reveal identities — do you? 👀`,
//       timestamp: formatTime(timeLeft),
//       type: 'reveal-request'
//     };
//     setMessages(prev => [...prev, revealMessage]);

//     // Simulate other user's response
//     setTimeout(() => {
//       if (Math.random() > 0.3) {
//         setOtherRequestedReveal(true);
//         setShowRevealModal(true);
//       } else {
//         const declineMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           senderId: currentUser === 'A' ? 'B' : 'A',
//           content: "They'd prefer to stay anonymous. Let the mystery linger… 🎭",
//           timestamp: formatTime(timeLeft - 10),
//           type: 'system'
//         };
//         setMessages(prev => [...prev, declineMessage]);
//       }
//     }, 3000);
//   };

//   const acceptReveal = () => {
//     setIsRevealed(true);
//     setShowRevealModal(false);
//     const revealMessage: Message = {
//       id: Date.now().toString(),
//       senderId: currentUser,
//       content: "It's a match! You two just unmasked the mystery. 🎭✨",
//       timestamp: formatTime(timeLeft),
//       type: 'system'
//     };
//     setMessages(prev => [...prev, revealMessage]);
//   };

//   const declineReveal = () => {
//     setShowRevealModal(false);
//     const declineMessage: Message = {
//       id: Date.now().toString(),
//       senderId: currentUser,
//       content: "You chose to keep the mystery alive... 🎭",
//       timestamp: formatTime(timeLeft),
//       type: 'system'
//     };
//     setMessages(prev => [...prev, declineMessage]);
//   };

//   const handleEndChat = (wantToMatch: boolean) => {
//     setShowEndModal(false);
//     if (wantToMatch) {
//       // Handle match request
//       alert('Match request sent! 💜');
//     }
//     // Navigate back or to next screen
//   };

//   return (
//     <div className="h-screen bg-dark text-light flex flex-col relative overflow-hidden">
//       {/* Mysterious Background Effect */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark to-emotional/10 pointer-events-none" />
      
//       {/* Header */}
//       <div className="relative z-10 p-4 border-b border-light/10 bg-dark/80 backdrop-blur-sm">
//         <div className="flex items-center justify-between">
//           <button className="p-2 hover:bg-light/10 rounded-full transition-colors" onClick={() => router.back()}>
//             <ArrowLeft className="w-5 h-5" />
//           </button>
          
//           {/* Timer */}
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
//                 <Clock className="w-5 h-5 text-primary" />
//               </div>
//               <div 
//                 className="absolute inset-0 rounded-full border-2 border-primary transition-all duration-1000"
//                 style={{
//                   background: `conic-gradient(from 0deg, #A06CD5 ${(timeLeft / (15 * 60)) * 360}deg, transparent 0deg)`
//                 }}
//               />
//             </div>
//             <div className="text-center">
//               <div className="text-primary font-rounded font-bold text-lg">
//                 {formatTime(timeLeft)}
//               </div>
//               <div className="text-light/60 text-xs">time left</div>
//             </div>
//           </div>

//           <button
//             onClick={() => setShowReportModal(true)}
//             className="p-2 hover:bg-light/10 rounded-full transition-colors"
//           >
//             <Flag className="w-5 h-5 text-light/60" />
//           </button>
//         </div>

//         {/* Mystery Header */}
//         <div className="text-center mt-4">
//           <h1 className="font-serif text-xl text-primary mb-1">Blind Date Mode</h1>
//           <p className="text-light/70 text-sm">
//             Chat anonymously • Unmask when ready • Keep it mysterious 🎭
//           </p>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
//         {messages.map(message => (
//           <div
//             key={message.id}
//             className={`flex ${
//               message.type === 'system' 
//                 ? 'justify-center' 
//                 : message.senderId === currentUser 
//                   ? 'justify-end' 
//                   : 'justify-start'
//             }`}
//           >
//             {message.type === 'system' ? (
//               <div className="bg-light/10 backdrop-blur-sm rounded-2xl px-4 py-2 max-w-xs text-center">
//                 <p className="text-light/80 text-sm">{message.content}</p>
//               </div>
//             ) : (
//               <div className={`max-w-xs ${message.senderId === currentUser ? 'order-2' : 'order-1'}`}>
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="w-6 h-6 bg-light/20 rounded-full flex items-center justify-center">
//                     <Mask className="w-3 h-3 text-light/60" />
//                   </div>
//                   <span className="text-light/60 text-xs font-rounded">
//                     {isRevealed ? (message.senderId === 'A' ? 'Priya' : 'You') : `Stranger ${message.senderId}`}
//                   </span>
//                 </div>
//                 <div
//                   className={`p-3 rounded-2xl ${
//                     message.senderId === currentUser
//                       ? 'bg-gradient-to-r from-primary to-emotional text-white'
//                       : 'bg-light/10 text-light'
//                   }`}
//                 >
//                   <p className="text-sm">{message.content}</p>
//                 </div>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-light/50 text-xs">{message.timestamp}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex justify-start">
//             <div className="max-w-xs">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-6 h-6 bg-light/20 rounded-full flex items-center justify-center">
//                   <Mask className="w-3 h-3 text-light/60" />
//                 </div>
//                 <span className="text-light/60 text-xs font-rounded">
//                   Someone&apos;s thinking...
//                 </span>
//               </div>
//               <div className="bg-light/10 p-3 rounded-2xl">
//                 <div className="flex gap-1">
//                   <div className="w-2 h-2 bg-light/60 rounded-full animate-bounce" />
//                   <div className="w-2 h-2 bg-light/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
//                   <div className="w-2 h-2 bg-light/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Reveal Button */}
//       {!isRevealed && !hasRequestedReveal && (
//         <div className="relative z-10 px-4 py-2">
//           <button
//             onClick={requestReveal}
//             className="w-full py-3 bg-gradient-to-r from-primary/20 to-emotional/20 border border-primary/40 rounded-2xl text-primary font-rounded font-medium hover:from-primary/30 hover:to-emotional/30 transition-all duration-300 flex items-center justify-center gap-2"
//           >
//             <Eye className="w-4 h-4" />
//             👀 Ask to Reveal
//           </button>
//         </div>
//       )}

//       {/* Message Input */}
//       <div className="relative z-10 p-4 border-t border-light/10 bg-dark/80 backdrop-blur-sm">
//         <div className="flex items-center gap-3">
//           <div className="flex-1 flex items-center gap-2 bg-light/10 rounded-2xl p-3">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//               placeholder="Keep the mystery alive..."
//               className="flex-1 bg-transparent focus:outline-none text-light"
//             />
//             <button className="p-1 hover:bg-light/10 rounded-full transition-colors">
//               <Smile className="w-5 h-5 text-light/60" />
//             </button>
//           </div>
//           <button
//             onClick={sendMessage}
//             disabled={!newMessage.trim()}
//             className={`p-3 rounded-full transition-all ${
//               newMessage.trim()
//                 ? 'bg-gradient-to-r from-primary to-emotional hover:scale-105'
//                 : 'bg-light/20'
//             }`}
//           >
//             <Send className="w-5 h-5 text-white" />
//           </button>
//         </div>
//       </div>

//       {/* Reveal Modal */}
//       {showRevealModal && (
//         <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4">
//             <div className="text-center mb-6">
//               <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
//               <h2 className="font-serif text-xl text-light mb-2">Unmask the Mystery?</h2>
//               <p className="text-light/70 text-sm">
//                 Your chat partner wants to reveal identities. Ready to see who you&apos;ve been talking to?
//               </p>
//             </div>
//             <div className="flex gap-4">
//               <button
//                 onClick={declineReveal}
//                 className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
//               >
//                 Keep it cryptic
//               </button>
//               <button
//                 onClick={acceptReveal}
//                 className="flex-1 py-3 bg-gradient-to-r from-primary to-emotional rounded-2xl text-white font-rounded"
//               >
//                 Let&apos;s reveal! 👀
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* End Chat Modal */}
//       {showEndModal && (
//         <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4">
//             <div className="text-center mb-6">
//               <Clock className="w-12 h-12 text-emotional mx-auto mb-4" />
//               <h2 className="font-serif text-xl text-light mb-2">Time&apos;s Up!</h2>
//               <p className="text-light/70 text-sm">
//                 Your blind date has ended. Want to stay connected?
//               </p>
//             </div>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleEndChat(false)}
//                 className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
//               >
//                 Maybe next time
//               </button>
//               <button
//                 onClick={() => handleEndChat(true)}
//                 className="flex-1 py-3 bg-gradient-to-r from-primary to-emotional rounded-2xl text-white font-rounded flex items-center justify-center gap-2"
//               >
//                 <Heart className="w-4 h-4" />
//                 Yes, let&apos;s match!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Report Modal */}
//       {showReportModal && (
//         <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4">
//             <h2 className="font-serif text-xl text-light mb-2">Report or Block?</h2>
//             <p className="text-light/70 text-sm mb-6">
//               Help us keep DYCE safe for everyone.
//             </p>
//             <div className="space-y-3">
//               <button className="w-full py-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 font-rounded">
//                 Report inappropriate behavior
//               </button>
//               <button className="w-full py-3 bg-light/10 rounded-2xl text-light/70 font-rounded">
//                 Block this user
//               </button>
//               <button
//                 onClick={() => setShowReportModal(false)}
//                 className="w-full py-3 bg-light/5 rounded-2xl text-light/60 font-rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default BlindDatePage;