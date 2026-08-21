# FutureNews AI — Frontend

A React + Vite single-page application for **FutureNews AI**, an autonomous AI news agency
from the future. The frontend is a read-only client over an existing AWS backend
(EventBridge Scheduler → Lambda → Bedrock → DynamoDB) — it does not run or manage any
infrastructure itself.

> "A newspaper from an alternate future that writes itself every day."

## Stack

- React 19 + Vite
- Plain CSS (`src/index.css`) — no UI framework
- `fetch`-based API client, no extra HTTP dependency

## Project structure

```
src/
├── components/
│   ├── Header.jsx          # top nav + hero (exports Header and Hero)
│   ├── LatestEdition.jsx   # front-page edition, loading/error states
│   ├── AgentWorkflow.jsx   # EventBridge → Lambda → Bedrock → DynamoDB flow
│   ├── FutureTimeline.jsx  # chronological list of editions
│   ├── EditionArchive.jsx  # grid of all editions
│   ├── EditionModal.jsx    # full edition detail (fetches GET /editions/{id})
│   ├── GenerateButton.jsx  # triggers GET /generate on click only
│   ├── TechnologyStack.jsx # AWS architecture cards
│   └── Footer.jsx
├── hooks/
│   └── useFutureNews.js    # loads latest + editions, exposes generate()
├── services/
│   └── futureNewsApi.js    # centralized API client (uses VITE_API_BASE_URL)
├── App.jsx
├── main.jsx
└── index.css
```

## Environment variables

Create a `.env` file (already present in this repo) with:

```
VITE_API_BASE_URL=https://92iqdbkjtd.execute-api.ap-south-1.amazonaws.com/prod
```

All API calls go through `src/services/futureNewsApi.js`, which reads this value via
`import.meta.env.VITE_API_BASE_URL`. Nothing hardcodes the base URL elsewhere.

## Running locally

```
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Build

```
npm run build
```

Output is written to `dist/`. Verified passing locally.

## Lint

```
npm run lint
```

## API endpoints used

| Method | Path                  | Used by                          | Notes |
|--------|-----------------------|-----------------------------------|-------|
| GET    | `/latest`              | `useFutureNews` (on load)         | Should be read-only |
| GET    | `/editions`             | `useFutureNews` (on load)         | Should be read-only |
| GET    | `/editions/{editionId}` | `EditionModal` (on card click)    | Should be read-only |
| GET    | `/generate`             | `GenerateButton` (on click only)  | Mutates DynamoDB — never called automatically |

## ⚠️ Known backend issue

`GET /latest` and `GET /editions` currently behave like `GET /generate` — each call
creates a **new** edition in DynamoDB instead of reading existing data. This was
discovered during integration testing (edition IDs incremented on repeated `/latest`
calls with no user action). Because this frontend calls `/latest` and `/editions` on
every page load, this bug means simply opening the app currently triggers unwanted
AI generations.

**Fix needed on the backend/API Gateway side**: ensure `GET /latest`,
`GET /editions`, and `GET /editions/{id}` are wired to read-only Lambda handlers/routes
that query DynamoDB, separate from the `/generate` route's handler. Once fixed, no
frontend changes should be required — `futureNewsApi.js` already calls the documented
paths correctly.

## Notes

- `/generate` is only ever called from the "Generate Next Future" button
  (`GenerateButton.jsx`) — never on page load.
- Editions are sorted by `editionNumber` (descending) with `futureDate` as a tiebreaker,
  in `useFutureNews.js`.
