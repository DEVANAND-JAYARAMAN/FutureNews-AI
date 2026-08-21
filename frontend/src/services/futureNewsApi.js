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

export function getLatestEdition() {
  return request('/latest');
}

export function getAllEditions() {
  return request('/editions');
}

export function getEditionById(editionId) {
  return request(`/editions/${encodeURIComponent(editionId)}`);
}

export function generateNextEdition() {
  return request('/generate');
}
