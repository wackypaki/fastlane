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


app.get('/makes/:generation', async (req, res) => {
  const generation = req.params.generation;
  try {
    const query = `
      SELECT DISTINCT mk.name
      FROM makes mk
      JOIN models m ON mk.id = m.make_id
      JOIN generations g ON m.id = g.model_id
      WHERE g.name = $1;
    `;
    const { rows } = await pool.query(query, [generation]);
    res.json(rows.map(row => row.name));
  } catch (error) {
    console.error('Error fetching makes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/models/:generation/:make', async (req, res) => {
  const generation = req.params.generation;
  const make = req.params.make;
  try {
    const query = `
      SELECT DISTINCT m.name
      FROM models m
      JOIN generations g ON m.id = g.model_id
      JOIN makes mk ON m.make_id = mk.id
      WHERE g.name = $1 AND mk.name = $2;
    `;
    const { rows } = await pool.query(query, [generation, make]);
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