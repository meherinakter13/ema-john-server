const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufmbf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
const port = 4200

// middleware
 app.use(express.json());
 app.use(cors());


// Connect with database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
   const ordersCollection = client.db("emaJohnStore").collection("orders");
// Add products 
  app.post('/addProducts',(req, res) => {
      const products = req.body;
      productsCollection.insertOne(products)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })

// get all products
  app.get('/products',(req, res) =>{
    productsCollection.find({})
    .toArray((err,documents) => {
      res.send(documents);
    })
  })

// get single product

  app.get('/product/:key',(req, res) =>{
      productsCollection.find({key : req.params.key})
      .toArray((err,documents) => {
        res.send(documents[0]);
      })
    })

// get multiple products
 app.post('/productsByKeys',(req, res)=>{
    const productKeys = req.body
   productsCollection.find({key : {$in: productKeys}})
   .toArray((err,documents)=>{
     res.send(documents);
   })
 })
  
 // Add orders in database 
 app.post('/addOrder',(req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})
});


app.listen(process.env.PORT || port)