# AI Mock Interview Panel --- API Contract v1.0

**Project:** AI Mock Interview Panel with Adversarial Difficulty\
**Version:** 1.0\
**Status:** API contract frozen for initial implementation\
**Backend:** Node.js + Express\
**Database:** MongoDB\
**Authentication:** JWT\
**Realtime:** Socket.io

------------------------------------------------------------------------

# 1. API Conventions

## Base URL

Development:

``` text
http://localhost:<PORT>/api
```

Production:

``` text
https://<domain>/api
```

## Content Type

JSON APIs:

``` http
Content-Type: application/json
```

Multipart APIs:

``` http
Content-Type: multipart/form-data
```

## Authentication

Protected APIs use:

``` http
Authorization: Bearer <access_token>
```

JWT contains the authenticated user's identity and authorization
information.

## Standard Success Shape

``` json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Standard Error Shape

``` json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "errors": []
}
```

## Common HTTP Status Codes

  Status   Meaning
  -------- ------------------------------------------
  200      Successful request
  201      Resource created
  204      Successful request with no response body
  400      Validation / malformed request
  401      Authentication required/invalid
  403      Insufficient permissions
  404      Resource not found
  409      Conflict
  422      Semantically invalid input
  429      Rate limit exceeded
  500      Internal server error
  502      External AI/provider failure
  503      Service temporarily unavailable

------------------------------------------------------------------------

# 2. Authentication API

## 2.1 Register

``` http
POST /auth/register
```

### Auth

Public.

### Request

``` json
{
  "name": "Ajay",
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Validation

-   Name required
-   Valid email
-   Password minimum strength requirement
-   Email must be unique

### Response

``` json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Ajay",
      "email": "user@example.com",
      "role": "candidate"
    },
    "accessToken": "JWT_TOKEN"
  }
}
```

### Errors

-   `EMAIL_ALREADY_EXISTS`
-   `INVALID_EMAIL`
-   `WEAK_PASSWORD`
-   `VALIDATION_ERROR`

------------------------------------------------------------------------

## 2.2 Login

``` http
POST /auth/login
```

### Auth

Public.

### Request

``` json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Response

``` json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "accessToken": "JWT_TOKEN"
  }
}
```

### Errors

-   `INVALID_CREDENTIALS`
-   `ACCOUNT_DISABLED`
-   `VALIDATION_ERROR`

------------------------------------------------------------------------

## 2.3 Logout

``` http
POST /auth/logout
```

### Auth

Required.

### Response

``` json
{
  "success": true,
  "message": "Logged out successfully"
}
```

If refresh tokens are introduced later, the logout operation must revoke
the active refresh token/session.

------------------------------------------------------------------------

## 2.4 Get Current User

``` http
GET /auth/me
```

### Auth

Required.

### Response

``` json
{
  "success": true,
  "data": {
    "user": {}
  }
}
```

------------------------------------------------------------------------

## 2.5 Google OAuth

``` http
GET /auth/google
```

Public entry endpoint.

Callback:

``` http
GET /auth/google/callback
```

The exact callback mechanism depends on the chosen OAuth implementation.

------------------------------------------------------------------------

# 3. User/Profile API

## 3.1 Get Profile

``` http
GET /users/profile
```

### Auth

Required.

### Response

Returns current user profile and placement preferences.

------------------------------------------------------------------------

## 3.2 Update Profile

``` http
PATCH /users/profile
```

### Request

``` json
{
  "name": "Ajay",
  "phone": "XXXXXXXXXX",
  "bio": "Computer Science student",
  "education": [],
  "experienceLevel": "fresher",
  "targetRoles": [
    "Full Stack Developer"
  ],
  "skills": [
    "Java",
    "React",
    "Node.js"
  ],
  "preferredDifficulty": "medium"
}
```

### Validation

Only allowed profile fields may be updated.

### Errors

-   `VALIDATION_ERROR`
-   `INVALID_ROLE`
-   `INVALID_DIFFICULTY`

------------------------------------------------------------------------

# 4. Resume API

## 4.1 Upload Resume

``` http
POST /resumes
```

### Auth

Required.

### Content Type

`multipart/form-data`

### Form Fields

``` text
file=<PDF>
```

### Validation

-   PDF only
-   File size limit
-   File must be readable
-   Authenticated user required

### Response

``` json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resume": {
      "id": "RESUME_ID",
      "status": "uploaded",
      "fileName": "resume.pdf"
    }
  }
}
```

### Errors

-   `FILE_REQUIRED`
-   `INVALID_FILE_TYPE`
-   `FILE_TOO_LARGE`
-   `UPLOAD_FAILED`

------------------------------------------------------------------------

## 4.2 List Resumes

``` http
GET /resumes
```

### Auth

Required.

### Response

``` json
{
  "success": true,
  "data": {
    "resumes": []
  }
}
```

------------------------------------------------------------------------

## 4.3 Get Resume

``` http
GET /resumes/:resumeId
```

### Auth

Required.

### Authorization

User must own the resume, unless admin access is explicitly allowed.

------------------------------------------------------------------------

## 4.4 Analyze Resume

``` http
POST /resumes/:resumeId/analyze
```

### Auth

Required.

### Processing

``` text
Resume
 ↓
Text Extraction
 ↓
Structured Parsing
 ↓
LLM Analysis
 ↓
Skill Extraction
 ↓
Project Extraction
 ↓
Claim Extraction
 ↓
Resume Analysis Saved
```

### Response

``` json
{
  "success": true,
  "message": "Resume analysis started",
  "data": {
    "resumeId": "RESUME_ID",
    "status": "processing"
  }
}
```

If analysis is synchronous in the first implementation, the response may
return the completed analysis. The API contract should prefer
asynchronous processing for production scalability.

------------------------------------------------------------------------

## 4.5 Get Resume Analysis

``` http
GET /resumes/:resumeId/analysis
```

### Response

``` json
{
  "success": true,
  "data": {
    "status": "completed",
    "analysis": {
      "skills": [],
      "strengths": [],
      "weaknesses": [],
      "suggestedTopics": [],
      "claims": [],
      "overallScore": 82
    }
  }
}
```

------------------------------------------------------------------------

# 5. Interview API

## 5.1 Create Interview

``` http
POST /interviews
```

### Auth

Required.

### Request

``` json
{
  "resumeId": "RESUME_ID",
  "targetRole": "Full Stack Developer",
  "experienceLevel": "fresher",
  "interviewType": "mixed",
  "difficulty": "medium",
  "duration": 30,
  "questionLimit": 15,
  "mode": "text",
  "resumeBased": true
}
```

### Validation

-   Resume must belong to user
-   Valid target role
-   Valid interview type
-   Valid difficulty
-   Duration within allowed range
-   Question limit within allowed range
-   Valid mode

### Response

``` json
{
  "success": true,
  "message": "Interview created",
  "data": {
    "interview": {
      "id": "INTERVIEW_ID",
      "status": "scheduled"
    }
  }
}
```

------------------------------------------------------------------------

## 5.2 List Interviews

``` http
GET /interviews
```

### Query Parameters

``` text
?page=1
&limit=10
&status=completed
&type=mixed
```

### Response

``` json
{
  "success": true,
  "data": {
    "interviews": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

------------------------------------------------------------------------

## 5.3 Get Interview

``` http
GET /interviews/:interviewId
```

Returns configuration, current status and permitted interview metadata.

------------------------------------------------------------------------

## 5.4 Start Interview

``` http
POST /interviews/:interviewId/start
```

### Auth

Required.

### Processing

``` text
Validate Interview
      ↓
Create Interview Session
      ↓
Load Resume Context
      ↓
Load Claims
      ↓
Initialize Difficulty
      ↓
Initialize Panel
      ↓
Generate First Question
```

### Response

``` json
{
  "success": true,
  "message": "Interview started",
  "data": {
    "interview": {},
    "session": {},
    "firstQuestion": {}
  }
}
```

------------------------------------------------------------------------

## 5.5 Get Current Interview State

``` http
GET /interviews/:interviewId/state
```

### Auth

Required.

### Response

``` json
{
  "success": true,
  "data": {
    "status": "in_progress",
    "currentAgent": "technical_lead",
    "currentStage": "technical",
    "currentDifficulty": "hard",
    "questionCount": 6,
    "timeRemaining": 1120
  }
}
```

Do not expose internal prompts, hidden evaluation reasoning, secret
system instructions or protected AI metadata to the client.

------------------------------------------------------------------------

## 5.6 Submit Text Answer

``` http
POST /interviews/:interviewId/answers
```

### Request

``` json
{
  "questionId": "QUESTION_ID",
  "text": "My answer goes here."
}
```

### Processing

``` text
Answer
 ↓
Persist Answer
 ↓
Analyze Answer
 ↓
Update Interview State
 ↓
Check Claims
 ↓
Check Contradictions
 ↓
Evaluate Answer
 ↓
Adaptive Difficulty
 ↓
Select Next Agent
 ↓
Generate Next Question
```

### Response

For a non-streaming implementation:

``` json
{
  "success": true,
  "data": {
    "answer": {},
    "evaluation": {},
    "nextQuestion": {}
  }
}
```

For streaming/realtime implementation, the API may acknowledge the
answer and send evaluation/next-question events over Socket.io.

------------------------------------------------------------------------

## 5.7 Submit Voice Answer

``` http
POST /interviews/:interviewId/answers/voice
```

### Auth

Required.

### Content Type

`multipart/form-data`

### Fields

``` text
questionId=<QUESTION_ID>
audio=<AUDIO_FILE>
```

### Processing

``` text
Audio
 ↓
Speech-to-Text
 ↓
Transcript
 ↓
Answer Analysis
 ↓
Evaluation
 ↓
Interview State Update
 ↓
Next Question
```

------------------------------------------------------------------------

## 5.8 End Interview

``` http
POST /interviews/:interviewId/end
```

### Auth

Required.

### Processing

-   Validate session
-   Stop active session
-   Generate final evaluation
-   Calculate readiness
-   Generate improvement recommendations
-   Persist completion state

### Response

``` json
{
  "success": true,
  "message": "Interview completed",
  "data": {
    "interviewId": "INTERVIEW_ID",
    "status": "completed",
    "evaluationId": "EVALUATION_ID"
  }
}
```

------------------------------------------------------------------------

# 6. Question API

## 6.1 Get Interview Questions

``` http
GET /interviews/:interviewId/questions
```

### Auth

Required.

### Response

Returns questions that the authenticated candidate is allowed to view
after the relevant interview state.

Do not expose hidden future questions before they are asked.

------------------------------------------------------------------------

# 7. Evaluation API

## 7.1 Get Final Evaluation

``` http
GET /evaluations/:interviewId
```

### Auth

Required.

### Response

``` json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "scores": {
      "technical": 82,
      "dsa": 76,
      "projects": 88,
      "communication": 71,
      "problemSolving": 84,
      "resumeCredibility": 69,
      "behavioral": 79,
      "confidence": 74
    },
    "verdict": "borderline",
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
  }
}
```

------------------------------------------------------------------------

## 7.2 Get Answer Evaluation

``` http
GET /evaluations/answers/:answerId
```

Returns evaluation for a specific answer.

------------------------------------------------------------------------

# 8. Coding API

## 8.1 Get Coding Questions

``` http
GET /coding/:interviewId/questions
```

### Auth

Required.

### Response

Returns the coding question(s) assigned to the current interview stage.

------------------------------------------------------------------------

## 8.2 Run Code

``` http
POST /coding/:interviewId/run
```

### Request

``` json
{
  "questionId": "QUESTION_ID",
  "language": "java",
  "code": "SOURCE_CODE"
}
```

### Processing

``` text
Code
 ↓
Validation
 ↓
Isolated Execution Service
 ↓
Test Cases
 ↓
Execution Result
```

### Response

``` json
{
  "success": true,
  "data": {
    "status": "completed",
    "passedTests": 8,
    "totalTests": 10,
    "executionTime": 120,
    "memoryUsed": 32,
    "results": []
  }
}
```

------------------------------------------------------------------------

## 8.3 Submit Coding Attempt

``` http
POST /coding/:interviewId/submit
```

### Request

``` json
{
  "questionId": "QUESTION_ID",
  "language": "java",
  "code": "SOURCE_CODE"
}
```

### Processing

-   Execute hidden tests
-   Calculate result
-   Store attempt
-   Analyze complexity
-   AI code review
-   Update interview evaluation

------------------------------------------------------------------------

# 9. Claim & Adversarial API

These APIs are primarily internal/service-facing. Candidate-facing
access should expose only appropriate results.

## 9.1 Get Candidate Claims

``` http
GET /interviews/:interviewId/claims
```

Returns claims relevant to the user's interview.

------------------------------------------------------------------------

## 9.2 Get Contradictions

``` http
GET /interviews/:interviewId/contradictions
```

### Response

``` json
{
  "success": true,
  "data": {
    "contradictions": []
  }
}
```

Sensitive internal confidence/evaluation fields may be omitted from the
normal candidate UI.

------------------------------------------------------------------------

# 10. Roadmap API

## 10.1 Generate Roadmap

``` http
POST /roadmaps
```

### Request

``` json
{
  "interviewId": "INTERVIEW_ID",
  "duration": 30
}
```

### Response

``` json
{
  "success": true,
  "message": "Roadmap generation started",
  "data": {
    "roadmapId": "ROADMAP_ID",
    "status": "processing"
  }
}
```

------------------------------------------------------------------------

## 10.2 List Roadmaps

``` http
GET /roadmaps
```

------------------------------------------------------------------------

## 10.3 Get Roadmap

``` http
GET /roadmaps/:roadmapId
```

------------------------------------------------------------------------

## 10.4 Update Roadmap Progress

``` http
PATCH /roadmaps/:roadmapId/milestones/:milestoneId
```

### Request

``` json
{
  "completed": true
}
```

------------------------------------------------------------------------

# 11. Analytics API

## 11.1 Dashboard Analytics

``` http
GET /analytics/dashboard
```

### Query

``` text
?role=Full%20Stack%20Developer
```

### Response

``` json
{
  "success": true,
  "data": {
    "readinessScore": 81,
    "interviewCount": 12,
    "averageScore": 78,
    "skillBreakdown": {},
    "topWeaknesses": [],
    "topStrengths": [],
    "scoreTrend": []
  }
}
```

------------------------------------------------------------------------

## 11.2 Interview Analytics

``` http
GET /analytics/interviews/:interviewId
```

Returns detailed analytics for one interview.

------------------------------------------------------------------------

## 11.3 Skill Analytics

``` http
GET /analytics/skills
```

Returns historical skill performance.

------------------------------------------------------------------------

# 12. Notification API

## 12.1 Get Notifications

``` http
GET /notifications
```

### Query

``` text
?page=1
&limit=20
&unreadOnly=true
```

------------------------------------------------------------------------

## 12.2 Mark Notification Read

``` http
PATCH /notifications/:notificationId/read
```

------------------------------------------------------------------------

## 12.3 Mark All Read

``` http
PATCH /notifications/read-all
```

------------------------------------------------------------------------

# 13. Admin API

All admin endpoints require:

``` text
Authentication + role=admin
```

## 13.1 Users

``` http
GET /admin/users
GET /admin/users/:userId
PATCH /admin/users/:userId/status
```

------------------------------------------------------------------------

## 13.2 Interviews

``` http
GET /admin/interviews
GET /admin/interviews/:interviewId
```

------------------------------------------------------------------------

## 13.3 AI Usage

``` http
GET /admin/ai-usage
GET /admin/ai-usage/summary
```

------------------------------------------------------------------------

## 13.4 System Statistics

``` http
GET /admin/stats
```

------------------------------------------------------------------------

## 13.5 Question/Knowledge Management

``` http
GET    /admin/questions
POST   /admin/questions
PATCH  /admin/questions/:questionId
DELETE /admin/questions/:questionId

GET    /admin/knowledge
POST   /admin/knowledge
DELETE /admin/knowledge/:knowledgeId
```

------------------------------------------------------------------------

# 14. Socket.io Architecture

REST APIs handle persistent operations.

Socket.io handles real-time interview interactions.

## Connection

``` text
Client
 ↓
Socket.io
 ↓
Authentication
 ↓
Join interview room
```

Room convention:

``` text
interview:<interviewId>
```

------------------------------------------------------------------------

# 15. Socket Events

## Client → Server

### Join Interview

``` text
interview:join
```

Payload:

``` json
{
  "interviewId": "INTERVIEW_ID"
}
```

### Typing/Activity

``` text
interview:activity
```

### Answer Submitted

``` text
interview:answer
```

### Leave Interview

``` text
interview:leave
```

------------------------------------------------------------------------

## Server → Client

### Interview State

``` text
interview:state
```

### AI Thinking/Processing

``` text
interview:processing
```

### New Question

``` text
interview:question
```

### Evaluation Available

``` text
interview:evaluation
```

### Difficulty Changed

``` text
interview:difficulty
```

### Agent Changed

``` text
interview:agent
```

### Warning

``` text
interview:warning
```

### Interview Completed

``` text
interview:completed
```

### Error

``` text
interview:error
```

------------------------------------------------------------------------

# 16. AI Service Internal Contracts

These are service-layer contracts, not public APIs.

## Resume Analysis

``` text
analyzeResume(resumeText)
→ parsedData
→ skills
→ projects
→ claims
→ suggestedTopics
→ strengths
→ weaknesses
```

## Question Generation

``` text
generateQuestion(context)
→ question
→ agent
→ topic
→ difficulty
→ questionType
→ expectedConcepts
```

## Answer Evaluation

``` text
evaluateAnswer(context, answer)
→ scores
→ strengths
→ weaknesses
→ missingConcepts
→ feedback
→ evidence
```

## Adversarial Analysis

``` text
analyzeAdversarial(context, answer)
→ claimDetected
→ contradictionDetected
→ evidenceLevel
→ challengeRequired
→ challengeReason
```

## Difficulty Decision

``` text
calculateDifficulty(context)
→ nextDifficulty
→ reason
```

## Agent Selection

``` text
selectNextAgent(context)
→ agent
→ reason
```

------------------------------------------------------------------------

# 17. Interview Answer Processing Pipeline

``` text
Candidate submits answer
        ↓
API / Socket receives answer
        ↓
Validate request
        ↓
Persist answer
        ↓
Load interview state
        ↓
Load relevant resume claims
        ↓
Evaluate answer
        ↓
Adversarial analysis
        ↓
Contradiction analysis
        ↓
Update difficulty
        ↓
Select next agent
        ↓
Generate next question
        ↓
Persist question
        ↓
Send next question
```

------------------------------------------------------------------------

# 18. Authorization Rules

## Candidate

Can:

-   Access own profile
-   Access own resumes
-   Access own interviews
-   Submit own answers
-   Access own evaluations
-   Access own coding attempts
-   Access own roadmaps
-   Access own notifications

Cannot:

-   Access another user's interview
-   Access another user's resume
-   Access internal AI prompts
-   Access hidden future questions
-   Access admin endpoints
-   Modify another user's data

## Admin

Can access administrative resources according to the admin permission
model.

------------------------------------------------------------------------

# 19. Validation Rules

Every API must validate:

-   Authentication
-   Authorization
-   Required fields
-   Data types
-   String lengths
-   Enum values
-   IDs/ObjectIds
-   File types
-   File size
-   Request body size
-   Pagination limits

Never trust client-provided:

-   `userId`
-   ownership
-   role
-   score
-   interview state
-   evaluation result
-   admin privileges

These must be derived or verified server-side.

------------------------------------------------------------------------

# 20. Error Handling Strategy

Central Express error middleware should normalize errors.

Error categories:

``` text
VALIDATION_ERROR
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
NOT_FOUND
CONFLICT
RATE_LIMITED
AI_PROVIDER_ERROR
AI_TIMEOUT
AI_INVALID_RESPONSE
DATABASE_ERROR
FILE_UPLOAD_ERROR
CODE_EXECUTION_ERROR
INTERNAL_SERVER_ERROR
```

AI provider failures should not expose raw provider errors or secrets to
the client.

------------------------------------------------------------------------

# 21. Rate Limiting

Rate limits should be applied more strictly to expensive operations:

-   Resume analysis
-   AI question generation
-   Answer evaluation
-   Voice processing
-   Code execution
-   Roadmap generation

Normal read APIs can have less restrictive limits.

------------------------------------------------------------------------

# 22. API Security Rules

-   Never return password hashes.
-   Never return API keys.
-   Never expose system prompts.
-   Never expose hidden evaluation chain-of-thought.
-   Never execute candidate code in the main API process.
-   Validate uploaded files.
-   Validate ownership for every user resource.
-   Sanitize/validate inputs.
-   Use HTTPS in production.
-   Protect admin routes.
-   Apply rate limits.
-   Log security-relevant failures.

------------------------------------------------------------------------

# 23. Pagination Standard

List endpoints should use:

``` text
?page=1&limit=10
```

Response:

``` json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

Server must enforce a maximum `limit`.

------------------------------------------------------------------------

# 24. API Versioning

Initial version:

``` text
/api
```

If breaking API changes become necessary later, introduce:

``` text
/api/v2
```

Do not silently change the meaning of an existing endpoint.

------------------------------------------------------------------------

# 25. API Implementation Order

The actual coding order should be:

## Phase A --- Core

``` text
/auth/register
/auth/login
/auth/logout
/auth/me

/users/profile
```

## Phase B --- Resume

``` text
/resumes
/resumes/:id
/resumes/:id/analyze
/resumes/:id/analysis
```

## Phase C --- Interview

``` text
/interviews
/interviews/:id
/interviews/:id/start
/interviews/:id/state
/interviews/:id/answers
/interviews/:id/end
```

## Phase D --- AI Panel

Implement internally:

``` text
Orchestrator
HR Agent
Technical Agent
Skeptical Agent
Shared Memory
```

## Phase E --- Intelligence

``` text
Adversarial Engine
Contradiction Detection
Adaptive Difficulty
```

## Phase F --- Evaluation

``` text
Answer Evaluation
Final Evaluation
```

## Phase G --- Advanced

``` text
Coding
Voice
RAG
```

## Phase H --- Product

``` text
Analytics
Roadmap
Readiness
Notifications
Admin
```

------------------------------------------------------------------------

# 26. Definition of API Completion

API layer is considered complete when:

-   All core routes exist.
-   Authentication is enforced correctly.
-   Authorization is enforced correctly.
-   Request validation works.
-   Error handling is centralized.
-   MongoDB operations are tested.
-   AI provider failures are handled.
-   Expensive endpoints are rate-limited.
-   Socket interview events work.
-   Candidate ownership is enforced.
-   Admin routes are protected.
-   API documentation matches implementation.

------------------------------------------------------------------------

# 27. Next Engineering Step

After this API contract, the next documents/designs are:

1.  **Frontend Architecture**
2.  **Backend Folder Structure**
3.  **AI Orchestration Architecture**
4.  **Prompt & Agent Contract**
5.  **Git/GitHub Development Workflow**
6.  **Implementation**

The project should not jump directly into feature coding until the
frontend/backend module boundaries are fixed.

------------------------------------------------------------------------

# 28. Scope Freeze

This API contract represents the intended v1.0 API surface.

Internal implementation details may be refined during development for:

-   Validation
-   Performance
-   Security
-   Database queries
-   Service boundaries
-   AI provider integration
-   Error handling

Core product behavior and endpoint responsibilities should remain
stable.
