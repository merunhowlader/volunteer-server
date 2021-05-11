const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors');

mongo = require('mongodb');



const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

let ObjectId = require('mongodb').ObjectID;

//const ObjectId = mongoose.Types.ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z94oz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const UserCollection = client.db(`${process.env.DB_NAME}`).collection("vusers");
  const EventCollection = client.db(`${process.env.DB_NAME}`).collection("events");
  const AddEventCollection = client.db(`${process.env.DB_NAME}`).collection("addedevents");
  // perform actions on the collection object

  console.log("db connected");

  app.post('/register',(req, res) => {
    const registerForm=req.body;

    UserCollection.insertOne(registerForm)
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
    console.log(registerForm);
  })

  app.get('/registerlist',(req, res) => {
    

    UserCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
    
  })
  // app.get('/deletelist/id',(req, res) => {
    

  //   console.log(req.params.id);
    
  // })

  // app.post('/deletelist/:id',(req, res) => {
   
  //   id=req.body.id;

  //   UserCollection.deleteOne({'_id':id}, function(error,doc) {
  //     if (error) {
  //       callback(error);
  //     } else {
  //        callback(null, doc);
  //     }
  // });
  //   // const id=req.params.id;
  //   // var myId = JSON.parse(id);
    
  //   // let newid=`"${id}"`;
  //   // console.log(myid);
   
    

  //   // UserCollection.deleteOne( {"_id":ObjectId(newid)})
  //   // .then(result =>{
  //   //   console.log(result);
  //   //   res.send(result);
  //   // })
    
  // })

  app.delete('/delete/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);

    UserCollection.deleteOne({ _id: new mongo.ObjectId(id) }, function (err, results) {
    });
  
    res.json({ success: id })
  })
  app.post('/addallevents',(req,res)=>{

    const events=req.body;
    console.log(events);
    
    EventCollection.insertMany(events)
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
  })
  app.get('/events',(req,res)=>{
    EventCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post('/addnewevent',(req,res)=>{
    var newEvent = req.body;
    
    
    AddEventCollection.insertOne(newEvent)
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
    
  })

  app.get('/addedevents/:email',(req,res)=>{
    let email = req.params.email;
    AddEventCollection.find({email:email})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  
  //client.close();
});




app.get('/',(req,res)=>{
    res.send('hello world');
  })


app.listen(process.env.PORT||port)