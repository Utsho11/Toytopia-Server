const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

// connection with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2g6iibi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const toysCollections = client.db('toy-shop-DB').collection('All-toys')
    
    app.get('/allToys', async (req,res) =>{
      let query = {};
      if(req.query?.email){
        query={email: req.query.email}
      }
      const result = await toysCollections.find(query).toArray();
      res.send(result);
    })
    // app.get('/allToys', async (req,res) =>{
    //   const result = await toysCollections.find().toArray();
    //   res.send(result);
    // })

    app.get('/allToys/:id', async (req,res) =>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await toysCollections.findOne(query);
      res.send(result);
      console.log(result);
    })

    app.post('/allToys', async (req,res) =>{
      const addedToy = req.body;
      console.log(addedToy);
      const result = await toysCollections.insertOne(addedToy);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('toy server is running');
})

app.listen(port,() => {
    console.log(`toy server is running on : ${port}`);
})