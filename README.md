# 📰 FutureNews AI

> ### *Tomorrow's headlines, written before they happen.*

**FutureNews AI** is an autonomous AI-powered newspaper that generates fictional news from the future.

Unlike a traditional content generator, FutureNews AI maintains a persistent memory of a fictional world. Every new edition analyzes previous events, world state, and ongoing storylines before deciding what happens next.

The result is an evolving fictional timeline where one event influences the next.

---

# 🚀 Live Architecture

```text
                        ┌─────────────────────┐
                        │   React + Vite      │
                        │    Frontend UI      │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │    AWS Amplify      │
                        │ Frontend Hosting    │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │  Amazon API Gateway │
                        │  HTTP API (stage:   │
                        │  prod)              │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │    AWS Lambda       │
                        │  FutureNews Agent   │
                        │  (Python, ap-south-1)│
                        └──────────┬──────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ▼                ▼                ▼
        ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
        │ Amazon DynamoDB │ │ Amazon Bedrock   │ │ Amazon          │
        │ FutureNewsWorld │ │ Claude Sonnet 4.5│ │ EventBridge     │
        │ State + Editions│ │ (global profile) │ │ Scheduler       │
        └─────────────────┘ └──────────────────┘ └─────────────────┘
```

> 📄 Full service inventory with exact resource names: [`docs/AWS_SERVICES.md`](docs/AWS_SERVICES.md)

---

# 🤖 How FutureNews AI Works

FutureNews AI operates as an autonomous agent.

The agent does not simply generate random news articles.

Instead, it follows a structured workflow.

```text
EventBridge Scheduler
        │
        ▼
AWS Lambda wakes up
        │
        ▼
Load World Memory
        │
        ├── Previous editions
        ├── World facts
        ├── Ongoing storylines
        └── Previous consequences
        │
        ▼
Generate Next Future Event
        │
        ▼
Amazon Bedrock (Converse API)
        │
        ▼
Claude Sonnet 4.5 (global inference profile)
        │
        ▼
AI Self Review
        │
        ├── Check timeline consistency
        ├── Check duplicate events
        ├── Check logical progression
        └── Review future plausibility
        │
        ▼
Save New Edition
        │
        ├── DynamoDB Editions
        └── Update World State
        │
        ▼
Next Edition
```

Each edition becomes part of the memory used to generate the next event.

---

# 🧠 Persistent World Memory

The core idea behind FutureNews AI is **persistent memory**.

The system stores information about the fictional world inside Amazon DynamoDB.

Example:

```text
Edition 1
    │
    ▼
AI-powered autonomous city introduced
    │
    ▼
Edition 2
    │
    ▼
New AI transportation infrastructure
    │
    ▼
Edition 3
    │
    ▼
Security concerns emerge
    │
    ▼
Edition 4
    │
    ▼
Global regulations are introduced
    │
    ▼
Edition 5
    │
    ▼
Technology evolves further
```

This allows the fictional world to evolve instead of generating unrelated news articles.

---

# ✨ Features

- 🤖 Autonomous AI news generation
- 🧠 Persistent fictional world memory
- 📰 AI-generated future news editions
- 🔄 Storyline continuity
- 🧠 Previous event awareness
- 🔍 AI self-review
- 📅 Future timeline generation
- 📚 Complete edition archive
- ⚡ Serverless AWS architecture
- 🌐 Public REST API
- 🚀 Automated frontend deployment
- ⏰ Scheduled autonomous execution

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- AWS Amplify

## Backend

- Python
- AWS Lambda
- Amazon API Gateway

## AI

- Amazon Bedrock
- Bedrock Converse API
- Claude Sonnet 4.5 (`global.anthropic.claude-sonnet-4-5-20250929-v1:0` inference profile)

## Database

- Amazon DynamoDB (`FutureNewsEditions`, `FutureNewsWorldState`)

## Automation

- Amazon EventBridge Scheduler

---

# ☁️ AWS Services Used

All backend resources run in **`ap-south-1`** (Mumbai).

| AWS Service | Resource name / identifier | Purpose |
|---|---|---|
| AWS Amplify Hosting | Frontend app (build of `frontend/`) | Builds and hosts the React + Vite frontend from GitHub |
| Amazon API Gateway | HTTP API, stage `prod` | Exposes the FutureNews HTTP API in front of Lambda |
| AWS Lambda | `handler.lambda_handler` (`agent.zip`) | Runs the API router and the FutureNews AI agent |
| Amazon Bedrock | `bedrock-runtime` · `Converse` API | Provides generative AI capabilities |
| Claude Sonnet 4.5 | `global.anthropic.claude-sonnet-4-5-20250929-v1:0` | Generates future events, self-review, revisions, and articles |
| Amazon DynamoDB | `FutureNewsEditions` (PK `editionId`) | Stores every generated edition |
| Amazon DynamoDB | `FutureNewsWorldState` (PK `worldId`, item `world-main`) | Persistent world memory |
| Amazon EventBridge Scheduler | Recurring schedule → Lambda `/generate` | Triggers autonomous agent execution |
| AWS IAM | Lambda execution role | DynamoDB + Bedrock `InvokeModel`/`Converse` permissions |
| Amazon CloudWatch Logs | `/aws/lambda/<function>` | Lambda monitoring and logs |

See [`docs/AWS_SERVICES.md`](docs/AWS_SERVICES.md) for the code references behind each entry.

---

# 🔌 API Endpoints

The backend exposes the following API routes.

## Get Latest Edition

```http
GET /latest
```

Returns the most recent FutureNews edition.

Example:

```json
{
  "editionNumber": 1,
  "editionId": "edition-001",
  "futureDate": "2047-01-15",
  "headline": "The First AI-Managed City Begins a New Era",
  "category": "Technology",
  "breakingSummary": "A major technological event changes the future...",
  "article": "Full AI-generated article..."
}
```

---

## Get All Editions

```http
GET /editions
```

Returns all generated FutureNews editions.

This endpoint only reads data from DynamoDB.

It does **not** trigger AI generation.

---

## Get Edition by ID

```http
GET /editions/{editionId}
```

Example:

```http
GET /editions/edition-001
```

Returns a specific edition.

---

## Generate Next Future Edition

```http
GET /generate
```

This endpoint triggers the FutureNews AI agent.

The workflow:

```text
/generate
    │
    ▼
Load World Memory
    │
    ▼
Load Previous Editions
    │
    ▼
Generate Future Event
    │
    ▼
AI Review
    │
    ▼
Save Edition
    │
    ▼
Update World State
```

Only this route calls Amazon Bedrock.

The read-only endpoints:

```text
/latest
/editions
/editions/{id}
```

only interact with DynamoDB.

---

# 🔁 End-to-End Flow

## Read path — `GET /latest`, `/editions`, `/editions/{id}`

```text
Browser (Amplify-hosted React app)
   │  fetch(`${VITE_API_BASE_URL}${path}`)
   ▼
Amazon API Gateway  (HTTP API, stage: prod)
   │  event.requestContext.http.path = "/prod/latest"
   ▼
AWS Lambda  handler.lambda_handler
   │  strip "/prod" prefix  →  "/latest"
   │  route dispatch (no Bedrock)
   ▼
Amazon DynamoDB
   ├── FutureNewsEditions   (get_item / scan)
   └── FutureNewsWorldState (get_item)
   │
   ▼
Decimal → int/float normalization  (helpers.convert_decimals / decimal_serializer)
   │
   ▼
JSON response + CORS headers  →  API Gateway  →  Browser
```

## Generate path — `GET /generate` (also the EventBridge Scheduler target)

```text
Amazon EventBridge Scheduler  ──(recurring)──┐
                                             │
Browser "Generate Next Future" button ───────┤
                                             ▼
API Gateway (prod)  →  AWS Lambda  generate_future_news()
   │
   1. get_world_state("world-main")          ← DynamoDB FutureNewsWorldState
   2. get_all_editions()                     ← DynamoDB FutureNewsEditions (scan)
   3. run_future_news_agent(world, editions)
        ├── build memory context (recent 5 editions + world state)
        ├── generate event      → Bedrock Converse (Claude Sonnet 4.5, temp 0.8)
        ├── validate event date (deterministic, no model call)
        ├── AI self-review      → Bedrock Converse (temp 0.3)
        ├── revise if score < 7 / not approved / bad date
        │       → Bedrock Converse (temp 0.6) + re-review
        └── write article       → Bedrock Converse (max_tokens 2000, temp 0.7)
   4. create_edition(...)  →  edition-00N
   5. update_world_memory(...)  (new facts, storylines, date, edition count)
   6. save_edition()          → DynamoDB FutureNewsEditions (put_item)
      update_world_state()     → DynamoDB FutureNewsWorldState (put_item)
   │
   ▼
JSON { edition, agentReview, dateValidation, wasRevised } + CORS  →  Browser
```

Every Bedrock call goes through the `global.anthropic.claude-sonnet-4-5-20250929-v1:0`
inference profile in `ap-south-1`. Lambda logs land in CloudWatch Logs.

---

# 🧩 Agent Architecture

The FutureNews agent is composed of multiple logical components.

```text
FutureNews Agent
│
├── Memory System
│     ├── Load World State
│     └── Load Previous Editions
│
├── Generator
│     └── Generate Future Event
│
├── Reviewer
│     ├── Check consistency
│     ├── Detect repetition
│     └── Evaluate plausibility
│
├── Date Validator
│     └── Ensure chronological progression
│
└── Persistence Layer
      ├── Save Edition
      └── Update World State
```

---

# 🔄 Agent Generation Workflow

When the agent generates a new edition:

### 1. Load World Memory

The agent loads:

- Previous editions
- Current world state
- Important historical events
- Ongoing storylines

---

### 2. Generate a Future Event

Claude Sonnet 4.5 (via the Amazon Bedrock Converse API) generates a new event based on the existing fictional world.

The event includes:

```text
Headline
Category
Future Date
Breaking Summary
Full Article
Background Context
Related Events
New Facts
Possible Future Developments
```

---

### 3. AI Self Review

The generated event is reviewed.

The reviewer checks:

- Does the event logically follow previous events?
- Does it repeat an earlier event?
- Does it introduce a meaningful development?
- Does the future date progress correctly?
- Does it fit the fictional world?

Example response:

```json
{
  "approved": true,
  "score": 9,
  "issues": [],
  "feedback": "The event is consistent with the established world."
}
```

---

### 4. Save the Edition

Once approved, the edition is stored in DynamoDB.

Example:

```text
edition-001
edition-002
edition-003
edition-004
...
```

---

### 5. Update World State

The global world memory is updated.

The next generation will use the newly created edition as part of its context.

---

# 🗄️ DynamoDB Data Model

## Editions

Each edition contains information such as:

```json
{
  "editionId": "edition-001",
  "editionNumber": 1,
  "futureDate": "2047-01-15",
  "headline": "Future Event Headline",
  "category": "Technology",
  "breakingSummary": "Short summary",
  "article": "Full generated article",
  "backgroundContext": "Context from the fictional world",
  "relatedEvents": [],
  "newFacts": [],
  "possibleFutureDevelopments": [],
  "createdAt": "2026-08-21T00:00:00Z"
}
```

---

## World State

The world state stores persistent information about the fictional universe.

Example:

```json
{
  "worldId": "global",
  "totalEditions": 10,
  "currentFutureDate": "2050-04-18",
  "worldFacts": [],
  "activeStorylines": []
}
```

---

# 🌐 Frontend

The frontend is built using React and Vite.

The application contains:

```text
FutureNews AI
│
├── Latest Edition
│
├── Future Timeline
│
├── Edition Archive
│
├── Generate Next Future
│
├── Agent Workflow
│
├── Technology Stack
│
└── About the Agent
```

The frontend communicates with the API Gateway backend using:

```text
VITE_API_BASE_URL
```

Example:

```env
VITE_API_BASE_URL=https://YOUR_API_ID.execute-api.REGION.amazonaws.com/prod
```

---

# 🚀 Deployment Architecture

## Frontend

```text
GitHub
   │
   ▼
AWS Amplify
   │
   ▼
Build React Application
   │
   ▼
Deploy
   │
   ▼
Live Website
```

Every push to the connected repository can trigger a new frontend deployment.

---

## Backend

```text
Python Source Code
        │
        ▼
Lambda Deployment Package
        │
        ▼
agent.zip
        │
        ▼
AWS Lambda
        │
        ▼
API Gateway
```

The Lambda deployment package must contain:

```text
handler.py
agent/
services/
prompts/
utils/
```

at the ZIP root.

---

# 🧪 Important Engineering Challenges Solved

Building FutureNews AI involved solving several real-world serverless and AI integration issues.

---

## 1. API Routes Were Accidentally Triggering Generation

Initially:

```text
/latest
/editions
```

were incorrectly invoking the same Lambda generation logic as:

```text
/generate
```

This caused new AI-generated editions to be created simply by loading the frontend.

### Solution

Explicit route dispatch was implemented.

```text
/latest
    ↓
DynamoDB only

/editions
    ↓
DynamoDB only

/editions/{id}
    ↓
DynamoDB only

/generate
    ↓
FutureNews AI Agent
    ↓
Amazon Bedrock
```

---

## 2. DynamoDB Decimal Serialization

DynamoDB returns numeric values as Python `Decimal` objects.

This caused errors such as:

```text
Object of type Decimal is not JSON serializable
```

The issue occurred both:

- When returning API responses
- Inside the AI generation pipeline when using `json.dumps()`

### Solution

A recursive Decimal conversion utility was implemented.

```text
Decimal
   ↓
int / float
   ↓
JSON-safe Python objects
```

The conversion is applied when DynamoDB data enters the agent memory pipeline.

---

## 3. Edition Number Formatting

The edition number was retrieved from DynamoDB and could be returned as a `Decimal`.

Formatting logic such as:

```python
f"edition-{edition_number:03d}"
```

requires a normal integer.

### Solution

The edition number is converted to a Python integer before arithmetic and formatting.

---

## 4. API Gateway Stage Prefix

Lambda console tests used paths like:

```text
/latest
```

However, production API Gateway requests reached Lambda as:

```text
/prod/latest
```

This caused:

```text
404 No route found for '/prod/latest'
```

### Solution

The API Gateway stage prefix is normalized before route dispatch.

```text
/prod/latest
        ↓
/latest
```

The same applies to:

```text
/prod/editions
        ↓
/editions

/prod/generate
        ↓
/generate
```

---

## 5. CORS Issues

The frontend initially could not communicate with the API.

### Solution

CORS headers were added to all responses.

```text
Access-Control-Allow-Origin: *

Access-Control-Allow-Headers:
Content-Type

Access-Control-Allow-Methods:
GET,POST,OPTIONS
```

The Lambda also handles:

```http
OPTIONS
```

requests directly.

---

## 6. Bedrock Model Access

Early configurations hit errors around model access and, for some model IDs, AWS
Marketplace permissions (`aws-marketplace:ViewSubscriptions` / `Subscribe`).

### Solution

The project settled on **Claude Sonnet 4.5** accessed through the **global
cross-region inference profile**:

```text
Amazon Bedrock
        ↓
Claude Sonnet 4.5
        ↓
global.anthropic.claude-sonnet-4-5-20250929-v1:0
```

Model access is granted in the Bedrock console for the `ap-south-1` region.

---

## 7. On-Demand Throughput Not Supported

Invoking a base model ID directly can produce:

```text
Invocation of model ID <base-model-id>
with on-demand throughput isn't supported
```

### Solution

The model is always invoked through the `global.` inference profile ID rather than
the direct base model ID (`backend/src/services/bedrock_service.py`).

---

# 📁 Project Structure

```text
FutureNews-AI/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── LatestEdition.jsx
│   │   │   ├── AgentWorkflow.jsx
│   │   │   ├── FutureTimeline.jsx
│   │   │   ├── EditionArchive.jsx
│   │   │   ├── EditionModal.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   ├── TechnologyStack.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useFutureNews.js
│   │   │
│   │   ├── services/
│   │   │   └── futureNewsApi.js
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   └── .env
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── agent/
│   │   │   ├── generator.py
│   │   │   ├── reviewer.py
│   │   │   ├── memory.py
│   │   │   └── future_news_agent.py
│   │   │
│   │   ├── services/
│   │   │   ├── dynamodb_service.py
│   │   │   └── bedrock_service.py
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.py
│   │   │
│   │   ├── prompts/
│   │   │
│   │   └── handler.py
│   │
│   └── lambda_package/
│       └── agent.zip
│
└── README.md
```

---

# ⚙️ Local Development

## Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/FutureNews-AI.git

cd FutureNews-AI
```

---

## Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```env
VITE_API_BASE_URL=https://YOUR_API_GATEWAY_URL/prod
```

Run the development server:

```bash
npm run dev
```

---

## Build the Frontend

```bash
npm run build
```

---

# 🔐 IAM Permissions

The Lambda execution role requires permissions for the AWS services used by the application.

Typical permissions include:

```text
DynamoDB
    ├── GetItem
    ├── PutItem
    ├── UpdateItem
    ├── Scan
    └── Query

Amazon Bedrock
    └── bedrock:InvokeModel
```

Depending on the implementation and Bedrock API configuration, Converse/inference-profile access must also be permitted.

---

# 🧠 Key Design Principle

FutureNews AI follows one important rule:

> **Reading the future should never create the future.**

Therefore:

```text
GET /latest
GET /editions
GET /editions/{id}
```

are strictly read-only.

Only:

```text
/generate
```

is allowed to invoke the AI generation pipeline.

---

# 🌤️ Part of the AWS Summer Build Series

FutureNews AI is my season-finale entry for the **AWS Builder Center Summer Build
Series** (June–August 2026). The summer moved through three stages — ship an idea
from the Wishlist, build a creative app, then build an agent that runs on its own —
and this project is where those threads come together:

| Summer theme | How FutureNews AI expresses it |
|---|---|
| A creative app | An AI newspaper that writes fictional headlines from the future |
| An autonomous agent | EventBridge Scheduler wakes a Lambda agent with no human trigger |
| A finishing touch | The agent's self-review (score, verdict, revision pass, timeline check) is now surfaced in the UI after each generation |

**What I learned across the summer:**

- Inference profiles matter — base model IDs fail with on-demand throughput; the
  `global.` Claude Sonnet 4.5 profile is what actually works in `ap-south-1`.
- "Reading the future should never create the future" — separating read-only
  routes from the single generation route kept costs and side effects predictable.
- Persistent memory is what turns a content generator into an agent: every edition
  is written from the full history of prior editions and world state.

---

# 🔮 Future Improvements

Possible future enhancements include:

- [ ] Scheduled automatic generation with configurable frequency
- [ ] Multiple fictional worlds
- [ ] Different AI agents for politics, technology, economy, and science
- [ ] Multi-agent debate before publishing an edition
- [ ] Edition search and filtering
- [ ] Interactive world map
- [ ] Storyline visualization
- [ ] AI-generated newspaper images
- [ ] User voting on possible future developments
- [ ] WebSocket live generation updates
- [ ] CloudWatch dashboards and monitoring
- [ ] Cost monitoring and Bedrock usage tracking
- [ ] Authentication for generation controls
- [ ] Rate limiting for public API access

---

# 🎯 What Makes FutureNews AI Different?

Most AI content generators work like this:

```text
User Prompt
    ↓
AI
    ↓
Generated Content
```

FutureNews AI works differently:

```text
Persistent World
        ↓
Previous Events
        ↓
World Memory
        ↓
AI Reasoning
        ↓
Generate Next Event
        ↓
AI Self Review
        ↓
Save Memory
        ↓
Repeat
```

The application creates an evolving fictional universe rather than isolated AI-generated articles.

---

# 🏗️ Built With

- ☁️ AWS (`ap-south-1`)
- 🤖 Amazon Bedrock (Converse API)
- 🧠 Claude Sonnet 4.5 (global inference profile)
- ⚡ AWS Lambda (Python)
- 🗄️ Amazon DynamoDB
- 🌐 Amazon API Gateway (HTTP API)
- ⏰ Amazon EventBridge Scheduler
- 🚀 AWS Amplify
- ⚛️ React
- ⚡ Vite
- 🐍 Python

---

# 👨‍💻 Author

**Devanand Jayaraman**

AI/ML Engineer | AWS | Generative AI | Agentic AI

---

# ⭐ Final Note

FutureNews AI is an experiment in autonomous storytelling.

It explores a simple question:

> **What if an AI could remember an entire fictional world and continuously write its future?**

Every edition becomes history.

Every new event changes the world.

And the next headline has not happened yet.

---

## 📰 FUTURENEWS AI

### *Tomorrow's headlines, written before they happen.*

**Built with AWS + Amazon Bedrock**
