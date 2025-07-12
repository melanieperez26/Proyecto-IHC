require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/api/educacion', (req, res) => {
    res.json({
        message: 'API de recursos educativos'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
