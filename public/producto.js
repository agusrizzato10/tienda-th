// Página de detalle de un producto (el carrito y el menú están en comun.js)
const idProducto = new URLSearchParams(location.search).get("id");

function crear(etiqueta, clase, texto) {
  let el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

// agrega una fila a la ficha técnica (si el dato está vacío en la base, no se muestra)
function agregarDato(lista, titulo, valor) {
  if (!valor) return;
  let li = crear("li");
  li.appendChild(crear("span", "", titulo));
  li.appendChild(crear("strong", "", valor));
  lista.appendChild(li);
}

// foto del producto: con una sola imagen se ve fija; con dos, se desliza (mouse, dedo o puntos)
function crearGaleria(imagenes, alt) {
  const foto = crear("div", "detalle-foto");
  const pista = crear("div", "galeria-pista");
  imagenes.forEach(function (ruta, i) {
    const img = crear("img");
    img.src = ruta;
    img.alt = imagenes.length > 1 ? alt + " (foto " + (i + 1) + ")" : alt;
    pista.appendChild(img);
  });
  foto.appendChild(pista);
  if (imagenes.length < 2) return foto;

  foto.classList.add("galeria");
  const puntos = crear("div", "galeria-puntos");
  const botones = [];
  let actual = 0;

  function mostrar(n) {
    actual = Math.max(0, Math.min(imagenes.length - 1, n));
    pista.style.transform = "translateX(-" + (actual * 100) + "%)";
    botones.forEach(function (b, i) { b.classList.toggle("activo", i === actual); });
  }

  imagenes.forEach(function (ruta, i) {
    const b = crear("button", "galeria-punto");
    b.setAttribute("aria-label", "Ver foto " + (i + 1));
    b.onclick = function () { mostrar(i); };
    botones.push(b);
    puntos.appendChild(b);
  });
  foto.appendChild(puntos);
  mostrar(0);

  // deslizar con el mouse o con el dedo
  let arrastrando = false;
  let inicioX = 0;
  let desplazamiento = 0;
  foto.onpointerdown = function (e) {
    if (e.target.closest(".galeria-punto")) return;
    arrastrando = true;
    inicioX = e.clientX;
    desplazamiento = 0;
    pista.style.transition = "none";
  };
  foto.onpointermove = function (e) {
    if (!arrastrando) return;
    desplazamiento = e.clientX - inicioX;
    pista.style.transform = "translateX(" + (-actual * 100 + (desplazamiento / foto.offsetWidth) * 100) + "%)";
  };
  function soltar() {
    if (!arrastrando) return;
    arrastrando = false;
    pista.style.transition = "";
    if (desplazamiento < -50) mostrar(actual + 1);
    else if (desplazamiento > 50) mostrar(actual - 1);
    else mostrar(actual);
  }
  foto.onpointerup = soltar;
  foto.onpointercancel = soltar;
  foto.onpointerleave = soltar;
  return foto;
}

function mostrarProducto(p) {
  const caja = document.getElementById("detalleProducto");
  caja.innerHTML = "";

  const foto = crearGaleria([p.imagen, p.imagen2, p.imagen3].filter(Boolean), p.nombre);
  if (p.agotado) {
    foto.classList.add("agotado");
    foto.appendChild(crear("span", "marca-agotado", "Agotado"));
  }

  const info = crear("div", "detalle-info");
  info.appendChild(crear("span", "detalle-cat", p.categoria));
  info.appendChild(crear("h1", "", p.nombre));
  info.appendChild(crear("p", "detalle-precio", "$" + formatear(p.precio)));
  const ficha = crear("ul", "detalle-ficha");
  agregarDato(ficha, "Medidas", p.medidas);
  agregarDato(ficha, "Material", p.material);
  agregarDato(ficha, "Fragancia", p.fragancia);
  agregarDato(ficha, "Cantidad", p.cantidad);
  info.appendChild(ficha);

  // cantidad y botón para agregar al carrito
  let cantidad = 1;
  const compra = crear("div", "compra");
  const selector = crear("div", "selector");
  const menos = crear("button", "", "−");
  const numero = crear("span", "", "1");
  const mas = crear("button", "", "+");
  menos.onclick = function () { if (cantidad > 1) { cantidad--; numero.textContent = cantidad; } };
  mas.onclick = function () { cantidad++; numero.textContent = cantidad; };
  selector.appendChild(menos);
  selector.appendChild(numero);
  selector.appendChild(mas);

  const boton = crear("button", "btn", "Agregar al carrito");
  boton.onclick = function () {
    agregarAlCarrito(p, cantidad);
    abrirCarrito(true);
  };
  // producto agotado: no se puede elegir cantidad ni agregar al carrito
  if (p.agotado) {
    boton.textContent = "Producto agotado";
    boton.disabled = true;
    boton.onclick = null;
    selector.style.display = "none";
  }
  compra.appendChild(selector);
  compra.appendChild(boton);
  info.appendChild(compra);
  // sección "Descripción" (debajo del botón y antes del aviso del pago): solo aparece si el producto tiene un texto cargado
  if (p.detalle) {
    const bloque = crear("div", "detalle-descripcion");
    bloque.appendChild(crear("h3", "detalle-subtitulo", "Descripción"));
    bloque.appendChild(crear("p", "detalle-desc", p.detalle));
    info.appendChild(bloque);
  }

  info.appendChild(crear("p", "nota", "Coordinás el pago y la entrega por WhatsApp al finalizar el pedido."));

  caja.appendChild(foto);
  caja.appendChild(info);
}

// "También te puede interesar": hasta 4 productos de la misma categoría (primero los disponibles)
async function cargarRelacionados(actual) {
  try {
    const respuesta = await fetch("/productos");
    const todos = (await respuesta.json()).map(normalizar);
    const relacionados = todos
      .filter(function (p) { return p.categoria === actual.categoria && p.id !== actual.id; })
      .sort(function (a, b) { return Number(a.agotado) - Number(b.agotado); })
      .slice(0, 4);
    if (relacionados.length === 0) return; // si no hay otros productos, la sección no se muestra

    const grilla = document.getElementById("productos");
    relacionados.forEach(function (p) { grilla.appendChild(crearTarjetaProducto(p)); });
    document.getElementById("bloqueRelacionados").hidden = false;
    observarAparecer();
  } catch (error) {
    console.log(error);
  }
}

async function cargarProducto() {
  try {
    const respuesta = await fetch("/productos/" + idProducto);
    if (!respuesta.ok) throw new Error("Producto no encontrado");
    const p = normalizar(await respuesta.json());
    document.title = p.nombre + " | The Home";
    mostrarProducto(p);
    cargarRelacionados(p);
  } catch (error) {
    console.log(error);
    document.getElementById("detalleProducto").textContent = "No encontramos este producto.";
  }
}

cargarProducto();
