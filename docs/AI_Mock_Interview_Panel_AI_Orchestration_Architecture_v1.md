# AI Mock Interview Panel --- AI Orchestration Architecture v1.0

**Project:** AI Mock Interview Panel with Adversarial Difficulty\
**Version:** 1.0\
**Status:** AI architecture baseline / scope frozen\
**Primary AI Pattern:** Orchestrated multi-agent system with shared
interview state

------------------------------------------------------------------------

# 1. Purpose

This document defines the internal AI architecture of the AI Mock
Interview Panel.

The goal is to create a realistic interview system in which multiple AI
personas collaborate through a central orchestrator while sharing
controlled interview memory.

The system must:

-   Remember previous answers.
-   Understand the candidate's resume.
-   Ask contextual follow-ups.
-   Challenge unsupported claims.
-   Detect contradictions.
-   Adapt interview difficulty.
-   Select the most appropriate interviewer.
-   Evaluate answers.
-   Produce a final hiring-style assessment.

The system must **not** behave like three independent chatbots.

------------------------------------------------------------------------

# 2. Core AI Architecture

``` text
                         CANDIDATE
                             │
                             ↓
                     ┌───────────────┐
                     │ Interview UI  │
                     └───────┬───────┘
                             ↓
                     ┌───────────────┐
                     │ Answer Intake │
                     └───────┬───────┘
                             ↓
                     ┌───────────────┐
                     │ Context       │
                     │ Builder       │
                     └───────┬───────┘
                             ↓
                  ┌──────────────────────┐
                  │ Interview            │
                  │ Orchestrator         │
                  └──────────┬───────────┘
                             ↓
             ┌───────────────┼────────────────┐
             ↓               ↓                ↓
       ┌──────────┐    ┌────────────┐   ┌─────────────┐
       │ HR Agent │    │ Technical  │   │ Skeptical   │
       │          │    │ Lead Agent │   │ Manager     │
       └────┬─────┘    └─────┬──────┘   └──────┬──────┘
            └───────────────┬┴──────────────────┘
                            ↓
                  ┌─────────────────────┐
                  │ Adversarial Engine   │
                  └──────────┬──────────┘
                             ↓
                  ┌─────────────────────┐
                  │ Difficulty Engine   │
                  └──────────┬──────────┘
                             ↓
                  ┌─────────────────────┐
                  │ Evaluation Engine   │
                  └──────────┬──────────┘
                             ↓
                  ┌─────────────────────┐
                  │ Shared Interview    │
                  │ Memory / State      │
                  └──────────┬──────────┘
                             │
                             └──────→ Next Turn
```

------------------------------------------------------------------------

# 3. Design Principles

## 3.1 Orchestrator-Centric

The orchestrator owns interview-level decisions.

Agents do not independently control the interview.

## 3.2 Shared State

All agents receive the relevant portion of the same interview state.

## 3.3 Structured AI Output

LLM calls should request structured output rather than uncontrolled text
whenever the output affects application logic.

## 3.4 Separation of Generation and Decision

The AI can propose a question, but the orchestrator decides whether that
question should actually be asked.

## 3.5 Evidence-Based Evaluation

Evaluation should reference the candidate's actual answer, resume
information and interview context.

## 3.6 Minimum Necessary Context

Do not send the entire conversation to every LLM call.

Use summaries, relevant history and retrieved claims.

------------------------------------------------------------------------

# 4. Interview State Machine

The interview is represented as a state machine.

``` text
CREATED
   ↓
READY
   ↓
INTRODUCTION
   ↓
HR
   ↓
TECHNICAL
   ↓
PROJECT
   ↓
ADVERSARIAL
   ↓
CODING
   ↓
CLOSING
   ↓
EVALUATING
   ↓
COMPLETED
```

Not every interview must use every stage.

The orchestrator may skip stages depending on interview configuration.

------------------------------------------------------------------------

# 5. State Object

Conceptual interview state:

``` json
{
  "interviewId": "INTERVIEW_ID",
  "userId": "USER_ID",
  "targetRole": "Full Stack Developer",
  "experienceLevel": "fresher",
  "interviewType": "mixed",
  "currentStage": "technical",
  "currentAgent": "technical_lead",
  "difficulty": "hard",
  "questionNumber": 7,
  "questionLimit": 15,
  "timeRemaining": 1080,
  "coveredTopics": [],
  "strengths": [],
  "weaknesses": [],
  "claims": [],
  "contradictions": [],
  "recentAnswers": [],
  "conversationSummary": "",
  "agentHistory": [],
  "lastDecision": {}
}
```

This is conceptual data. Actual runtime state may be split between Redis
and MongoDB.

------------------------------------------------------------------------

# 6. Turn Lifecycle

Every interview turn follows a predictable pipeline.

``` text
1. Candidate submits answer
        ↓
2. Validate answer
        ↓
3. Persist answer
        ↓
4. Load relevant interview state
        ↓
5. Analyze answer
        ↓
6. Retrieve relevant resume claims
        ↓
7. Detect weaknesses / contradictions
        ↓
8. Evaluate answer
        ↓
9. Decide adversarial intensity
        ↓
10. Calculate difficulty
        ↓
11. Select next agent
        ↓
12. Select next topic
        ↓
13. Generate next question
        ↓
14. Validate generated question
        ↓
15. Persist question
        ↓
16. Update shared state
        ↓
17. Send question to candidate
```

------------------------------------------------------------------------

# 7. Answer Analyzer

The answer analyzer converts the candidate's response into structured
signals.

Input:

``` text
Candidate Answer
+
Current Question
+
Relevant Context
```

Output concept:

``` json
{
  "technicalCorrectness": 0.82,
  "relevance": 0.91,
  "depth": 0.61,
  "clarity": 0.78,
  "completeness": 0.67,
  "confidenceSignal": 0.72,
  "vagueness": 0.31,
  "unsupportedClaims": [],
  "topicsDemonstrated": [],
  "missingConcepts": [],
  "followUpNeeded": true
}
```

These are internal signals, not necessarily direct user-facing scores.

------------------------------------------------------------------------

# 8. HR Agent

## Objective

Evaluate behavioral and communication capabilities.

## Focus Areas

-   Communication
-   Teamwork
-   Leadership
-   Conflict handling
-   Ownership
-   Motivation
-   Career goals
-   Adaptability
-   Situational judgment

## Personality

-   Professional
-   Friendly
-   Conversational
-   Observant

## Behavior

The HR agent should:

-   Ask open-ended behavioral questions.
-   Ask follow-ups when answers lack examples.
-   Request specific situations.
-   Ask about actions and outcomes.
-   Avoid unnecessary technical questioning.

Example:

``` text
Question:
"Tell me about a difficult team conflict you faced."

Candidate:
"We had some disagreement."

Follow-up:
"What specifically was the disagreement, what action did you take, and what was the outcome?"
```

------------------------------------------------------------------------

# 9. Technical Lead Agent

## Objective

Measure technical competence and engineering depth.

## Focus Areas

-   DSA
-   Programming
-   OOP
-   DBMS
-   OS
-   CN
-   Projects
-   APIs
-   Backend/frontend architecture
-   System design

## Personality

-   Precise
-   Analytical
-   Technical
-   Increasingly demanding

## Behavior

The Technical Lead should:

-   Ask concept questions.
-   Ask why/how questions.
-   Request implementation details.
-   Challenge architectural decisions.
-   Increase depth when the candidate performs well.

Example:

``` text
Candidate:
"We used Redis for performance."

Follow-up:
"What data did you cache, what was your invalidation strategy, and what problem would occur if Redis became unavailable?"
```

------------------------------------------------------------------------

# 10. Skeptical Manager Agent

## Objective

Test credibility, depth and consistency.

## Focus Areas

-   Resume claims
-   Metrics
-   Project ownership
-   Technical claims
-   Contradictions
-   Vague answers
-   Unsupported achievements

## Personality

-   Skeptical
-   Direct
-   Evidence-oriented
-   Professional
-   Adversarial but not abusive

## Behavior

The manager should challenge claims without becoming hostile.

Example:

``` text
Resume:
"Reduced API latency by 40%."

Question:
"How did you achieve that?"

Candidate:
"I optimized the database."

Challenge:
"What was your baseline latency, what query or index changes did you make, and how did you measure the 40% improvement?"
```

------------------------------------------------------------------------

# 11. Agent Contract

Every agent should follow a common internal contract.

Conceptually:

``` text
Agent Input
├── Candidate profile
├── Target role
├── Interview stage
├── Current question
├── Current answer
├── Relevant resume claims
├── Relevant previous answers
├── Interview objectives
├── Difficulty
└── Agent-specific instructions

Agent Output
├── Proposed question
├── Question type
├── Topic
├── Difficulty
├── Follow-up reason
├── Expected concepts
└── Confidence
```

The orchestrator validates and decides whether to use the proposed
output.

------------------------------------------------------------------------

# 12. Interview Orchestrator

The orchestrator is the central brain.

## Responsibilities

-   Maintain interview flow.
-   Select agent.
-   Select stage.
-   Select topic.
-   Trigger adversarial mode.
-   Adjust difficulty.
-   Prevent repetitive questions.
-   Respect question limits.
-   Respect interview duration.
-   End interview when conditions are met.

## Orchestrator Input

``` text
Interview State
+
Answer Analysis
+
Evaluation
+
Claim Analysis
+
Contradiction Analysis
+
Interview Configuration
```

## Orchestrator Output

``` json
{
  "nextAgent": "skeptical_manager",
  "nextStage": "adversarial",
  "nextTopic": "resume_claim",
  "difficulty": "hard",
  "questionType": "adversarial",
  "reason": "Candidate made an unsupported performance claim."
}
```

------------------------------------------------------------------------

# 13. Agent Selection Logic

Agent selection should be rule-guided rather than randomly delegated.

Conceptual decision matrix:

  Situation                      Preferred Agent
  ------------------------------ -------------------
  Behavioral question            HR
  Communication weakness         HR
  Technical concept              Technical Lead
  DSA                            Technical Lead
  Project architecture           Technical Lead
  Resume metric                  Skeptical Manager
  Contradiction                  Skeptical Manager
  Vague technical claim          Skeptical Manager
  Strong technical performance   Technical Lead
  Interview closing              HR / Orchestrator

The orchestrator may override the default choice when interview state
requires it.

------------------------------------------------------------------------

# 14. Topic Selection

Topics should be selected based on:

``` text
Interview Configuration
+
Role Requirements
+
Resume
+
Previously Covered Topics
+
Weaknesses
+
Strengths
+
Time Remaining
+
Difficulty
```

Avoid asking the same concept repeatedly unless the purpose is deeper
verification.

------------------------------------------------------------------------

# 15. Resume Intelligence Pipeline

``` text
Resume PDF
    ↓
Text Extraction
    ↓
Structured Parsing
    ↓
Skill Extraction
    ↓
Project Extraction
    ↓
Experience Extraction
    ↓
Claim Extraction
    ↓
Claim Classification
    ↓
Interview Claim Store
```

Each important claim can become a future interview target.

------------------------------------------------------------------------

# 16. Claim Model

A claim contains:

``` text
claimText
claimType
value
unit
source
evidence
verificationStatus
credibilityScore
challenged
challengeCount
```

Example:

``` text
Claim:
"Improved API performance by 40%."

Type:
performance

Value:
40

Unit:
%

Status:
unverified
```

------------------------------------------------------------------------

# 17. Adversarial Engine

The adversarial engine decides whether a candidate answer deserves a
challenge.

## Inputs

``` text
Current Answer
Current Question
Resume Claims
Previous Statements
Previous Answers
Answer Analysis
```

## Detects

-   Vague answers
-   Unsupported claims
-   Contradictions
-   Missing evidence
-   Incorrect technical statements
-   Suspicious metrics
-   Ownership ambiguity
-   Overclaiming

## Output

``` json
{
  "shouldChallenge": true,
  "reason": "Candidate gave a numerical performance claim without measurement evidence.",
  "severity": "medium",
  "target": "performance_claim",
  "suggestedAgent": "skeptical_manager"
}
```

------------------------------------------------------------------------

# 18. Adversarial Intensity

Do not challenge every answer.

Use levels:

``` text
NONE
LOW
MEDIUM
HIGH
```

## NONE

Normal question flow.

## LOW

Simple clarification.

## MEDIUM

Evidence request.

## HIGH

Cross-reference previous claims and require detailed justification.

Example:

``` text
Candidate:
"I built a scalable system."

LOW:
"What made the system scalable?"

MEDIUM:
"Which scalability bottleneck did you address?"

HIGH:
"You previously said the system supported 10,000 users, but you also said no load testing was performed. How did you validate that claim?"
```

------------------------------------------------------------------------

# 19. Contradiction Engine

The contradiction engine compares important candidate statements.

``` text
Statement A
+
Statement B
+
Context
↓
Semantic Comparison
↓
Potential Contradiction
↓
Confidence
↓
Severity
```

Output:

``` json
{
  "contradiction": true,
  "confidence": 0.91,
  "severity": "medium",
  "statementA": "I built the project alone.",
  "statementB": "Our backend team implemented the APIs."
}
```

The system should distinguish between:

-   True contradiction
-   Different context
-   Clarification
-   Harmless wording difference

It should not accuse the candidate based on low-confidence semantic
differences.

------------------------------------------------------------------------

# 20. Adaptive Difficulty Engine

Difficulty levels:

``` text
beginner
easy
medium
hard
expert
```

Difficulty should not be based on one answer only.

Use rolling performance.

Conceptual score:

``` text
Performance Score =
    Technical Correctness
  + Depth
  + Problem Solving
  + Consistency
  + Recent Performance
```

Possible decision:

``` text
Strong performance → increase difficulty
Stable performance → maintain difficulty
Repeated struggle → decrease difficulty
```

The exact numeric thresholds can be tuned during testing.

------------------------------------------------------------------------

# 21. Topic-Specific Difficulty

Difficulty should also be topic-specific.

Example:

``` text
DSA: Hard
DBMS: Medium
OS: Easy
Projects: Hard
Communication: Medium
```

The candidate may be strong in one area and weak in another.

Do not maintain only one global difficulty score.

Maintain:

``` text
topicDifficulty
```

and optionally:

``` text
skillConfidence
```

------------------------------------------------------------------------

# 22. Shared Memory Architecture

Memory is divided into layers.

## Layer 1 --- Immediate Context

Recent:

-   Question
-   Answer
-   Previous question
-   Current analysis

## Layer 2 --- Interview Summary

Compressed summary of the interview.

Contains:

-   Important claims
-   Strengths
-   Weaknesses
-   Topics covered
-   Major decisions
-   Contradictions

## Layer 3 --- Resume Context

Relevant:

-   Skills
-   Projects
-   Experience
-   Claims

## Layer 4 --- Retrieved Knowledge

RAG documents relevant to the current topic.

------------------------------------------------------------------------

# 23. Context Builder

The context builder decides what the LLM actually receives.

``` text
Current Question
+
Current Answer
+
Recent Turns
+
Interview Summary
+
Relevant Resume Claims
+
Relevant Weaknesses
+
Relevant Contradictions
+
Target Role
+
Interview Stage
+
Difficulty
+
RAG Context
```

Do not send the complete interview transcript every time.

------------------------------------------------------------------------

# 24. Memory Compression

Long interviews create large context windows.

Use:

``` text
Recent raw turns
+
Rolling summary
+
Important facts
+
Relevant claims
```

When context becomes large:

``` text
Raw History
    ↓
Summarization
    ↓
Interview Summary
    ↓
Important Facts
```

This reduces token usage while preserving important information.

------------------------------------------------------------------------

# 25. RAG Pipeline

``` text
Candidate Question / Topic
        ↓
Create Search Query
        ↓
Generate Embedding
        ↓
Vector Search
        ↓
Retrieve Top Relevant Documents
        ↓
Filter by Role / Topic
        ↓
Context Builder
        ↓
LLM
```

RAG should provide relevant knowledge rather than flooding the model
with the entire knowledge base.

------------------------------------------------------------------------

# 26. Question Generation Pipeline

``` text
Interview State
      ↓
Context Builder
      ↓
Agent Selection
      ↓
Agent Prompt
      ↓
LLM
      ↓
Structured Output
      ↓
Question Validator
      ↓
Duplicate / Relevance Check
      ↓
Orchestrator Approval
      ↓
Question Sent
```

------------------------------------------------------------------------

# 27. Question Validator

Every generated question should be checked for:

-   Relevance
-   Role alignment
-   Difficulty
-   Duplicate content
-   Correct agent behavior
-   Professional tone
-   No answer leakage
-   No unsupported assumptions

Invalid questions should be regenerated or replaced.

------------------------------------------------------------------------

# 28. Evaluation Architecture

Evaluation is separated into:

## Answer Evaluation

Evaluates one response.

## Interview Evaluation

Evaluates overall interview.

## Readiness Evaluation

Maps interview performance to target-role readiness.

Pipeline:

``` text
Answer
 ↓
Answer Evaluator
 ↓
Per-answer Score
 ↓
Interview Aggregator
 ↓
Category Scores
 ↓
Final Evaluator
 ↓
Hiring Verdict
 ↓
Readiness Engine
```

------------------------------------------------------------------------

# 29. Evaluation Dimensions

Per-answer:

``` text
technicalCorrectness
relevance
completeness
depth
clarity
communication
confidenceSignal
consistency
problemSolving
```

Not every dimension applies equally to every question type.

For example:

-   HR → communication/behavioral relevance
-   DSA → correctness/problem-solving
-   Project → depth/architecture
-   Adversarial → evidence/consistency

------------------------------------------------------------------------

# 30. Scoring Strategy

Avoid simply averaging every score.

Use question-type weights.

Conceptually:

``` text
Final Score =
    Technical Performance
  + Problem Solving
  + Project Depth
  + Behavioral Performance
  + Communication
  + Consistency
  + Resume Credibility
```

Weights depend on target role and interview configuration.

------------------------------------------------------------------------

# 31. Hiring Verdict

Possible outcomes:

``` text
strong_hire
hire
borderline
no_hire
```

The verdict must be supported by:

-   Strong areas
-   Weak areas
-   Key answers
-   Technical gaps
-   Behavioral evidence
-   Resume credibility
-   Interview consistency

Never generate a verdict solely from one answer.

------------------------------------------------------------------------

# 32. Structured LLM Output

AI calls that affect application logic should use structured output.

Example question output:

``` json
{
  "question": "How did you validate the performance improvement?",
  "questionType": "adversarial",
  "topic": "performance_optimization",
  "difficulty": "hard",
  "expectedConcepts": [
    "baseline",
    "measurement",
    "benchmarking"
  ],
  "reason": "Candidate claimed a 40% improvement without evidence."
}
```

The backend validates this structure before using it.

------------------------------------------------------------------------

# 33. Prompt Architecture

Prompts are separated by responsibility.

``` text
prompts/
├── system.prompts
├── hr.prompts
├── technical.prompts
├── skeptical.prompts
├── evaluation.prompts
├── adversarial.prompts
├── resume.prompts
├── roadmap.prompts
└── shared.prompts
```

Avoid building giant prompts directly inside controllers.

------------------------------------------------------------------------

# 34. Prompt Versioning

Every AI operation should have a prompt version.

Example:

``` text
HR_INTERVIEW_V1
TECHNICAL_INTERVIEW_V1
SKEPTICAL_INTERVIEW_V1
ANSWER_EVALUATION_V1
ADVERSARIAL_ENGINE_V1
```

When prompts change significantly:

``` text
V1 → V2
```

Old evaluations should retain their original version metadata.

------------------------------------------------------------------------

# 35. AI Failure Handling

Possible failures:

-   Timeout
-   Provider outage
-   Rate limit
-   Invalid JSON
-   Empty response
-   Safety filter
-   Context overflow
-   Network failure

Handling strategy:

``` text
LLM Call
 ↓
Validate Response
 ↓
Valid?
 ├── YES → Continue
 └── NO
      ↓
 Retry / Repair
      ↓
 Still invalid?
      ↓
 Controlled fallback
```

Never expose raw AI provider errors to the candidate.

------------------------------------------------------------------------

# 36. Retry Policy

Retries should be limited.

Example strategy:

``` text
Attempt 1
 ↓
Invalid
 ↓
Attempt 2 with corrected constraints
 ↓
Invalid
 ↓
Fallback question / safe response
```

Do not create infinite retry loops.

------------------------------------------------------------------------

# 37. Token Management

To control AI cost:

-   Use concise system prompts.
-   Use summarized memory.
-   Retrieve only relevant RAG documents.
-   Avoid sending duplicate context.
-   Use cheaper models for simple tasks where appropriate.
-   Use stronger models for difficult evaluation/orchestration tasks
    when justified.
-   Track token usage per operation.

------------------------------------------------------------------------

# 38. AI Model Routing

Different operations may use different model tiers.

Conceptually:

``` text
Simple classification
→ lightweight model

Question generation
→ capable general model

Complex evaluation
→ stronger reasoning model

Resume extraction
→ structured-output capable model

Speech
→ speech-specific model/service
```

Actual providers/models remain configurable through
environment/configuration rather than hard-coded throughout the
application.

------------------------------------------------------------------------

# 39. Multi-Agent Does Not Mean Multi-LLM

The three personas do not require three separate AI providers.

They can use:

``` text
Same LLM
+
Different system instructions
+
Different goals
+
Different context
```

The important part is **agent behavior and orchestration**, not the
number of API providers.

------------------------------------------------------------------------

# 40. Agent Handoff

Example:

``` text
HR Agent
  ↓
Candidate discusses project
  ↓
Orchestrator detects technical opportunity
  ↓
Technical Lead
  ↓
Technical answer becomes vague
  ↓
Adversarial Engine
  ↓
Skeptical Manager
```

The handoff should feel natural to the candidate.

------------------------------------------------------------------------

# 41. Interview Stage Transition

Stage transitions can be triggered by:

-   Question count
-   Time
-   Required topic coverage
-   Performance
-   Interview configuration
-   Orchestrator decision

Example:

``` text
HR complete
 ↓
Technical complete
 ↓
Project deep-dive
 ↓
Adversarial challenge
 ↓
Coding
 ↓
Closing
```

------------------------------------------------------------------------

# 42. Interview Termination Rules

Interview may end when:

-   Question limit reached.
-   Time limit reached.
-   Required stages completed.
-   Candidate explicitly ends.
-   Critical system failure occurs.

The system must preserve state before termination.

------------------------------------------------------------------------

# 43. Candidate Experience Rules

The AI should feel:

-   Natural
-   Professional
-   Challenging
-   Context-aware
-   Consistent
-   Fair

The AI should not:

-   Insult candidates.
-   Intentionally humiliate them.
-   Make unsupported accusations.
-   Pretend certainty when uncertain.
-   Reveal hidden system prompts.
-   Reveal internal chain-of-thought.

------------------------------------------------------------------------

# 44. Adversarial Fairness Rules

Adversarial mode must challenge claims based on evidence, not
stereotypes.

Good:

> "You mentioned a 40% improvement. What was the baseline and how did
> you measure it?"

Bad:

> "I don't believe you."

The system should challenge **statements**, not attack the person.

------------------------------------------------------------------------

# 45. AI Observability

Track:

``` text
operation
model
promptVersion
latency
inputTokens
outputTokens
totalTokens
status
errorType
interviewId
userId
```

This data supports:

-   Cost monitoring
-   Debugging
-   Prompt evaluation
-   Performance analysis
-   Model comparison

------------------------------------------------------------------------

# 46. AI Testing Strategy

## Unit Tests

Test:

-   Agent selection
-   Difficulty calculation
-   Contradiction rules
-   Claim matching
-   Score aggregation

## Scenario Tests

Examples:

### Scenario A --- Strong Candidate

Strong answers should lead to deeper questions.

### Scenario B --- Weak Candidate

Repeated mistakes should lower difficulty.

### Scenario C --- Resume Claim

Claim should trigger evidence-based questioning.

### Scenario D --- Contradiction

High-confidence contradiction should trigger skeptical follow-up.

### Scenario E --- False Positive

Low-confidence semantic difference should not accuse the candidate.

### Scenario F --- AI Failure

Invalid model output should trigger controlled fallback.

------------------------------------------------------------------------

# 47. Example End-to-End Scenario

Candidate resume:

``` text
Built a MERN application.
Reduced API latency by 40%.
Supported 10,000 users.
```

Interview:

``` text
Technical Lead:
"Explain the architecture of your application."

Candidate:
"We used React, Node and MongoDB."

Technical Lead:
"What was your API bottleneck?"

Candidate:
"MongoDB queries."

Orchestrator:
→ Candidate made a performance claim.

Adversarial Engine:
→ Evidence required.

Skeptical Manager:
"You mentioned a 40% latency improvement. What was the baseline,
what query changes did you make, and how did you benchmark it?"

Candidate:
"We didn't actually benchmark it."

Claim:
verificationStatus = weak

Difficulty:
maintain hard

Evaluation:
resumeCredibility ↓

Next:
Technical Lead asks deeper database question.
```

This is the behavior we want the platform to reproduce.

------------------------------------------------------------------------

# 48. Core AI Data Flow

``` text
                         RESUME
                            ↓
                    Claim Extraction
                            ↓
                    Interview Claims
                            ↓
Candidate Answer ─────→ Answer Analyzer
                            ↓
                    Context Builder
                            ↓
                    Shared Memory
                            ↓
                  Interview Orchestrator
                            ↓
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
       HR Agent       Technical Agent   Skeptical Agent
          └─────────────────┼─────────────────┘
                            ↓
                    Adversarial Engine
                            ↓
                    Difficulty Engine
                            ↓
                    Evaluation Engine
                            ↓
                   Shared State Update
                            ↓
                       Next Question
```

------------------------------------------------------------------------

# 49. AI Architecture Folder Mapping

``` text
server/ai/
│
├── agents/
│   ├── hr.agent.js
│   ├── technical.agent.js
│   └── skeptical.agent.js
│
├── orchestrator/
│   ├── interview.orchestrator.js
│   ├── agent.selector.js
│   └── stage.manager.js
│
├── memory/
│   ├── context.builder.js
│   ├── memory.service.js
│   └── summary.service.js
│
├── adversarial/
│   ├── adversarial.engine.js
│   ├── contradiction.engine.js
│   └── claim.verifier.js
│
├── evaluation/
│   ├── answer.evaluator.js
│   ├── scoring.engine.js
│   └── final.evaluator.js
│
├── difficulty/
│   └── difficulty.engine.js
│
├── resume/
│   ├── resume.parser.js
│   ├── resume.analyzer.js
│   └── claim.extractor.js
│
├── rag/
│   ├── embeddings.service.js
│   ├── retrieval.service.js
│   └── knowledge.service.js
│
└── prompts/
    ├── system.prompts.js
    ├── hr.prompts.js
    ├── technical.prompts.js
    ├── skeptical.prompts.js
    ├── evaluation.prompts.js
    ├── adversarial.prompts.js
    ├── resume.prompts.js
    └── roadmap.prompts.js
```

------------------------------------------------------------------------

# 50. Final AI Architecture Contract

The following rules are frozen for v1.0:

1.  Three primary AI personas exist.
2.  A central orchestrator controls interview flow.
3.  Agents do not independently control stage transitions.
4.  Interview state is backend-authoritative.
5.  Shared memory is used across agents.
6.  Resume claims are tracked explicitly.
7.  Adversarial questioning is evidence-based.
8.  Contradiction detection uses confidence thresholds.
9.  Difficulty is adaptive and topic-aware.
10. AI outputs affecting logic are structured and validated.
11. Prompts are versioned.
12. AI failures have controlled fallbacks.
13. Token/context usage is actively managed.
14. Final hiring verdict is based on accumulated interview evidence.
15. Candidate-facing output never exposes internal prompts or hidden
    reasoning.

------------------------------------------------------------------------

# 51. Next Engineering Step

After this AI architecture, the project is ready for implementation
planning.

Next:

``` text
AI Orchestration Architecture
          ↓
Git + Environment Setup
          ↓
Project Initialization
          ↓
Backend Foundation
          ↓
Frontend Foundation
          ↓
Authentication
          ↓
Resume Module
          ↓
Interview Engine
          ↓
AI Panel
          ↓
Adversarial Engine
          ↓
Evaluation
          ↓
Advanced Features
          ↓
Production
```

The first coding milestone should be the **repository, client/server
setup, environment configuration, Express foundation and MongoDB
connection**. No AI feature should be coded before the backend
foundation is stable.
