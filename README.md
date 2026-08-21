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
                        │     REST API        │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │    AWS Lambda       │
                        │  FutureNews Agent   │
                        └──────────┬──────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ▼                ▼                ▼
        ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐
        │ Amazon DynamoDB │ │ Amazon       │ │ Amazon          │
        │ World Memory    │ │ Bedrock      │ │ EventBridge     │
        │ Editions        │ │ Nova Lite    │ │ Scheduler       │
        └─────────────────┘ └──────────────┘ └─────────────────┘
```

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
Amazon Bedrock
        │
        ▼
Amazon Nova Lite
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
- Amazon Nova Lite
- Bedrock Converse API

## Database

- Amazon DynamoDB

## Automation

- Amazon EventBridge Scheduler

---

# ☁️ AWS Services Used

| AWS Service | Purpose |
|---|---|
| AWS Amplify | Hosts and deploys the React frontend |
| Amazon API Gateway | Exposes the FutureNews REST API |
| AWS Lambda | Runs the FutureNews AI agent |
| Amazon Bedrock | Provides generative AI capabilities |
| Amazon Nova Lite | Generates future events and articles |
| Amazon DynamoDB | Stores editions and persistent world memory |
| Amazon EventBridge Scheduler | Triggers autonomous agent execution |
| AWS IAM | Manages permissions between AWS services |
| Amazon CloudWatch | Lambda monitoring and logs |

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

Amazon Nova Lite generates a new event based on the existing fictional world.

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

An Anthropic Claude model configuration caused an error requiring AWS Marketplace permissions.

```text
aws-marketplace:ViewSubscriptions
aws-marketplace:Subscribe
```

### Solution

The project was switched back to the Amazon Nova Lite inference profile that had previously worked successfully.

The project now uses:

```text
Amazon Bedrock
        ↓
Amazon Nova Lite
        ↓
Inference Profile
```

This avoids requiring additional AWS Marketplace permissions for the configured model access path.

---

## 7. Amazon Nova Lite On-Demand Throughput

Direct model invocation previously produced:

```text
Invocation of model ID amazon.nova-lite-v1:0
with on-demand throughput isn't supported
```

### Solution

The model is invoked using the appropriate inference profile rather than the direct base model ID.

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

- ☁️ AWS
- 🤖 Amazon Bedrock
- 🧠 Amazon Nova Lite
- ⚡ AWS Lambda
- 🗄️ Amazon DynamoDB
- 🌐 Amazon API Gateway
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
