const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9uab6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("photography").collection("services");
  const bookingCollection = client.db("photography").collection("bookings");
  const reviewCollection = client.db("photography").collection("reviews");
  const adminCollection = client.db("photography").collection("admins");
  console.log("success");
 
  app.get('/services',(req,res)=>{
    serviceCollection.find()
    .toArray((err, items)=>{
      res.send(items)
      
    })
  })

  app.get('/services/:_id',(req,res)=>{
    const singleItem = ObjectId(req.params._id)
    console.log(singleItem)
    serviceCollection.find({_id:singleItem})
    // serviceCollection.find({_id : ObjectId(req.params._id)})
    .toArray((err, documents)=>{
      res.send(documents)
      console.log('err',err,'res',documents)
    })
  })

  app.post('/addservice',(req,res)=>{
    const newService = req.body;
    console.log('adding service', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addbooking',(req,res)=>{
    const newBooking = req.body;
    bookingCollection.insertOne(newBooking)
    .then(result => {
      console.log('inserted booking',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/bookings', (req, res) => {
    bookingCollection.find()
    .toArray((err , items) => {
        console.log(err);
        res.send(items)
        console.log('from booking collection', items);
    })
 })

  app.post('/addreview',(req,res)=>{
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result=>{
       
       res.send(result.insertedCount>0)
       console.log('inserted review',result.insertedCount)
    })
  })

  app.get('/reviews',(req,res)=>{
    reviewCollection.find()
    .toArray((err, items)=>{
      res.send(items)
      console.log(err);
      console.log('from mongo',items);
    })
  })
  
  app.post('/addadmin',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    console.log(name,email)
    adminCollection.insertOne({name,email})
    .then(result => {
      res.send(result.insertedCount > 0)
      console.log('added admin',result.insertedCount)
    })
  })

  app.get('/admins',(req,res)=>{
    adminCollection.find()
    .toArray((err,documents)=>{
      res.send(documents)
      console.log(err,'admin',documents)
    })
  })

  app.post('/isadmin',(req,res)=>{
    const email = req.body.email;
    adminCollection.find({email:email})
    .toArray((err,admins)=>{
      res.send(admins.length>0)
    })
  }) 
  // client.close();
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })