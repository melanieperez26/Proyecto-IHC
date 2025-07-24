require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


// Rutas base
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas API
app.get('/api/recorridos', (req, res) => {
    res.json({
        message: 'API de recorridos 360°'
    });
});

app.get('/api/guia', (req, res) => {
    res.json({
        message: 'API de auto guías multilingües'
    });
});

app.get('/api/mapa', (req, res) => {
    res.json({
        message: 'API de mapa histórico interactivo'
    });
});

app.get('/api/realidad-aumentada', (req, res) => {
    res.json({
        message: 'API de realidad aumentada'
    });
});

app.post('/api/encuesta', async (req, res) => {
    const { rating, comentario } = req.body;
  
    if (!rating) return res.status(400).json({ error: 'Calificación requerida' });
  
    try {
      const result = await pool.query(
        'INSERT INTO encuestas (rating, comentario) VALUES ($1, $2) RETURNING *',
        [rating, comentario]
      );
      res.status(201).json({ message: 'Encuesta guardada', data: result.rows[0] });
    } catch (error) {
      console.error('Error al guardar encuesta:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
});
app.get('/api/encuestas', async (req, res) => {
    const result = await pool.query('SELECT * FROM encuestas ORDER BY fecha DESC');
    res.json(result.rows);
});

app.post('/api/ayuda', async (req, res) => {
    const { nombre, email, tipo, comentario, dispositivo, frecuencia } = req.body;
  
    // Validación básica
    if (!tipo || !comentario || !dispositivo || !frecuencia) {
      return res.status(400).json({ error: 'Datos incompletos: tipo, comentario, dispositivo y frecuencia son obligatorios.' });
    }
    if (typeof comentario !== 'string' || comentario.trim().length < 10) {
      return res.status(400).json({ error: 'El comentario debe tener al menos 10 caracteres.' });
    }
    // (Opcional) Validar formato de email si viene enviado
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase())) {
      return res.status(400).json({ error: 'Correo electrónico inválido.' });
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO ayudas (nombre, email, tipo, comentario, dispositivo, frecuencia) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nombre || null, email || null, tipo, comentario, dispositivo, frecuencia]
      );
      res.status(201).json({ message: 'Ayuda guardada', data: result.rows[0] });
    } catch (error) {
      console.error('Error al guardar ayuda:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
});
  
app.get('/api/ayudas', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ayudas ORDER BY fecha DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener ayudas:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
});

app.post('/api/incidencias', async (req, res) => {
  console.log("➡️ Datos recibidos en el backend:", req.body); // NUEVO

  const { nombre, correo, tipo, descripcion, fecha } = req.body;

  if (!tipo || !descripcion || !fecha) {
    return res.status(400).json({ error: 'Datos incompletos: tipo, descripción y fecha son obligatorios.' });
  }
  if (typeof descripcion !== 'string' || descripcion.trim().length < 10) {
    return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO incidencias (nombre, correo, tipo, descripcion, fecha) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre || null, correo || null, tipo, descripcion, fecha]
    );
    res.status(201).json({ message: 'Incidencia guardada', data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al guardar incidencia:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


app.get('/api/incidencias', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM incidencias ORDER BY fecha DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
});

app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    const query = `
      INSERT INTO contacto (nombre, email, asunto, mensaje)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [nombre, email, asunto, mensaje]);

    res.status(200).json({ mensaje: 'Contacto enviado correctamente' });
  } catch (error) {
    console.error('Error en la ruta /api/contacto:', error);
    res.status(500).json({ mensaje: 'Error al guardar el contacto' });
  }
});
app.post('/api/contacto', async (req, res) => {
  console.log("📩 Recibido contacto:", req.body);
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
