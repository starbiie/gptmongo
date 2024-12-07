var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const dbUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'millionre';
const collectionName = 'starbi';

/* GET the view products page */
router.get('/', async function (req, res) {
  try {
    const client = await MongoClient.connect(dbUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const products = await collection.find({}).toArray();
    client.close();

    res.render('admin/view-products', { products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Failed to fetch products');
  }
});

/* GET the add product page */
router.get('/add-product', function (req, res) {
  res.render('admin/add-product'); // Render the add product form
});

/* POST request to add a new product */
router.post('/add-product', async function (req, res) {
  try {
    const client = await MongoClient.connect(dbUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertOne({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      img: req.body.img,
    });

    client.close();
    res.redirect('/admin');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Failed to add product');
  }
});

/* POST route to delete a product */
router.post('/delete-product/:id', async function (req, res) {
  try {
    const client = await MongoClient.connect(dbUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    client.close();
    res.redirect('/admin');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Failed to delete product');
  }
});

module.exports = router;
