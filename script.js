document.documentElement.classList.add("js");
/* ================= CONFIGURAÇÃO (edite aqui) ================= */
const WHATSAPP = "5511997130075";          // número com DDI + DDD
const INSTAGRAM_URL = "https://www.instagram.com/atelie_toquedegraca_cartonagem/";                  // cole aqui o link do Instagram do ateliê; vazio = link oculto
const MENSAGENS = {
  ola: "Olá! Conheci o Ateliê Toque de Graça pelo site e gostaria de tirar algumas dúvidas.",
  encomenda: "Olá! Conheci o Ateliê Toque de Graça pelo site e gostaria de fazer uma encomenda.",
  personalizado: "Olá! Conheci o Ateliê Toque de Graça pelo site e gostaria de conversar sobre uma encomenda personalizada. Tenho uma ideia e gostaria de saber quais são as possibilidades."
};
const CATEGORIAS = ["Cartonagem artesanal","Papelaria personalizada","Presentes e lembranças","Diários e cadernetas"];

/* ============ PRODUTOS (arquivo de dados) ============
   Campos: id, nome, categoria, descricao, preco (ex.: "R$ 45,00" ou vazio),
   imagem (ex.: "images/produtos/caixa.jpg" ou vazio), personalizacao, botao,
   fala (opcional: o que a Graça diz no balão quando o produto aparece; vazio = frase automática).
   exemplo:true marca o item como demonstrativo — remova ao cadastrar o produto real. */
const PRODUTOS = [
  {id:"ex-1",fala:"Essa caixa eu faço sob medida, do tamanho que você precisar! 📦",nome:"Caixa personalizada",categoria:"Cartonagem artesanal",descricao:"Caixa em cartonagem feita sob medida.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-2",fala:"Olha esse bloquinho rosa! Cada detalhe é personalizado à mão 💕",nome:"Bloco de Anotações",categoria:"Papelaria personalizada",descricao:"Bloco de Anotações personalizado a mão.",preco:"",imagem:"images/produtos/blocorosa.png",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-3",fala:"Um planner pra deixar a rotina mais leve e organizada ✨",nome:"Planner personalizado",categoria:"Papelaria personalizada",descricao:"Planner para organizar a rotina.",preco:"",imagem:"",personalizacao:"",botao:"Consultar",exemplo:true},
  {id:"ex-4",nome:"Lembrancinha especial",categoria:"Presentes e lembranças",descricao:"Mimo para datas especiais.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-5",fala:"O diário da gestante é pra guardar cada momento dessa fase tão especial 🤰",nome:"Diário da gestante",categoria:"Diários e cadernetas",descricao:"Diário para registrar a gestação.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-6",nome:"Caderneta de saúde",categoria:"Diários e cadernetas",descricao:"Caderneta personalizada.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-7",nome:"Bloquinho de anotações",categoria:"Papelaria personalizada",descricao:"Bloquinho para o dia a dia.",preco:"",imagem:"",personalizacao:"",botao:"Consultar",exemplo:true},
  {id:"ex-8",nome:"Kit presente",categoria:"Presentes e lembranças",descricao:"Peças preparadas para presentear.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true}
];

/* ================= LÓGICA ================= */
const wa = t => "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(t);
const FLOWER = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="20" cy="20" r="3"/><path d="M20 17c-4-6-1-12 0-12s4 6 0 12zM23 20c6-4 12-1 12 0s-6 4-12 0zM20 23c4 6 1 12 0 12s-4-6 0-12zM17 20c-6 4-12 1-12 0s6-4 12 0z"/></svg>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function fillPlaceholder(el){
  const src = el.dataset.img, label = el.dataset.label || "Fotografia";
  el.innerHTML = FLOWER + "<span>" + esc(label) + "</span>";
  if(!src) return;
  const img = new Image();
  img.alt = el.dataset.alt || "";
       img.decoding = "async";
  img.onload = () => el.appendChild(img);   // só exibe se a imagem existir
  img.src = src;
}

function renderTabs(){
  const tabs = document.getElementById("tabs");
  ["Todos", ...CATEGORIAS].forEach((c,i) => {
    const b = document.createElement("button");
    b.className = "tab"; b.type = "button"; b.textContent = c;
    b.setAttribute("aria-pressed", i === 0);
    b.onclick = () => {
      tabs.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-pressed", t === b));
      renderGrid(c);
    };
    tabs.appendChild(b);
  });
}

/* ===== Carrossel de produtos ===== */
const AUTO_MS = 7000;   // tempo (ms) para trocar de produto automaticamente (dá tempo de ler a fala da Graça)
let slideIdx = 0, slideCount = 0, autoTimer = null, listaAtual = [], categoriaAtual = "Todos", trocouCategoria = false;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderGrid(cat){
  const track = document.getElementById("track"), dots = document.getElementById("dots");
  const lista = PRODUTOS.filter(p => !cat || cat === "Todos" || p.categoria === cat);
  listaAtual = lista; categoriaAtual = cat || "Todos"; trocouCategoria = true;
  track.innerHTML = ""; dots.innerHTML = "";
  lista.forEach((p,i) => {
    const s = document.createElement("article");
    s.className = "slide";
    s.setAttribute("aria-roledescription", "slide");
    s.setAttribute("aria-label", (i+1) + " de " + lista.length);
    const msg = "Olá! Conheci o Ateliê Toque de Graça pelo site e gostaria de saber mais sobre o produto " + p.nome + ". Poderia me passar mais informações?";
    s.innerHTML =
      '<div class="ph" data-img="' + esc(p.imagem) + '" data-alt="' + esc(p.nome) + '" data-label="Foto em breve"></div>' +
      '<div class="info">' +
        (p.exemplo ? '<span class="demo">Exemplo</span>' : '') +
        '<span class="cat">' + esc(p.categoria) + '</span>' +
        '<h3>' + esc(p.nome) + '</h3>' +
        '<p>' + esc(p.descricao) + '</p>' +
        (p.personalizacao ? '<span class="tag">' + esc(p.personalizacao) + '</span>' : '') +
        '<span class="price">' + (p.preco ? esc(p.preco) : 'Consulte o valor') + '</span>' +
        '<a class="btn btn-line" target="_blank" rel="noopener" href="' + wa(msg) + '">' + esc(p.botao || "Consultar") + '</a>' +
      '</div>';
    track.appendChild(s);
    const d = document.createElement("button");
    d.type = "button"; d.className = "dot"; d.setAttribute("aria-label", "Ir para o produto " + (i+1));
    d.onclick = () => { goTo(i); startAuto(); };
    dots.appendChild(d);
  });
  track.querySelectorAll(".ph").forEach(fillPlaceholder);
  slideCount = lista.length;
  const multi = slideCount > 1;
  document.getElementById("prev").hidden = !multi;
  document.getElementById("next").hidden = !multi;
  dots.hidden = !multi;
  goTo(0); startAuto();
}

function goTo(i){
  if(!slideCount) return;
  slideIdx = (i + slideCount) % slideCount;
  document.getElementById("track").style.transform = "translateX(-" + (slideIdx * 100) + "%)";
  document.querySelectorAll("#track .slide").forEach((s,k) => { s.inert = k !== slideIdx; });
  document.querySelectorAll("#dots .dot").forEach((d,k) => d.setAttribute("aria-current", k === slideIdx));
  apresentarProduto(slideIdx);
}
function startAuto(){
  clearInterval(autoTimer);
  if(reduceMotion || slideCount < 2) return;
  autoTimer = setInterval(() => goTo(slideIdx + 1), AUTO_MS);
}
function stopAuto(){ clearInterval(autoTimer); }

(function(){
  const slider = document.getElementById("slider"), viewport = document.getElementById("viewport");
  document.getElementById("prev").onclick = () => { goTo(slideIdx - 1); startAuto(); };
  document.getElementById("next").onclick = () => { goTo(slideIdx + 1); startAuto(); };
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);
  slider.addEventListener("focusin", stopAuto);
  slider.addEventListener("focusout", startAuto);
  slider.addEventListener("keydown", e => {
    if(e.key === "ArrowLeft"){ goTo(slideIdx - 1); }
    if(e.key === "ArrowRight"){ goTo(slideIdx + 1); }
  });
  let x0 = null;
  viewport.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; stopAuto(); }, {passive:true});
  viewport.addEventListener("touchend", e => {
    if(x0 !== null){
      const dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 40) goTo(slideIdx + (dx < 0 ? 1 : -1));
    }
    x0 = null; startAuto();
  });
})();

document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = wa(MENSAGENS[a.dataset.wa]); a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll("[data-ig]").forEach(a => {
  if(INSTAGRAM_URL){ a.href = INSTAGRAM_URL; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
});
document.querySelectorAll("body > main .ph").forEach(fillPlaceholder);
/* ================= GRAÇA, A APRESENTADORA =================
   Uma só Graça que "viaja" pela página: em cada seção ela vai até o ponto marcado
   com class="ponto" no index.html e fala o texto do data-fala dele.
   Na vitrine, ela anda de um lado para o outro a cada produto.
   Frases automáticas usadas quando o produto não tem "fala". Use {nome} e {descricao}. */
const FALAS_PADRAO = [
  "Olha que fofura: {nome}! {descricao}",
  "Agora apresento: {nome}. {descricao}",
  "Esse é um dos meus xodós: {nome}! {descricao}",
  "Próximo da vitrine: {nome}. {descricao}"
];
const FALA_CATEGORIA = "Separei só os itens de {categoria} pra você! 🌸";

const preenche = (t, d) => t.replace(/\{(\w+)\}/g, (_, k) => d[k] != null ? d[k] : "");

// Escreve o texto no balão, letra por letra (sem "pular" o layout)
function digitar(balao, texto, aoTerminar){
  const reserva = balao.querySelector(".fala-reserva"), alvo = balao.querySelector(".fala-texto");
  clearTimeout(balao._timer);
  reserva.textContent = texto;
  if(reduceMotion){ alvo.textContent = texto; aoTerminar && aoTerminar(); return; }
  const letras = Array.from(texto); let i = 0;
  alvo.textContent = ""; balao.classList.add("digitando");
  (function passo(){
    alvo.textContent += letras[i++] || "";
    if(i < letras.length){
      balao._timer = setTimeout(passo, /[.,!?:]/.test(letras[i-1]) ? 160 : 26);
    } else { balao.classList.remove("digitando"); aoTerminar && aoTerminar(); }
  })();
}
function anima(el, classe){ el.classList.remove(classe); void el.offsetWidth; el.classList.add(classe); }

const graca = document.getElementById("graca"), gBalao = graca.querySelector(".balao"), palco = document.getElementById("palco");
const paradas = Array.from(document.querySelectorAll("main > section"))
  .map(sec => ({sec, ponto: sec.querySelector(".ponto"), visitas: 0}))
  .filter(p => p.ponto);
let paradaAtual = null, gracaTimer = null, ladoVitrine = 0, falaProduto = "";

// posição na página, ignorando animações de "revelar"
function posPagina(el){ let x = 0, y = 0; for(let e = el; e; e = e.offsetParent){ x += e.offsetLeft; y += e.offsetTop; } return {x, y}; }

// calcula onde a Graça deve ficar, para que lado olha e onde vai o balão
function destino(parada){
  const p = parada.ponto, pos = posPagina(p), gw = graca.offsetWidth, gh = graca.offsetHeight;
  const larguraTela = document.documentElement.clientWidth;
  if(p === palco){
    const dir = ladoVitrine === 1;
    return { x: dir ? pos.x + p.offsetWidth - gw : pos.x, y: pos.y + p.offsetHeight - gh,
             virada: dir, balao: dir ? "esq" : "dir", max: p.offsetWidth - gw - 16 };
  }
  const x = pos.x, balao = p.dataset.balao || "cima";
  const alinhaDir = balao === "cima" && x + gw / 2 > larguraTela / 2;   // balão para dentro da tela
  const max = balao === "dir" ? larguraTela - (x + gw) - 20 : balao === "esq" ? x - 20
            : alinhaDir ? x + gw - 14 : larguraTela - x - 14;
  return { x, y: pos.y - gh, virada: p.dataset.lado === "dir", balao, alinhaDir, max };
}

// coloca a Graça no destino; devolve quanto tempo (ms) a viagem leva
function posicionar(parada, instantaneo){
  const d = destino(parada), antes = graca._pos;
  const dist = antes ? Math.hypot(d.x - antes.x, d.y - antes.y) : 0;
  const dur = Math.min(1.7, Math.max(.75, dist / 800));
  graca.classList.toggle("sem-transicao", !!instantaneo || reduceMotion);
  graca.style.setProperty("--viagem", dur + "s");
  graca.style.transform = "translate(" + Math.round(d.x) + "px," + Math.round(d.y) + "px)";
  graca.classList.toggle("virada", d.virada);
  gBalao.classList.remove("b-cima", "b-dir", "b-esq"); gBalao.classList.add("b-" + d.balao);
  gBalao.classList.toggle("b-alinha-dir", !!d.alinhaDir);
  gBalao.style.setProperty("--balao-max", Math.max(150, Math.min(300, d.max)) + "px");
  graca._pos = d;
  return (instantaneo || reduceMotion || dist < 4) ? 0 : dur * 1000;
}

function textoDaParada(parada){
  if(parada.ponto === palco) return falaProduto;
  const opcoes = (parada.ponto.dataset.fala || "").split("|");
  return opcoes[parada.visitas++ % opcoes.length].trim();
}

function falar(texto){
  if(!texto) return;
  gBalao.classList.add("mostra"); graca.classList.add("falando");
  digitar(gBalao, texto, () => graca.classList.remove("falando"));
}

// leva a Graça até uma seção (ou de um lado para o outro da vitrine)
function irPara(parada){
  const primeira = !paradaAtual;
  paradaAtual = parada;
  clearTimeout(gracaTimer);
  gBalao.classList.remove("mostra"); graca.classList.remove("falando");
  const texto = textoDaParada(parada);
  if(primeira){
    posicionar(parada, true);
    graca.classList.remove("espera");
    anima(graca, "chega");
    gracaTimer = setTimeout(() => { graca.classList.remove("chega"); anima(graca, "acena"); falar(texto); }, reduceMotion ? 0 : 800);
    return;
  }
  // espera o balão sumir, depois viaja dando pulinhos
  gracaTimer = setTimeout(() => {
    const tempo = posicionar(parada, false);
    if(tempo) anima(graca, "andando");
    gracaTimer = setTimeout(() => { graca.classList.remove("andando"); falar(texto); }, tempo + 60);
  }, reduceMotion ? 0 : 220);
}

// qual seção está no meio da tela
function paradaNaTela(){
  const fim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  if(fim) return paradas[paradas.length - 1];
  const linha = window.scrollY + window.innerHeight * .5;
  let escolhida = paradas[0];
  paradas.forEach(p => { if(posPagina(p.sec).y <= linha) escolhida = p; });
  return escolhida;
}
let rolando = false;
window.addEventListener("scroll", () => {
  if(rolando) return; rolando = true;
  requestAnimationFrame(() => { rolando = false; const p = paradaNaTela(); if(p !== paradaAtual) irPara(p); });
}, {passive: true});

// se o layout mudar (fontes, fotos, girar o celular), reposiciona sem viajar
let ajustando = false;
const reajustar = () => {
  if(ajustando || !paradaAtual) return; ajustando = true;
  requestAnimationFrame(() => { ajustando = false; posicionar(paradaAtual, true); });
};
window.addEventListener("resize", reajustar);
if("ResizeObserver" in window) new ResizeObserver(reajustar).observe(document.body);

// chamado pelo carrossel a cada troca de produto
function apresentarProduto(i){
  const p = listaAtual[i]; if(!p) return;
  let texto = p.fala || preenche(FALAS_PADRAO[PRODUTOS.indexOf(p) % FALAS_PADRAO.length], p);
  if(trocouCategoria && categoriaAtual !== "Todos") texto = preenche(FALA_CATEGORIA, {categoria: categoriaAtual.toLowerCase()}) + " " + texto;
  trocouCategoria = false;
  const mudou = falaProduto && falaProduto !== texto;
  falaProduto = texto;
  if(paradaAtual && paradaAtual.ponto === palco && mudou){
    ladoVitrine ^= 1;                       // atravessa a vitrine
    irPara(paradaAtual);
  }
}

// Seções aparecem suavemente ao rolar a página
function observar(el, aoAparecer, limite){
  if(!("IntersectionObserver" in window)){ aoAparecer(el); return; }
  const io = new IntersectionObserver(entradas => entradas.forEach(e => {
    if(e.isIntersecting){ io.unobserve(e.target); aoAparecer(e.target); }
  }), {threshold: limite || .2});
  io.observe(el);
}
document.querySelectorAll(".revela").forEach(el => observar(el, e => e.classList.add("visivel"), .15));

renderTabs(); renderGrid("Todos");
window.addEventListener("load", () => irPara(paradaNaTela()));
if(document.readyState === "complete") irPara(paradaNaTela());

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.textContent = o ? "✕" : "☰"; };
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); burger.textContent = "☰"; }));
