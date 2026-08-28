# Weekend Showcase Challenge: FutureNews AI

**Tags:** #application #challenge

> *Tomorrow's headlines, written before they happen.*

## Vision and what it does

FutureNews AI is an autonomous AI newspaper that writes fictional news from the
future. It is not a prompt-in, article-out content generator. It maintains a
**persistent memory of a fictional world** in DynamoDB, and every new edition is
written from the full history of previous events, the current world state, and the
storylines already in motion.

The result is an evolving timeline: Edition 1 introduces the first AI-managed city,
Edition 2 builds new AI transport infrastructure on top of it, Edition 3 raises
security concerns, Edition 4 brings global regulation — each headline is a
consequence of the last. Reading the site never generates anything; a scheduled
agent does that on its own.

Three things make it work:

- **Memory system** — loads world state and the most recent editions before deciding what happens next.
- **Generator** — drafts the next plausible future event (headline, article, consequences, new world facts).
- **Reviewer + date validator** — the agent scores its own draft for timeline consistency and repetition, revises if the score is below threshold, and deterministically checks that the event date actually moves the timeline forward.

## How I built it

The backend is a single Python AWS Lambda function behind an API Gateway HTTP API.
One of the first real bugs was that `/latest` and `/editions` were falling through
into the same code path as `/generate`, so simply loading the frontend was creating
new editions. I fixed it with explicit route dispatch and adopted one rule for the
whole project: **reading the future should never create the future.** Only
`/generate` is allowed to call Bedrock.

Other decisions and challenges along the way:

- **DynamoDB `Decimal` serialization** broke both API responses and the
  `json.dumps()` calls inside the agent's memory pipeline. A recursive
  `Decimal → int/float` converter runs as data enters the agent.
- **API Gateway stage prefix** — production requests arrive as `/prod/latest`, not
  `/latest`, which 404'd every route. The handler strips the stage prefix before
  dispatch.
- **Bedrock model access** — invoking a base model ID directly fails with
  "on-demand throughput isn't supported." The project invokes Claude Sonnet 4.5
  through the `global.` cross-region inference profile
  (`global.anthropic.claude-sonnet-4-5-20250929-v1:0`) instead.

This weekend's finishing touch: the `/generate` response already returned the
agent's self-review (score, approved/rejected verdict, whether a revision pass ran,
and the timeline check), but the UI threw it away. Now the frontend surfaces it as
an **Agent Self-Review** card after every generation, so you can watch the agent
critique and correct itself. I also added client-side category filtering to the
edition archive, a live "timeline reached &lt;date&gt;" status in the hero, and
cleaned up a stale "Amazon Nova Lite" reference left over from an earlier model
choice.

## AWS services used

| Service | Role |
|---|---|
| Amazon EventBridge Scheduler | Wakes the agent on a recurring schedule — the autonomous trigger |
| AWS Lambda (Python) | Runs the API router and the FutureNews agent |
| Amazon Bedrock (Converse API) | Claude Sonnet 4.5 via the global inference profile — event generation, self-review, revision, article writing |
| Amazon DynamoDB | `FutureNewsEditions` + `FutureNewsWorldState` — persistent world memory |
| Amazon API Gateway (HTTP API) | Public REST API, stage `prod` |
| AWS Amplify Hosting | Builds and hosts the React + Vite frontend from GitHub |
| Amazon CloudWatch Logs | Agent run logs |
| AWS IAM | Lambda execution role (DynamoDB + Bedrock `Converse`) |

**Architecture:** EventBridge Scheduler → Lambda agent → load world memory from
DynamoDB → Bedrock (Claude Sonnet 4.5) generates event → AI self-review + date
validation → revise if needed → write article → save edition and updated world
state to DynamoDB. The browser only ever hits the read-only routes; Amplify serves
the static React app.

## What I learned across the summer

The Summer Build Series moved through three stages — ship a Wishlist idea, build a
creative app, then build an agent that runs on its own — and FutureNews AI is where
they converge.

- **Persistent memory is what makes something an agent** rather than a content
  generator. The interesting behavior — storyline continuity, consequences,
  self-correction — all comes from feeding the full history back in.
- **Inference profiles are not optional.** Every "model access" error I hit
  disappeared once I stopped calling base model IDs and went through the `global.`
  profile.
- **Separating side-effecting routes from read-only ones** kept the project cheap
  and predictable — a public API that generates content on every page load is a
  bill waiting to happen.

## Links

- **Repo:** https://github.com/DEVANAND-JAYARAMAN/FutureNews-AI
- **Live app:** _&lt;your Amplify URL&gt;_

## A builder who inspired me

_&lt;tag a builder from the community here&gt;_ — thanks for a great summer of challenges.
