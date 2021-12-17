require('dotenv').config()  //import DotEnv package that automatically loads environment variables from a .env file into the process.env object.

/* ------------------- Database --------------------- */
const mongoose = require("mongoose") //Import mongoose  Object Data Modeling (ODM) library for MongoDB and Node.
mongoose.connect(process.env.DATABASE) //connect to the database

mongoose.Promise = global.Promise; //Mongoose async operations, like .save() and queries. Enables you to do things like MyModel.findOne({}).then() 

require('./Models/Universities'); //import DB schema

mongoose.connection.on('error', (err)=>{
    console.error('Database connecrion Error')
})

/* ------------------- EXPRESS --------------------- */

const express = require('express'); // import express
const app = express(); // initialize app with express
const ip_filter = require("express-ip-filter-middleware").default; //import ip-filter middleware to filter requests by IP
const IPBlockedError = require("express-ip-filter-middleware").IPBlockedError 
const rateLimit = require("express-rate-limit"); //import rate-limit middleware to limit requests per user

const ALLOWED_IP_ADDRESSES = process.env.ALLOWED_IP_ADDRESSES.split(" ") //Pull allowed IPs from .env
const options = {
    mode: 'whitelist',
    allow: ALLOWED_IP_ADDRESSES,
};
app.use(ip_filter(options)) //use ipfilter middleware options allow specific address and denys the rest

//Handle non-allowed requests
app.use(function(err, req, res, _next) {
    if(err instanceof IPBlockedError){
      res.status(401); //HTTP response code 401 (Unauthorized)
    }else{
      res.status(err.status || 500); // if the error isn't related to Non-Authorization, return error status or 500 (Internal Serve Error)
    }
    res.json({ //respond with the error message
        message: err.message,
        error: err
      });
  });

// set rate limit
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: process.env.RATE_LIMIT_1, // limit each IP to 100/500/1000 requests per windowMs
  handler: function (req, res, /*next*/) {
    const current_time = new Date().getTime()/1000 //get the current time (Unix time) and convert it to seconds.
    const time_to_reset = res.getHeaders()["x-ratelimit-reset"] //get the time to reset limit from response headers.
    return res.status(429).json({ //HTTP error 429 (too many requests)
    //The following seems messy but beleive me it displays when the user can make the next request.
      error: `You exceeded your requests limit of (${this.max}) .. dude. Please try again after (${Math.floor(time_to_reset - current_time)}) seconds`
    })}
});

//  apply rate limit to all requests
app.use(limiter);

// import routes (the way in which the client requests are handled by the application endpoints)
const routes = require('./Routes/UniversitiesRoutes');
// middleware to use our routes
app.use('/', routes);

const PORT = process.env.PORT || 3001
app.listen(PORT, function() {
  console.log(`listening on ${PORT}`)
})

// export the app
module.exports = app