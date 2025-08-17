import React from "react";
import {
  Heart,
  Sparkles,
  Bubbles,
  MessageCircle,
  School,
  GraduationCap,
  X,
} from "lucide-react";
import { cn, getConnectionIntent } from "@/lib/utils";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { MatchesItemType } from "@/app/(protected)/my-matches/page";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";

const MyMatchesModal = ({
  profile,
  showProfileModal,
  setShowProfileModal,
}: {
  profile: MatchesItemType;
  setMatchId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowUnmatchModal: React.Dispatch<React.SetStateAction<boolean>>;
  showProfileModal: boolean;
  setShowProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  return (
    <>
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent
          showCloseButton={false}
          className="w-full overflow-y-auto max-h-[90vh] bg-glassmorphism rounded-3xl p-0" 
          title="Profile Details"
        >
          <DialogClose asChild>
            <div className="absolute top-4 right-4 z-10">
              <button className="p-2 bg-dark/50 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogClose>
          <div
            className={cn(
              `relative bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden cursor-grab active:cursor-grabbing transition-transform duration-300`
            )}
          >
            {/* Profile Image */}
            <div className="relative h-[80vh] bg-gradient-to-br from-primary/20 to-emotional/20">
              <Swiper
                modules={[Pagination]}
                onTouchStart={(s, e) => e.stopPropagation()}
                onTouchEnd={(s, e) => e.stopPropagation()}
                onTouchMove={(s, e) => e.stopPropagation()}
                slidesPerView={1}
                loop
                pagination={{ clickable: true }}
              >
                {profile.user.profileImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative h-[80vh] ">
                      <Image
                        src={`${image.url}`}
                        alt={profile.user.name}
                        fill
                        className="w-full h-full object-cover "
                        priority
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="absolute top-4 left-4 gap-2 flex items-center z-10">
                <button
                  onClick={() => router.push("/messages")}
                  className="p-2 bg-dark/50 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                {/* <button
                  onClick={() => {
                    setMatchId(profile.id);
                    setShowUnmatchModal(true);
                  }}
                  className="p-2 bg-red-400 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
                >
                  <HeartCrack className="w-4 h-4" />
                </button> */}
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="rounded-2xl p-4">
                  <div className="bg-emotional/20 px-2 py-1 rounded-full text-emotional text-[13px] font-bold w-max font-rounded mb-2">
                    {profile.user.currentMood}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-xl text-light">
                      {profile.user.name}, {profile.user.age}
                    </h3>
                  </div>
                  <h2 className="text-light/80 text-md font-medium mb-2 flex items-center gap-3">
                    <School size={20} fontWeight={800} />
                    {profile.user.college}
                  </h2>
                  <h2 className="text-light/80 text-md font-medium mb-2 flex items-center gap-3">
                    <GraduationCap size={27} fontWeight={800} />
                    {profile.user.branch}
                  </h2>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              {/* Vibe Score */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-rounded font-medium text-white">
                    Compatibilty Score
                  </span>
                </div>
                <div className="text-primary font-bold text-lg capitalize">
                  {profile.compatibility}%
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-light/80 text-sm font-medium mb-2">
                  About me
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {profile.user.height} cm
                  </span>
                  <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {getConnectionIntent(profile.user.connectionIntent!)?.label}
                  </span>
                  <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {profile.user.personalityType}
                  </span>
                  {profile.user.hangoutSpot && (
                    <span className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded">
                      {profile.user.hangoutSpot}
                    </span>
                  )}
                  {profile.user.campusVibeTags.length > 0 &&
                    profile.user.campusVibeTags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-accent/15 text-accent px-4 py-1.5 rounded-full text-[13px] font-rounded"
                      >
                        {tag.split("-").join(" ")}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-light/80 text-sm font-medium mb-2">
                  I&apos;m looking for
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emotional/15 text-emotional px-4 py-1.5 rounded-full text-[13px] font-rounded">
                    {profile.user.connectionIntent?.split("-").join(" ")}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-light/80 text-sm font-medium mb-2">
                  My interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.user.interests.length > 0 &&
                    profile.user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-primary/15 text-primary px-4 py-1.5 rounded-full text-[13px] font-rounded"
                      >
                        {interest.split("-").join(" ")}
                      </span>
                    ))}
                  {profile.user.favoriteArtist &&
                    profile.user.favoriteArtist.map((favArtist, index) => (
                      <span
                        key={index}
                        className="bg-primary/15 text-primary px-4 py-1.5 rounded-full text-[13px] font-rounded"
                      >
                        {favArtist.split("-").join(" ")}
                      </span>
                    ))}
                </div>
              </div>

              {/* Fun Prompts */}
              <div className="space-y-4">
                {profile.user.funPrompt1 && (
                  <div className="bg-dark/5 backdrop-blur-sm rounded-3xl p-6 border border-dark/10 shadow-md shadow-dark/70">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="w-5 h-5 text-emotional" />
                      <h3 className="font-sans font-semibold text-lg text-light">
                        Ideal first date would be...
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                        <p className="text-light/80 text-sm mb-2 italic">
                          &quot;{profile.user.funPrompt1}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {profile.user.funPrompt2 && (
                  <div className="bg-dark/5 backdrop-blur-sm rounded-3xl p-6 border border-dark/10 shadow-md shadow-dark/70">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-emerald-500" />
                      <h3 className="font-sans font-semibold text-lg text-light">
                        Chai or Coffee...
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                        <p className="text-light/80 text-sm mb-2 italic">
                          &quot;{profile.user.funPrompt2}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {profile.user.funPrompt3 && (
                  <div className="bg-dark/5 backdrop-blur-sm rounded-3xl p-6 border border-dark/10 shadow-md shadow-dark/70">
                    <div className="flex items-center gap-2 mb-4">
                      <Bubbles className="w-5 h-5 text-primary" />
                      <h3 className="font-sans font-semibold text-lg text-light">
                        I can&apos;t stop talking about...
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
                        <p className="text-light/80 text-sm mb-2 italic">
                          &quot;{profile.user.funPrompt3}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyMatchesModal;

//   <Swiper slidesPerView={1} centeredSlides grabCursor>
//     {profiles.map((profile, ind) => (
//       <SwiperSlide key={ind}>
//         <div
//           className={cn(
//             `relative bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden cursor-grab active:cursor-grabbing transition-transform duration-300`
//           )}
//         >
//           {/* Profile Image */}
//           <div className="relative h-96 bg-gradient-to-br from-primary/20 to-emotional/20">
//             <Swiper
//               modules={[Pagination]}
//               onTouchStart={(s, e) => e.stopPropagation()}
//               onTouchEnd={(s, e) => e.stopPropagation()}
//               onTouchMove={(s, e) => e.stopPropagation()}
//               slidesPerView={1}
//               loop
//               pagination={{ clickable: true }}
//             >
//               {profile.user.profileImages.map((image, index) => (
//                 <SwiperSlide key={index}>
//                   <div className="relative h-96">
//                     <Image
//                       src={`${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}`}
//                       alt={profile.user.name}
//                       fill
//                       className="w-full h-full object-cover"
//                       priority
//                     />
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             <div className="absolute top-4 right-4 gap-2 flex items-center z-10">
//               <button
//                 onClick={() => router.push("/messages")}
//                 className="p-2 bg-dark/50 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
//               >
//                 <MessageCircle className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => {
//                   setMatchId(profile.id);
//                   setShowUnmatchModal(true);
//                 }}
//                 className="p-2 bg-red-400 backdrop-blur-sm rounded-full text-light/70 hover:text-light transition-colors"
//               >
//                 <HeartCrack className="w-4 h-4" />
//               </button>
//             </div>
//             <div className="absolute bottom-4 left-4 right-4 z-10">
//               <div className="bg-dark/70 backdrop-blur-sm rounded-2xl p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="font-sans font-bold text-xl text-light">
//                     {profile.user.name}, {profile.user.age}
//                   </h3>
//                   <div className="flex items-center gap-2">
//                     <div className="bg-primary/20 px-2 py-1 rounded-full text-primary text-xs font-rounded">
//                       {profile.user.college}
//                     </div>
//                     <div className="bg-primary/20 px-2 py-1 rounded-full text-primary text-xs font-rounded">
//                       {profile.user.currentMood}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="bg-amber-400/20 px-2 py-1 rounded-full text-amber-400 text-xs font-rounded">
//                     {profile.user.height} cm
//                   </div>
//                   {profile.user.branchVisible && (
//                     <div className="bg-accent/20 px-2 py-1 rounded-full text-accent text-xs font-rounded">
//                       {profile.user.branch}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Profile Details */}
//           <div className="p-6">
//             {/* Vibe Score */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <Sparkles className="w-5 h-5 text-primary" />
//                 <span className="font-rounded font-medium">
//                   Compatibilty Score
//                 </span>
//               </div>
//               <div className="text-primary font-bold text-lg capitalize">
//                 {profile.compatibility}%
//               </div>
//             </div>

//             {/* Connection Type */}
//             <div className="mb-4">
//               <h4 className="text-light/80 text-sm font-medium mb-2">
//                 Looking for
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 <span className="bg-emotional/20 text-emotional px-3 py-1 rounded-full text-xs font-rounded">
//                   {
//                     getConnectionIntent(profile.user.connectionIntent!)
//                       ?.label
//                   }
//                 </span>
//               </div>
//             </div>

//             {/* Campus Vibes TAgs */}
//             <div className="mb-4">
//               <h4 className="text-light/80 text-sm font-medium mb-2">
//                 Campus Vibes
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {profile.user.campusVibeTags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-rounded"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Interests */}
//             <div className="mb-6">
//               <h4 className="text-light/80 text-sm font-medium mb-2">
//                 Interests
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {profile.user.interests.map((interest, index) => (
//                   <span
//                     key={index}
//                     className="bg-emotional/20 text-emotional px-3 py-1 rounded-full text-xs font-rounded"
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             {/* Hangout Spot */}
//             <div className="mb-6">
//               <h4 className="text-light/80 text-sm font-medium mb-2">
//                 Hangout Spot
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-rounded">
//                   {profile.user.hangoutSpot || "Not specified"}
//                 </span>
//               </div>
//             </div>
//             {/* Personality Type */}
//             <div className="mb-6">
//               <h4 className="text-light/80 text-sm font-medium mb-2">
//                 Personality Type
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 <span className="bg-emotional/20 text-emotional px-3 py-1 rounded-full text-xs font-rounded">
//                   {profile.user.personalityType || "Not specified"}
//                 </span>
//               </div>
//             </div>

//             {/* Fun Prompts */}
//             <div className="space-y-4">
//               <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Heart className="w-5 h-5 text-emotional" />
//                   <h3 className="font-sans font-semibold text-lg text-light">
//                     Ideal first date would be...
//                   </h3>
//                 </div>
//                 <div className="space-y-4">
//                   {profile.user.funPrompt1 ? (
//                     <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
//                       <p className="text-light/80 text-sm mb-2 italic">
//                         &quot;{profile.user.funPrompt1}&quot;
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="text-light/80 text-sm mb-2 italic px-4">
//                       Not Specified.
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
//                 <div className="flex items-center gap-2 mb-4">
//                   <MessageCircle className="w-5 h-5 text-emerald-500" />
//                   <h3 className="font-sans font-semibold text-lg text-light">
//                     Chai or Coffee...
//                   </h3>
//                 </div>
//                 <div className="space-y-4">
//                   {profile.user.funPrompt2 ? (
//                     <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
//                       <p className="text-light/80 text-sm mb-2 italic">
//                         &quot;{profile.user.funPrompt2}&quot;
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="text-light/80 text-sm mb-2 italic px-4">
//                       Not Specified.
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Bubbles className="w-5 h-5 text-primary" />
//                   <h3 className="font-sans font-semibold text-lg text-light">
//                     I can&apos;t stop talking about...
//                   </h3>
//                 </div>
//                 <div className="space-y-4">
//                   {profile.user.funPrompt3 ? (
//                     <div className="bg-light/5 rounded-2xl p-4 border border-light/10">
//                       <p className="text-light/80 text-sm mb-2 italic">
//                         &quot;{profile.user.funPrompt3}&quot;
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="text-light/80 text-sm mb-2 italic px-4">
//                       Not Specified.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </SwiperSlide>
//     ))}
//   </Swiper>
