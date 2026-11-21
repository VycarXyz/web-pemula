const localHosts = ["localhost", "127.0.0.1"];
window.apiConfig = Object.freeze({
  baseUrl: localHosts.includes(window.location.hostname) ? "http://localhost:3001" : window.location.origin
});
