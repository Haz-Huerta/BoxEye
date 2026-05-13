const db = require('../config/db');

exports.crearPedido = async (req, res) => {
  try {

   const {
  usuario_id = null,
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