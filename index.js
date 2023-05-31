const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000

// middleware
// app.use(cors());
const corsConfig = {
  origin :'*',
  credentials:true,
  method: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
    ]
}
app.use(cors(corsConfig));
app.options("",cors(corsConfig))
app.use(express.json());
//bossUser
//b67VEwdNjg3Szl1B

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjz0bfk.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

    const menuCollection = client.db("bistroDb").collection('menu');
    const reviewsCollection = client.db("bistroDb").collection('reviews');
    const cartCollection = client.db("bistroDb").collection('carts');

    app.get('/menu',async(req,res)=>{
      const result = await menuCollection.find().toArray();

      res.send(result)
    })
    app.get('/reviews',async(req,res)=>{
      const result = await reviewsCollection.find().toArray();
  
      res.send(result)
    })

     // cart collection 
     app.get('/carts',async(req,res)=>{
      const email = req.query.email;
      // console.log(email)

      if(!email){
        res.send([])
      }
      const query = {email: email}
      const result = await cartCollection.find().toArray();
      res.send(result)
     })
     app.post('/carts',async(req,res)=>{
        const item = req.body  //item = doc
        console.log(item);
        const result = await cartCollection.insertOne(item);
        res.send(result)
     })
     app.delete('/carts/:id',async (req,res)=>{
      const id= req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
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

app.get('/',(req,res)=>{
    res.send('boss is sitting')

})
app.listen(port,()=>{
    console.log(`boss is sitting on port ${port}`)
})
   