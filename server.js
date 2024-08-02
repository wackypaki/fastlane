const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'vehicle_db'
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Create an endpoint to fetch vehicle data
app.get('/api/vehicle', (req, res) => {
    let sql = 'SELECT * FROM vehicles WHERE id = 1'; // Adjust the query as needed
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});