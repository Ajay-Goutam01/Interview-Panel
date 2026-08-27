# AI Mock Interview Panel --- Frontend & Backend Architecture v1.0

**Project:** AI Mock Interview Panel with Adversarial Difficulty\
**Version:** 1.0\
**Status:** Architecture baseline\
**Frontend:** React + Vite + Tailwind CSS\
**Backend:** Node.js + Express\
**Database:** MongoDB\
**Realtime:** Socket.io\
**Cache/Session:** Redis

------------------------------------------------------------------------

# 1. Architecture Principles

The project follows these principles:

1.  Feature-based frontend organization.
2.  Module/service-based backend organization.
3.  Clear separation between business logic and AI logic.
4.  Controllers remain thin.
5.  Services contain business logic.
6.  AI orchestration remains isolated from normal CRUD logic.
7.  Database access is handled through models/repositories/services
    rather than directly from route handlers.
8.  Shared interview state is treated as a dedicated domain.
9.  Real-time interview communication uses Socket.io.
10. Security, validation and error handling are centralized.

------------------------------------------------------------------------

# 2. High-Level Architecture

``` text
                         ┌───────────────────────┐
                         │       Browser         │
                         │ React + Tailwind      │
                         └───────────┬───────────┘
                                     │
                          HTTPS / Socket.io
                                     │
                                     ↓
                         ┌───────────────────────┐
                         │     Express API       │
                         │      + Socket.io      │
                         └───────────┬───────────┘
                                     │
               ┌─────────────────────┼─────────────────────┐
               ↓                     ↓                     ↓
        ┌─────────────┐       ┌─────────────┐       ┌──────────────┐
        │ Controllers │       │  Services   │       │ AI Domain    │
        └─────────────┘       └──────┬──────┘       └──────┬───────┘
                                     │                      │
                                     │             ┌────────┴─────────┐
                                     │             │ Orchestrator     │
                                     │             │ Agents           │
                                     │             │ Memory           │
                                     │             │ Adversarial      │
                                     │             │ Evaluation       │
                                     │             │ Difficulty       │
                                     │             └────────┬─────────┘
                                     │                      │
                         ┌───────────┴──────────────────────┴───────────┐
                         ↓                       ↓                       ↓
                    MongoDB                   Redis                 Vector DB
                         │
                         ├── Object Storage
                         ├── LLM Provider
                         ├── Speech Services
                         └── Code Execution Service
```

------------------------------------------------------------------------

# 3. Frontend Architecture

## 3.1 Frontend Responsibilities

The frontend is responsible for:

-   Rendering UI.
-   Managing user interaction.
-   Managing local UI state.
-   Calling backend APIs.
-   Maintaining authenticated session state.
-   Maintaining interview-room state.
-   Receiving realtime events.
-   Displaying AI responses.
-   Showing analytics.
-   Handling form validation.
-   Managing loading/error states.

The frontend should not contain:

-   AI decision-making.
-   Secret API keys.
-   Database logic.
-   LLM prompts.
-   Evaluation logic.
-   Interview orchestration rules.

Those belong to the backend.

------------------------------------------------------------------------

# 4. Frontend Folder Structure

``` text
client/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │   ├── providers.jsx
│   │   └── store.js
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── common/
│   │   └── feedback/
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   ├── resume/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   ├── interview/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── state/
│   │   │   └── utils/
│   │   │
│   │   ├── coding/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   ├── analytics/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   ├── roadmap/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   ├── profile/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── state/
│   │   │
│   │   └── notifications/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── state/
│   │
│   ├── hooks/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── socket.js
│   │   └── interceptors.js
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   └── styles/
│
├── .env
├── package.json
└── vite.config.js
```

------------------------------------------------------------------------

# 5. Frontend Feature Responsibilities

## 5.1 Auth

Pages:

-   Login
-   Register
-   Forgot Password
-   Reset Password

Responsibilities:

-   Authentication
-   Session state
-   Protected route state
-   OAuth flow

------------------------------------------------------------------------

## 5.2 Dashboard

Shows:

-   Placement readiness
-   Recent interviews
-   Score trend
-   Weak topics
-   Strong topics
-   Active roadmap
-   Quick-start interview

------------------------------------------------------------------------

## 5.3 Resume

Pages:

-   Resume list
-   Resume upload
-   Resume details
-   Resume analysis

Components:

-   Upload area
-   Resume preview
-   Skill cards
-   Claim cards
-   Analysis score
-   Strength/weakness sections

------------------------------------------------------------------------

# 6. Interview Feature Architecture

This is the most important frontend feature.

``` text
interview/
├── pages/
│   ├── InterviewSetup.jsx
│   ├── InterviewLobby.jsx
│   ├── InterviewRoom.jsx
│   └── InterviewComplete.jsx
│
├── components/
│   ├── PanelHeader.jsx
│   ├── AgentAvatar.jsx
│   ├── QuestionCard.jsx
│   ├── AnswerInput.jsx
│   ├── VoiceRecorder.jsx
│   ├── Transcript.jsx
│   ├── InterviewTimer.jsx
│   ├── DifficultyIndicator.jsx
│   ├── InterviewProgress.jsx
│   ├── AgentTransition.jsx
│   ├── ProcessingIndicator.jsx
│   └── InterviewWarning.jsx
│
├── hooks/
│   ├── useInterview.js
│   ├── useInterviewSocket.js
│   ├── useInterviewTimer.js
│   └── useVoiceInterview.js
│
├── services/
│   └── interviewService.js
│
├── state/
│   └── interviewStore.js
│
└── utils/
    ├── interviewFormatters.js
    └── interviewConstants.js
```

------------------------------------------------------------------------

# 7. Interview Room State

Frontend state should track:

``` text
interviewId
status
currentAgent
currentStage
currentQuestion
questionHistory
currentAnswer
processing
difficulty
questionCount
timeRemaining
transcript
voiceState
error
```

The frontend should display the state but **must not be the source of
truth** for interview decisions.

The backend remains authoritative.

------------------------------------------------------------------------

# 8. Frontend State Strategy

Use state at three levels:

## Local Component State

For:

-   Input values
-   Modal state
-   UI toggles
-   Temporary form state

## Feature State

For:

-   Interview state
-   Resume state
-   Dashboard data
-   Coding state

## Global State

For:

-   Authenticated user
-   Theme
-   Global notifications
-   Application-wide state

Do not put every API response into global state.

------------------------------------------------------------------------

# 9. API Service Layer

Frontend services communicate with backend APIs.

Example organization:

``` text
services/
├── api.js
├── authService.js
├── resumeService.js
├── interviewService.js
├── codingService.js
├── analyticsService.js
├── roadmapService.js
└── notificationService.js
```

Feature-specific services can alternatively remain inside each feature.

The important rule is:

**Components should not directly construct raw Axios requests.**

------------------------------------------------------------------------

# 10. Socket.io Frontend Architecture

Connection flow:

``` text
Login
 ↓
Authenticated User
 ↓
Socket Connection
 ↓
Join Interview Room
 ↓
Receive Events
 ↓
Update Interview State
 ↓
Render UI
```

Room:

``` text
interview:<interviewId>
```

Important events:

``` text
interview:state
interview:processing
interview:question
interview:evaluation
interview:difficulty
interview:agent
interview:warning
interview:completed
interview:error
```

------------------------------------------------------------------------

# 11. Backend Architecture

## Backend Responsibilities

Backend owns:

-   Authentication
-   Authorization
-   Database operations
-   Resume processing
-   Interview orchestration
-   AI calls
-   AI agents
-   Shared memory
-   Adversarial engine
-   Difficulty engine
-   Evaluation
-   Coding-service integration
-   Voice-service integration
-   Analytics
-   Notifications
-   Admin functionality

------------------------------------------------------------------------

# 12. Backend Folder Structure

``` text
server/
│
├── config/
│   ├── db.js
│   ├── redis.js
│   ├── ai.js
│   └── storage.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── resume.controller.js
│   ├── interview.controller.js
│   ├── question.controller.js
│   ├── answer.controller.js
│   ├── evaluation.controller.js
│   ├── coding.controller.js
│   ├── roadmap.controller.js
│   ├── analytics.controller.js
│   ├── notification.controller.js
│   └── admin.controller.js
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── resume.service.js
│   ├── interview.service.js
│   ├── question.service.js
│   ├── answer.service.js
│   ├── evaluation.service.js
│   ├── coding.service.js
│   ├── roadmap.service.js
│   ├── analytics.service.js
│   ├── notification.service.js
│   └── usage.service.js
│
├── models/
│   ├── user.model.js
│   ├── resume.model.js
│   ├── interview.model.js
│   ├── interviewSession.model.js
│   ├── question.model.js
│   ├── answer.model.js
│   ├── evaluation.model.js
│   ├── interviewClaim.model.js
│   ├── contradiction.model.js
│   ├── codingAttempt.model.js
│   ├── roadmap.model.js
│   ├── notification.model.js
│   └── aiUsage.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── resume.routes.js
│   ├── interview.routes.js
│   ├── coding.routes.js
│   ├── evaluation.routes.js
│   ├── roadmap.routes.js
│   ├── analytics.routes.js
│   ├── notification.routes.js
│   └── admin.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── admin.middleware.js
│   ├── error.middleware.js
│   ├── validate.middleware.js
│   ├── upload.middleware.js
│   └── rateLimit.middleware.js
│
├── validations/
│   ├── auth.validation.js
│   ├── user.validation.js
│   ├── resume.validation.js
│   ├── interview.validation.js
│   ├── answer.validation.js
│   ├── coding.validation.js
│   └── roadmap.validation.js
│
├── sockets/
│   ├── socket.server.js
│   ├── interview.socket.js
│   └── socket.auth.js
│
├── ai/
│   ├── agents/
│   │   ├── hr.agent.js
│   │   ├── technical.agent.js
│   │   └── skeptical.agent.js
│   │
│   ├── orchestrator/
│   │   ├── interview.orchestrator.js
│   │   ├── agent.selector.js
│   │   └── stage.manager.js
│   │
│   ├── memory/
│   │   ├── context.builder.js
│   │   ├── memory.service.js
│   │   └── summary.service.js
│   │
│   ├── adversarial/
│   │   ├── adversarial.engine.js
│   │   ├── contradiction.engine.js
│   │   └── claim.verifier.js
│   │
│   ├── evaluation/
│   │   ├── answer.evaluator.js
│   │   ├── scoring.engine.js
│   │   └── final.evaluator.js
│   │
│   ├── difficulty/
│   │   └── difficulty.engine.js
│   │
│   ├── resume/
│   │   ├── resume.parser.js
│   │   ├── resume.analyzer.js
│   │   └── claim.extractor.js
│   │
│   ├── rag/
│   │   ├── embeddings.service.js
│   │   ├── retrieval.service.js
│   │   └── knowledge.service.js
│   │
│   └── prompts/
│       ├── hr.prompts.js
│       ├── technical.prompts.js
│       ├── skeptical.prompts.js
│       ├── evaluation.prompts.js
│       └── system.prompts.js
│
├── utils/
│   ├── logger.js
│   ├── asyncHandler.js
│   ├── apiError.js
│   ├── apiResponse.js
│   └── constants.js
│
├── app.js
├── server.js
├── package.json
└── .env
```

------------------------------------------------------------------------

# 13. Backend Request Flow

Standard CRUD request:

``` text
Request
  ↓
Route
  ↓
Authentication Middleware
  ↓
Validation Middleware
  ↓
Controller
  ↓
Service
  ↓
Model / External Service
  ↓
Service Result
  ↓
Controller Response
```

Controllers should remain thin.

------------------------------------------------------------------------

# 14. AI Request Flow

AI interview request:

``` text
Request / Socket Event
        ↓
Authentication
        ↓
Interview Controller/Socket
        ↓
Interview Service
        ↓
Interview Orchestrator
        ↓
Context Builder
        ↓
Shared Memory
        ↓
Agent Selector
        ↓
Selected AI Agent
        ↓
LLM Provider
        ↓
Structured AI Output
        ↓
Adversarial Analysis
        ↓
Evaluation
        ↓
Difficulty Engine
        ↓
Next Agent Selection
        ↓
Next Question
        ↓
Persist State
        ↓
Socket Event / API Response
```

------------------------------------------------------------------------

# 15. Controller Responsibilities

Controllers should:

-   Receive request.
-   Validate basic request availability.
-   Call service.
-   Return response.
-   Pass errors to middleware.

Controllers should NOT:

-   Build large prompts.
-   Query multiple databases directly.
-   Contain interview decision logic.
-   Evaluate AI responses.
-   Select agents.
-   Calculate difficulty.

------------------------------------------------------------------------

# 16. Service Responsibilities

Services contain business logic.

Examples:

### Interview Service

-   Create interview
-   Start interview
-   End interview
-   Get interview
-   Coordinate with orchestrator

### Resume Service

-   Upload metadata
-   Parse resume
-   Save analysis
-   Manage resume state

### Evaluation Service

-   Persist evaluation
-   Generate final evaluation
-   Calculate final metrics

------------------------------------------------------------------------

# 17. AI Domain Responsibilities

The `ai/` directory contains the intelligence system.

## Agents

Responsible for persona-specific behavior.

## Orchestrator

Responsible for interview-level decisions.

## Memory

Responsible for context construction and conversation summaries.

## Adversarial

Responsible for claims, contradictions and challenge generation.

## Evaluation

Responsible for answer and interview scoring.

## Difficulty

Responsible for difficulty changes.

## RAG

Responsible for semantic retrieval.

## Prompts

Responsible for versioned prompt definitions.

------------------------------------------------------------------------

# 18. AI Layer Isolation Rule

Normal backend services should never contain long AI prompts or complex
agent logic.

Bad:

``` text
interview.controller.js
→ giant prompt
→ LLM call
→ parse response
→ decide agent
→ save database
```

Good:

``` text
interview.controller
        ↓
interview.service
        ↓
interview.orchestrator
        ↓
agent
        ↓
LLM
```

This makes the system testable and maintainable.

------------------------------------------------------------------------

# 19. Redis Architecture

Redis will handle:

-   Active interview state
-   Temporary context
-   Rate limits
-   Caching
-   Distributed locks where needed
-   Short-lived processing state

Suggested key patterns:

``` text
interview:session:<interviewId>
interview:context:<interviewId>
rate:user:<userId>
lock:interview:<interviewId>
cache:resume:<resumeId>
```

TTL should be applied to temporary data.

------------------------------------------------------------------------

# 20. MongoDB Responsibilities

MongoDB stores persistent business state:

``` text
users
resumes
interviews
questions
answers
evaluations
interviewClaims
contradictions
codingAttempts
roadmaps
notifications
aiUsages
```

------------------------------------------------------------------------

# 21. Vector Database Responsibilities

Vector DB stores/retrieves semantic knowledge:

``` text
DSA concepts
DBMS concepts
OS concepts
CN concepts
OOP concepts
System Design
HR knowledge
Role-specific interview knowledge
```

Flow:

``` text
Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Relevant Documents
 ↓
Context Builder
 ↓
LLM
```

------------------------------------------------------------------------

# 22. External Service Boundaries

## LLM Provider

Used for:

-   Resume analysis
-   Question generation
-   Follow-ups
-   Evaluation
-   Adversarial reasoning
-   Roadmap generation

## Speech Services

Used for:

-   Speech-to-text
-   Text-to-speech

## Code Execution

Used for:

-   Running candidate code
-   Test cases
-   Execution metrics

Candidate code must run outside the main Node.js process.

## Object Storage

Used for:

-   Resume PDFs
-   Audio files

------------------------------------------------------------------------

# 23. Environment Configuration

Example:

``` text
NODE_ENV=
PORT=
MONGO_URI=
REDIS_URL=
JWT_SECRET=
JWT_EXPIRES_IN=

LLM_API_KEY=
LLM_MODEL=

VECTOR_DB_URL=
VECTOR_DB_API_KEY=

STORAGE_URL=
STORAGE_PUBLIC_KEY=
STORAGE_PRIVATE_KEY=

STT_API_KEY=
TTS_API_KEY=

CODE_EXECUTION_URL=
CODE_EXECUTION_KEY=

CLIENT_URL=
```

Secrets must never be committed to Git.

------------------------------------------------------------------------

# 24. Error Handling Architecture

Global middleware:

``` text
Request
 ↓
Error occurs
 ↓
next(error)
 ↓
error.middleware
 ↓
Normalize Error
 ↓
Log Internal Details
 ↓
Return Safe Client Response
```

AI errors should be categorized:

``` text
AI_TIMEOUT
AI_PROVIDER_ERROR
AI_INVALID_RESPONSE
AI_RATE_LIMIT
AI_CONTEXT_ERROR
```

------------------------------------------------------------------------

# 25. Logging

Production logging should capture:

-   Request ID
-   User ID when available
-   Route
-   Status code
-   Latency
-   Error type
-   AI provider/model
-   AI latency
-   AI token usage

Never log:

-   Passwords
-   JWT secrets
-   API keys
-   Sensitive private credentials

------------------------------------------------------------------------

# 26. Testing Architecture

Testing should cover:

## Unit Tests

-   Difficulty engine
-   Agent selector
-   Claim matching
-   Contradiction logic
-   Scoring engine
-   Utility functions

## Integration Tests

-   Auth APIs
-   Resume APIs
-   Interview APIs
-   Evaluation APIs
-   Coding APIs

## AI Tests

-   Structured output validation
-   Prompt regression tests
-   Follow-up quality
-   Contradiction scenarios
-   Adversarial scenarios

## End-to-End

``` text
Register
 ↓
Upload Resume
 ↓
Analyze
 ↓
Create Interview
 ↓
Start
 ↓
Answer
 ↓
AI Follow-up
 ↓
Complete
 ↓
Evaluation
 ↓
Roadmap
```

------------------------------------------------------------------------

# 27. Development Rules

1.  Write code feature-by-feature.
2.  Keep controllers thin.
3.  Keep business logic in services.
4.  Keep AI logic inside `ai/`.
5.  Never expose secrets to frontend.
6.  Validate every input.
7.  Verify resource ownership.
8.  Never trust client-side scores/state.
9.  Keep interview state authoritative on backend.
10. Commit after each stable milestone.
11. Do not add unrelated features.
12. Refactor only when justified by complexity, correctness or
    maintainability.

------------------------------------------------------------------------

# 28. Implementation Order

## Step 1

Repository + client/server structure.

## Step 2

Backend:

-   Express
-   Environment
-   MongoDB
-   Error handling
-   Basic middleware

## Step 3

Authentication:

-   User model
-   Register
-   Login
-   JWT
-   Auth middleware
-   `/auth/me`

## Step 4

Frontend:

-   React
-   Tailwind
-   Routing
-   Auth state
-   Protected routes
-   API layer

## Step 5

Resume:

-   Upload
-   Storage
-   Parsing
-   Analysis

## Step 6

Interview:

-   Interview model
-   Create interview
-   Start interview
-   Interview session
-   Question/answer flow

## Step 7

AI:

-   LLM integration
-   HR agent
-   Technical agent
-   Skeptical agent
-   Orchestrator

## Step 8

Intelligence:

-   Shared memory
-   Adversarial engine
-   Contradiction detection
-   Adaptive difficulty

## Step 9

Evaluation:

-   Answer evaluation
-   Final evaluation
-   Hiring verdict

## Step 10

Advanced:

-   RAG
-   Coding
-   Voice

## Step 11

Product:

-   Analytics
-   Roadmap
-   Readiness
-   Notifications
-   Admin

## Step 12

Production:

-   Redis optimization
-   Security
-   Testing
-   Docker
-   CI/CD
-   Deployment

------------------------------------------------------------------------

# 29. Architecture Freeze

The following are now the baseline architecture:

``` text
Frontend
→ React + Vite + Tailwind

Backend
→ Node.js + Express

Database
→ MongoDB

Realtime
→ Socket.io

Cache / Active State
→ Redis

Semantic Search
→ Vector DB

AI
→ LLM + Embeddings + RAG

Files
→ Object Storage

Code Execution
→ Isolated External Service
```

Internal implementation details may be refined when necessary for
correctness, security or performance.

------------------------------------------------------------------------

# 30. Next Architecture Document

The next critical design is:

**AI ORCHESTRATION ARCHITECTURE**

It will define:

-   Interview state machine
-   Agent selection
-   Shared memory
-   Context builder
-   Agent contracts
-   Prompt architecture
-   Adversarial engine
-   Contradiction detection
-   Difficulty algorithm
-   Evaluation pipeline
-   Structured LLM outputs
-   AI failure handling
-   Token/context management
-   Multi-agent flow

This is the core technical differentiator of the project.
