const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwozgdd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("Restro-sentiment").collection("user");
    const foodCollection = client.db("Restro-sentiment").collection("food-catagory");
    const countryCollection = client.db("Restro-sentiment").collection("Country");
    const restaurantsCollection = client.db("Restro-sentiment").collection("Restaurants");
    const foodsCollection = client.db("Restro-sentiment").collection("food");
    const reviewCollection = client.db("Restro-sentiment").collection("review");
    const visitorCollection = client.db("Restro-sentiment").collection("visitor");


    app.put("/users", async (req, res) => {
      const userDetailes = req.body;
      const filter = { email: userDetailes.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: userDetailes,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      let users = await cursor.toArray();
      console.log(users);
      res.send(users);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.get("/catalog", async (req, res) => {
      const query = {};
      const cursor = foodCollection.find(query);
      let catalog;
      catalog = await cursor.toArray();
      res.send(catalog);
    });

    app.get("/locations", async (req, res) => {
      const query = {};
      const cursor = countryCollection.find(query);
      let catalog;
      catalog = await cursor.toArray();
      res.send(catalog);
    });

    app.get("/restaurants/:catagory" , async (req , res)=>
    {
      const catagory = req.params.catagory;
      const query = {foodCatagory : catagory };
      const cursor =  restaurantsCollection.find(query);
      let restaurants;
      restaurants = await cursor.toArray();
      res.send(restaurants)
    })

    app.get("/restaurant/:id" , async (req , res) =>
    {
      const id = req.params.id
      const query = {_id : ObjectId(id)}
      const result = await restaurantsCollection.findOne(query);

    
      res.send(result)

    })

    app.post("/addCollection" , async (req,res)=>{
      const newCollection = req.body;

      const result = await foodCollection.insertOne(newCollection)

      res.send(result)
    })


    app.post("/addLocation" , async (req, res) =>
    {
      const newLocation = req.body

      const result = await countryCollection.insertOne(newLocation);

      res.send(result)


    })


    app.get("/srcResult/:food/:location/:budget" , async(req,res)=>
    {

      const food = req.params.food;
      const location = req.params.location;

      const budget = req.params.budget;


      const query = {foodCatagory : food ,  conutry_id : location , 
        MinimumBudget : {$lte : parseInt(budget)}};

        const cursor = restaurantsCollection.find(query);

        const result = await cursor.toArray();
        
        console.log(result);

        res.send(result)


    })


    app.get("/foods/:id" , async(req,res)=>
    {
        const id = req.params.id;
        const query = { restraurentId : id }

        const cursor = foodsCollection.find(query)
        
        const result = await cursor.toArray()

        res.send(result)
    })


    app.put("/setLocation/:id" , async(req,res)=>
    {
      const id = req.params.id;

      const details = req.body;

    
      const filter = {_id : ObjectId(id)}

      const option = {upsert : true}

      const updateDoc = {
        $set: details,
      }

      const result = await userCollection.updateOne(filter, updateDoc, option);

      res.send(result);



    })

    app.put("/makeAdmin/:id" , async(req,res)=>
    {
      const id = req.params.id;

      const details = req.body;

    
      const filter = {_id : ObjectId(id)}

      const option = {upsert : true}

      const updateDoc = {
        $set: details,
      }

      const result = await userCollection.updateOne(filter, updateDoc, option);

      res.send(result);

    })


    app.post("/addReview", async (req,res)=>
    {
      const details = req.body;

      const result = await reviewCollection.insertOne(details);

      res.send(result)

    } )

    app.post("/addVisitor" , async(req,res)=>
    {
      const details = req.body;

      const result = await visitorCollection.insertOne(details)

      res.send(details)
    })


  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Restro-Sentiment Running");
});

app.listen(port, () => {
  console.log("Restro-sentiment running in port ", port);
});
