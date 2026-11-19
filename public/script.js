// Página de inicio (el carrito, el menú y WhatsApp están en comun.js)

// imagen por defecto (se reemplaza por la imagen real)
function imagenDefault(texto, color) {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>" +
    "<rect width='100%' height='100%' fill='" + color + "'/>" +
    "<text x='50%' y='50%' fill='white' font-size='34' font-family='sans-serif' " +
    "text-anchor='middle' dominant-baseline='middle'>" + texto + "</text></svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

let slides = [
{
imagenDesktop: "carrucel-img/foto1.webp",
imagenMobile: "carrucel-img/foto1-celular.png"
},
{
imagenDesktop: "carrucel-img/foto2.webp",
imagenMobile: "carrucel-img/foto2-celular.jpg"
}
];

let categorias = [];
let productos = [];

// ================== CARRUSEL ==================
let actual = 0;
let temporizador;
const pista = document.getElementById("pista");
const contenedorPuntos = document.getElementById("puntos");

function dibujarCarrusel() {
pista.innerHTML = "";
contenedorPuntos.innerHTML = "";

for (let i = 0; i < slides.length; i++) {
let img = document.createElement("img");

// Elige la imagen adecuada dependiendo si está en celular o PC al momento de cargar
if (window.innerWidth <= 980) {
  img.src = slides[i].imagenMobile;
} else {
  img.src = slides[i].imagenDesktop;
}

img.alt = "Foto " + (i + 1);
pista.appendChild(img);

let punto = document.createElement("button");
punto.className = "punto";
punto.setAttribute("aria-label", "Ir a la foto " + (i + 1));
punto.onclick = function () {
  mostrarSlide(i);
  reiniciarTemporizador();
};
contenedorPuntos.appendChild(punto);


}
mostrarSlide(0);
}

function mostrarSlide(n) {
actual = (n + slides.length) % slides.length;
pista.style.transform = "translateX(-" + (actual * 100) + "%)";
const puntos = document.querySelectorAll(".punto");
for (let i = 0; i < puntos.length; i++) {
puntos[i].classList.toggle("activo", i === actual);
}
}

function reiniciarTemporizador() {
clearInterval(temporizador);
temporizador = setInterval(function () { mostrarSlide(actual + 1); }, 5000);
}
reiniciarTemporizador();

const carrusel = document.getElementById("inicio");
let arrastrando = false;
let inicioX = 0;
let desplazamiento = 0;

carrusel.onpointerdown = function (e) {
if (e.target.closest(".punto")) return;
arrastrando = true;
inicioX = e.clientX;
desplazamiento = 0;
pista.style.transition = "none";
clearInterval(temporizador);
};

carrusel.onpointermove = function (e) {
if (!arrastrando) return;
desplazamiento = e.clientX - inicioX;
const porcentaje = (desplazamiento / carrusel.offsetWidth) * 100;
pista.style.transform = "translateX(" + (-actual * 100 + porcentaje) + "%)";
};

function soltar() {
if (!arrastrando) return;
arrastrando = false;
pista.style.transition = "";
if (desplazamiento < -50) {
mostrarSlide(actual + 1);
} else if (desplazamiento > 50) {
mostrarSlide(actual - 1);
} else {
mostrarSlide(actual);
}
reiniciarTemporizador();
}

carrusel.onpointerup = soltar;
carrusel.onpointercancel = soltar;
carrusel.onpointerleave = soltar;

// si se gira el celular o cambia el tamaño de la ventana, se pasa a la foto que corresponde (PC o celular)
let carruselEnCelular = window.innerWidth <= 700;
window.addEventListener("resize", function () {
  const enCelular = window.innerWidth <= 700;
  if (enCelular === carruselEnCelular) return;
  carruselEnCelular = enCelular;
  pista.querySelectorAll("img").forEach(function (img, i) {
    img.src = enCelular ? slides[i].imagenMobile : slides[i].imagenDesktop;
  });
});

// ================== CATEGORÍAS Y PRODUCTOS ==================
function dibujarCategorias() {
const grilla = document.getElementById("categorias");
grilla.innerHTML = "";
for (let i = 0; i < categorias.length; i++) {
let caja = document.createElement("article");
caja.className = "tarjeta aparecer";
caja.dataset.texto = categorias[i].nombre.toLowerCase();

let foto = document.createElement("div");
foto.className = "foto";
let img = document.createElement("img");
img.src = categorias[i].imagen || imagenDefault(categorias[i].nombre, "#c28a93");
img.alt = categorias[i].nombre;
foto.appendChild(img);

let titulo = document.createElement("h3");
titulo.textContent = categorias[i].nombre;

let nombre = categorias[i].nombre;
caja.onclick = function () { buscarCategoria(nombre); };

caja.appendChild(foto);
caja.appendChild(titulo);
grilla.appendChild(caja);


}
}

function dibujarProductos() {
const grilla = document.getElementById("productos");
grilla.innerHTML = "";
for (let i = 0; i < productos.length; i++) {
let p = productos[i];
let caja = document.createElement("article");
caja.className = "tarjeta producto aparecer";

caja.dataset.texto = (p.nombre + " " + p.categoria).toLowerCase();
caja.dataset.categoria = (p.categoria || "").toLowerCase();

let enlace = document.createElement("a");
enlace.className = "enlace";
enlace.href = "producto.html?id=" + p.id;

let foto = document.createElement("div");
foto.className = "foto";
let img = document.createElement("img");
img.src = p.imagen || imagenDefault(p.nombre, "#c28a93");
img.loading = "lazy";
img.alt = p.nombre;
foto.appendChild(img);

// producto agotado: cartel sobre la foto
if (p.agotado) {
  caja.classList.add("agotado");
  const marca = document.createElement("span");
  marca.className = "marca-agotado";
  marca.textContent = "Agotado";
  foto.appendChild(marca);
}

let titulo = document.createElement("h3");
titulo.textContent = p.nombre;
let precio = document.createElement("p");
precio.className = "precio";
precio.textContent = "$" + formatear(p.precio);

let cat = document.createElement("span");
cat.className = "categoria-chica";
cat.textContent = p.categoria;

enlace.appendChild(foto);
enlace.appendChild(cat);
enlace.appendChild(titulo);
enlace.appendChild(precio);

let boton = document.createElement("button");
boton.className = "btn";
boton.textContent = "Agregar al carrito";
boton.onclick = function () {
  agregarAlCarrito(p, 1);
  boton.textContent = "¡Agregado! ✓";
  setTimeout(function () { boton.textContent = "Agregar al carrito"; }, 1200);
};
// producto agotado: el botón queda desactivado
if (p.agotado) {
  boton.textContent = "Agotado";
  boton.disabled = true;
  boton.onclick = null;
}

caja.appendChild(enlace);
caja.appendChild(boton);
grilla.appendChild(caja);


}
}

async function cargarDatos() {
try {
const rc = await fetch("/categorias");
categorias = await rc.json();
const rp = await fetch("/productos");
const filas = await rp.json();
productos = filas.map(normalizar);
} catch (error) {
console.log(error);
}
dibujarCategorias();
dibujarProductos();
aplicarLimite();
observarAparecer();

const params = new URLSearchParams(location.search);
if (params.get("categoria")) {
buscarCategoria(params.get("categoria"));
} else if (params.get("buscar")) {
buscar(params.get("buscar"));
document.getElementById("categorias").scrollIntoView();
}
}

// ================== BÚSQUEDA / FILTRO ==================
const buscadorHeader = document.getElementById("buscadorHeader");
const buscadorFooter = document.getElementById("buscadorFooter");

function filtrar(texto) {
texto = texto.toLowerCase().trim();
let hayResultados = false;
const tarjetas = document.querySelectorAll(".tarjeta.producto");
for (let i = 0; i < tarjetas.length; i++) {
let coincide = tarjetas[i].dataset.texto.includes(texto);
tarjetas[i].classList.toggle("oculto", !coincide);
tarjetas[i].classList.toggle("oculto-inicial", texto === "" && i >= mostrados);
if (coincide) hayResultados = true;
}
const sin = document.getElementById("sinResultados");
sin.textContent = "No encontramos productos con esa búsqueda.";
  document.getElementById("btnVerMas").hidden = texto !== "" || mostrados >= tarjetas.length;
sin.style.display = hayResultados ? "none" : "block";
mostrarBarra("");
document.querySelectorAll(".tarjeta.activa").forEach(function (t) { t.classList.remove("activa"); });
}

function buscar(texto) {
buscadorHeader.value = texto;
buscadorFooter.value = texto;
filtrar(texto);
}

function buscarCategoria(nombre) {
buscadorHeader.value = "";
buscadorFooter.value = "";
const elegida = nombre.toLowerCase();

document.querySelectorAll("#categorias .tarjeta").forEach(function (t) {
t.classList.remove("oculto");
t.classList.toggle("activa", t.dataset.texto === elegida);
});

let hay = false;
document.querySelectorAll("#productos .tarjeta").forEach(function (t) {
t.classList.remove("oculto-inicial");

let coincide = t.dataset.categoria === elegida;
t.classList.toggle("oculto", !coincide);
if (coincide) hay = true;


});

const sin = document.getElementById("sinResultados");
sin.textContent = "Todavía no hay productos en esta categoría.";
sin.style.display = hay ? "none" : "block";

mostrarBarra(nombre);
  document.getElementById("btnVerMas").hidden = true; // con una categoría elegida se ven todos sus productos
  document.getElementById("tituloProductos").scrollIntoView();
}

function mostrarBarra(nombre) {
const barra = document.getElementById("barraFiltro");
barra.innerHTML = "";
barra.classList.toggle("activa", nombre !== "");
if (nombre === "") return;
let texto = document.createElement("span");
texto.textContent = "Mostrando: " + nombre;
let boton = document.createElement("button");
boton.textContent = "Ver todos los productos ✕";
boton.onclick = function () {
    buscar("");
  };
barra.appendChild(texto);
barra.appendChild(boton);
}

buscadorFooter.oninput = function () { buscar(buscadorFooter.value); };

// ================== VER MÁS PRODUCTOS ==================
const POR_PAGINA = 12;       // cuántos productos se muestran cada vez
let mostrados = POR_PAGINA;

// muestra solo los primeros "mostrados" productos y el botón "Ver más" si quedan otros
function aplicarLimite() {
  const tarjetas = document.querySelectorAll("#productos .tarjeta");
  tarjetas.forEach(function (t, i) {
    t.classList.toggle("oculto-inicial", i >= mostrados);
  });
  document.getElementById("btnVerMas").hidden = mostrados >= tarjetas.length;
}

document.getElementById("btnVerMas").onclick = function () {
  mostrados += POR_PAGINA;
  aplicarLimite();
};

// ================== INICIO ==================
dibujarCarrusel();
cargarDatos();