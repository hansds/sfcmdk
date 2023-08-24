export function fetchAuthenticated(url: string, sessionId: string) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${sessionId}`,
    },
  });
}
