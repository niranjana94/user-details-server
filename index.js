const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoclient = mongodb.mongoclient;
const url = "mongodb+srv://m001-student:8FVGTLPp6xBplNdw@sandbox.pzv6n.mongodb.net?retryWrites=true&w=majority"

const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors=require('cors')

app.use(bodyParser.json())

app.use(cors({
    origin:"*"
}))

app.get("/", async function (req, res) {
    res.json("Hello World");
});

app.get("/users",async function(req, res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('users');
        let users = await db.collection('user').find().toArray();        
        client.close();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.json({
            message:"Something went wrong"
        })
    }
})

app.post("/user",async function(req, res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('users');
        let users = await db.collection('user').insertOne({name:req.body.name,email:req.body.email,city:req.body.city})     
        client.close();
        res.json({
            id:users.insertedId,
            details:users
        });
    } catch (error) {
        console.log(error);
        res.json({
            message:"Something went wrong"
        })
    }
})

app.put('/user/:id',async function(req, res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('users');       
                
        await db.collection('user').findOneAndUpdate({_id:mongodb.ObjectID(req.params.id)},{$set:{name:req.body.name,email:req.body.email,city:req.body.city}});
                 
        client.close();
        res.json();
    } catch (error) {
        res.json({
            message:"Something went wrong"
        })
    }  
})

app.delete('/:id',async function(req,res){
    try {
        let client = await MongoClient.connect(url);
        let db = client.db('users');       
                
        await db.collection('user').findOneAndDelete({_id:mongodb.ObjectID(req.params.id)});
                 
        client.close();
        res.json();
    } catch (error) {
        res.json({
            message:"Something went wrong"
        })
    }
});  
    

app.listen(process.env.PORT || 3030,function(){
    console.log('server started');
})
