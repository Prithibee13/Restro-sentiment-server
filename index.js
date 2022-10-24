const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwozgdd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run ()
{
    try
    {
        await client.connect(); 
        const userCollection = client.db('Restro-sentiment').collection('user');

        app.put('/users' , async(req,res) =>
        {
            const userDetailes = req.body;
            const filter = { email: userDetailes.email };
            const options = { upsert: true }
            const updateDoc = {
                $set: userDetailes
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)

            res.send(result)
        })

        /* app.get('/users' , async(req , res) =>
        {
            const query = {}
            const cursor = userCollection.find(query);
            const users = cursor.toArray();
            res.send(users);

        }) */

    }

    finally
    {

    }
}

run().catch(console.dir)

app.get('/' ,(req,res) =>
{
    res.send('Restro-Sentiment Running')
})

app.listen(port , ()=>
{
    console.log("Doctors-portal-server running in port " , port);
})