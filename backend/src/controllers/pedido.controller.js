const db = require('../config/db');
const { enviarFactura } =
require('../services/email.service');

exports.crearPedido = async (req, res) => {
  try {

  const usuario_id = req.user.id;

  const {
  productos,
  total
} = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({
        error: 'No hay productos'
      });
    }

    // Crear pedido
    const [pedidoResult] = await db.query(`
      INSERT INTO pedidos (usuario_id, total, estado)
      VALUES (?, ?, ?)
    `, [
      usuario_id,
      total,
      'pendiente'
    ]);

    const pedidoId = pedidoResult.insertId;
    const [usuarios] = await db.query(
  `
  SELECT correo
  FROM usuarios
  WHERE id = ?
  `,
  [usuario_id]
);

const correoUsuario =
  usuarios[0].correo;

    console.log('PRODUCTOS RECIBIDOS');
    console.log(productos);

    // Insertar detalles
    for (const producto of productos) {

      await db.query(`
        INSERT INTO detalles_pedido
        (
          pedido_id,
          producto_id,
          cantidad,
          precio_unitario
        )
        VALUES (?, ?, ?, ?)
      `, [
        pedidoId,
        producto.id,
        1,
        producto.precio
      ]);

    }

    await enviarFactura(

  correoUsuario,

  pedidoId,

  productos,

  total

);

    res.status(201).json({
      mensaje: 'Pedido registrado',
      pedidoId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error registrando pedido'
    });

  }
};