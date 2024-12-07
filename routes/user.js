var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET the home page and fetch products from the database. */
router.get('/', async function(req, res, next) {
  const dbUrl = 'mongodb://127.0.0.1:27017';

  try {
    const client = await MongoClient.connect(dbUrl);
    const db = client.db('millionre');
    const collection = db.collection('starbi');

    // Fetch products from the database
    const products = await collection.find({}).toArray();
    client.close();

    // Render the index page with products data
    res.render('index', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Failed to fetch products');
  }
});

module.exports = router;
