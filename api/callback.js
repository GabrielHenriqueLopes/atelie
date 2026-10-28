// Volta do GitHub: troca o código pelo token e entrega ao painel (/admin), que abriu esta janela.
module.exports = async (req, res) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origin = "https://" + host;
  const url = new URL(req.url, origin);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = (req.headers.cookie || "").split(/;\s*/).find(c => c.startsWith("painel_state="));
  const esperado = cookie ? cookie.split("=")[1] : "";

  let status = "error", conteudo = { message: "Não foi possível entrar." };
  try {
    if (!code || !state || state !== esperado) throw new Error("Pedido de login inválido ou expirado. Tente de novo.");
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: origin + "/api/callback"
      })
    });
    const dados = await r.json();
    if (!dados.access_token) throw new Error(dados.error_description || "O GitHub não devolveu o acesso.");
    status = "success";
    conteudo = { token: dados.access_token, provider: "github" };
  } catch (e) {
    conteudo = { message: e.message };
  }

  const mensagem = "authorization:github:" + status + ":" + JSON.stringify(conteudo);
  res.setHeader("Set-Cookie", "painel_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Entrando…</title>
<body style="font-family:system-ui;padding:24px">${status === "success" ? "Entrando no painel…" : "Erro: " + conteudo.message.replace(/[<>&]/g, "")}
<script>
(function () {
  var origem = ${JSON.stringify(origin)};
  var mensagem = ${JSON.stringify(mensagem)};
  function responder(e) {
    if (e.origin !== origem) return;            // só entrega o acesso ao próprio site
    window.opener.postMessage(mensagem, origem);
    window.removeEventListener("message", responder);
    setTimeout(function () { window.close(); }, 400);
  }
  if (window.opener) {
    window.addEventListener("message", responder);
    window.opener.postMessage("authorizing:github", origem);
  }
})();
</script></body></html>`);
};
