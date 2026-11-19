// importar la conexión creada en el archivo conexion.js
const conexion = require("./conexion");

// crear un servidor
const express = require("express");       // importa el módulo express
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");

const servidor = express();               // crea un objeto llamado servidor 

// clave para entrar a admin.html (¡cambiala por una tuya!)
const CLAVE_ADMIN = "messi060608";

// Configuración de multer: solo imágenes, máximo 3 MB y con un nombre único (no pisa fotos anteriores)
const TIPOS = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dirImg = path.join(__dirname, "public", "img");
      fs.mkdirSync(dirImg, { recursive: true });
      cb(null, dirImg);
    },
    filename: function (req, file, cb) {
      cb(null, "producto_" + Date.now() + TIPOS[file.mimetype]);
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (TIPOS[file.mimetype]) cb(null, true);
    else cb(new Error("Solo se permiten imágenes JPG, PNG o WebP."));
  }
});

// activar el servidor
const puerto = process.env.PORT || 3000;
servidor.listen(puerto, function () {
  console.log("Servidor activo en puerto " + puerto + ". Carpeta pública: " + path.join(__dirname, "public"));
});

servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

const carpetaPublica = path.join(__dirname, "public");
servidor.use(express.static(carpetaPublica));

// consulta de productos: trae también el nombre de la categoría
const sqlProductos =
  "select p.*, c.nombre as nombrecategoria " +
  "from productos p join categorias c on p.categoria = c.idcategoria";

// todas las categorías
servidor.get("/categorias", async function (req, respuesta) {
  try {
    const resultado = await conexion.query("select * from categorias");
    respuesta.json(resultado[0]);
  } catch (error) {
    console.log(error);
    respuesta.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// todos los productos
servidor.get("/productos", async function (req, respuesta) {
  try {
    const resultado = await conexion.query(sqlProductos);
    respuesta.json(resultado[0]);
  } catch (error) {
    console.log(error);
    respuesta.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// un solo producto (para la página individual)
servidor.get("/productos/:id", async function (req, respuesta) {
  try {
    const resultado = await conexion.query(sqlProductos + " where p.idproductos = ?", [req.params.id]);
    const filas = resultado[0];
    if (filas.length === 0) {
      respuesta.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    respuesta.json(filas[0]);
  } catch (error) {
    console.log(error);
    respuesta.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// ================== ADMINISTRACIÓN (solo con clave) ==================
// Cualquiera puede VER productos (GET), pero solo el administrador puede crear, editar o borrar.

const sesiones = new Set(); // sesiones abiertas (se borran al reiniciar el servidor)

// entrar al panel: devuelve un token que admin.js manda en cada pedido
servidor.post("/admin/login", function (req, respuesta) {
  if (req.body.clave !== CLAVE_ADMIN) {
    respuesta.status(401).json({ error: "Clave incorrecta" });
    return;
  }
  const token = crypto.randomBytes(24).toString("hex");
  sesiones.add(token);
  respuesta.json({ token: token });
});

// deja pasar solo los pedidos que traen un token válido
function soloAdmin(req, respuesta, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!sesiones.has(token)) {
    respuesta.status(401).json({ error: "No autorizado" });
    return;
  }
  next();
}

servidor.get("/admin/verificar", soloAdmin, function (req, respuesta) {
  respuesta.json({ ok: true });
});

// sube la imagen; si el tipo o el tamaño no sirven, responde con el error
function subirImagen(req, respuesta, next) {
  upload.fields([{ name: "imagen", maxCount: 1 }, { name: "imagen2", maxCount: 1 }, { name: "imagen3", maxCount: 1 }])(req, respuesta, function (error) {
    if (error) {
      const mensaje = error.code === "LIMIT_FILE_SIZE" ? "La imagen pesa más de 3 MB." : error.message;
      respuesta.status(400).json({ error: mensaje });
      return;
    }
    next();
  });
}

// borra del disco una foto subida desde el panel (no toca el logo ni otras imágenes)
function borrarImagen(ruta) {
  if (ruta && /^img\/producto_[\w.]+$/.test(ruta)) {
    fs.unlink(path.join(__dirname, "public", ruta), function () {});
  }
}

// una ruta de imagen es válida si es "img/archivo.ext" y el archivo existe en la carpeta img
function imagenValida(ruta) {
  return typeof ruta === "string" &&
    /^img\/[^\/\\]+\.(jpe?g|png|webp)$/i.test(ruta) &&
    fs.existsSync(path.join(__dirname, "public", ruta));
}

// borra una foto copiada por el panel, pero solo si ningún otro producto la usa
async function borrarSiNadieUsa(ruta) {
  if (!ruta || !/^img\/producto_[\w.]+$/.test(ruta)) return;
  const [filas] = await conexion.query("select count(*) as total from productos where imagen = ? or imagen2 = ? or imagen3 = ?", [ruta, ruta, ruta]);
  if (filas[0].total === 0) {
    fs.unlink(path.join(__dirname, "public", ruta), function () {});
  }
}

// lista las fotos que ya están en la carpeta img (para no copiar una foto que ya está ahí)
servidor.get("/admin/imagenes", soloAdmin, function (req, respuesta) {
  const carpeta = path.join(__dirname, "public", "img");
  let archivos = [];
  try {
    archivos = fs.readdirSync(carpeta)
      .filter(function (nombre) { return /\.(jpe?g|png|webp)$/i.test(nombre); })
      .map(function (nombre) { return { nombre: nombre, tamano: fs.statSync(path.join(carpeta, nombre)).size }; });
  } catch (error) {
    console.log(error);
  }
  respuesta.json(archivos);
});

function responderError(respuesta, error, general) {
  console.log(error);
  if (error.code === "ER_DUP_ENTRY") {
    respuesta.status(409).json({ error: "Ya existe un producto con ese nombre." });
  } else {
    respuesta.status(500).json({ error: general });
  }
}

// fotos subidas en este pedido: principal ("imagen"), segunda ("imagen2") y tercera ("imagen3")
function fotosSubidas(req) {
  const archivos = req.files || {};
  return {
    principal: archivos.imagen ? archivos.imagen[0] : null,
    secundaria: archivos.imagen2 ? archivos.imagen2[0] : null,
    tercera: archivos.imagen3 ? archivos.imagen3[0] : null
  };
}

// CREAR PRODUCTO
servidor.post("/productos", soloAdmin, subirImagen, async function (req, respuesta) {
  const { descripcion, categoria, precio, medidas, material, fragancia, cantidad, detalle, agotado,
          imagenExistente, imagen2Existente, imagen3Existente } = req.body;
  const sinStock = agotado === "1" ? 1 : 0;
  const subidas = fotosSubidas(req);
  // cada foto: nueva (se copia) o ya existente en la carpeta img (se usa tal cual)
  const imagenRuta = subidas.principal ? "img/" + subidas.principal.filename
    : (imagenValida(imagenExistente) ? imagenExistente : "img/logo.delsitio.png");
  const imagen2Ruta = subidas.secundaria ? "img/" + subidas.secundaria.filename
    : (imagenValida(imagen2Existente) ? imagen2Existente : "");
  const imagen3Ruta = subidas.tercera ? "img/" + subidas.tercera.filename
    : (imagenValida(imagen3Existente) ? imagen3Existente : "");
  try {
    const sql = "insert into productos (descripcion, categoria, precio, imagen, imagen2, imagen3, medidas, material, fragancia, cantidad, detalle, agotado) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [resultado] = await conexion.query(sql, [descripcion, categoria, precio, imagenRuta, imagen2Ruta, imagen3Ruta, medidas, material, fragancia, cantidad, detalle, sinStock]);
    respuesta.json({ mensaje: "Producto creado con éxito", id: resultado.insertId });
  } catch (error) {
    if (subidas.principal) borrarImagen(imagenRuta);
    if (subidas.secundaria) borrarImagen(imagen2Ruta);
    if (subidas.tercera) borrarImagen(imagen3Ruta);
    responderError(respuesta, error, "Error al crear el producto en la base de datos");
  }
});

// EDITAR PRODUCTO
servidor.put("/productos/:id", soloAdmin, subirImagen, async function (req, respuesta) {
  const { descripcion, categoria, precio, medidas, material, fragancia, cantidad, detalle, agotado,
          imagenActual, imagen2Actual, imagen3Actual,
          imagenExistente, imagen2Existente, imagen3Existente, quitarImagen2, quitarImagen3 } = req.body;
  const sinStock = agotado === "1" ? 1 : 0;
  const subidas = fotosSubidas(req);
  const imagenRuta = subidas.principal ? "img/" + subidas.principal.filename
    : (imagenValida(imagenExistente) ? imagenExistente : imagenActual);
  let imagen2Ruta = imagen2Actual || "";
  if (subidas.secundaria) imagen2Ruta = "img/" + subidas.secundaria.filename;
  else if (imagenValida(imagen2Existente)) imagen2Ruta = imagen2Existente;
  else if (quitarImagen2 === "1") imagen2Ruta = "";     // se eligieron menos fotos: se saca la segunda
  let imagen3Ruta = imagen3Actual || "";
  if (subidas.tercera) imagen3Ruta = "img/" + subidas.tercera.filename;
  else if (imagenValida(imagen3Existente)) imagen3Ruta = imagen3Existente;
  else if (quitarImagen3 === "1") imagen3Ruta = "";     // se eligieron menos fotos: se saca la tercera
  try {
    const sql = "update productos set descripcion = ?, categoria = ?, precio = ?, imagen = ?, imagen2 = ?, imagen3 = ?, medidas = ?, material = ?, fragancia = ?, cantidad = ?, detalle = ?, agotado = ? where idproductos = ?";
    await conexion.query(sql, [descripcion, categoria, precio, imagenRuta, imagen2Ruta, imagen3Ruta, medidas, material, fragancia, cantidad, detalle, sinStock, req.params.id]);
    // las copias anteriores se borran solo si ningún producto las usa
    if (imagenRuta !== imagenActual) await borrarSiNadieUsa(imagenActual);
    if (imagen2Ruta !== (imagen2Actual || "")) await borrarSiNadieUsa(imagen2Actual);
    if (imagen3Ruta !== (imagen3Actual || "")) await borrarSiNadieUsa(imagen3Actual);
    respuesta.json({ mensaje: "Producto actualizado con éxito" });
  } catch (error) {
    if (subidas.principal) borrarImagen(imagenRuta);
    if (subidas.secundaria) borrarImagen(imagen2Ruta);
    if (subidas.tercera) borrarImagen(imagen3Ruta);
    responderError(respuesta, error, "Error al actualizar el producto en la base de datos");
  }
});

// ELIMINAR PRODUCTO
servidor.delete("/productos/:id", soloAdmin, async function (req, respuesta) {
  try {
    const [filas] = await conexion.query("select imagen, imagen2, imagen3 from productos where idproductos = ?", [req.params.id]);
    await conexion.query("delete from productos where idproductos = ?", [req.params.id]);
    if (filas.length > 0) {
      await borrarSiNadieUsa(filas[0].imagen);
      await borrarSiNadieUsa(filas[0].imagen2);
      await borrarSiNadieUsa(filas[0].imagen3);
    }
    respuesta.json({ mensaje: "Producto eliminado con éxito" });
  } catch (error) {
    responderError(respuesta, error, "Error al eliminar el producto de la base de datos");
  }
});
