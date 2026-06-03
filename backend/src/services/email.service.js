const nodemailer = require('nodemailer');

const enviarFactura = async (
  destino,
  pedidoId,
  productos,
  total
) => {

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

  const listaProductos = productos
    .map(p => `
      <li>
        ${p.nombre}
        - $${p.precio}
      </li>
    `)
    .join('');

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: destino,

    subject: `Factura Pedido #${pedidoId}`,

    html: `

      <h1>BoxEye</h1>

      <h2>
        Pedido #${pedidoId}
      </h2>

      <ul>
        ${listaProductos}
      </ul>

      <h3>
        Total: $${total}
      </h3>

    `

  });

};

const transporter = nodemailer.createTransport({

  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

const enviarCorreo = async (
  destino,
  asunto,
  html
) => {

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: destino,

    subject: asunto,

    html

  });

};

module.exports = {
  enviarCorreo,
  enviarFactura
};