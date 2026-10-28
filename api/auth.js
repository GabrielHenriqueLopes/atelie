// Login do painel (/admin): manda a pessoa para a tela de autorização do GitHub.
// Precisa das variáveis de ambiente na Vercel: OAUTH_GITHUB_CLIENT_ID e OAUTH_GITHUB_CLIENT_SECRET.
const crypto = require("crypto");

module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Falta configurar OAUTH_GITHUB_CLIENT_ID nas variáveis de ambiente da Vercel.");
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const redirectUri = "https://" + host + "/api/callback";
  const state = crypto.randomBytes(16).toString("hex");
  const scope = process.env.OAUTH_GITHUB_SCOPE || "repo,user";

  res.setHeader("Set-Cookie", "painel_state=" + state + "; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600");
  res.statusCode = 302;
  res.setHeader("Location",
    "https://github.com/login/oauth/authorize?client_id=" + encodeURIComponent(clientId) +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&scope=" + encodeURIComponent(scope) +
    "&state=" + state);
  res.end();
};
