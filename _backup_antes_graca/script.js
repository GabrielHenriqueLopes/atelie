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
   imagem (ex.: "images/produtos/caixa.jpg" ou vazio), personalizacao, botao.
   exemplo:true marca o item como demonstrativo — remova ao cadastrar o produto real. */
const PRODUTOS = [
  {id:"ex-1",nome:"Caixa personalizada",categoria:"Cartonagem artesanal",descricao:"Caixa em cartonagem feita sob medida.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-2",nome:"Bloco de Anotações",categoria:"Papelaria personalizada",descricao:"Bloco de Anotações personalizado a mão.",preco:"",imagem:"images/produtos/blocorosa.png",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-3",nome:"Planner personalizado",categoria:"Papelaria personalizada",descricao:"Planner para organizar a rotina.",preco:"",imagem:"",personalizacao:"",botao:"Consultar",exemplo:true},
  {id:"ex-4",nome:"Lembrancinha especial",categoria:"Presentes e lembranças",descricao:"Mimo para datas especiais.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
  {id:"ex-5",nome:"Diário da gestante",categoria:"Diários e cadernetas",descricao:"Diário para registrar a gestação.",preco:"",imagem:"",personalizacao:"Personalizável",botao:"Consultar",exemplo:true},
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
const AUTO_MS = 5000;   // tempo (ms) para trocar de produto automaticamente
let slideIdx = 0, slideCount = 0, autoTimer = null;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderGrid(cat){
  const track = document.getElementById("track"), dots = document.getElementById("dots");
  const lista = PRODUTOS.filter(p => !cat || cat === "Todos" || p.categoria === cat);
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
renderTabs(); renderGrid("Todos");

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.textContent = o ? "✕" : "☰"; };
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); burger.textContent = "☰"; }));
