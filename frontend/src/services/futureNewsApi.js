const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path) {
  if (!BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL is not set. Create a .env file with VITE_API_BASE_URL=<api base url>.'
    );
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch (err) {
    throw new Error(
      `Network error reaching FutureNews API (${path}). This may be a CORS issue on the API Gateway/Lambda side, or the API may be unreachable. Original error: ${err.message}`
    );
  }

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch {
      /* ignore */
    }
    throw new Error(
      `FutureNews API request failed (${response.status} ${response.statusText}) for ${path}. ${detail}`
    );
  }

  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
}

// The live API has been observed to wrap a single edition in different ways
// depending on the endpoint/deployment (e.g. { edition: {...} } from /generate,
// a bare edition object from /latest, etc). This picks the actual edition object
// out of whichever shape shows up.
function unwrapEdition(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.edition && typeof raw.edition === 'object') return raw.edition;
  if (raw.Item && typeof raw.Item === 'object') return raw.Item;
  if (raw.editionId || raw.headline) return raw;
  return null;
}

// Normalizes an edition object's fields, filling in fallbacks for keys that
// have been seen under alternate names, so the UI always has a consistent shape.
function normalizeEdition(raw) {
  const edition = unwrapEdition(raw);
  if (!edition) return null;

  return {
    editionId: edition.editionId ?? edition.id ?? '',
    editionNumber: edition.editionNumber ?? edition.number ?? 0,
    futureDate: edition.futureDate ?? edition.date ?? '',
    headline: edition.headline ?? edition.title ?? '',
    category: edition.category ?? edition.eventType ?? edition.type ?? '',
    breakingSummary: edition.breakingSummary ?? edition.summary ?? '',
    article: edition.article ?? edition.content ?? edition.body ?? '',
    backgroundContext: edition.backgroundContext ?? edition.storylineImpact ?? edition.context ?? '',
    newFacts: edition.newFacts ?? [],
    possibleFutureDevelopments: edition.possibleFutureDevelopments ?? [],
    relatedEvents: edition.relatedEvents ?? [],
    createdAt: edition.createdAt ?? '',
  };
}

// Normalizes the /editions response into an array of editions, regardless of
// whether the API returns a bare array, a wrapper object, or a single edition.
function normalizeEditionsList(raw) {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map(normalizeEdition).filter(Boolean);
  }

  if (Array.isArray(raw.editions)) {
    return raw.editions.map(normalizeEdition).filter(Boolean);
  }

  if (Array.isArray(raw.items)) {
    return raw.items.map(normalizeEdition).filter(Boolean);
  }

  if (Array.isArray(raw.Items)) {
    return raw.Items.map(normalizeEdition).filter(Boolean);
  }

  // A single edition (wrapped in { edition: {...} } or bare) — wrap it in an array.
  const single = normalizeEdition(raw);
  return single ? [single] : [];
}

export async function getLatestEdition() {
  const raw = await request('/latest');
  return normalizeEdition(raw);
}

export async function getAllEditions() {
  const raw = await request('/editions');
  return normalizeEditionsList(raw);
}

export async function getEditionById(editionId) {
  const raw = await request(`/editions/${encodeURIComponent(editionId)}`);
  return normalizeEdition(raw);
}

export function generateNextEdition() {
  return request('/generate');
}
