const express=require('express');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app=express();
const port=process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tqysnnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const districtsCollection=client.db("diagnosticDB").collection("districts");
    const upazillasCollection=client.db("diagnosticDB").collection("upazilas");
    const usersCollection=client.db("diagnosticDB").collection("users");
    const testCollection=client.db("diagnosticDB").collection("test");
    const reservationCollection=client.db("diagnosticDB").collection("reservation");

    app.get('/districts',async(req,res)=>{
        const result=await districtsCollection.find().toArray();
        res.send(result);
    })

    app.get('/upazillas',async(req,res)=>{
        const result=await upazillasCollection.find().toArray();
        res.send(result);
    })
    app.get('/test',async(req,res)=>{
        const result=await testCollection.find().toArray();
        res.send(result);
    })
    app.get('/test/:id', async (req,res)=>{
        const id = req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await testCollection.findOne(query);
        res.send(result);
    })
    app.patch('/test/:id',async (req,res) =>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const updatedDoc={
          $inc:{
            slots:-1
          }
        }
        const result=await testCollection.updateOne(filter,updatedDoc);
        res.send(result);
    })

    // users related api
    
    app.post('/users', async (req,res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    })

    app.get('/users',async(req,res)=>{
        const result=await usersCollection.find().toArray();
        res.send(result);

    })
    // reservation
    app.post('/reservation',async(req,res)=>{
        const reservation=req.body;
        const result=await reservationCollection.insertOne(reservation);
        res.send(result);
  
    })
      
      
    app.get('/reservation',async(req,res)=>{
          const email=req.query.email;
          const query={email:email};
          const result=await reservationCollection.find(query).toArray();
          res.send(result);
  
    })
    
    app.delete('/reservation/:id', async(req,res)=>{
        const id = req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await reservationCollection.deleteOne(query);
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







app.get('/',(req,res)=>{
    res.send('Diagnostic Center is sitting');
})

app.listen(port,()=>{
    console.log(`Diagnostic Center is sitting on port ${port}`)
})