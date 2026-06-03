const db = require('../config/db');
const bcrypt = require('bcrypt');

// Obtener perfil del usuario
const getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        id,
        nombre_usuario,
        correo,
        rol
      FROM usuarios
      WHERE id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });

    }

    res.json(rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener perfil'
    });

  }

};


// Obtener historial de compras
const getOrderHistory = async (req, res) => {

  try {

    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT *
      FROM pedidos
      WHERE usuario_id = ?
      ORDER BY fecha_pedido DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener historial'
    });

  }

};

// Editar perfil
const updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      nombre_usuario,
      correo
    } = req.body;

    console.log(req.body);
    console.log(req.user);
    console.log(userId);

    await db.query(
      `
      UPDATE usuarios
      SET
        nombre_usuario = ?,
        correo = ?
      WHERE id = ?
      `,
      [
        nombre_usuario,
        correo,
        userId
      ]
    );

    res.json({
      mensaje: 'Perfil actualizado'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al actualizar perfil'
    });

  }

};

const updatePassword = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      passwordActual,
      nuevaPassword
    } = req.body;

    // Buscar usuario
    const [rows] = await db.query(
      `
      SELECT *
      FROM usuarios
      WHERE id = ?
      `,
      [userId]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });

    }

    const user = rows[0];

    // Comparar contraseña actual
    const passwordCorrecta =
      await bcrypt.compare(
        passwordActual,
        user.contrasena
      );

    if (!passwordCorrecta) {

      return res.status(401).json({
        mensaje: 'Contraseña actual incorrecta'
      });

    }

    // Encriptar nueva contraseña
    const hashedPassword =
      await bcrypt.hash(
        nuevaPassword,
        10
      );

    // Actualizar contraseña
    await db.query(
      `
      UPDATE usuarios
      SET contrasena = ?
      WHERE id = ?
      `,
      [hashedPassword, userId]
    );

    res.json({
      mensaje: 'Contraseña actualizada'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al actualizar contraseña'
    });

  }

};

module.exports = {
  getProfile,
  getOrderHistory,
  updateProfile,
  updatePassword
};