// importar el módulo mysql
const mysql = require("mysql2/promise");

// crear la conexión con variables de entorno para Render y valores por defecto para local
const conexion = mysql.createPool({
  host: process.env.DB_HOST || "gateway01.sa-east-1.prod.aws.tidbcloud.com",
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || "3aCc4XRSpjjGkMa.root",
  password: process.env.DB_PASSWORD || "cE8NTGhueA51pkYF",
  database: process.env.DB_NAME || "tienda-th",
  ssl: process.env.DB_SSL === "true" ? { minVersion: "TLSv1.2" } : { minVersion: "TLSv1.2", rejectUnauthorized: true },
  enableKeepAlive: true
});

// exportar la conexión
module.exports = conexion;