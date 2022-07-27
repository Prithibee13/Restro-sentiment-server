const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json())

async function run ()
{
    try
    {
    
    }

    finally
    {

    }
}

run().catch(console.dir)



app.listen(port , ()=>
{
    console.log("Doctors-portal-server running in port " , port);
})