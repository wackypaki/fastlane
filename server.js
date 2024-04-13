const express = require('express');
const cors = require('cors');
const path = require('path'); // Required to resolve paths
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' directory

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fastlane',
  password: 'B0n3rsh!tz',
  port: 5432,
});

// Serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html')); // Replace with the correct path if necessary
});

app.get('/years', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT year FROM years ORDER BY year DESC');
    res.json(rows.map(row => row.year));
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/makes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM makes ORDER BY name');
    res.json(rows.map(row => row.name));
  } catch (error) {
    console.error('Error fetching makes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/models', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM models ORDER BY name');
    res.json(rows.map(row => row.name));
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});