# DYCE - Campus Connection App
*Connecting Hearts & Minds at NSUT & IGDTUW*  






https://github.com/user-attachments/assets/9bf78c2c-590f-4ef8-a176-e4776776a8c4



## ✨ About DYCE

DYCE is an exclusive campus connection platform designed specifically for students of **Netaji Subhas University of Technology (NSUT)** and **Indira Gandhi Delhi Technical University for Women (IGDTUW)**. 

Our app bridges the gap between academic life and social connections, offering a safe and engaging space for students to find meaningful relationships, friendships, and connections within their campus community.

## ✨ Core Features

### 💖 Blind Dating
- **Anonymous Matching**: Connect with potential dates without revealing identities initially
- **Personality-Based Pairing**: Advanced algorithm matches based on interests, values, and compatibility
- **Safe Reveal System**: Choose when and how to share your identity

### 🎯 Smart Matchmaking
- **Compatibility Algorithm**: Sophisticated matching based on academic interests, hobbies, and personality traits
- **Multi-Dimensional Matching**: Find study partners, workout buddies, or romantic interests
- **Preference Filters**: Customize your matching criteria (year, branch, interests, relationship goals)
- **Chemistry Score**: Real-time compatibility rating based on interactions

### 🤝 Campus Connections
- **Study Groups**: Form academic circles with like-minded students
- **Event Companionship**: Find partners for campus events, fests, and activities
- **Mentorship Network**: Connect seniors with juniors for guidance and support
- **Project Collaboration**: Find teammates for hackathons, assignments, and research

### 🔒 Safety & Privacy
- **Verified Student Profiles**: Email verification with official college domains (@nsut.ac.in, @igdtuw.ac.in)
- **Report & Block System**: Comprehensive safety tools to maintain a respectful environment
- **Anonymous Chat Options**: Secure messaging with identity protection
- **Emergency Features**: Quick access to campus security and support resources

## 🎓 Exclusive to NSUT & IGDTUW

### Why Campus-Specific?
- **Shared Experiences**: Connect with students who understand your academic environment
- **Local Context**: Recommendations for campus hangouts, events, and activities
- **Academic Integration**: Find study partners in your specific courses and branches
- **Safety Through Familiarity**: Meet people within your trusted campus community
- **Event Integration**: Connect around college fests, competitions, and campus activities

### Supported Branches & Years
**NSUT:**
- Computer Science & Engineering
- Information Technology
- Electronics & Communication
- Electrical Engineering
- Mechanical Engineering
- And all other NSUT branches

**IGDTUW:**
- Computer Science & Engineering
- Information Technology
- Electronics & Communication
- And all other IGDTUW branches

## 🚀 Getting Started

### Prerequisites

```bash
- Node.js (v16.0 or higher)
- React Native CLI or Expo CLI
- Android Studio / Xcode (for mobile development)
- MongoDB or Firebase (for database)
- Git
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshikaaa06/DYCE---Campus-Connection-App.git
   cd DYCE---Campus-Connection-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables:
   ```env
   # App Configuration
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_ENVIRONMENT=development
   
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_id
   
   # Email Verification
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Image Upload
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Push Notifications
   FIREBASE_SERVER_KEY=your_firebase_server_key
   ```

4. **Start the development server**
   ```bash
   # For React Native
   npx react-native start
   npx react-native run-android  # or run-ios
   
   # For Web Version
   npm start
   ```




## 📱 App Screens & Flow

### Authentication Flow
```
Welcome Screen → College Selection (NSUT/IGDTUW) → Email Verification → Profile Creation → Interest Selection → App Home
```

### Main App Sections
1. **Discover** - Browse potential connections
2. **Matches** - View your compatibility matches
3. **Chat** - Conversations and messaging
4. **Events** - Campus events and meetups
5. **Profile** - Manage your profile and preferences

## 🎨 User Experience

### Profile Creation
- **Academic Info**: College, year, branch, interests
- **Personal Traits**: Hobbies, personality type, relationship goals
- **Photos**: Verified campus photos with optional face blur
- **Preferences**: What you're looking for (friends, study partners, dates)

### Matching Process
1. **Algorithm Analysis**: System analyzes compatibility factors
2. **Daily Suggestions**: Curated matches delivered daily
3. **Mutual Interest**: Both parties express interest to unlock chat
4. **Conversation Starters**: AI-generated icebreakers based on common interests
5. **Progress Tracking**: See how your connections develop

## 🔐 Safety Features

### Verification Process
- **College Email Verification**: Must use official @nsut.ac.in or @igdtuw.ac.in email
- **Student ID Verification**: Optional additional verification

### Community Guidelines
- **Respectful Behavior**: Zero tolerance for harassment or inappropriate behavior
- **Authentic Profiles**: Fake profiles result in immediate ban
- **Consent-Based Interactions**: All interactions require mutual consent
- **Privacy Protection**: Personal information shared only with explicit permission

## 🧪 Testing

### Test Coverage
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=matching
npm test -- --testPathPattern=auth
npm test -- --testPathPattern=chat

# E2E Testing
npm run test:e2e
```

### Testing Scenarios
- **Matching Algorithm**: Compatibility scoring accuracy
- **Authentication**: College email verification
- **Safety Features**: Report and block functionality
- **Real-time Chat**: Message delivery and encryption
- **Profile Management**: Data privacy and visibility controls



## 📈 Roadmap

### Phase 1 (Current) - MVP
- [x] Basic matchmaking algorithm
- [x] Secure authentication system
- [x] Anonymous chat functionality
- [x] Profile creation and management
- [x] Safety and reporting features

### Phase 2 (Q3 2024)
- [ ] Advanced matching with ML
- [ ] Video chat integration
- [ ] Campus event integration
- [ ] Group formation features
- [ ] Mentor-mentee connections

### Phase 3 (Q4 2024)
- [ ] AR campus navigation for meetups
- [ ] Voice message support
- [ ] Advanced analytics dashboard
- [ ] Integration with college management systems
- [ ] Alumni network connections

### Future Enhancements
- [ ] Cross-campus events (NSUT ↔ IGDTUW)
- [ ] Study abroad connection features
- [ ] Career networking expansion
- [ ] AI-powered conversation assistance





## 📄 Privacy & Terms

### Data Protection
- **Minimal Data Collection**: Only essential information for matching
- **Secure Storage**: Encrypted data storage and transmission
- **User Control**: Full control over data sharing and deletion
- **GDPR Compliant**: Following international privacy standards

### Community Standards
- **Respectful Communication**: Maintain dignity in all interactions
- **Authentic Representation**: Use real photos and honest profile information
- **Consent-Based Sharing**: Share personal information only with explicit consent
- **Campus Community Values**: Uphold the values of NSUT and IGDTUW

## 👨‍💻 Development Team

**Front-End Developer**
- **Anshika Prasad** - [Github](https://github.com/Anshikaaa06)
- LinkedIn: [https://www.linkedin.com/in/anshikaprasad/]

**Back-End Developer**
- **Anushka Sharma** - [Github](https://github.com/sharma-anushka)
- LinkedIn: [https://www.linkedin.com/in/anushka-sharma-423102288/]

**Full-Stack Developer**
- **Roshan Sharma** - [Github](https://github.com/RoshanSharma11)
- LinkedIn: [https://www.linkedin.com/in/theroshansharma/]

**Machine Learning Developer**
- **Avyakt Jain** - [Github](https://github.com/avyakt06jain)
- LinkedIn: [https://www.linkedin.com/in/avyakt-jain-b3042722a/]




---

<div align="center">
  <p><strong>Connecting NSUT & IGDTUW Students, One Match at a Time</strong></p>
  <p>Made with 💖 for the campus community</p>
  <p>© 2024 DYCE Campus Connection App. All rights reserved.</p>
  
  <br>
  
  
</div>
