/* Prévia do painel: mostra como cada foto vai aparecer no site, com o ajuste escolhido. */
(function () {
  if (!window.CMS || !window.h || !window.createClass) return;
  var h = window.h, createClass = window.createClass;
  var COR = { fundo: "#f6efe4", borda: "#dccdb8", texto: "#4a3329", suave: "#7a6252" };

  function num(v, d, min, max) { v = Number(v); return isFinite(v) ? Math.min(max, Math.max(min, v)) : d; }
  function estiloFoto(a, padrao) {
    a = a || {};
    var x = num(a.x, 50, 0, 100), y = num(a.y, 50, 0, 100), z = num(a.zoom, 100, 50, 400) / 100;
    var modo = a.modo || padrao;
    return {
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      objectFit: modo === "preencher" ? "cover" : "contain",
      objectPosition: x + "% " + y + "%", transformOrigin: x + "% " + y + "%", transform: "scale(" + z + ")"
    };
  }
  function quadro(src, ajuste, padrao, forma, legenda, chave) {
    var dentro = src
      ? h("img", { src: src, style: estiloFoto(ajuste, padrao) })
      : h("span", { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center",
          justifyContent: "center", color: COR.suave, fontStyle: "italic", fontSize: "14px" } }, "Sem foto");
    return h("figure", { key: chave, style: { margin: 0 } },
      h("div", { style: Object.assign({ position: "relative", overflow: "hidden", background: COR.fundo,
        border: "1px solid " + COR.borda }, forma) }, dentro),
      h("figcaption", { style: { font: "14px system-ui, sans-serif", color: COR.texto, marginTop: "6px" } }, legenda));
  }
  function caminho(props, img) { try { return img ? props.getAsset(img).toString() : ""; } catch (e) { return img || ""; } }
  function pagina(titulo, filhos) {
    return h("div", { style: { padding: "20px", fontFamily: "system-ui, sans-serif", color: COR.texto, background: "#fdfaf5", minHeight: "100vh" } },
      h("h2", { style: { fontWeight: 500, margin: "0 0 4px" } }, titulo),
      h("p", { style: { margin: "0 0 18px", color: COR.suave, fontSize: "14px" } }, "É assim que as fotos vão aparecer no site."),
      filhos);
  }

  var PrevProdutos = createClass({
    render: function () {
      var props = this.props, lista = props.entry.getIn(["data", "produtos"]);
      var itens = lista && lista.toJS ? lista.toJS() : [];
      return pagina("Vitrine", h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "18px" } },
        itens.map(function (p, i) {
          var extras = (p.fotos || []).filter(function (f) { return f && f.imagem; });
          var legenda = (p.nome || "(sem nome)") + (p.categoria ? " · " + p.categoria : "") +
            (extras.length ? " · " + (extras.length + (p.imagem ? 1 : 0)) + " fotos" : "");
          return h("div", { key: i },
            quadro(caminho(props, p.imagem), p.ajuste, "inteira", { aspectRatio: "1 / 1", borderRadius: "14px" }, legenda, "c"),
            extras.length ? h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "8px" } },
              extras.map(function (f, k) {
                return quadro(caminho(props, f.imagem), f.ajuste, "inteira", { aspectRatio: "1 / 1", borderRadius: "8px" }, "+" + (k + 1), k);
              })) : null);
        })));
    }
  });

  var PrevSite = createClass({
    render: function () {
      var props = this.props, f = props.entry.getIn(["data", "fotos"]);
      var fotos = f && f.toJS ? f.toJS() : {};
      function foto(k) { var v = fotos[k] || {}; return typeof v === "string" ? { imagem: v } : v; }
      var ini = foto("inicio"), pro = foto("processo"), ate = foto("atelie");
      return pagina("Fotos das seções", h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "22px" } }, [
        quadro(caminho(props, ini.imagem), ini.ajuste, "preencher", { aspectRatio: "4 / 5", borderRadius: "240px 240px 14px 14px" }, "Início", "i"),
        quadro(caminho(props, pro.imagem), pro.ajuste, "preencher", { aspectRatio: "4 / 5", borderRadius: "14px" }, "O valor do artesanal", "p"),
        quadro(caminho(props, ate.imagem), ate.ajuste, "preencher", { aspectRatio: "1 / 1", borderRadius: "50% 50% 14px 14px / 40% 40% 14px 14px" }, "Sobre o ateliê", "a")
      ]));
    }
  });

  CMS.registerPreviewTemplate("produtos", PrevProdutos);
  CMS.registerPreviewTemplate("site", PrevSite);
})();
