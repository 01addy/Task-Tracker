let inMemoryToken = null;
const ACCESS_TOKEN_KEY = "tt_access_token";

export function setAccessToken(token) {
  inMemoryToken = token;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (e) {}
}

export function getAccessToken() {
  if (inMemoryToken) return inMemoryToken;
  try {
    inMemoryToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    return inMemoryToken;
  } catch (e) {
    return null;
  }
}

export function clearAccessToken() {
  inMemoryToken = null;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (e) {}
}
