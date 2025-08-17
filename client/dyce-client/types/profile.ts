export interface Profile {
  id: string;
  name: string;
  age: number;
  college: string;
  campusVibeTags: string[];
  hangoutSpot?: string;
  branch?: string;
  branchVisible: boolean;
  height?: number;
  gender: string;
  interests: string[];
  personalityType?: "INTROVERT" | "EXTROVERT" | "AMBIVERT";
  favoriteArtist?: string[];
  funPrompt1?: string;
  funPrompt2?: string;
  funPrompt3?: string;
  connectionIntent?: string;
  currentMood?: string;
  allowComments: boolean;
  profileImages: {
    id: string;
    url: string;
    order: number;
    createdAt: string;
  }[];
}
