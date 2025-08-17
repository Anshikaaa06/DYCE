const CAMPUS_VIBE_OPTIONS = [
  { id: "library-lurker", label: "Library Lurker", emoji: "📚" },
  { id: "hostel-hustler", label: "Hostel Hustler", emoji: "🏠" },
  { id: "fest-freak", label: "Fest Freak", emoji: "🎉" },
  { id: "gym-bro", label: "Gym Bro", emoji: "💪" },
  { id: "coding-ninja", label: "Coding Ninja", emoji: "🧠" },
  { id: "leetcode-grinder", label: "Leetcode Grinder", emoji: "⌨️" },
  { id: "hackathon-addict", label: "Hackathon Addict", emoji: "🚀" },
  { id: "design-geek", label: "Design Geek", emoji: "🎨" },
  { id: "campus-influencer", label: "Campus Influencer", emoji: "📱" },
  { id: "vegas-goer", label: "Vegas Goer", emoji: "🎰" },
];

const HANGOUT_SPOTS = [
  { id: "library", label: "Library", emoji: "🧠" },
  { id: "auditorium", label: "Auditorium", emoji: "🎭" },
  { id: "grounds", label: "Grounds", emoji: "🏃" },
  { id: "hostel", label: "Hostel", emoji: "🛏️" },
  { id: "startup-lab", label: "Startup Lab", emoji: "💻" },
];

const CONNECTION_INTENTS = [
  { id: "study-buddy", label: "Study Buddy", emoji: "📚" },
  { id: "fest-and-fun", label: "Fest & Fun", emoji: "🎉" },
  { id: "genuine-connection", label: "Genuine Connection", emoji: "💖" },
  { id: "just-vibing", label: "Just Vibing", emoji: "😎" },
  { id: "its-complicated", label: "It's Complicated", emoji: "🤔" },
];

const MOODS: Array<{ id: string; emoji: string; label: string; color: string }> = [
  { id: "love", emoji: "💞", label: "Looking for love", color: "text-emotional" },
  { id: "bored", emoji: "🥱", label: "Bored", color: "text-light/60" },
  { id: "flirty", emoji: "😎", label: "Flirty", color: "text-primary" },
  { id: "party", emoji: "🎉", label: "Party mode", color: "text-accent" },
  { id: "study-buddy", emoji: "📚", label: "Study buddy", color: "text-blue-400" },
  { id: "coffee-date", emoji: "☕", label: "Coffee date?", color: "text-yellow-400" },
  { id: "mysterious", emoji: "🎭", label: "Mysterious", color: "text-purple-400" },
  { id: "feeling-cute", emoji: "🌟", label: "Feeling cute", color: "text-pink-400" },
];


const PERSONALITY_TYPES = [
  { id: "INTROVERT", label: "Introvert", emoji: "🤫" },
  { id: "EXTROVERT", label: "Extrovert", emoji: "🗣️" },
  { id: "AMBIVERT", label: "Ambivert", emoji: "🎭" },
];

export { CAMPUS_VIBE_OPTIONS, HANGOUT_SPOTS, PERSONALITY_TYPES, CONNECTION_INTENTS, MOODS };
