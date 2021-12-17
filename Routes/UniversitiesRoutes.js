const express = require('express');
const router = express.Router(); 

//In case, we wanted to extend the methods the API serves. It is usefull (and easier to read) to separate Routes from Business Logic Functions.
// import a controller file of request handlers.
const universitiesController = require('../Controllers/universitiesController.js');

// use baseRoute
router.get('/', universitiesController.baseRoute);

// Use read all route
router.get('/getUniversities', universitiesController.getUniversities);

module.exports = router;