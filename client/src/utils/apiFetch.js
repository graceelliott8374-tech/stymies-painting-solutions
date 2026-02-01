const API_BASE = "http://localhost:5000";

async function refreshSession() {
  // Uses refreshToken cookie (HttpOnly) to mint a new short-lived access cookie
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

/**
 * apiFetch(url, options)
 * - always includes cookies
 * - if request returns 401, attempts refresh once, then retries once
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  // Always send cookies
  const opts = {
    ...options,
    credentials: "include",
  };

  let res = await fetch(url, opts);

  // If access token expired, refresh once and retry once
  if (res.status === 401) {
    const ok = await refreshSession();
    if (ok) {
      res = await fetch(url, opts);
    }
  }

  return res;
}
