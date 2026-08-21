# 📰 FutureNews AI

### An autonomous newspaper from an alternate future — powered by AWS and Amazon Bedrock.

> **Tomorrow's headlines, written before they happen.**

FutureNews AI is an autonomous AI-powered news agency that creates a new edition of a fictional newspaper set in the future.

Unlike a simple AI content generator, FutureNews AI maintains a **persistent fictional world**. The AI agent remembers previous events, analyzes how the world has evolved, and generates the next logical chapter in the story.

Every edition contributes to an evolving timeline.

---

## 🌍 The Concept

Imagine opening a newspaper from the future.

One day, you might read:

> **India launches its first fully autonomous AI-managed city.**

A few editions later:

> **Aethera Core faces its first major infrastructure crisis.**

Then:

> **Government launches an investigation into autonomous city governance.**

FutureNews AI connects these events into a continuously evolving fictional universe.

The goal is to create:

> **"A newspaper from an alternate future that writes itself every day."**

---

# 🤖 Autonomous Agent Workflow

FutureNews AI is designed as an autonomous agent rather than a one-time content generator.

The workflow is:

```text
EventBridge Scheduler
        │
        ▼
FutureNews AI Agent
        │
        ▼
Load Persistent World Memory
        │
        ▼
Analyze Previous Events
        │
        ▼
Generate Next Future Event
        │
        ▼
Self Review & Validation
        │
        ├── Is the story consistent?
        ├── Is it creative?
        ├── Does it avoid repetition?
        └── Does it create future possibilities?
        │
        ▼
Revise if Necessary
        │
        ▼
Generate Final Newspaper Edition
        │
        ▼
Store in DynamoDB
        │
        ▼
The Future World Evolves
```

No human needs to open the app for this to happen — a scheduled EventBridge trigger wakes
the Lambda agent on its own cadence and the world keeps advancing in the background.

---

## 🧠 Persistent Agent Memory

The core idea behind FutureNews AI is persistent memory.

The AI agent does not generate every story independently.

Before creating a new edition, it considers:

- Previous news events
- Current world state
- Active storylines
- Important facts introduced in earlier editions
- Possible future developments
- Recent headlines

This allows the fictional world to evolve over time.

For example:

```
Edition 1
│
├── India launches Aethera,
│   its first fully autonomous AI-managed city.
│
Edition 2
│
├── Aethera Core makes a controversial
│   autonomous emergency decision.
│
Edition 3
│
├── Legal and ethical debates emerge
│   around AI authority.
│
Edition 4
│
├── A major cybersecurity incident
│   disrupts the AI-managed city.
│
Edition 5+
│
└── The consequences continue to evolve.
```

Each new event becomes part of the memory used to generate future events.

---

## ☁️ AWS Architecture

```
                         ┌─────────────────────┐
                         │ EventBridge         │
                         │ Scheduler           │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ AWS Lambda          │
                         │ FutureNews Agent    │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │ Amazon       │  │ Amazon       │  │ Amazon       │
          │ Bedrock      │  │ DynamoDB     │  │ API Gateway  │
          │              │  │              │  │              │
          │ AI Generation│  │ World Memory │  │ Frontend API │
          └──────────────┘  │ News Archive │  └──────┬───────┘
                            └──────────────┘         │
                                                     ▼
                                            ┌─────────────────┐
                                            │ React + Vite    │
                                            │ FutureNews UI   │
                                            └─────────────────┘
```

---

## 🛠️ Technologies Used

**Frontend**
- React
- Vite
- JavaScript
- CSS

**AWS**
- Amazon EventBridge Scheduler
- AWS Lambda
- Amazon Bedrock
- Amazon DynamoDB
- Amazon API Gateway
- AWS Amplify

---

## ⚙️ How It Works

### 1. The Agent Wakes Up

Amazon EventBridge Scheduler automatically triggers the FutureNews AI agent.

The user does not need to open the application.

### 2. The Agent Reads Its Memory

The Lambda function retrieves:

- Current fictional world state
- Previous FutureNews editions
- Active storylines
- Important facts

from Amazon DynamoDB.

### 3. The AI Generates the Next Event

Amazon Bedrock is used to generate a new event that logically continues the fictional world.

The agent is instructed to avoid simply repeating previous stories.

### 4. The Agent Reviews Its Own Work

A self-review step evaluates the generated event.

The agent checks:

- Story consistency
- Creativity
- Repetition
- Timeline consistency
- Future storytelling potential

If problems are detected, the content can be revised.

### 5. The New Edition Is Stored

The final edition is saved to DynamoDB.

Each edition contains information such as:

```json
{
  "editionId": "edition-010",
  "editionNumber": 10,
  "futureDate": "2048-05-20",
  "headline": "Aethera Achieves Milestone in Quantum AI Scalability",
  "category": "Technology Breakthrough",
  "breakingSummary": "A new breakthrough changes the future of autonomous cities.",
  "article": "Full AI-generated newspaper article...",
  "backgroundContext": "Context from previous events...",
  "newFacts": [],
  "possibleFutureDevelopments": []
}
```

The next generation cycle can then use this information as part of its persistent memory.

---

## 📰 Features

- 🤖 Autonomous AI news generation
- 🧠 Persistent fictional world memory
- 🔄 Self-review and revision loop
- 📰 AI-generated future newspaper editions
- 🌍 Evolving storylines
- ⏳ Future event timeline
- 📚 Previous editions archive
- ⚡ On-demand edition generation
- ☁️ Fully serverless AWS architecture

---

## 🔌 API

The backend exposes API endpoints through Amazon API Gateway.

```
GET /generate
GET /latest
GET /editions
GET /editions/{editionId}
```

**Base URL:** `https://92iqdbkjtd.execute-api.ap-south-1.amazonaws.com/prod`

### Generate

`GET /generate`

Triggers the FutureNews AI agent and creates a new edition.

### Latest Edition

`GET /latest`

Returns the latest available FutureNews edition.

### Archive

`GET /editions`

Returns previous editions.

### Specific Edition

`GET /editions/{editionId}`

Returns a specific edition.

> ⚠️ **Current limitation:** `/latest`, `/editions`, and `/editions/{editionId}` are
> intended to be read-only, but in the live deployment they currently trigger the same
> generation pipeline as `/generate` — each call creates a new edition instead of reading
> existing data. See [Known Issues](#-known-issues) below.

---

## 🖥️ Frontend

The FutureNews AI interface is designed as a futuristic digital newspaper.

Users can:

- Read the latest edition
- Browse previous editions
- Explore the future timeline
- View the evolving fictional world
- Learn how the autonomous agent works
- Generate the next edition manually

The design combines:

**Futuristic technology × Digital newspaper × AI storytelling**

The frontend is built with React + Vite and talks to the API exclusively through
`frontend/src/services/futureNewsApi.js`, which reads the API base URL from
`VITE_API_BASE_URL` — nothing is hardcoded. `GET /generate` is only ever called when
the user clicks **Generate Next Future**, never automatically on page load.

See [`frontend/README.md`](frontend/README.md) for the component-level breakdown.

---

## 📁 Project Structure

```
FutureNews-AI
│
├── backend
│   ├── src
│   │   ├── handler.py
│   │   ├── agent
│   │   │   ├── future_news_agent.py
│   │   │   ├── generator.py
│   │   │   ├── memory.py
│   │   │   └── reviewer.py
│   │   ├── prompts
│   │   └── services
│   │       ├── bedrock_service.py
│   │       └── dynamodb_service.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   └── .env
│
└── README.md
```

---

## 🚀 Running the Frontend Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/FutureNews-AI.git
```

Navigate to the frontend:

```bash
cd FutureNews-AI/frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```
VITE_API_BASE_URL=YOUR_API_GATEWAY_URL
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## ⚠️ Known Issues

**Read endpoints currently mutate data.** `GET /latest`, `GET /editions`, and
`GET /editions/{id}` are meant to be read-only, but every call to them currently runs the
full generation pipeline and stores a **new** edition in DynamoDB — the same behavior as
`GET /generate`. This was confirmed by calling `/latest` twice in a row: the returned
`editionId` incremented both times, and the response was wrapped in
`{"message": "FutureNews edition generated successfully.", "edition": {...}, ...}`, which
only the generate path should return.

**Root cause (from [`backend/src/handler.py`](backend/src/handler.py)):** there is a
single `lambda_handler` with no branching on HTTP method or path — it unconditionally
runs load-memory → run-agent → create-edition → save-to-DynamoDB on every invocation.
[`backend/src/services/dynamodb_service.py`](backend/src/services/dynamodb_service.py)
already has a read-only `get_all_editions()` helper, but there's no `get_latest_edition()`
or `get_edition_by_id()`, and nothing routes the read paths to read-only logic — all four
API Gateway routes appear to point at this same Lambda.

**Fix needed (backend, not the frontend in this repo):**
1. Add read-only handling — either branching in `lambda_handler` on the route/method, or a
   separate Lambda — that for `/latest`, `/editions`, `/editions/{id}` only reads from
   DynamoDB via `get_all_editions()` plus new `get_latest_edition()` and
   `get_edition_by_id(edition_id)` helpers.
2. Wire those three routes in API Gateway to the read-only logic, leaving `GET /generate`
   as the only route that runs the existing generation pipeline.

Until fixed, avoid loading the frontend against the live API more than necessary — every
page load currently generates and stores a new fictional edition.

---

## 🔮 Future Improvements

Possible future enhancements include:

- Multiple fictional worlds
- AI-generated newspaper images
- Multiple independent storylines
- Character and organization memory
- Event relationship graphs
- Storyline branching
- Human editorial controls
- Automatic daily generation
- Email delivery of new editions
- Personalized future newspapers

---

## 📚 What I Learned

Building FutureNews AI was an exploration of what makes an AI system behave more like an agent rather than a simple text generator.

Key learnings include:

- Designing autonomous AI workflows
- Using Amazon EventBridge Scheduler for autonomous execution
- Building serverless applications with AWS Lambda
- Integrating generative AI with Amazon Bedrock
- Designing persistent memory using Amazon DynamoDB
- Creating self-review and revision loops
- Connecting serverless backends through Amazon API Gateway
- Building and deploying React applications
- Designing AI systems where previous outputs influence future decisions

The biggest lesson was that memory changes the nature of an AI application.

Instead of generating isolated responses, FutureNews AI allows previous events to influence what happens next.

The result is an evolving fictional world.

---

**FutureNews AI** — *An autonomous newspaper from the future.*
Built with AWS + Amazon Bedrock.
