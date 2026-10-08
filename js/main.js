const { cars, gallery } = window.SITE_DATA;
const $ = s => document.querySelector(s);
$("#yr").textContent = new Date().getFullYear();

// hero slideshow
const slides = [...document.querySelectorAll(".slide")];
let si = 0;
setInterval(() => { slides[si].classList.remove("active"); si = (si + 1) % slides.length; slides[si].classList.add("active"); }, 4500);

function filters(el, items, key, cb) {
  const types = ["All", ...new Set(items.map(i => i[key]))];
  el.innerHTML = types.map((t, i) => `<button class="${i ? "" : "on"}" data-t="${t}">${t}</button>`).join("");
  el.onclick = e => { const b = e.target.closest("button"); if (!b) return;
    el.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); cb(b.dataset.t); };
}

function renderCars(t = "All") {
  $("#carGrid").innerHTML = cars.filter(c => t === "All" || c.type === t).map(c => `
    <article class="card" data-img="${c.img}" data-cap="${c.name} - ${c.color}">
      <img loading="lazy" src="${c.thumb}" alt="${c.name}">
      <div class="body"><h3>${c.name}</h3><div class="meta">${c.type} - ${c.color} - ${c.hp} hp - ${c.mpg} mpg</div>
      <div class="price">$${c.price.toLocaleString()}</div></div></article>`).join("");
}
filters($("#carFilters"), cars, "type", renderCars); renderCars();

let current = [];
function renderGal(t = "All") {
  current = gallery.filter(g => t === "All" || g.type === t);
  $("#galCount").textContent = `(${current.length} photos)`;
  $("#galGrid").innerHTML = current.map((g, i) => `<img loading="lazy" src="${g.src}" alt="${g.title}" data-i="${i}">`).join("");
}
filters($("#galFilters"), gallery, "type", renderGal); renderGal();

// lightbox
let li = 0, mode = "gal";
const lb = $("#lb");
function show() { const g = mode === "gal" ? current[li] : null; if (g) { $("#lbImg").src = g.src; $("#lbCap").textContent = g.title; } }
$("#galGrid").onclick = e => { const i = e.target.dataset.i; if (i == null) return; mode = "gal"; li = +i; show(); lb.classList.add("open"); };
$("#carGrid").onclick = e => { const c = e.target.closest(".card"); if (!c) return; mode = "car";
  $("#lbImg").src = c.dataset.img; $("#lbCap").textContent = c.dataset.cap; lb.classList.add("open"); };
$("#lbClose").onclick = () => lb.classList.remove("open");
$("#lbPrev").onclick = () => { if (mode === "gal") { li = (li - 1 + current.length) % current.length; show(); } };
$("#lbNext").onclick = () => { if (mode === "gal") { li = (li + 1) % current.length; show(); } };
lb.onclick = e => { if (e.target === lb) lb.classList.remove("open"); };
document.onkeydown = e => { if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") lb.classList.remove("open");
  if (e.key === "ArrowLeft") $("#lbPrev").click(); if (e.key === "ArrowRight") $("#lbNext").click(); };
