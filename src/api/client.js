import { API } from "./config";

export const getToken  = ()        => localStorage.getItem("st_token");
export const setToken  = (token)   => localStorage.setItem("st_token", token);
export const clearToken = ()       => localStorage.removeItem("st_token");

/**
 * @param {string} endpoint  - Ruta de API.XX.XX (ya resuelta con .replace si lleva :id)
 * @param {object} options   - Opciones fetch: method, body, headers, blob
 */
export async function apiFetch(endpoint, options = {}) {
  const { blob: asBlob, ...fetchOptions } = options;
  const token = getToken();

  const res = await fetch(`${API.BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!res.ok) {
    let errMsg = `Error ${res.status}`;
    try { const data = await res.json(); errMsg = data.message || errMsg; } catch {}
    const err = new Error(errMsg);
    err.status = res.status;
    throw err;
  }

  return asBlob ? res.blob() : res.json();
}
