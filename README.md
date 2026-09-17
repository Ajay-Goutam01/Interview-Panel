# 🤖 AI Interview Platform

An AI-powered interview preparation platform that simulates realistic technical, HR, behavioral, and hiring-manager interviews using resume-based personalization, multiple AI interviewer agents, voice interaction, and automated candidate evaluation.

The platform allows candidates to upload their resume, create personalized interviews, answer questions using text or voice, and receive AI-powered feedback and performance analysis.

---

## 📌 Overview

The **AI Interview Platform** is designed to provide a realistic interview practice environment for candidates preparing for technical and HR interviews.

Instead of following a fixed list of questions, the platform uses the candidate's processed resume and interview configuration to generate personalized interview questions.

The system supports multiple interviewer agents:

- HR Interviewer
- Technical Interviewer
- Hiring Manager

Candidates can participate using:

- Text answers
- Voice answers

The voice pipeline uses **Sarvam AI** for speech processing, while **Gemini** is used for AI-powered interview question generation and answer evaluation.

---

# ✨ Features

## 🔐 Authentication

The platform includes a complete authentication system.

Features:

- User registration
- User login
- User logout
- Authentication using HTTP-only cookies
- JWT-based authentication
- Protected API routes
- Authentication state management
- User profile management

---

# 👤 User Profile

Users can manage their basic profile information.

Supported profile information includes:

- Name
- Email
- Phone
- Professional information

The profile information can be used as part of the interview experience and candidate context.

---

# 📄 Resume Management

Candidates can upload their resumes and use them to create personalized interviews.

### Supported Formats

- PDF
- DOC
- DOCX

### Resume Features

- Resume upload
- Resume storage
- Resume processing
- Resume parsing
- Resume claims extraction
- AI-powered resume analysis
- Resume scoring
- Resume deletion
- Processed resume retrieval

### File Limit

```text
Maximum file size: 5 MB

Resume files are stored using ImageKit.

🧠 AI Resume Analysis

After resume processing, the platform can analyze the resume using AI.

The system extracts relevant information such as:

Candidate skills
Experience
Projects
Education
Resume claims
Professional information

The AI analysis can also generate an overall resume score and identify areas that can be improved.

🎯 AI Interview System

Candidates can create interviews based on their requirements.

Interview Types
HR Interview

Focuses on:

Introduction
Career goals
Motivation
Work experience
Behavioral questions
Workplace situations
Communication
Technical Interview

Focuses on:

Programming
Technical concepts
Computer Science fundamentals
Projects
Technical experience
Problem solving
Behavioral Interview

Focuses on:

Situational questions
Decision making
Teamwork
Conflict handling
Leadership
Workplace behavior
Full Interview

The full interview combines multiple interviewer agents.

Typical flow:

HR Interviewer
      ↓
Technical Interviewer
      ↓
Hiring Manager
🎚️ Interview Difficulty

The platform supports different difficulty levels:

Easy
Medium
Hard
Expert

The selected difficulty is used by the interview engine while generating questions.

🌐 Interview Languages

Supported interview languages:

English
Hindi
Hinglish

The selected language is passed into the interview configuration and voice pipeline.

🤖 Multiple AI Interviewer Agents

The platform uses different AI interviewer agents depending on the selected interview type.

HR Agent

The HR interviewer focuses on candidate background, motivation, communication, and behavioral questions.

Technical Agent

The technical interviewer focuses on technical knowledge, programming, projects, and problem-solving ability.

Hiring Manager Agent

The hiring manager focuses on:

Ownership
Decision making
Leadership
Real-world scenarios
Project experience
Professional judgment
💬 Text Interview

Candidates can answer questions using a text input.

The basic interview flow is:

AI Generates Question
        ↓
Candidate Types Answer
        ↓
Answer Submitted
        ↓
AI Evaluates Answer
        ↓
Feedback Generated
        ↓
Next Question

The interview conversation is stored as part of the interview record.

🎙️ Voice Interview

The platform also supports voice-based interview answers.

Candidates can use their browser microphone to record answers.

Voice Answer Flow
Candidate Speaks
       ↓
Browser Microphone
       ↓
Audio Recording
       ↓
Backend
       ↓
Sarvam Speech-to-Text
       ↓
Transcript
       ↓
Interview Engine
       ↓
AI Evaluation
       ↓
Next Question
🗣️ Speech-to-Text

Voice transcription is implemented using:

Sarvam AI Saaras

The recorded audio is uploaded to the backend and converted into text.

The resulting transcript is then passed to the existing interview engine.

This allows voice answers to use the same evaluation pipeline as text answers.

🔊 Text-to-Speech

The platform uses:

Sarvam AI Bulbul

for AI interviewer speech generation.

The intended flow is:

AI Question
      ↓
Sarvam Bulbul
      ↓
Audio
      ↓
Frontend
      ↓
AI Interviewer Speaks
📊 Answer Evaluation

Candidate answers are evaluated by the AI interview engine.

Evaluation can include:

Score
Answer quality
Feedback
Strengths
Weaknesses

The system can provide feedback after individual answers.

🏁 Final Interview Evaluation

After the interview is completed, the system can generate a final evaluation.

The final evaluation can include:

Overall score
Technical score
Communication score
Problem-solving score
Confidence
Strengths
Weaknesses
Recommendations
Hiring recommendation

Example structure:

Overall Score
Technical Score
Communication Score
Problem Solving Score
Confidence
Strengths
Weaknesses
Recommendations
Hiring Recommendation
🔄 Complete Interview Flow
                 USER
                   │
                   ▼
              Registration
                   │
                   ▼
                 Login
                   │
                   ▼
            Upload Resume
                   │
                   ▼
           Resume Processing
                   │
                   ▼
          AI Resume Analysis
                   │
                   ▼
          Create Interview
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
      HR       Technical    Behavioral
       │           │           │
       └───────────┼───────────┘
                   │
                   ▼
             Start Interview
                   │
                   ▼
          AI Generates Question
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       Text Answer      Voice Answer
          │                 │
          │                 ▼
          │           Sarvam STT
          │                 │
          └────────┬────────┘
                   ▼
             Answer Evaluation
                   │
                   ▼
              Next Question
                   │
                   ▼
             Next AI Agent
                   │
                   ▼
           Interview Completed
                   │
                   ▼
            Final Evaluation
                   │
                   ▼
           Performance Report
🏗️ System Architecture
                         ┌──────────────────────┐
                         │      React UI        │
                         │        Vite          │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │    Express Server    │
                         │       Node.js        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │   MongoDB   │       │   ImageKit   │       │  AI Layer   │
       │             │       │             │       │   Gemini     │
       └─────────────┘       └─────────────┘       └──────┬──────┘
                                                          │
                                                          ▼
                                                 ┌────────────────┐
                                                 │ Interview Agent│
                                                 │                │
                                                 │ HR             │
                                                 │ Technical      │
                                                 │ Hiring Manager │
                                                 └───────┬────────┘
                                                         │
                                                         ▼
                                                 ┌────────────────┐
                                                 │    Sarvam AI   │
                                                 │                │
                                                 │ STT + TTS      │
                                                 └────────────────┘
🛠️ Tech Stack
Frontend
React
Vite
React Router
Tailwind CSS
Axios
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
HTTP-only Cookies
Multer
Artificial Intelligence
Google Gemini API
OpenAI-compatible SDK interface
Voice AI
Sarvam AI Saaras
Sarvam AI Bulbul
Storage
ImageKit
📁 Project Structure
AI_Interview/
│
├── client/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   │
│   │   ├── features/
│   │   │   │
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── interview/
│   │   │   ├── resume/
│   │   │   └── voice/
│   │   │
│   │   ├── services/
│   │   │
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
🔌 API Endpoints
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
User
GET    /api/users/profile
PATCH  /api/users/profile
Resume
POST   /api/resume
GET    /api/resume
GET    /api/resume/:id
POST   /api/resume/:id/process
DELETE /api/resume/:id
Interviews
GET    /api/interviews
POST   /api/interviews
GET    /api/interviews/:id
POST   /api/interviews/:id/start
POST   /api/interviews/:id/answer
Voice
POST   /api/voice/transcribe
POST   /api/voice/speech
POST   /api/voice/interviews/:id/answer

POST   /api/voice/interviews/:id/session
GET    /api/voice/interviews/:id/session
DELETE /api/voice/interviews/:id/session
⚙️ Environment Variables

Create a .env file inside the server directory.

Example:

PORT=5000

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash

SARVAM_API_KEY=your_sarvam_api_key
SARVAM_STT_MODEL=saaras:v4
SARVAM_TTS_MODEL=bulbul:v3

Important: Never commit .env files or API keys to GitHub.

▶️ Installation & Setup
1. Clone Repository
git clone <your-repository-url>
cd AI_Interview
2. Install Backend Dependencies
cd server
npm install
3. Configure Environment Variables

Create:

server/.env

Add all required credentials.

4. Start Backend
npm run dev

Backend:

http://localhost:5000
5. Install Frontend Dependencies

Open another terminal:

cd client
npm install
6. Start Frontend
npm run dev

Frontend:

http://localhost:5173
🔐 Security

The backend implements several security-related practices:

JWT authentication
HTTP-only authentication cookies
Protected API routes
User ownership validation
Environment variables for secrets
Multipart file validation
Resume file-size restrictions
Authentication middleware
📦 Resume Processing Flow
Resume Upload
      ↓
Multer
      ↓
File Validation
      ↓
ImageKit Upload
      ↓
Resume Record Created
      ↓
Resume Processing
      ↓
Text Extraction
      ↓
AI Analysis
      ↓
Resume Score
      ↓
Processed Resume
🧠 Interview Agent Flow
Create Interview
       ↓
Interview Configuration
       ↓
Resume Context
       ↓
Current Agent
       ↓
Question Generation
       ↓
Candidate Answer
       ↓
Answer Evaluation
       ↓
Follow-up / Next Question
       ↓
Agent Transition
       ↓
Final Evaluation
🎙️ Voice Architecture
                    VOICE INTERVIEW
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Candidate Voice             AI Question
              │                         │
              ▼                         ▼
         Sarvam STT                Sarvam TTS
              │                         │
              ▼                         ▼
         Transcript                 Audio
              │                         │
              └────────────┬────────────┘
                           ▼
                    Interview Engine
                           │
                           ▼
                    AI Evaluation
📊 Current Development Status
Feature	Status
Authentication	✅ Completed
User Registration	✅ Completed
User Login	✅ Completed
User Logout	✅ Completed
User Profile	✅ Completed
Resume Upload	✅ Completed
Resume Storage	✅ Completed
ImageKit Integration	✅ Completed
Resume Processing	✅ Completed
Resume Parsing	✅ Completed
Resume AI Analysis	✅ Completed
Resume Scoring	✅ Completed
Interview Creation	✅ Completed
HR Interview Agent	✅ Completed
Technical Interview Agent	✅ Completed
Hiring Manager Agent	✅ Completed
Full Interview Flow	✅ Implemented
Text Interview	✅ Completed
Answer Evaluation	✅ Completed
Final Evaluation Backend	✅ Completed
Voice Recording	✅ Completed
Sarvam Speech-to-Text	✅ Completed
Sarvam Text-to-Speech	✅ Integrated
Voice Answer Processing	✅ Completed
AI Voice Playback	🔄 In Progress
First Question Auto Playback	🔄 Pending
Gemini Reliability Handling	🔄 Pending
Final End-to-End Testing	🔄 Pending
UI/UX Final Polish	🔄 Pending
Production Deployment	🔄 Pending
🚧 Remaining Work
1. 🔊 AI Interviewer Voice Playback

The Sarvam TTS integration has been implemented on the backend.

The remaining frontend integration is to make the browser automatically play the generated AI question.

Target flow:

AI Generates Question
        ↓
Sarvam Bulbul
        ↓
Audio Generated
        ↓
Frontend Receives Audio
        ↓
Browser Plays Audio
        ↓
AI Interviewer Speaks
2. 🎤 First Question Auto Playback

After starting an interview, the first AI-generated question should automatically be converted to speech and played to the candidate.

The intended experience is:

Start Interview
      ↓
AI Interviewer Appears
      ↓
AI Speaks First Question
      ↓
Candidate Answers
3. 🧠 Gemini API Reliability

The interview question-generation and evaluation system currently uses the Gemini API.

During development, the Gemini free-tier request quota was reached.

The API returned:

429 RESOURCE_EXHAUSTED

The response indicated that the free-tier request limit for the selected model had been exceeded.

The API also returned:

503 UNAVAILABLE

when the selected model was temporarily experiencing high demand.

Because of these external API limitations, continuous end-to-end testing of the interview flow could not be completed.

This is an external API quota/availability limitation rather than a frontend voice-recording issue.

Testing will continue once the API becomes available again.

4. 🎨 UI/UX Final Polish

The core functionality is implemented, but the UI still requires a final design pass.

Planned improvements:

Premium light theme
Better dashboard design
Improved interview-room UI
Better AI interviewer section
Voice recording animations
AI speaking indicator
Better loading states
Better empty states
Better error states
Improved score visualization
Better interview result page
Responsive mobile design
Consistent typography
Consistent spacing
Improved buttons and cards

The final UI direction will use a clean, premium light theme rather than a dark interface.

5. 🧪 Complete End-to-End Testing

After the AI API becomes available again, the complete flow needs to be tested:

Register
   ↓
Login
   ↓
Upload Resume
   ↓
Process Resume
   ↓
AI Resume Analysis
   ↓
Create Interview
   ↓
Start Interview
   ↓
AI Question
   ↓
Text Answer
   ↓
Voice Answer
   ↓
Speech-to-Text
   ↓
AI Evaluation
   ↓
Follow-up Question
   ↓
Next Agent
   ↓
Interview Completion
   ↓
Final Evaluation
6. 🚀 Production Deployment

The application is currently in development.

Future deployment tasks include:

Frontend deployment
Backend deployment
Production MongoDB configuration
Production environment variables
Production CORS configuration
Secure cookie configuration
API monitoring
Error logging
Performance optimization
⚠️ Known Limitations
Gemini API

The current AI layer depends on the Gemini API.

The free-tier API may return:

429 RESOURCE_EXHAUSTED

when the request quota is exhausted.

It may also temporarily return:

503 UNAVAILABLE

when the selected model is experiencing high demand.

Scanned Resumes

Text-based resumes are supported more reliably.

Scanned or image-only PDFs may require OCR processing in a future version.

Browser Microphone

Voice interviews require:

Browser microphone permission
MediaRecorder support
A compatible browser

If microphone permission is denied, voice recording cannot work.

🔮 Future Improvements

Potential future improvements include:

Real-time voice conversation
AI interviewer speaking animation
More AI interviewer personalities
Voice emotion analysis
Speech confidence analysis
Filler-word detection
Speaking-speed analysis
Pronunciation analysis
Facial expression analysis
Real-time interview timer
Advanced analytics dashboard
Interview history
Performance comparison
Resume-to-job-description matching
Job-specific interview generation
Interview report export
PDF performance reports
AI provider fallback system
Production deployment
🧪 Development Status

This project is currently under active development.

The core platform is functional and the major application pipelines have been implemented.

Current development is focused on:

AI Reliability
      +
Voice Experience
      +
UI/UX Polish
      +
Testing
      +
Deployment
🎯 Project Goal

The goal of this project is to build a realistic AI-powered interview preparation platform that can simulate different interviewers and provide candidates with personalized interview practice based on their resumes and skills.

The platform combines:

Resume Intelligence
        +
Multi-Agent AI
        +
Voice AI
        +
Interview Evaluation
        +
Performance Analytics

to create a complete interview preparation experience.

👨‍💻 Developer

Built as a full-stack AI project using modern web technologies, AI services, and voice processing APIs.

📌 Project Status

Core Platform: 🟢 Functional

Resume Analysis: 🟢 Functional

AI Interview Engine: 🟢 Implemented

Text Interview: 🟢 Functional

Voice Recording: 🟢 Functional

Speech-to-Text: 🟢 Functional

Text-to-Speech: 🟢 Backend Integrated

AI Voice Playback: 🟡 In Progress

UI/UX: 🟡 Final Polish Pending

End-to-End Testing: 🟡 Pending AI API Availability

Production Deployment: 🔴 Pending