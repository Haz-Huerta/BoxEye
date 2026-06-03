const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { enviarCorreo } =
require('../services/email.service');

// REGISTRO
const register = async (req, res) => {

  try {

    const {
      nombre_usuario,
      correo,
      contrasena
    } = req.body;

    if (
      !nombre_usuario ||
      !correo ||
      !contrasena
    ) {

      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
      });

    }

    if (!correo.includes('@')) {

      return res.status(400).json({
        mensaje: 'Correo inválido'
      });

    }

    if (contrasena.length < 6) {

      return res.status(400).json({
        mensaje: 'La contraseña debe tener mínimo 6 caracteres'
      });

    }


    // Verificar usuario existente
    const [existingUser] = await db.query(
      `
      SELECT *
      FROM usuarios
      WHERE correo = ?
      `,
      [correo]
    );

    if (existingUser.length > 0) {

      return res.status(400).json({
        mensaje: 'El usuario ya existe'
      });

    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(
      contrasena,
      10
    );

    // Insertar usuario
    await db.query(
      `
      INSERT INTO usuarios
      (
        nombre_usuario,
        correo,
        contrasena
      )
      VALUES (?, ?, ?)
      `,
      [
        nombre_usuario,
        correo,
        hashedPassword
      ]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al registrar usuario'
    });

  }

};


// LOGIN
const login = async (req, res) => {

  try {

    const {
      correo,
      contrasena
    } = req.body;

    // Buscar usuario
    const [rows] = await db.query(
      `
      SELECT *
      FROM usuarios
      WHERE correo = ?
      `,
      [correo]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });

    }

    const user = rows[0];

    // Validar contraseña
    const validPassword = await bcrypt.compare(
      contrasena,
      user.contrasena
    );

    if (!validPassword) {

      return res.status(401).json({
        mensaje: 'Contraseña incorrecta'
      });

    }

    // Generar token
    const token = jwt.sign(
      {
        id: user.id,
        correo: user.correo,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.json({

      mensaje: 'Login correcto',

      token,

      usuario: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        rol: user.rol
      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error en login'
    });

  }

};

const forgotPassword = async (
  req,
  res
) => {

  try {

    const { correo } = req.body;

    const token =
      crypto.randomBytes(32)
      .toString('hex');

    await db.query(
      `
      UPDATE usuarios
      SET reset_token = ?
      WHERE correo = ?
      `,
      [token, correo]
    );

    const enlace =
      `http://localhost:4200/reset-password/${token}`;

    await enviarCorreo(

      correo,

      'Recuperación de contraseña',

      `
      <h2>BoxEye</h2>

      <p>
        Haz clic en el siguiente enlace:
      </p>

      <a href="${enlace}">
        Recuperar contraseña
      </a>
      `

    );

    res.json({
      mensaje: 'Correo enviado'
    });

  }

  catch(error){

    console.error(error);

    res.status(500).json({
      mensaje: 'Error'
    });

  }

};

const resetPassword = async (
  req,
  res
) => {

  try {

    const {
      token,
      nuevaContrasena
    } = req.body;

    const [usuarios] =
      await db.query(
        `
        SELECT *
        FROM usuarios
        WHERE reset_token = ?
        `,
        [token]
      );

    if (usuarios.length === 0) {

      return res.status(404).json({
        mensaje: 'Token inválido'
      });

    }

    const hash =
      await bcrypt.hash(
        nuevaContrasena,
        10
      );

    await db.query(
      `
      UPDATE usuarios
      SET
        contrasena = ?,
        reset_token = NULL
      WHERE reset_token = ?
      `,
      [hash, token]
    );

    res.json({
      mensaje:
        'Contraseña actualizada'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error'
    });

  }

};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};