const db = require('../config/db');

const getProductos = async (req, res) => {
    try {
        // En mysql2/promise, query devuelve un array: [filas, campos]
        // Usamos [rows] para extraer solo los datos de los productos
        const [rows] = await db.query('SELECT * FROM productos');
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ 
            message: 'Error al obtener los productos de la base de datos',
            error: error.message 
        });
    }
};

module.exports = {
    getProductos
};