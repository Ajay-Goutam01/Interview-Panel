# AI Mock Interview Panel with Adversarial Difficulty

**Project Status:** Architecture & Product Scope Frozen --- v1.0\
**Project Type:** AI-powered full-stack interview preparation platform\
**Primary Stack:** React, Node.js, Express, MongoDB, Redis, Vector DB,
LLM APIs, Socket.io

------------------------------------------------------------------------

# 1. Product Overview

AI Mock Interview Panel is an intelligent interview simulation platform
where a candidate faces a panel of AI interviewers with different
personalities and objectives.

The platform contains three primary AI personas:

-   **HR Interviewer** --- behavioral skills, communication, confidence,
    culture-fit.
-   **Technical Lead** --- DSA, CS fundamentals, projects, system
    design, technical depth.
-   **Skeptical Hiring Manager** --- challenges vague claims, verifies
    resume statements, detects contradictions and performs adversarial
    follow-ups.

Unlike a normal AI chatbot, all agents operate using a **shared
interview state and memory**. The system dynamically decides what should
be asked next based on the candidate's resume, previous answers,
performance, weaknesses, contradictions, interview objectives and
current difficulty.

------------------------------------------------------------------------

# 2. Problem Statement

Most interview-preparation platforms rely on static question banks or
generic AI conversations. They often fail to maintain meaningful
interview-wide context, challenge candidate claims, detect
contradictions, adapt difficulty, simulate multiple interviewer
personalities, or provide evidence-based hiring-style feedback.

This project addresses those limitations using:

-   Multi-agent AI orchestration
-   Shared interview memory
-   Resume-grounded questioning
-   Adversarial questioning
-   Adaptive difficulty
-   Contradiction detection
-   AI answer evaluation
-   Coding assessment
-   Voice interview
-   Personalized improvement roadmap
-   Placement readiness analytics

------------------------------------------------------------------------

# 3. Target Users

## Primary Users

-   College students
-   Freshers
-   Job seekers
-   Software developers
-   Candidates preparing for technical interviews
-   Candidates preparing for HR interviews
-   Campus placement candidates

## Secondary Users

-   Placement cells
-   Coding bootcamps
-   Career-training institutes
-   Upskilling platforms

------------------------------------------------------------------------

# 4. Product Goals

1.  Simulate realistic interview environments.
2.  Personalize interviews using candidate profiles and resumes.
3.  Dynamically adapt interview difficulty.
4.  Detect vague and contradictory responses.
5.  Challenge resume claims.
6.  Evaluate technical and behavioral performance.
7.  Provide actionable feedback.
8.  Track performance over multiple interviews.
9.  Calculate placement readiness.
10. Generate personalized improvement roadmaps.

## Non-Goals

The platform does not:

-   Guarantee employment.
-   Replace professional recruiters.
-   Make real-world hiring decisions.
-   Diagnose psychological or medical conditions.
-   Treat voice characteristics as definitive evidence of candidate
    ability.

------------------------------------------------------------------------

# 5. Core USP

## Multi-Agent Interview Panel

Three AI interviewers with distinct objectives and personalities.

## Shared Interview Memory

All agents understand the relevant history of the same interview.

## Adversarial Difficulty

The system actively challenges weak, vague or unsupported claims.

## Resume-Grounded Interview

Questions can be generated from the candidate's actual resume and
projects.

## Adaptive Difficulty

Question difficulty changes according to candidate performance.

## Evidence-Based Evaluation

Final scores are based on interview evidence and evaluation signals
rather than arbitrary scores.

------------------------------------------------------------------------

# 6. Complete Feature Scope

## 6.1 User & Authentication

-   Registration
-   Login
-   Logout
-   JWT authentication
-   Google OAuth
-   Password hashing
-   Forgot password
-   Password reset
-   Protected routes
-   User profile
-   Profile completion
-   Target role
-   Experience level
-   Preferred interview difficulty

## 6.2 Resume Intelligence

Resume PDF upload with AI analysis.

Extract:

-   Name
-   Email
-   Skills
-   Technologies
-   Education
-   Experience
-   Projects
-   Achievements
-   Certifications
-   Quantifiable claims
-   Performance claims
-   Important statements

Generate:

-   Skill profile
-   Suggested interview topics
-   Resume-based questions
-   Claims requiring verification
-   Potentially vague claims

Example claim:

> "Improved API performance by 40%."

This becomes an interview claim that can later be challenged.

## 6.3 Interview Configuration

Candidate selects:

-   Target role
-   Experience level
-   Interview type
-   Difficulty
-   Duration
-   Number of questions
-   Resume-based mode
-   Text/voice/mixed mode

Interview types:

-   HR
-   Technical
-   DSA
-   Project Deep-Dive
-   System Design
-   Mixed

## 6.4 AI Interview Panel

### HR Interviewer

-   Introduction
-   Behavioral questions
-   Communication
-   Teamwork
-   Leadership
-   Conflict resolution
-   Situational questions
-   Motivation
-   Career goals

### Technical Lead

-   DSA
-   Programming
-   OOP
-   DBMS
-   Operating Systems
-   Computer Networks
-   Projects
-   System Design
-   Technical decision-making

### Skeptical Hiring Manager

-   Resume claim challenges
-   Vague-answer detection
-   Contradiction follow-ups
-   Unsupported metrics
-   Evidence-based questioning
-   Technical-depth challenges

## 6.5 Shared Interview Memory

Maintain:

-   Previous questions
-   Answers
-   Topics
-   Resume claims
-   Candidate statements
-   Scores
-   Weaknesses
-   Strengths
-   Contradictions
-   Follow-up opportunities
-   Current difficulty
-   Interview stage
-   Time remaining
-   Agent history

## 6.6 Interview Orchestrator

Central decision-making component that determines:

-   Which interviewer speaks next
-   What topic should be discussed
-   Whether a follow-up is needed
-   Whether adversarial mode activates
-   Whether difficulty changes
-   Whether a resume claim should be challenged
-   When to transition stages
-   When the interview ends

## 6.7 Adversarial Engine

Detect:

-   Vague responses
-   Contradictions
-   Unsupported claims
-   Suspicious metrics
-   Incomplete explanations
-   Incorrect technical statements
-   Resume inconsistencies
-   Previous-answer inconsistencies

Then generate targeted follow-ups.

## 6.8 Adaptive Difficulty Engine

Difficulty levels:

-   Beginner
-   Easy
-   Medium
-   Hard
-   Expert

Increase difficulty when the candidate consistently performs strongly.

Decrease difficulty when the candidate repeatedly struggles.

Signals include:

-   Answer quality
-   Technical correctness
-   Depth
-   Problem-solving
-   Consistency
-   Previous performance

## 6.9 Voice Interview

-   AI voice
-   Speech-to-text
-   Text-to-speech
-   Live transcript
-   Answer duration
-   Speaking pace
-   Filler-word detection
-   Pause detection
-   Communication analysis

Voice metrics are supporting signals only.

## 6.10 DSA Coding Round

-   Problem statement
-   Code editor
-   Java
-   C++
-   JavaScript
-   Python
-   Run code
-   Visible tests
-   Hidden tests
-   Execution time
-   Memory usage
-   Test-case results
-   Complexity analysis
-   AI code review
-   Hint-based assistance

Code execution should use an isolated execution service rather than
executing untrusted code directly inside the main backend.

## 6.11 Project Deep-Dive

Questions can cover:

-   Architecture choices
-   Database choices
-   Redis
-   Authentication
-   Scaling
-   Bottlenecks
-   Security
-   Technology alternatives
-   Failure scenarios
-   Future improvements

## 6.12 Knowledge & RAG

Knowledge domains:

-   DSA
-   DBMS
-   OS
-   CN
-   OOP
-   System Design
-   HR
-   Behavioral interviews
-   Role-specific concepts

RAG supports question generation, technical evaluation and contextual
follow-ups.

## 6.13 Answer Evaluation

Evaluate:

-   Technical correctness
-   Relevance
-   Completeness
-   Depth
-   Clarity
-   Communication
-   Confidence
-   Consistency
-   Problem solving

Each answer receives score, strengths, weaknesses, feedback and
evidence.

## 6.14 Contradiction Detection

Compare new statements against:

-   Resume
-   Previous answers
-   Previous claims
-   Project information

Potential contradictions are flagged and can trigger follow-up
questions.

## 6.15 Final Evaluation

Generate:

-   Overall score
-   Technical score
-   DSA score
-   Project score
-   Communication score
-   Problem-solving score
-   Resume credibility
-   Behavioral score
-   Confidence score

Final verdict:

-   Strong Hire
-   Hire
-   Borderline
-   No Hire

The verdict must contain supporting interview evidence.

## 6.16 Analytics Dashboard

-   Overall performance
-   Interview history
-   Skill-wise scores
-   Question-wise analysis
-   Weak topics
-   Strong topics
-   Score progression
-   Difficulty progression
-   Coding performance
-   Communication metrics
-   Resume credibility
-   Interview duration

## 6.17 AI Improvement Roadmap

Generate:

-   7-day roadmap
-   14-day roadmap
-   30-day roadmap

Each roadmap can include:

-   Topics
-   Practice tasks
-   Priority
-   Difficulty
-   Revision areas
-   Mock interview recommendations

## 6.18 Placement Readiness

Role-specific readiness score with category breakdown:

-   DSA
-   Development
-   DBMS
-   OS
-   CN
-   Projects
-   HR
-   Communication

## 6.19 Role-Based Interviews

Initial roles:

-   Frontend Developer
-   Backend Developer
-   Full Stack Developer
-   Software Engineer
-   Data Analyst
-   Data Scientist
-   DevOps Engineer

## 6.20 Interview History

Store:

-   Configuration
-   Transcript
-   Questions
-   Answers
-   Scores
-   Feedback
-   Verdict
-   Strengths
-   Weaknesses
-   Roadmap

## 6.21 Notifications

-   Resume analysis complete
-   Interview complete
-   Evaluation ready
-   Roadmap ready
-   Important account events

## 6.22 Admin Panel

-   User management
-   Interview monitoring
-   AI usage analytics
-   Failed AI request monitoring
-   Question bank management
-   Knowledge base management
-   Reported issues
-   System statistics
-   Basic moderation

## 6.23 AI Usage Management

Track:

-   Token usage
-   AI requests
-   Model usage
-   Per-user consumption
-   Interview consumption
-   Estimated cost
-   Failed requests

------------------------------------------------------------------------

# 7. High-Level User Flow

``` text
Register / Login
       ↓
Complete Profile
       ↓
Upload Resume
       ↓
AI Resume Analysis
       ↓
Select Target Role
       ↓
Configure Interview
       ↓
Interview Room
       ↓
HR / Technical / Skeptical Panel
       ↓
Shared Memory
       ↓
Adaptive + Adversarial Questions
       ↓
Evaluation
       ↓
Final Hiring Verdict
       ↓
Analytics
       ↓
Personalized Roadmap
       ↓
Retry Interview
```

------------------------------------------------------------------------

# 8. Technical Architecture

``` text
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │ React + Tailwind    │
                         │ Dashboard           │
                         │ Interview Room      │
                         │ Coding UI           │
                         └──────────┬──────────┘
                                    │ HTTPS / WebSocket
                                    ↓
                         ┌─────────────────────┐
                         │     API SERVER      │
                         │ Node + Express      │
                         │ Auth / REST APIs    │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    ↓                                ↓
          ┌─────────────────┐              ┌─────────────────┐
          │ Interview       │              │ Backend Services│
          │ Orchestrator    │              │ Auth/Resume/etc │
          └────────┬────────┘              └─────────────────┘
                   │
        ┌──────────┼───────────┐
        ↓          ↓           ↓
   ┌────────┐ ┌──────────┐ ┌────────────┐
   │   HR   │ │Technical │ │ Skeptical  │
   │ Agent  │ │  Agent   │ │  Manager   │
   └────┬───┘ └────┬─────┘ └──────┬─────┘
        └──────────┼───────────────┘
                   ↓
        ┌──────────────────────┐
        │ Shared Interview     │
        │ State + Memory       │
        └──────────┬───────────┘
                   ↓
       ┌───────────┼────────────┐
       ↓           ↓            ↓
┌────────────┐ ┌──────────┐ ┌─────────────┐
│Adversarial │ │Adaptive  │ │ Evaluation  │
│Engine      │ │Difficulty│ │ Engine      │
└────────────┘ └──────────┘ └─────────────┘
       │           │            │
       └───────────┼────────────┘
                   ↓
       ┌────────────────────────┐
       │       AI Layer         │
       │ LLM + Embeddings + RAG │
       └───────────┬────────────┘
                   │
        ┌──────────┼─────────────┐
        ↓          ↓             ↓
    MongoDB      Redis        Vector DB
        │
        ├── Object Storage
        ├── Speech Services
        └── Code Execution Service
```

------------------------------------------------------------------------

# 9. Architecture Layers

## 9.1 Presentation Layer

React application:

-   Landing page
-   Authentication
-   Dashboard
-   Resume
-   Interview configuration
-   Interview room
-   Coding editor
-   Analytics
-   Roadmap
-   Profile
-   Admin

## 9.2 API Layer

Node.js + Express:

-   Auth
-   Users
-   Resume
-   Interview
-   Question
-   Answer
-   Evaluation
-   Coding
-   Analytics
-   Roadmap
-   Notification
-   Admin

## 9.3 Interview Intelligence Layer

Contains:

-   Interview Orchestrator
-   Interview state manager
-   Agent selector
-   Topic manager
-   Follow-up manager
-   Context manager
-   Difficulty controller

## 9.4 AI Agent Layer

-   HR Agent
-   Technical Agent
-   Skeptical Agent

All receive controlled shared context.

## 9.5 Intelligence Engine

``` text
Resume Claims
      +
Previous Answers
      +
Current Answer
      +
Interview Objective
      ↓
Adversarial Engine
      ↓
Contradiction / Weakness / Gap
      ↓
Follow-up Question
```

## 9.6 Data Layer

### MongoDB

Permanent product data.

### Redis

Temporary/high-speed state.

### Vector DB

Semantic knowledge and RAG retrieval.

### Object Storage

Resume PDFs and audio files.

## 9.7 External Services

-   LLM provider
-   Embedding provider
-   Speech-to-text
-   Text-to-speech
-   Object storage
-   Code execution service

------------------------------------------------------------------------

# 10. Critical Interview Flow

Example:

``` text
Candidate:
"I optimized MongoDB and improved performance by 40%."
        ↓
Answer received
        ↓
Answer Analyzer
        ↓
Claim Matcher
        ↓
Previous Context Retrieval
        ↓
Evaluation
        ↓
Adversarial Engine
        ↓
Interview Orchestrator
        ↓
Skeptical Manager
        ↓
Follow-up Question
```

Internal decision example:

``` text
claim_found = true
claim = "40% performance improvement"
evidence_level = weak
technical_depth = medium
contradiction = false
follow_up_required = true
next_agent = skeptical_manager
difficulty = hard
```

Candidate-facing question:

> "You mentioned a 40% improvement. What was your baseline response
> time, and how exactly did you measure that improvement?"

------------------------------------------------------------------------

# 11. Database Architecture

Primary MongoDB collections:

``` text
users
resumes
interviews
interviewSessions
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

# 12. Database Schema

## 12.1 User

``` text
User
├── name
├── email
├── password
├── authProvider
├── googleId
├── phone
├── profile
│   ├── bio
│   ├── education
│   ├── experienceLevel
│   ├── targetRoles[]
│   ├── skills[]
│   └── preferredDifficulty
├── role
├── profileCompletion
├── isActive
├── lastLoginAt
├── createdAt
└── updatedAt
```

Roles:

``` text
candidate
admin
```

## 12.2 Resume

``` text
Resume
├── userId
├── file
│   ├── url
│   ├── publicId
│   └── originalName
├── parsedData
│   ├── name
│   ├── email
│   ├── education[]
│   ├── experience[]
│   ├── skills[]
│   ├── projects[]
│   ├── achievements[]
│   └── certifications[]
├── extractedClaims[]
├── aiAnalysis
│   ├── strengths[]
│   ├── weaknesses[]
│   ├── suggestedTopics[]
│   └── overallScore
├── isActive
├── createdAt
└── updatedAt
```

Actual PDF content is stored in object storage; MongoDB stores metadata
and references.

## 12.3 Interview

``` text
Interview
├── userId
├── resumeId
├── targetRole
├── experienceLevel
├── interviewType
├── difficulty
├── duration
├── questionLimit
├── mode
├── status
├── currentStage
├── panel
├── startedAt
├── completedAt
├── finalEvaluationId
├── readinessScore
├── createdAt
└── updatedAt
```

Modes:

``` text
text
voice
mixed
```

Statuses:

``` text
scheduled
in_progress
completed
abandoned
failed
```

Stages:

``` text
introduction
hr
technical
project
adversarial
coding
closing
```

## 12.4 Interview Session

``` text
InterviewSession
├── interviewId
├── userId
├── currentAgent
├── currentDifficulty
├── currentTopic
├── questionCount
├── timeRemaining
├── activeClaims[]
├── detectedWeaknesses[]
├── detectedStrengths[]
├── contradictions[]
├── conversationSummary
├── recentContext[]
├── agentHistory[]
├── lastActivityAt
└── expiresAt
```

Active state can be maintained in Redis while important state is
persisted in MongoDB.

## 12.5 Question

``` text
Question
├── interviewId
├── agentType
├── stage
├── topic
├── difficulty
├── question
├── questionType
├── basedOn
├── parentQuestionId
├── expectedConcepts[]
├── sequenceNumber
├── createdAt
└── metadata
```

`basedOn` values:

``` text
resume
previous_answer
weakness
contradiction
knowledge_base
generic
```

`questionType` values:

``` text
initial
follow_up
adversarial
behavioral
technical
coding
project
system_design
```

## 12.6 Answer

``` text
Answer
├── interviewId
├── questionId
├── userId
├── text
├── transcript
├── audioUrl
├── duration
├── submittedAt
├── evaluationId
└── metadata
```

## 12.7 Evaluation

``` text
Evaluation
├── interviewId
├── questionId
├── answerId
├── scores
│   ├── technicalCorrectness
│   ├── relevance
│   ├── completeness
│   ├── depth
│   ├── clarity
│   ├── communication
│   ├── confidence
│   └── consistency
├── strengths[]
├── weaknesses[]
├── missingConcepts[]
├── feedback
├── evidence[]
├── evaluatorModel
├── evaluatedAt
└── version
```

Keeping model and evaluation version allows old evaluations to remain
interpretable if AI models/prompts change later.

## 12.8 Interview Claim

Core adversarial-engine entity:

``` text
InterviewClaim
├── userId
├── resumeId
├── interviewId
├── source
├── claimText
├── claimType
├── value
├── unit
├── verificationStatus
├── evidence
├── challenged
├── challengeCount
├── credibilityScore
└── createdAt
```

Claim types:

``` text
performance
scale
leadership
achievement
technical
experience
metric
```

Verification statuses:

``` text
unverified
supported
weak
contradicted
verified
```

## 12.9 Contradiction

``` text
Contradiction
├── interviewId
├── claimId
├── firstStatement
├── secondStatement
├── sourceQuestionIds[]
├── severity
├── confidence
├── resolved
├── resolution
└── detectedAt
```

Severity:

``` text
low
medium
high
```

## 12.10 Coding Attempt

``` text
CodingAttempt
├── interviewId
├── userId
├── questionId
├── language
├── code
├── testResults[]
├── passedTests
├── totalTests
├── executionTime
├── memoryUsed
├── status
├── complexity
│   ├── time
│   └── space
├── aiReview
├── submittedAt
└── createdAt
```

Untrusted code must be executed through an isolated execution service.

## 12.11 Roadmap

``` text
Roadmap
├── userId
├── interviewId
├── targetRole
├── overallReadiness
├── weakAreas[]
├── strongAreas[]
├── duration
├── milestones[]
├── recommendations[]
├── status
├── generatedBy
├── createdAt
└── updatedAt
```

Milestone:

``` text
milestone
├── title
├── topic
├── priority
├── estimatedDays
├── resources[]
├── practiceTasks[]
├── completed
└── completedAt
```

## 12.12 Notification

``` text
Notification
├── userId
├── type
├── title
├── message
├── referenceId
├── isRead
└── createdAt
```

Types:

``` text
resume_analysis
interview_completed
evaluation_ready
roadmap_ready
system
```

## 12.13 AI Usage

``` text
AIUsage
├── userId
├── interviewId
├── provider
├── model
├── operation
├── inputTokens
├── outputTokens
├── totalTokens
├── estimatedCost
├── latency
├── status
└── createdAt
```

Operations:

``` text
resume_analysis
question_generation
answer_evaluation
follow_up
adversarial_analysis
roadmap_generation
```

------------------------------------------------------------------------

# 13. Entity Relationships

``` text
USER
 │
 ├────────────── RESUMES
 │                    │
 │                    ↓
 │              RESUME CLAIMS
 │
 └────────────── INTERVIEWS
                       │
                       ├── QUESTIONS
                       │       │
                       │       └── ANSWERS
                       │               │
                       │               └── EVALUATIONS
                       │
                       ├── CLAIMS
                       │       │
                       │       └── CONTRADICTIONS
                       │
                       ├── CODING ATTEMPTS
                       │
                       └── FINAL EVALUATION
                                  │
                                  ↓
                              ROADMAP
```

------------------------------------------------------------------------

# 14. Database Index Strategy

Initial indexes:

``` text
User
→ email

Resume
→ userId

Interview
→ userId
→ status
→ createdAt

Question
→ interviewId
→ sequenceNumber

Answer
→ interviewId
→ questionId

Evaluation
→ interviewId
→ questionId

InterviewClaim
→ interviewId
→ userId

CodingAttempt
→ interviewId
→ userId

Roadmap
→ userId
→ interviewId

Notification
→ userId
→ isRead
```

Indexes should be validated against actual query patterns during
implementation.

------------------------------------------------------------------------

# 15. MongoDB vs Redis vs Vector DB vs Storage

## MongoDB

Permanent product data:

``` text
User
Resume
Interview
Question
Answer
Evaluation
Roadmap
Claims
Coding Attempts
Notifications
AI Usage
```

## Redis

Temporary/high-speed data:

``` text
Active interview state
Recent conversation context
Rate limits
Caching
Temporary locks
```

## Vector Database

Semantic knowledge:

``` text
Interview concepts
Knowledge base
Role-specific material
Relevant RAG context
```

## Object Storage

Binary files:

``` text
Resume PDFs
Audio recordings
Other supported files
```

------------------------------------------------------------------------

# 16. Security Architecture

Requirements:

-   JWT authentication
-   Secure password hashing
-   Protected APIs
-   Role-based authorization
-   Input validation
-   Rate limiting
-   Secure file upload
-   File-type validation
-   Environment-based secrets
-   HTTPS in production
-   Basic OWASP protections
-   Never execute untrusted code directly in the API process

------------------------------------------------------------------------

# 17. Performance Architecture

-   Redis caching
-   Streaming AI responses where useful
-   MongoDB indexes
-   Pagination
-   Efficient AI context management
-   Background processing for expensive operations
-   AI request timeouts
-   Retry/fallback strategy
-   Logging
-   Error monitoring

------------------------------------------------------------------------

# 18. Development Roadmap

## Phase 1 --- Foundation

-   Repository setup
-   Frontend setup
-   Backend setup
-   MongoDB connection
-   Authentication
-   User profile

## Phase 2 --- Resume Intelligence

-   Resume upload
-   Parsing
-   AI analysis
-   Skill extraction
-   Claim extraction

## Phase 3 --- Interview Engine

-   Interview configuration
-   Interview session
-   Question/answer flow
-   State management

## Phase 4 --- AI Panel

-   HR agent
-   Technical agent
-   Skeptical manager
-   Orchestrator
-   Shared memory

## Phase 5 --- Intelligence

-   Adversarial engine
-   Contradiction detection
-   Adaptive difficulty
-   Resume-grounded questioning

## Phase 6 --- Evaluation

-   Answer evaluation
-   Final scoring
-   Hiring verdict
-   Feedback

## Phase 7 --- Advanced Interview

-   DSA coding
-   Project deep-dive
-   Voice interview
-   RAG

## Phase 8 --- Product Layer

-   Analytics
-   Roadmap
-   Placement readiness
-   Notifications
-   Interview history

## Phase 9 --- Production

-   Security hardening
-   Redis optimization
-   Docker
-   CI/CD
-   Monitoring
-   Deployment

------------------------------------------------------------------------

# 19. Definition of Done

The project is complete when a user can:

1.  Create an account.
2.  Complete their profile.
3.  Upload a resume.
4.  Receive AI resume analysis.
5.  Configure an interview.
6.  Enter an interview room.
7.  Interact with multiple AI interviewers.
8.  Receive contextual follow-up questions.
9.  Experience adversarial questioning.
10. Have previous answers remembered.
11. Have resume claims challenged.
12. Have contradictions detected.
13. Experience adaptive difficulty.
14. Complete a coding round.
15. Complete a voice interview.
16. Receive answer-level evaluation.
17. Receive a final hiring-style verdict.
18. View detailed analytics.
19. Receive an AI-generated improvement roadmap.
20. View placement readiness.
21. Review previous interviews.
22. Use the system securely in production.

------------------------------------------------------------------------

# 20. Scope Freeze

This document defines the **frozen v1.0 product scope**.

We will not continuously add unrelated features during implementation.

The following can still change when technically necessary:

-   Code organization refinements
-   Database indexes
-   Prompt wording
-   AI model selection
-   Internal service boundaries
-   Performance optimizations
-   Bug fixes
-   Security improvements

The product's core features and overall architecture remain fixed unless
a serious technical blocker requires a justified change.

------------------------------------------------------------------------

# 21. Next Engineering Documents

After this master document, the implementation sequence is:

1.  **API Contract**
    -   HTTP method
    -   Endpoint
    -   Authentication
    -   Request body
    -   Response
    -   Error cases
2.  **Frontend Architecture**
    -   Pages
    -   Components
    -   State management
    -   Services
    -   Routes
3.  **Backend Architecture**
    -   Modules
    -   Controllers
    -   Services
    -   Models
    -   Middleware
    -   Utilities
4.  **AI Orchestration Design**
    -   Agent prompts
    -   Shared context
    -   Agent selection
    -   State machine
    -   Adversarial engine
    -   Evaluation pipeline
5.  **Implementation**
    -   Build one phase at a time
    -   Write code manually
    -   Test each milestone
    -   Commit each stable stage

------------------------------------------------------------------------

# 22. Product Vision

The final product should feel less like:

> "Chat with an AI about interviews."

and more like:

> **"Walk into a realistic AI-powered interview room where three
> intelligent interviewers know your resume, remember what you say,
> challenge your claims, adapt to your performance, and give you a
> hiring-style assessment at the end."**

This is the core identity of the project.
