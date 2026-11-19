-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: gateway01.sa-east-1.prod.aws.tidbcloud.com:4000
-- Tiempo de generación: 19-11-2026 a las 19:56:15
-- Versión del servidor: 8.0.11-TiDB-v8.5.3-serverless
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda-th`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `idcategoria` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`idcategoria`, `nombre`, `imagen`) VALUES
(1, 'Cocina comedor', 'img/portada/portada-cocina-comedor.jpg'),
(2, 'Living', 'img/portada/portada-living.jpg'),
(3, 'Baño', 'img/portada/portada-baño.avif'),
(4, 'Textiles y accesorios', 'img/portada/portada-textiles.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idproductos` int NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `imagen` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `categoria` int NOT NULL DEFAULT '0',
  `medidas` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `material` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `fragancia` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cantidad` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `detalle` text COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imagen2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `agotado` tinyint(1) NOT NULL DEFAULT '0',
  `imagen3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idproductos`, `descripcion`, `precio`, `imagen`, `categoria`, `medidas`, `material`, `fragancia`, `cantidad`, `detalle`, `imagen2`, `agotado`, `imagen3`) VALUES
(18, 'Mantel de tussor rayado', 37900.00, 'img/Mantel1ft1.webp', 1, '160 x 290 cm', 'Tussor', '', '', '', 'img/Mantel1ft2.webp', 0, NULL),
(19, 'Mantel de tussor estampado', 25900.00, 'img/Mantel2ft1.webp', 1, '150 x 200 cm', 'Tussor', '', '', '', 'img/Mantel2ft2.webp', 0, ''),
(20, 'Mantel de tussor estampado tropical', 25900.00, 'img/Mantel3ft1.webp', 1, '150 x 200 cm', 'Tussor', '', '', '', 'img/Mantel3ft2.webp', 0, ''),
(21, 'Mantel matero nido de abeja con volado color verde oliva', 16900.00, 'img/MM1-P.webp', 1, '70 x 90 cm', 'Nido de abeja', '', '', '', 'img/MM1-S.webp', 0, ''),
(22, 'Mantel matero nido de abeja con volado y puntilla rosa viejo', 16900.00, 'img/MM2-P.webp', 1, '70 x 90 cm', 'Nido de abeja', '', '', '', 'img/MM2-S.webp', 0, ''),
(23, 'Mantel matero nido de abeja con volado y aplique verde oliva', 16900.00, 'img/MM3-P.webp', 1, '70 X 90 cm', 'Nido de abeja', '', '', '', 'img/MM3-S.webp', 0, ''),
(24, 'Mantel matero nido de abeja con volado y aplique azul aero', 16900.00, 'img/MM4-P.webp', 1, '70 x 90 cm', 'Nido de abeja', '', '', '', 'img/MM4-S.webp', 0, ''),
(25, 'Mantel matero con puntilla entre dos y volado azul aero', 16900.00, 'img/MM5-P.webp', 1, '70 x 90 cm', 'Nido de abeja', '', '', '', 'img/MM5-S.webp', 0, ''),
(26, 'Mantel matero Tussor liso combinado con rayado arena y flecos', 13900.00, 'img/MM6-P.webp', 1, '70 x 90 cm', 'Tussor', '', '', '', 'img/MM6-S.webp', 0, ''),
(27, 'Mantel matero Tussor liso crudo combinado con rosa y flecos', 13900.00, 'img/MM7-P.webp', 1, '70 x 90 cm', 'Tussor', '', '', '', 'img/MM7-S.webp', 0, ''),
(28, 'Mantel matero Tussor liso crudo combinado con verde seco y flecos', 13900.00, 'img/MM8-P.webp', 1, '70 x 90 cm', 'Tussor', '', '', '', 'img/MM8-S.webp', 0, ''),
(29, 'Mantel matero Tussor liso crudo combinado con rayado en gris y flecos', 13900.00, 'img/MM9-P.webp', 1, '70 x 90 cm', 'Tussor', '', '', '', 'img/MM9-S.webp', 0, ''),
(30, 'Funda cubre bidón de agua 20l Diseño floral', 8900.00, 'img/funda-bidon1.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(31, 'Funda cubre bidón de agua 20l Diseño de hojas ', 8900.00, 'img/funda-bidon2.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(33, 'Funda cubre bidón de agua 20l Gris topo Diseño floral', 8900.00, 'img/funda-bidon3.jpg', 1, 'Bidón de 20 litros', 'Tussor', '', '', '', '', 0, ''),
(34, 'Funda cubre bidón de agua 20l Liso combinado con rayado', 8900.00, 'img/funda-bidon4.jpg', 1, 'Bidón de 20 litros', 'Lienzo con tussor rayado', '', '', '', '', 0, ''),
(35, 'Funda cubre bidón de agua 20l Gris topo Diseño de hojas', 8900.00, 'img/funda-bidon5.jpg', 1, 'Bidón de 20 litros', 'Tussor', '', '', '', '', 0, ''),
(36, 'Funda cubre bidón de agua 20l Diseño Jaula Love', 8900.00, 'img/funda-bidon6.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(37, 'Funda cubre bidón de agua 20l Diseño hojas', 8900.00, 'img/funda-bidon7.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(38, 'Funda cubre bidón de agua 20l Gris topo Diseño marino', 8900.00, 'img/funda-bidon8.jpg', 1, 'Bidón de 20 litros', 'Tussor', '', '', '', '', 0, ''),
(39, 'Funda cubre bidón de agua 20l Diseño marino', 8900.00, 'img/funda-bidon9.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(40, 'Funda cubre bidón de agua 20l inverso con cordón para canilla Diseño hojas', 10900.00, 'img/funda-bidon-cordon1.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(41, 'Funda cubre bidón de agua 20l inverso con cordón para canilla diseño de hojas', 10900.00, 'img/funda-bidon-cordon2.jpg', 1, 'Bidón de 20 litros', 'Lienzo', '', '', '', '', 0, ''),
(42, 'Mate imperial de calabaza ', 39900.00, 'img/mate-imperial de calabaza.jpg', 1, '', 'Calabaza', '', '', '', '', 0, NULL),
(43, 'Mate camionero de calabaza', 24999.00, 'img/mate-camionero.jpg', 1, '', 'Calabaza', '', '', '', '', 0, NULL),
(44, 'Mate camionero de algarrobo', 29999.00, 'img/mate-camionero de algarrobo.jpg', 1, '', 'Algarrobo', '', '', '', '', 0, NULL),
(45, 'Mate imperial de algarrobo', 34999.00, 'img/mate-imperial de algarrobo.jpg', 1, '', 'Algarrobo', '', '', '', '', 0, NULL),
(46, 'Bolsa para el pan en lienzo con hojas', 8900.00, 'img/producto_1794441209494.jpg', 1, '', 'Lienzo', '', '', '', '', 0, ''),
(48, 'Bolsa para el pan en lienzo con hojas grises', 8900.00, 'img/Bolsa-pan2.jpg', 1, '', 'Lienzo', '', '', '', '', 0, ''),
(49, 'Bolsa para el pan en lienzo con hojas negras', 8900.00, 'img/Bolsa-pan3.jpg', 1, '', 'Lienzo', '', '', '', '', 0, ''),
(50, 'Camino de mesa rustico con flecos', 17900.00, 'img/producto_1794441447702.jpg', 2, '42 x 145 cm', 'Lino de algodón', '', '', '', '', 0, ''),
(51, 'Camino de mesa rustico rayado', 17900.00, 'img/Camino2.jpg', 2, '40 x 195 cm', 'Tela rustica tejida', '', '', '', '', 0, ''),
(52, 'Camino de mesa gris topo diseño de hojas con flecos', 17900.00, 'img/Camino3.jpg', 2, '40 x 125 cm', 'Tussor', '', '', '', '', 0, ''),
(53, 'Camino de mesa color camel con detalles en puntillas y terminación en flecos', 23900.00, 'img/Camino4.jpg', 2, '40 x 128 cm', 'Lino de algodón', '', '', '', '', 0, ''),
(54, 'Camino de mesa con detalle de puntilla y volado', 19900.00, 'img/Camino5.jpg', 2, '43 x 150 cm', 'Tussor de gasa', '', '', '', '', 0, ''),
(55, 'Camino de mesa gris topo con volado', 17900.00, 'img/Camino6.jpg', 2, '40 x 145 cm', 'Tussor', '', '', '', '', 0, ''),
(56, 'Camino de mesa gris claro con volado y detalle en puntilla', 15900.00, 'img/Camino7.jpg', 2, '40 x 140 cm', 'Tussor de gasa', '', '', '', '', 0, ''),
(57, 'Camino de mesa gris topo diseño de hojas con valado', 23900.00, 'img/Camino8.jpg', 2, '45 x 190 cm', 'Tussor', '', '', '', '', 0, ''),
(58, 'Camino de mesa rosa viejo con volado y diseño de hojas', 16900.00, 'img/Camino9.jpg', 2, '40 x 135', 'Tussor', '', '', '', '', 0, ''),
(59, 'Funda de almohadones con diseño de las Islas Malvinas y las tres estrellas', 9900.00, 'img/Funda-almohadonesF2.jpg', 2, '50 x 50 cm', 'Tussor crudo', '', '', '', 'img/Funda-almohadonesF1.jpg', 0, ''),
(60, 'Cortina de baño tussor de algodón color crudo', 29900.00, 'img/producto_1794443963028.webp', 3, '180 x 180 cm', 'Tussor de algodón', '', '', 'Sumale estilo y calidez natural a tu baño con esta cortina confeccionada en tusor 100% algodón. Gracias a la textura suave y liviana de la tela, se adapta perfectamente a cualquier ambiente, generando un efecto decorativo rústico y relajado.', '', 0, NULL),
(61, 'Cortina de baño tussor de algodón color canela', 29900.00, 'img/cortina-canela.WEBP', 3, '180 x 180 cm', 'Tussor de algodón', '', '', 'Sumale estilo y calidez natural a tu baño con esta cortina confeccionada en tusor 100% algodón. Gracias a la textura suave y liviana de la tela, se adapta perfectamente a cualquier ambiente, generando un efecto decorativo rústico y relajado.', '', 0, NULL),
(62, 'Set de baño ', 19900.00, 'img/set-bañoft1.jpg', 3, 'Medida estándar', 'Lienzo', '', '', '', 'img/set-bañoft2.jpg', 0, 'img/set-bañoft3.jpg'),
(63, 'Home spray Poder', 7900.00, 'img/TyA-hs-poder.webp', 4, '', '', 'Poder', '250ml', 'Un blend que estimula la acción y la autoafirmación. Las notas de naranja, pimienta, jazmín y un fondo de cedro encienden el poder, el anhelo de avanzar.', '', 0, ''),
(64, 'Home spray Cher', 7900.00, 'img/TyA-hs-cher.webp', 4, '', '', 'Cher', '250ml', 'Dulce, suave y muy femenino. Un aroma envolvente que recuerda a perfume, fresco y delicado. Ideal para dejar el ambiente agradable, con buena energía, calma y un toque romántico.', '', 0, ''),
(65, 'Home spray Deseo', 7900.00, 'img/TyA-hs-deseo.webp', 4, '', '', 'Deseo ', '250ml', 'Un blend íntimo y profundo. Activa el deseo, la presencia y la conexión con el cuerpo. Notas de rosa vibrante, sándalo y un toque de frutilla despiertan los sentidos.', '', 0, ''),
(66, 'Home spray Refugio ', 7900.00, 'img/TyA-hs-refugio.webp', 4, '', '', 'Refugio ', '250ml', 'Un blend para bajar la guardia y volver al cuerpo. Inspirado en la sensación de volver a casa. Con notas de lavanda, tilo y un fondo cálido de coco y vainilla, este aroma envuelve y aquieta.', '', 0, ''),
(67, 'Home spray Sandia-Melón ', 7900.00, 'img/TyA-hs-sandia-melon.webp', 4, '', '', 'Sandia-Melón', '250ml', '', '', 0, ''),
(68, 'Cesto multiuso Verde oliva', 6900.00, 'img/CestoM2.webp', 4, '10 x 20 cm', 'Nido de abeja', '', '', '', '', 0, ''),
(69, 'Cesto multiuso Rosa viejo', 6900.00, 'img/CestoM1.webp', 4, '10 x 20 cm', 'Nido de abeja', '', '', '', '', 0, ''),
(70, 'Cesto multiuso Azul aero', 6900.00, 'img/CestoM3.webp', 4, '10 x 20 cm', 'Nido de abeja', '', '', '', '', 0, ''),
(71, 'Cesto multiuso Rosa viejo', 5900.00, 'img/CestoM5.webp', 4, '10 x 20 cm', 'Tussor', '', '', '', '', 0, ''),
(72, 'Cesto multiuso color camel con diseño', 5900.00, 'img/CestoM4.webp', 4, '10 x 20 cm', 'Tussor', '', '', '', '', 0, ''),
(73, 'Neceser rustico rayado', 9900.00, 'img/Neceser.webp', 4, '20 x 30 cm', 'Tela rustica', '', '', '', '', 0, ''),
(74, 'Individual con diseño floral', 4000.00, 'img/producto_1794508084353.jpg', 1, '28 x 48 cm', 'Tussor', '', '', '', 'img/producto_1794508084356.jpg', 0, ''),
(75, 'Individual  verde seco con diseño de hoja', 4000.00, 'img/Individual2.jpg', 1, '28 x 48 cm', 'Tussor', '', '', '', '', 0, ''),
(76, 'Sujeta cortina X2', 5500.00, 'img/sujetaC-ft1.jpg', 4, '', 'Yeso', '', '', '', 'img/producto_1794509065033.jpg', 0, ''),
(77, 'Sujeta servilleta X2', 3000.00, 'img/SujetaS-ft1.jpg', 4, '', 'Yeso', '', '', '', 'img/SujetaS-ft2.jpg', 0, '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`idcategoria`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idproductos`),
  ADD KEY `categoria` (`categoria`),
  ADD KEY `descripcion` (`descripcion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `idcategoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30002;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idproductos` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90019;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria`) REFERENCES `categorias` (`idcategoria`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
