const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.static('public'));

const supabaseUrl = 'https://thpphchqfvljxfqofzsc.supabase.co';
const supabaseKey = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocHBoY2hxZnZsanhmcW9menNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4NTc3MjMsImV4cCI6MjAzNzQzMzcyM30';
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve your index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust the path if necessary
});

app.get('/api/vehicle', async (req, res) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', 1); // Adjust the query as needed

  if (error) {
    console.error('Error fetching vehicle data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
