// Lógica del Panel de Administración

// ================== SESIÓN DE ADMINISTRADOR ==================
let tokenAdmin = sessionStorage.getItem("tokenAdmin");

// agrega el token a un pedido al servidor
function conToken(opciones) {
  opciones.headers = { Authorization: "Bearer " + tokenAdmin };
  return opciones;
}

function mostrarPanel(mostrar) {
  if (mostrar) cargarImagenesServidor();
  document.getElementById("pantallaLogin").hidden = mostrar;
  document.getElementById("panelAdmin").hidden = !mostrar;
  document.getElementById("btnSalir").hidden = !mostrar;
}

function cerrarSesion() {
  tokenAdmin = null;
  sessionStorage.removeItem("tokenAdmin");
  mostrarPanel(false);
}

// mensaje de error que mandó el servidor (si la sesión venció, vuelve al ingreso)
async function errorDe(respuesta, general) {
  if (respuesta.status === 401) {
    cerrarSesion();
    return "Tu sesión venció. Ingresá de nuevo.";
  }
  try { return (await respuesta.json()).error || general; } catch (e) { return general; }
}

document.getElementById("formLogin").onsubmit = async function (e) {
  e.preventDefault();
  try {
    const respuesta = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave: document.getElementById("clave").value })
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      alert(datos.error || "Clave incorrecta");
      return;
    }
    tokenAdmin = datos.token;
    sessionStorage.setItem("tokenAdmin", tokenAdmin);
    document.getElementById("clave").value = "";
    mostrarPanel(true);
  } catch (err) {
    if (err instanceof SyntaxError) {
      // el servidor respondió con una página en vez de datos: no conoce la ruta de ingreso
      alert("El servidor no reconoce la ruta de ingreso. Reemplazá servidor.js por el nuevo y reiniciá el servidor (Ctrl + C y después node servidor.js).");
    } else {
      alert("No se pudo conectar con el servidor. Revisá que node servidor.js esté funcionando y entrá por http://localhost:3000/admin.html");
    }
  }
};

document.getElementById("btnSalir").onclick = cerrarSesion;

// si ya había una sesión abierta, se comprueba que siga siendo válida
if (tokenAdmin) {
  fetch("/admin/verificar", conToken({})).then(function (r) {
    if (r.ok) mostrarPanel(true); else cerrarSesion();
  });
}

let categoriasAdmin = [];

// ================== FOTOS QUE YA ESTÁN EN LA CARPETA img ==================
let imagenesServidor = [];

async function cargarImagenesServidor() {
  try {
    const res = await fetch("/admin/imagenes", conToken({}));
    if (res.ok) imagenesServidor = await res.json();
  } catch (err) {
    console.error("Error al leer las fotos de la carpeta img:", err);
  }
}

// si la foto elegida ya está en la carpeta img (mismo nombre y mismo tamaño), devuelve su nombre
function buscarEnServidor(archivo) {
  for (let i = 0; i < imagenesServidor.length; i++) {
    if (imagenesServidor[i].nombre.toLowerCase() === archivo.name.toLowerCase() && imagenesServidor[i].tamano === archivo.size) {
      return imagenesServidor[i].nombre;
    }
  }
  return null;
}

document.getElementById("imagenFile").onchange = function () {
  const aviso = document.getElementById("avisoImagen");
  const archivo = this.files[0];
  if (!archivo) { aviso.textContent = ""; return; }
  aviso.textContent = buscarEnServidor(archivo)
    ? "✓ Esta foto ya está en la carpeta img: se usa sin copiarla."
    : "Esta foto no está en la carpeta img: se va a copiar ahí.";
};

async function cargarCategoriasSelect() {
  try {
    const res = await fetch("/categorias");
    categoriasAdmin = await res.json();
    const select = document.getElementById("categoria");
    select.innerHTML = '<option value="">Seleccioná una categoría...</option>';
    
    categoriasAdmin.forEach(c => {
      let option = document.createElement("option");
      option.value = c.idcategoria;
      option.textContent = c.nombre;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar categorías:", err);
  }
}

async function cargarProductosAdmin() {
  try {
    const res = await fetch("/productos");
    const productos = await res.json();
    const contenedor = document.getElementById("contenedorCategoriasAdmin");
    contenedor.innerHTML = "";

    if (productos.length === 0) {
      contenedor.innerHTML = '<p style="text-align: center; color: #777; padding: 20px;">No hay productos cargados en la base de datos.</p>';
      return;
    }

    // Agrupar productos por categoría
    let agrupados = {};
    productos.forEach(p => {
      let catNombre = p.nombrecategoria || "Sin categoría";
      if (!agrupados[catNombre]) {
        agrupados[catNombre] = [];
      }
      agrupados[catNombre].push(p);
    });

    for (let cat in agrupados) {
      let seccionCat = document.createElement("div");
      seccionCat.style.marginBottom = "30px";

      let tituloCat = document.createElement("h4");
      tituloCat.textContent = cat;
      tituloCat.style.color = "var(--rosa-oscuro)";
      tituloCat.style.borderBottom = "2px solid var(--beige)";
      tituloCat.style.paddingBottom = "8px";
      tituloCat.style.fontSize = "1.2rem";
      seccionCat.appendChild(tituloCat);

      let tablaDiv = document.createElement("div");
      tablaDiv.style.overflowX = "auto";

      let tabla = document.createElement("table");
      tabla.style.width = "100%";
      tabla.style.borderCollapse = "collapse";
      tabla.style.textAlign = "left";
      tabla.style.fontSize = "0.95rem";
      tabla.style.marginTop = "10px";

      tabla.innerHTML = `
        <thead>
          <tr style="border-bottom: 1px solid var(--beige); color: #777;">
            <th style="padding: 10px;">Imagen</th>
            <th style="padding: 10px;">Nombre</th>
            <th style="padding: 10px;">Precio</th>
            <th style="padding: 10px;">Medidas / Fragancia</th>
            <th style="padding: 10px;">Material / Cantidad</th>
            <th style="padding: 10px; text-align: center;">Acciones</th>
          </tr>
        </thead>
      `;

      let tbody = document.createElement("tbody");

      agrupados[cat].forEach(p => {
        let tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid #f3e9dc";

        let tdImg = document.createElement("td");
        tdImg.style.padding = "10px";
        let img = document.createElement("img");
        img.src = p.imagen || "img/logo.delsitio.png";
        img.alt = p.nombre || p.descripcion;
        img.style.width = "45px";
        img.style.height = "45px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "4px";
        tdImg.appendChild(img);

        let tdNombre = document.createElement("td");
        tdNombre.style.padding = "10px";
        tdNombre.textContent = p.nombre || p.descripcion;
        tdNombre.style.fontWeight = "500";
        if (Number(p.agotado) === 1) {
          const marca = document.createElement("span");
          marca.textContent = "AGOTADO";
          marca.style.cssText = "margin-left: 8px; padding: 2px 8px; border-radius: 30px; background: #c25e5e; color: white; font-size: 0.7rem; letter-spacing: .08em;";
          tdNombre.appendChild(marca);
        }

        let tdPrecio = document.createElement("td");
        tdPrecio.style.padding = "10px";
        tdPrecio.textContent = "$" + Number(p.precio).toLocaleString("es-AR");

        let tdMedidas = document.createElement("td");
        tdMedidas.style.padding = "10px";
        tdMedidas.textContent = p.medidas || p.fragancia || "-";

        let tdMaterial = document.createElement("td");
        tdMaterial.style.padding = "10px";
        tdMaterial.textContent = p.material || p.cantidad || "-";

        let tdAcciones = document.createElement("td");
        tdAcciones.style.padding = "10px";
        tdAcciones.style.textAlign = "center";
        tdAcciones.style.display = "flex";
        tdAcciones.style.gap = "8px";
        tdAcciones.style.justifyContent = "center";
        tdAcciones.style.alignItems = "center";
        tdAcciones.style.height = "65px";

        let btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn";
        btnEditar.style.padding = "6px 14px";
        btnEditar.style.fontSize = "0.8rem";
        btnEditar.onclick = () => prepararEdicion(p);

        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn";
        btnEliminar.style.padding = "6px 14px";
        btnEliminar.style.fontSize = "0.8rem";
        btnEliminar.style.backgroundColor = "#c25e5e";
        btnEliminar.onclick = () => eliminarProducto(p.idproductos);

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdImg);
        tr.appendChild(tdNombre);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdMedidas);
        tr.appendChild(tdMaterial);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
      });

      tabla.appendChild(tbody);
      tablaDiv.appendChild(tabla);
      seccionCat.appendChild(tablaDiv);
      contenedor.appendChild(seccionCat);
    }
  } catch (err) {
    console.error("Error al cargar productos para admin:", err);
  }
}

function prepararEdicion(p) {
  document.getElementById("formTitulo").textContent = "Editar Producto";
  document.getElementById("idProducto").value = p.idproductos;
  document.getElementById("nombre").value = p.nombre || p.descripcion;
  document.getElementById("precio").value = p.precio;
  document.getElementById("imagenActual").value = p.imagen || "";
  document.getElementById("medidas").value = p.medidas || "";
  document.getElementById("material").value = p.material || "";
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("fragancia").value = p.fragancia || "";
  document.getElementById("cantidad").value = p.cantidad || "";
  document.getElementById("detalle").value = p.detalle || "";
  document.getElementById("agotado").checked = Number(p.agotado) === 1;
  document.getElementById("imagen2Actual").value = p.imagen2 || "";
  document.getElementById("imagen3Actual").value = p.imagen3 || "";
  document.getElementById("cantidadFotos").value = p.imagen3 ? "3" : (p.imagen2 ? "2" : "1");
  actualizarCampoFoto2();
  document.getElementById("avisoImagen2").textContent = p.imagen2 ? "Ya tiene foto secundaria. Elegí otra solo si querés cambiarla." : "";
  document.getElementById("avisoImagen3").textContent = p.imagen3 ? "Ya tiene tercera foto. Elegí otra solo si querés cambiarla." : "";
  document.getElementById("tipoProducto").value = (p.fragancia || p.cantidad) ? "aroma" : "comun";
  actualizarCamposSegunTipo();

  document.getElementById("btnCancelar").classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormulario() {
  document.getElementById("formTitulo").textContent = "Nuevo Producto";
  document.getElementById("formProducto").reset();
  document.getElementById("idProducto").value = "";
  document.getElementById("imagenActual").value = "";
  document.getElementById("avisoImagen").textContent = "";
  document.getElementById("imagen2Actual").value = "";
  document.getElementById("imagen3Actual").value = "";
  document.getElementById("avisoImagen2").textContent = "";
  document.getElementById("avisoImagen3").textContent = "";
  actualizarCampoFoto2();
  document.getElementById("btnCancelar").classList.add("oculto");
  actualizarCamposSegunTipo();
}

document.getElementById("btnCancelar").onclick = limpiarFormulario;

document.getElementById("formProducto").onsubmit = async function(e) {
  e.preventDefault();
  
  const id = document.getElementById("idProducto").value;
  const formData = new FormData();
  formData.append("descripcion", document.getElementById("nombre").value);
  formData.append("categoria", document.getElementById("categoria").value);
  formData.append("precio", document.getElementById("precio").value);
  // se envían solo los campos que corresponden a la categoría elegida
  const esAroma = !document.querySelector(".grupo-aroma").hidden;
  formData.append("medidas", esAroma ? "" : document.getElementById("medidas").value);
  formData.append("material", esAroma ? "" : document.getElementById("material").value);
  formData.append("fragancia", esAroma ? document.getElementById("fragancia").value : "");
  formData.append("cantidad", esAroma ? document.getElementById("cantidad").value : "");
  formData.append("detalle", document.getElementById("detalle").value);
  formData.append("agotado", document.getElementById("agotado").checked ? "1" : "0");
  formData.append("imagenActual", document.getElementById("imagenActual").value);

  const archivoInput = document.getElementById("imagenFile");
  if (archivoInput.files.length > 0) {
    const archivo = archivoInput.files[0];
    const existente = buscarEnServidor(archivo);
    if (existente) {
      formData.append("imagenExistente", "img/" + existente); // ya está en la carpeta: no se copia
    } else {
      formData.append("imagen", archivo);                     // no está: se copia a la carpeta img
    }
  }

  // fotos 2 y 3: solo las que corresponden a la cantidad elegida
  const cantidadFotos = Number(document.getElementById("cantidadFotos").value);
  for (let n = 2; n <= 3; n++) {
    const actualN = document.getElementById("imagen" + n + "Actual").value;
    formData.append("imagen" + n + "Actual", actualN);
    if (cantidadFotos >= n) {
      const archivoN = document.getElementById("imagenFile" + n).files[0];
      if (archivoN) {
        const existenteN = buscarEnServidor(archivoN);
        if (existenteN) {
          formData.append("imagen" + n + "Existente", "img/" + existenteN); // ya está en la carpeta: no se copia
        } else {
          formData.append("imagen" + n, archivoN);                           // no está: se copia a la carpeta img
        }
      } else if (!actualN) {
        alert("Elegiste " + cantidadFotos + " fotos: falta elegir la foto " + n + ".");
        return;
      }
    } else {
      formData.append("quitarImagen" + n, "1"); // se eligieron menos fotos: se saca esta foto
    }
  }

  try {
    let url = "/productos";
    let metodo = "POST";

    if (id) {
      url = "/productos/" + id;
      metodo = "PUT";
    }

    const respuesta = await fetch(url, conToken({
      method: metodo,
      body: formData // FormData envía archivos y textos correctamente
    }));

    if (respuesta.ok) {
      alert(id ? "Producto actualizado correctamente" : "Producto creado correctamente");
      limpiarFormulario();
      cargarProductosAdmin();
      cargarImagenesServidor();
    } else {
      alert(await errorDe(respuesta, "Hubo un error al guardar el producto."));
    }
  } catch (err) {
    console.error("Error en la petición:", err);
    alert("Error de conexión con el servidor.");
  }
};

async function eliminarProducto(id) {
  if (!confirm("¿Estás seguro de que querés eliminar este producto de la base de datos?")) return;

  try {
    const respuesta = await fetch("/productos/" + id, conToken({
      method: "DELETE"
    }));

    if (respuesta.ok) {
      alert("Producto eliminado correctamente");
      cargarProductosAdmin();
    } else {
      alert(await errorDe(respuesta, "No se pudo eliminar el producto."));
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
    alert("Error de conexión con el servidor.");
  }
}

// Según el tipo de producto se muestran Medidas y Material, o Fragancia y Cantidad
function actualizarCamposSegunTipo() {
  const esAroma = document.getElementById("tipoProducto").value === "aroma";
  document.querySelectorAll(".grupo-aroma").forEach(function (d) { d.hidden = !esAroma; });
  document.querySelectorAll(".grupo-medidas").forEach(function (d) { d.hidden = esAroma; });
}

document.getElementById("tipoProducto").onchange = actualizarCamposSegunTipo;

// Muestra u oculta los campos de la segunda y la tercera foto según "1", "2" o "3 fotos"
function actualizarCampoFoto2() {
  const cantidad = Number(document.getElementById("cantidadFotos").value);
  document.querySelectorAll(".grupo-foto2").forEach(function (d) { d.hidden = cantidad < 2; });
  document.querySelectorAll(".grupo-foto3").forEach(function (d) { d.hidden = cantidad < 3; });
}

document.getElementById("cantidadFotos").onchange = actualizarCampoFoto2;

document.getElementById("imagenFile2").onchange = function () {
  const aviso = document.getElementById("avisoImagen2");
  const archivo = this.files[0];
  if (!archivo) { aviso.textContent = ""; return; }
  aviso.textContent = buscarEnServidor(archivo)
    ? "✓ Esta foto ya está en la carpeta img: se usa sin copiarla."
    : "Esta foto no está en la carpeta img: se va a copiar ahí.";
};

document.getElementById("imagenFile3").onchange = function () {
  const aviso = document.getElementById("avisoImagen3");
  const archivo = this.files[0];
  if (!archivo) { aviso.textContent = ""; return; }
  aviso.textContent = buscarEnServidor(archivo)
    ? "✓ Esta foto ya está en la carpeta img: se usa sin copiarla."
    : "Esta foto no está en la carpeta img: se va a copiar ahí.";
};

// Inicializar panel
cargarCategoriasSelect();
cargarProductosAdmin();
