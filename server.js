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


app.get('/makes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name FROM makes ORDER BY name');
    res.json(rows.map(row => row.name));
  } catch (error) {
    console.error('Error fetching makes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/models/:make', async (req, res) => {
  const makeName = req.params.make;
  try {
      const query = `
          SELECT m.name
          FROM models m
          JOIN makes mk ON m.make_id = mk.id
          WHERE mk.name = $1;
      `;
      const { rows } = await pool.query(query, [makeName]);
      res.json(rows.map(row => row.name));
  } catch (error) {
      console.error('Error fetching models for make:', error);
      res.status(500).send('Server error');
  }
});

app.get('/generations/:model', async (req, res) => {
  const modelName = req.params.model;
  try {
      const query = `
          SELECT g.name
          FROM generations g
          JOIN models m ON g.model_id = m.id
          WHERE m.name = $1; // Make sure this matches the model name exactly
      `;
      const { rows } = await pool.query(query, [modelName]);
      res.json(rows.map(row => row.name));
  } catch (error) {
      console.error('Error fetching generations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});