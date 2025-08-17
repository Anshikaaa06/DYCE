'use client'


import { notFound } from 'next/navigation';

export default function Page() {
  // This will block access and show the 404 page
  notFound();
}



// import React, { useEffect, useState } from "react";
// import { Dice1, MessageCircle, Unlock, Heart, Sparkles } from "lucide-react";
// import BottomNavigation from "@/components/BottomNavigation";
// import { axiosClient } from "@/lib/axios-client";
// import { toast } from "sonner";
// import { Profile } from "@/types/profile";


// interface MatchedProfile {
//     blindDateId: string;
//     partnerId: string;
//     userRevealed: boolean;
//     profile: Profile | null;
// }

// type GameState = "initial" | "spinning" | "matched";

// const mockProfiles = [
//     "👤",
//     "👥",
//     "👫"
// ];

// const BlindDate: React.FC = () => {
//   const [gameState, setGameState] = useState<GameState>("initial");
//   const [matchedProfile, setMatchedProfile] = useState<MatchedProfile | null>(null);

//   const startBlindDate = async () => {
//     setGameState("spinning");

//     try {
//         const resp = await axiosClient.post('/blind-date/start')
//         if (resp.data.success) {
//             setMatchedProfile({...resp.data.data, userRevealed: false, profile: null});
//             setGameState("matched");
//         } else {
//             console.error("Failed to start blind date:", resp.data.message);
//             setGameState("initial");
//         }
//     } catch (error) {
//         console.error("Error starting blind date:", error);
//         toast.error("Failed to start blind date. Please try again.");
//         setGameState("initial");
//     }

//   };

//   const revealIdentity = async () => {
//     if (!matchedProfile) {
//       toast.error("No match found to reveal identity.");
//       return;
//     }
//     // setIsUserRevealed(true);
//     try {
//       const response = await axiosClient.post(`/blind-date/${matchedProfile?.blindDateId}/reveal`);
//       if (response.data.success) {
//         setMatchedProfile(prev =>({
//           ...(prev as MatchedProfile),
//           userRevealed: response.data.data.userRevealed,
//           profile: response.data.data.partner
//         }));
//         // toast.success("Your identity has been revealed!");
//       } else {
//         toast.error("Failed to reveal identity. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error revealing identity:", error);
//       toast.error("Failed to reveal identity. Please try again.");
//     }
//   };

//   const resetGame = () => {
//     setGameState("initial");
//     setMatchedProfile(null);
//     setMatchedProfile({ userRevealed: false, ...matchedProfile } as MatchedProfile);
//   };

//   useEffect(() => {
//     const getCurrentBlindDate = async () => {
//       try {
//         const response = await axiosClient.get('/blind-date/current');
//         if (response.data.success) {
//           setMatchedProfile(response.data.data);
//           setGameState("matched");
//         } else {
//           console.error("Failed to get current blind date:", response.data.message);
//         }
//       } catch (error) {
//         console.error("Error getting current blind date:", error);
//       }
//     }
//     getCurrentBlindDate();
//   }, [])

//   return (
//     <div className="min-h-screen bg-dark">
//       <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
//         {/* Animated Background Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-br from-primary via-dark to-emotional opacity-90"></div>

//         {/* Floating Elements */}
//         <div className="absolute top-20 left-10 text-emotional text-2xl animate-bounce">
//           ✨
//         </div>
//         <div className="absolute top-32 right-16 text-primary text-xl animate-pulse">
//           💜
//         </div>
//         <div className="absolute bottom-32 left-20 text-emotional text-lg animate-bounce delay-300">
//           🌙
//         </div>
//         <div className="absolute bottom-20 right-12 text-primary text-2xl animate-pulse delay-500">
//           ⭐
//         </div>

//         <div className="relative z-10 w-full max-w-md mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="font-dm-serif text-4xl md:text-5xl text-white mb-2 flex items-center justify-center gap-2">
//               Blind Date <Dice1 className="text-emotional animate-pulse" />
//             </h1>
//             <div className="flex justify-center items-center gap-1 text-emotional text-lg">
//               <Sparkles size={16} />
//               <span className="font-poppins text-sm opacity-80">
//                 Mystery • Romance • Adventure
//               </span>
//               <Sparkles size={16} />
//             </div>
//           </div>

//           {/* Initial State */}
//           {gameState === "initial" && (
//             <div className="text-center space-y-6 animate-bounce-in">
//               <button
//                 onClick={startBlindDate}
//                 className="w-full bg-gradient-to-r from-primary to-emotional text-white py-4 px-8 rounded-2xl font-rounded text-xl font-bold transform hover:scale-105 transition-all duration-300 animate-pulse-glow shadow-2xl"
//               >
//                 Find Me a Date 🎲
//               </button>
//               <p className="text-white/80 font-poppins text-sm leading-relaxed">
//                 A 15-minute anonymous connection, no pressure.
//                 <br />
//                 <span className="text-emotional text-xs">
//                   ✨ Pure chemistry, zero judgment ✨
//                 </span>
//               </p>
//             </div>
//           )}

//           {/* Spinning Animation */}
//           {gameState === "spinning" && (
//             <div className="relative">
//               <div className="text-center mb-6">
//                 <h2 className="font-rounded text-2xl text-white mb-2">
//                   Finding your match...
//                 </h2>
//                 <div className="text-emotional font-poppins text-sm animate-pulse">
//                   🎰 The universe is choosing... 🎰
//                 </div>
//               </div>

//               {/* Roulette Container */}
//               <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 h-32 mb-4">
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"></div>

//                 {/* Spinning Profiles */}
//                 <div className="flex items-center h-full animate-spin-roulette">
//                   {mockProfiles.map(
//                     (profile, index) => (
//                       <div
//                         key={index}
//                         className="flex-shrink-0 w-24 h-24 mx-4 rounded-full bg-gradient-to-br from-primary/50 to-emotional/50 flex items-center justify-center text-3xl backdrop-blur-sm border border-white/30"
//                       >
//                         {profile}
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>

//               <div className="text-center">
//                 <div className="inline-flex items-center gap-2 text-white/60 font-poppins text-sm">
//                   <div className="w-2 h-2 bg-emotional rounded-full animate-ping"></div>
//                   <span>Matching based on vibes...</span>
//                   <div className="w-2 h-2 bg-primary rounded-full animate-ping delay-200"></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Matched State */}
//           {gameState === "matched" && matchedProfile && (
//             <div className="text-center space-y-6 animate-bounce-in">
//               {/* Match Profile */}
//               <div className="relative">
//                 <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-emotional p-1 shadow-2xl">
//                   <div className="w-full h-full rounded-full bg-dark flex items-center justify-center text-5xl relative overflow-hidden">
//                     <div
//                       className={`transition-all duration-800 ${
//                         matchedProfile.userRevealed ? "animate-reveal" : "blur-sm opacity-70"
//                       }`}
//                     >
//                       {
//                         matchedProfile.profile ? (
//                           <img src={`${matchedProfile.profile?.profileImages[0].url}`} alt={matchedProfile.profile?.name} />
//                         ) : "🦋"
//                       }
//                     </div>
//                     {!matchedProfile.userRevealed && (
//                       <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <h3 className="font-rounded text-2xl text-white flex items-center justify-center gap-2">
//                     <span
//                       className={`transition-all duration-800 ${
//                         matchedProfile.userRevealed ? "animate-reveal" : "blur-sm"
//                       }`}
//                     >
//                       {
//                         matchedProfile.profile ? matchedProfile.profile?.name : "Mystery Match"
//                       }
//                       {/* Mystery Match */}
//                     </span>
//                     {/* <span className="text-emotional">
//                       {matchedProfile.emoji}
//                     </span> */}
//                   </h3>
//                   <p className="text-white/60 font-poppins text-sm mt-1">
//                     Your mystery match
//                   </p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="space-y-4">
//                 <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-8 rounded-2xl font-rounded text-lg font-bold flex items-center justify-center gap-3 transform hover:scale-105 transition-all duration-300 shadow-xl">
//                   <MessageCircle size={24} />
//                   Start Blind Chat
//                 </button>

//                 {!matchedProfile.userRevealed && (
//                   <button
//                     onClick={revealIdentity}
//                     className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-2xl font-rounded text-md font-medium flex items-center justify-center gap-3 transform hover:scale-105 transition-all duration-300 shadow-lg"
//                   >
//                     <Unlock size={20} />
//                     Reveal Identity 🔓
//                   </button>
//                 )}

//                 <p className="text-white/70 font-poppins text-xs leading-relaxed">
//                   {matchedProfile.userRevealed ? (
//                     <span className="text-emotional">
//                       ✨ Identity revealed! If they reveal too, it becomes a
//                       real match. ✨
//                     </span>
//                   ) : (
//                     "If both reveal, it becomes a real match."
//                   )}
//                 </p>
//               </div>

//               {/* Reset Button */}
//               <button
//                 onClick={resetGame}
//                 className="text-white/50 hover:text-white font-poppins text-sm underline transition-colors duration-300"
//               >
//                 Find another match
//               </button>
//             </div>
//           )}

//           {/* Bottom Decoration */}
//           <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white/30 text-xs font-poppins">
//             <Heart size={12} className="text-emotional animate-pulse" />
//             <span>Made with mystery</span>
//             <Heart
//               size={12}
//               className="text-emotional animate-pulse delay-300"
//             />
//           </div>
//         </div>
//         <BottomNavigation />
//       </div>
//     </div>
//   );
// };

// // export default BlindDate;
