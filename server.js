const express = require('express');         //get express library
const cookieParser = require("cookie-parser");

const app = express();                      //copy it into app
app.use(cookieParser());

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
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


Landlord.hasMany(RoomDetails, { foreignKey: 'landlord_id' });
RoomDetails.belongsTo(Landlord, { foreignKey: 'landlord_id' });



app.use("/", authRoutes);
const roomRoute = require('./routes/roomRoute');         //import roomdetails files
app.use('/roomdetails', roomRoute);                       //use that files
app.use("/protected", protectedRoutes);
app.use("/dashboard", dashboardRoutes);
app.use(express.static('public'));







const PORT =3000;
app.listen(PORT,()=>console.log('server is running '));

