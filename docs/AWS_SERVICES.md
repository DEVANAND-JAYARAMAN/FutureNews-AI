# ☁️ AWS Services Used — FutureNews AI

This document lists every AWS service the project depends on, the **exact resource
names / identifiers** found in the source code, and where each one is wired up.

> Region for all backend resources: **`ap-south-1`** (Mumbai)
> Source of truth: `backend/src/**` and `frontend/src/**`.

---

## Summary Table

| # | AWS Service | Resource name / identifier | Where in source | Purpose |
|---|-------------|----------------------------|-----------------|---------|
| 1 | **Amazon Bedrock** (Bedrock Runtime) | Model ID `global.anthropic.claude-sonnet-4-5-20250929-v1:0` (Claude Sonnet 4.5, global cross-region inference profile) | `backend/src/services/bedrock_service.py` | Generates future events, self-review verdicts, revisions, and the full newspaper article via the `converse` API |
| 2 | **Amazon DynamoDB** | Table `FutureNewsEditions` (partition key `editionId`) | `backend/src/services/dynamodb_service.py` | Stores every generated newspaper edition |
| 3 | **Amazon DynamoDB** | Table `FutureNewsWorldState` (partition key `worldId`, item id `world-main`) | `backend/src/services/dynamodb_service.py` | Persistent world memory: facts, storylines, entities, current fictional date, edition count |
| 4 | **AWS Lambda** | Handler `handler.lambda_handler`; deployment package `backend/lambda_package/agent.zip` | `backend/src/handler.py` | Runs the API router and the autonomous FutureNews agent |
| 5 | **Amazon API Gateway** | HTTP API (payload format 2.0), stage `prod` | `backend/src/handler.py` (`get_request_path`, `/prod/` prefix stripping) | Public REST-style HTTP interface in front of Lambda |
| 6 | **AWS Amplify Hosting** | Frontend app; build output of `frontend/` (`npm run build`) | `frontend/` (`VITE_API_BASE_URL` env var in `frontend/src/services/futureNewsApi.js`) | Builds and hosts the React + Vite frontend, connected to GitHub |
| 7 | **Amazon EventBridge Scheduler** | Recurring schedule targeting the Lambda `/generate` path | Referenced in `frontend/src/components/TechnologyStack.jsx` and `README.md` (infra-side, not in application code) | Wakes the agent on a recurring schedule to publish a new edition autonomously |
| 8 | **AWS IAM** | Lambda execution role | Implied by all `boto3` calls | Grants Lambda `dynamodb:GetItem/PutItem/Scan` on the two tables and `bedrock:InvokeModel` / `bedrock:Converse` on the inference profile |
| 9 | **Amazon CloudWatch Logs** | Log group `/aws/lambda/<function-name>` | Implicit (default Lambda logging) | Captures Lambda execution logs and errors |

---

## Detail by Service

### 1. Amazon Bedrock — `backend/src/services/bedrock_service.py`

```python
REGION   = "ap-south-1"
MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"

bedrock_runtime = boto3.client(service_name="bedrock-runtime", region_name=REGION)
bedrock_runtime.converse(modelId=MODEL_ID, messages=[...], inferenceConfig={...})
```

- Client: `bedrock-runtime`
- API: `Converse`
- Model: **Claude Sonnet 4.5** through the **`global.` cross-region inference profile**
  (direct on-demand invocation of the base model ID is not used).
- Called four ways from `backend/src/agent/`:
  - event generation (`generator.py`, temp `0.8`)
  - AI self-review (`reviewer.py`, temp `0.3`)
  - event revision (`future_news_agent.py`, temp `0.6`)
  - article writing (`future_news_agent.py`, `max_tokens=2000`, temp `0.7`)

> Note: earlier drafts of this project used Amazon Nova Lite; the agent has since
> moved to Claude Sonnet 4.5 via the global inference profile, and the `README.md`
> now reflects that everywhere.

### 2 & 3. Amazon DynamoDB — `backend/src/services/dynamodb_service.py`

```python
dynamodb          = boto3.resource("dynamodb", region_name="ap-south-1")
world_state_table = dynamodb.Table("FutureNewsWorldState")
editions_table    = dynamodb.Table("FutureNewsEditions")
```

| Table | Key | Operations used | Notes |
|-------|-----|-----------------|-------|
| `FutureNewsEditions` | `editionId` (S), e.g. `edition-001` | `get_item`, `put_item`, `scan` | `scan()` used to list/sort all editions (small MVP dataset) |
| `FutureNewsWorldState` | `worldId` (S), single item `world-main` | `get_item`, `put_item` | Holds `currentFutureDate`, `importantFacts`, `activeStorylines`, `entities`, `recentEventIds`, `totalEditions`, `worldSummary` |

Numeric attributes come back as `Decimal` and are normalized in
`backend/src/utils/helpers.py` (`convert_decimals`) and `backend/src/handler.py`
(`decimal_serializer`).

### 4. AWS Lambda — `backend/src/handler.py`

- Entry point: `lambda_handler(event, context)`
- Handles `OPTIONS` (CORS preflight) directly, returns CORS headers on every response.
- Strips the API Gateway stage prefix (`/prod/...` → `/...`) before routing.
- Deployment package layout (`agent.zip` root): `handler.py`, `agent/`, `services/`, `utils/`, `prompts/`.
- Runtime deps: `boto3==1.43.77` (`backend/requirements.txt`).

### 5. Amazon API Gateway — HTTP API

Reads `event["requestContext"]["http"]["path"]` / `["method"]` (payload format 2.0),
with fallbacks to `rawPath` / `path` / `httpMethod`.

| Method | Route | Handler | Calls Bedrock? |
|--------|-------|---------|----------------|
| GET | `/latest` | `get_latest_edition_route` | No (DynamoDB only) |
| GET | `/editions` | `get_all_editions_route` | No (DynamoDB only) |
| GET | `/editions/{editionId}` | `get_edition_by_id_route` | No (DynamoDB only) |
| GET | `/generate` | `generate_future_news` | **Yes** — runs the agent |
| OPTIONS | any | CORS preflight | No |

### 6. AWS Amplify Hosting — `frontend/`

- React 19 + Vite 8 build (`npm run build`).
- Single runtime config value: `VITE_API_BASE_URL` (the API Gateway `prod` invoke URL),
  consumed in `frontend/src/services/futureNewsApi.js`.
- The frontend uses the browser `fetch` API only — **no AWS SDK / Amplify libraries** are bundled.
- Connected to the GitHub repo so a push triggers a rebuild + redeploy.

### 7. Amazon EventBridge Scheduler

Not present in application code — it is an infrastructure-side resource that invokes the
Lambda's `/generate` path on a recurring schedule so editions are published autonomously.
Referenced in the UI (`TechnologyStack.jsx`) and `README.md`.

### 8. AWS IAM

The Lambda execution role needs:

```text
dynamodb:GetItem, dynamodb:PutItem, dynamodb:Scan
    on  FutureNewsEditions, FutureNewsWorldState
bedrock:InvokeModel  (and bedrock:Converse / inference-profile access)
    on  global.anthropic.claude-sonnet-4-5-20250929-v1:0
logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents
```

### 9. Amazon CloudWatch Logs

Default Lambda logging; used to debug the engineering issues documented in `README.md`
(route dispatch, Decimal serialization, stage-prefix 404s, Bedrock model access).

---

## Services NOT used

No Amazon S3 (the `s3transfer` package is only a transitive `boto3` dependency),
Cognito, SNS/SQS, Step Functions, or CloudFormation/CDK/SAM templates are present in the repo.
