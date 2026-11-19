// Código compartido por todas las páginas (inicio y producto)

const TELEFONOS = [
  "5492342400265", // estos son los números de celular al hacer click en continuar la compra
  "5492342405366"  
];

function formatear(numero) {
  return numero.toLocaleString("es-AR");
}

// el carrito se guarda en el navegador para que no se pierda al cambiar de página
let carrito = [];
try { carrito = JSON.parse(localStorage.getItem("carrito")) || []; } catch (e) { carrito = []; }

// convierte una fila de la base de datos en un producto para la página
function normalizar(p) {
  return {
    id: p.idproductos,
    nombre: p.nombre || p.descripcion,
    descripcion: p.descripcion,
    categoria: p.nombrecategoria,
    precio: parseFloat(p.precio),
    imagen: p.imagen,
    medidas: p.medidas,
    material: p.material,
    fragancia: p.fragancia,
    cantidad: p.cantidad,
    detalle: p.detalle,
    imagen2: p.imagen2,
    imagen3: p.imagen3,
    agotado: Number(p.agotado) === 1
  };
}

// ================== TARJETA DE PRODUCTO ==================
// arma una caja de producto (foto, categoría, nombre, precio y botón); se usa en "Productos relacionados"
function crearTarjetaProducto(p) {
  const caja = document.createElement("article");
  caja.className = "tarjeta producto aparecer";
  if (p.agotado) caja.classList.add("agotado");

  // foto, nombre y precio son un enlace a la página del producto
  const enlace = document.createElement("a");
  enlace.className = "enlace";
  enlace.href = "producto.html?id=" + p.id;

  const foto = document.createElement("div");
  foto.className = "foto";
  const img = document.createElement("img");
  img.src = p.imagen || "img/logo.delsitio.png";
  img.loading = "lazy";
  img.alt = p.nombre;
  foto.appendChild(img);
  if (p.agotado) {
    const marca = document.createElement("span");
    marca.className = "marca-agotado";
    marca.textContent = "Agotado";
    foto.appendChild(marca);
  }

  const cat = document.createElement("span");
  cat.className = "categoria-chica";
  cat.textContent = p.categoria;
  const titulo = document.createElement("h3");
  titulo.textContent = p.nombre;
  const precio = document.createElement("p");
  precio.className = "precio";
  precio.textContent = "$" + formatear(p.precio);

  enlace.appendChild(foto);
  enlace.appendChild(cat);
  enlace.appendChild(titulo);
  enlace.appendChild(precio);

  const boton = document.createElement("button");
  boton.className = "btn";
  boton.textContent = "Agregar al carrito";
  boton.onclick = function () {
    agregarAlCarrito(p, 1);
    boton.textContent = "¡Agregado! ✓";
    setTimeout(function () { boton.textContent = "Agregar al carrito"; }, 1200);
  };
  if (p.agotado) {
    boton.textContent = "Agotado";
    boton.disabled = true;
    boton.onclick = null;
  }

  caja.appendChild(enlace);
  caja.appendChild(boton);
  return caja;
}

// ================== CARRITO ==================
function agregarAlCarrito(producto, cantidad) {
  if (producto.agotado) return; // un producto agotado no se puede agregar
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].producto.id === producto.id) {
      carrito[i].cantidad += cantidad;
      dibujarCarrito();
      return;
    }
  }
  carrito.push({ producto: producto, cantidad: cantidad });
  dibujarCarrito();
}

function cambiarCantidad(indice, cambio) {
  carrito[indice].cantidad += cambio;
  if (carrito[indice].cantidad <= 0) {
    carrito.splice(indice, 1);
  }
  dibujarCarrito();
}

function dibujarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  let total = 0;
  let cantidad = 0;

  for (let i = 0; i < carrito.length; i++) {
    let item = carrito[i];
    let subtotal = item.producto.precio * item.cantidad;
    total += subtotal;
    cantidad += item.cantidad;

    let li = document.createElement("li");
    let nombre = document.createElement("strong");
    nombre.textContent = item.producto.nombre;
    let detalle = document.createElement("div");
    detalle.textContent = "$" + formatear(item.producto.precio) + " c/u";

    let fila = document.createElement("div");
    fila.className = "item-fila";

    let menos = document.createElement("button");
    menos.textContent = "−";
    menos.onclick = function () { cambiarCantidad(i, -1); };
    let cant = document.createElement("span");
    cant.textContent = item.cantidad;
    let mas = document.createElement("button");
    mas.textContent = "+";
    mas.onclick = function () { cambiarCantidad(i, 1); };
    let sub = document.createElement("span");
    sub.textContent = "$" + formatear(subtotal);

    fila.appendChild(menos);
    fila.appendChild(cant);
    fila.appendChild(mas);
    fila.appendChild(sub);

    li.appendChild(nombre);
    li.appendChild(detalle);
    li.appendChild(fila);
    lista.appendChild(li);
  }

  document.getElementById("cantidadTotal").textContent = cantidad;
  document.getElementById("totalCarrito").textContent = "Total: $" + formatear(total);
  document.getElementById("contador").textContent = cantidad;
  localStorage.setItem("carrito", JSON.stringify(carrito)); // se guarda para verlo en todas las páginas
}

function continuarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  let texto = "Hola! Quiero hacer el siguiente pedido:\n\n";
  let total = 0;
  let cantidad = 0;
  for (let i = 0; i < carrito.length; i++) {
    let item = carrito[i];
    texto += "• " + item.cantidad + " x " + item.producto.nombre +
             " - $" + formatear(item.producto.precio) + " c/u\n";
    total += item.producto.precio * item.cantidad;
    cantidad += item.cantidad;
  }
  texto += "\nCantidad de productos: " + cantidad;
  texto += "\nPrecio total: $" + formatear(total);

  // Elige al azar entre el índice 0 y el 1 (50% de probabilidad para cada una)
  const numeroElegido = TELEFONOS[Math.floor(Math.random() * TELEFONOS.length)];

  window.open("https://wa.me/" + numeroElegido + "?text=" + encodeURIComponent(texto), "_blank");
}

// ================== CARRITO AL DÍA ==================
// aviso dentro del panel del carrito (se crea la primera vez que se necesita)
function mostrarAvisoCarrito(texto) {
  let aviso = document.getElementById("avisoCarrito");
  if (!aviso) {
    if (texto === "") return;
    aviso = document.createElement("p");
    aviso.id = "avisoCarrito";
    aviso.className = "aviso-carrito";
    const lista = document.getElementById("listaCarrito");
    lista.parentNode.insertBefore(aviso, lista);
  }
  aviso.textContent = texto;
  aviso.hidden = texto === "";
}

// compara el carrito con los productos actuales de la base:
// actualiza precios y nombres, y quita los productos que ya no existen
async function actualizarCarritoConBase() {
  if (carrito.length === 0) return;
  let filas;
  try {
    const respuesta = await fetch("/productos");
    filas = await respuesta.json();
  } catch (error) {
    return; // sin conexión con el servidor: el carrito queda como está
  }
  if (!Array.isArray(filas)) return;

  const actuales = {};
  filas.forEach(function (fila) {
    const p = normalizar(fila);
    actuales[p.id] = p;
  });

  let cambioPrecio = false;
  let quitados = 0;
  const nuevoCarrito = [];
  for (let i = 0; i < carrito.length; i++) {
    const guardado = carrito[i].producto;
    const actual = actuales[guardado.id];
    if (!actual || actual.agotado) { quitados++; continue; } // ya no existe o se agotó
    if (actual.precio !== guardado.precio) cambioPrecio = true;
    nuevoCarrito.push({ producto: actual, cantidad: carrito[i].cantidad });
  }
  carrito = nuevoCarrito;
  dibujarCarrito();

  if (cambioPrecio && quitados > 0) {
    mostrarAvisoCarrito("Actualizamos tu carrito: cambiaron algunos precios y se quitaron productos que ya no están disponibles.");
  } else if (cambioPrecio) {
    mostrarAvisoCarrito("Actualizamos tu carrito: cambió el precio de algunos productos.");
  } else if (quitados > 0) {
    mostrarAvisoCarrito("Se quitaron del carrito productos que ya no están disponibles.");
  }
}

function abrirCarrito(abrir) {
  if (abrir) actualizarCarritoConBase(); // al abrir el carrito se revisan precios y productos
  else mostrarAvisoCarrito("");
  document.getElementById("panelCarrito").classList.toggle("abierto", abrir);
  document.getElementById("fondoOscuro").classList.toggle("visible", abrir);
}

document.getElementById("btnCarrito").onclick = function () { abrirCarrito(true); };
document.getElementById("cerrarCarrito").onclick = function () { abrirCarrito(false); };
document.getElementById("fondoOscuro").onclick = function () { abrirCarrito(false); };
document.getElementById("btnComprar").onclick = continuarCompra;

// ================== BUSCADOR DEL HEADER ==================
document.getElementById("btnBuscar").onclick = function () {
  const barra = document.getElementById("barraBusqueda");
  barra.classList.toggle("abierta");
  if (barra.classList.contains("abierta")) document.getElementById("buscadorHeader").focus();
};

// ================== SUGERENCIAS AL BUSCAR ==================
// mientras se escribe en la lupa del header, se muestran los productos que coinciden
const campoBusqueda = document.getElementById("buscadorHeader");
const formBusqueda = document.getElementById("barraBusqueda");
const cajaSugerencias = document.createElement("div");
cajaSugerencias.id = "sugerencias";
cajaSugerencias.hidden = true;
formBusqueda.appendChild(cajaSugerencias);

let productosParaBuscar = null;   // se cargan una sola vez, la primera vez que se escribe
let ultimaBusqueda = "";

// para comparar sin importar mayúsculas ni tildes ("bano" encuentra "Baño")
function sinAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function cargarProductosParaBuscar() {
  if (productosParaBuscar) return productosParaBuscar;
  try {
    const respuesta = await fetch("/productos");
    const filas = await respuesta.json();
    if (Array.isArray(filas)) productosParaBuscar = filas.map(normalizar);
  } catch (error) {
    console.log(error);
  }
  return productosParaBuscar || [];
}

// una fila de la lista: foto, nombre (con lo escrito en negrita) y precio
function crearSugerencia(p, texto) {
  const enlace = document.createElement("a");
  enlace.className = "sugerencia";
  enlace.href = "producto.html?id=" + p.id;

  const img = document.createElement("img");
  img.src = p.imagen || "img/logo.delsitio.png";
  img.alt = "";
  img.loading = "lazy";

  const nombre = document.createElement("span");
  nombre.className = "sugerencia-nombre";
  const plano = sinAcentos(p.nombre);
  const inicio = plano.indexOf(texto);
  if (inicio >= 0 && plano.length === p.nombre.length) {
    nombre.appendChild(document.createTextNode(p.nombre.slice(0, inicio)));
    const negrita = document.createElement("strong");
    negrita.textContent = p.nombre.slice(inicio, inicio + texto.length);
    nombre.appendChild(negrita);
    nombre.appendChild(document.createTextNode(p.nombre.slice(inicio + texto.length)));
  } else {
    nombre.textContent = p.nombre;
  }

  const precio = document.createElement("span");
  precio.className = "sugerencia-precio";
  precio.textContent = "$" + formatear(p.precio) + (p.agotado ? " · Agotado" : "");

  const datos = document.createElement("div");
  datos.appendChild(nombre);
  datos.appendChild(precio);
  enlace.appendChild(img);
  enlace.appendChild(datos);
  return enlace;
}

async function mostrarSugerencias(escrito) {
  const texto = sinAcentos(escrito.trim());
  ultimaBusqueda = texto;
  if (texto === "") {
    cajaSugerencias.hidden = true;
    return;
  }
  const todos = await cargarProductosParaBuscar();
  if (texto !== ultimaBusqueda) return;   // se siguió escribiendo: este resultado ya no sirve

  const coinciden = todos.filter(function (p) {
    return sinAcentos(p.nombre + " " + p.categoria).includes(texto);
  });
  cajaSugerencias.innerHTML = "";
  if (coinciden.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "sugerencias-vacio";
    vacio.textContent = "No encontramos productos con esa búsqueda.";
    cajaSugerencias.appendChild(vacio);
  } else {
    coinciden.slice(0, 4).forEach(function (p) {
      cajaSugerencias.appendChild(crearSugerencia(p, texto));
    });
    const verTodos = document.createElement("a");
    verTodos.className = "sugerencias-todos";
    verTodos.href = "index.html?buscar=" + encodeURIComponent(escrito.trim());
    verTodos.textContent = "Ver todos los resultados";
    verTodos.onclick = function (e) {
      e.preventDefault();
      buscarDesdeHeader(escrito.trim());
    };
    cajaSugerencias.appendChild(verTodos);
  }
  cajaSugerencias.hidden = false;
}

// "Ver todos los resultados" o Enter: en el inicio se filtra la grilla; en otra página se va al inicio
function buscarDesdeHeader(texto) {
  cajaSugerencias.hidden = true;
  if (typeof buscar === "function") {
    buscar(texto);
    document.getElementById("tituloProductos").scrollIntoView();
  } else {
    location.href = "index.html?buscar=" + encodeURIComponent(texto);
  }
}

campoBusqueda.addEventListener("input", function () {
  mostrarSugerencias(campoBusqueda.value);
  // si se borra todo el texto en el inicio, se vuelve a ver la lista completa
  if (campoBusqueda.value.trim() === "" && typeof buscar === "function") buscar("");
});
campoBusqueda.addEventListener("focus", function () {
  if (campoBusqueda.value.trim() !== "") mostrarSugerencias(campoBusqueda.value);
});
campoBusqueda.addEventListener("keydown", function (e) {
  if (e.key === "Escape") cajaSugerencias.hidden = true;
});
formBusqueda.addEventListener("submit", function (e) {
  e.preventDefault();
  const texto = campoBusqueda.value.trim();
  if (texto !== "") buscarDesdeHeader(texto);
});
// al hacer clic fuera de la barra, la lista se cierra
document.addEventListener("click", function (e) {
  if (!formBusqueda.contains(e.target) && !document.getElementById("btnBuscar").contains(e.target)) {
    cajaSugerencias.hidden = true;
  }
});

// desde cualquier página, una categoría del menú lleva al inicio filtrado
function irACategoria(nombre) {
  if (typeof buscarCategoria === "function") buscarCategoria(nombre);
  else location.href = "index.html?categoria=" + encodeURIComponent(nombre);
}

// ================== MENÚ ==================
const menu = document.getElementById("menu");
const desplegable = document.querySelector(".desplegable");

document.getElementById("btnMenu").onclick = function () { menu.classList.toggle("abierto"); };

document.getElementById("btnProductos").onclick = function (e) {
  e.preventDefault();
  desplegable.classList.toggle("abierto");
};

// al elegir una categoría del desplegable, se filtran los productos
const opciones = document.querySelectorAll("[data-cat]");
for (let i = 0; i < opciones.length; i++) {
  opciones[i].onclick = function (e) {
    e.preventDefault();
    irACategoria(opciones[i].dataset.cat);
    desplegable.classList.remove("abierto");
    menu.classList.remove("abierto");
  };
}

// cerrar el menú al tocar un enlace común (en celular)
const enlaces = document.querySelectorAll("#menu > a");
for (let i = 0; i < enlaces.length; i++) {
  enlaces[i].onclick = function () { menu.classList.remove("abierto"); };
}

// ================== WHATSAPP DEL FOOTER ==================
document.getElementById("btnContacto").href =
  "https://wa.me/" + TELEFONOS[0] + "?text=" + encodeURIComponent("Hola! Quisiera hacer una consulta.");

// ================== APARECER AL SCROLLEAR ==================
const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });


function observarAparecer() {
  document.querySelectorAll(".aparecer").forEach(function (el) { observador.observe(el); });
}

dibujarCarrito();
observarAparecer();
actualizarCarritoConBase(); // al entrar al sitio también se revisa el carrito

// ================== BOTÓN INICIO ==================
// Recarga la página de inicio como al entrar por primera vez.
// El carrito se conserva porque está guardado en el navegador (localStorage).
const enlacesInicio = document.querySelectorAll('a[href$="#inicio"]');
for (let i = 0; i < enlacesInicio.length; i++) {
  enlacesInicio[i].addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
    location.href = "index.html";
  });
}
