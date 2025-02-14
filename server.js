const express = require('express');         //get express library
const app = express();                      //copy it into app
const db = require('./config/dbConfig');    // importing database connection file 
const path = require("path");

require('dotenv').config();                 //importing .env file
const bodyParser = require('body-parser');  //middleware( data from http is parsed from http body!)
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



//Middleware function
const logrequest = (req,res,next)=>{          // logs each request
    console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
    next();                                   //move to next phase (without this u will be stuck infinitely in middleware)
  }
  app.use(logrequest);
  

const User = require('./models/user');
const Landlord = require('./models/landlord');
const RoomDetails = require('./models/roomDetails');

Landlord.hasMany(RoomDetails, { foreignKey: 'landlord_id' });
RoomDetails.belongsTo(Landlord, { foreignKey: 'landlord_id' });



app.get('/', (req, res) =>{
    res.send('Welcome to Rental Website!')
  })



  const roomRoute = require('./routes//roomRoute');         //import roomdetails files
  app.use('/roomdetails', roomRoute);                       //use that files






const PORT =80;
app.listen(PORT,()=>console.log('server is running '));

