const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path'); // Add this line

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hodlinfo_db',
  password: '7860',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.get('/api/tickers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickers');
    res.status(200).json({ success: true, tickers: result.rows });
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ success: false, error: 'Error fetching data from database' });
  }
});

const fetchAndStoreData = async () => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();
    
    const top10 = Object.values(data).slice(0, 10); // Adjust the slicing as needed

    for (const ticker of top10) {
      const { name, last, buy, sell, volume, base_unit } = ticker;
      console.log(`Inserting: ${name}, ${last}, ${buy}, ${sell}, ${volume}, ${base_unit}`);
      await pool.query(
        'INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, last, buy, sell, volume, base_unit]
      );
    }

    console.log('Data fetched and stored successfully');
    
    console.log('Click on this link to open the frontend: http://localhost:3000');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }
};

fetchAndStoreData();

app.listen(port, () => {
  console.log(`Server started on port ${port}`);

});
