const mongoose = require("mongoose");

const Universities = mongoose.model("universities"); //import DB Schema

// function for base route on "/"
exports.baseRoute = async (req, res) => {
  res.send("Server is Running");
};

// function to get universities on route "/getUniversities"
exports.getUniversities = async (req, res) => {
  const universities = await Universities.find();
  res.json(universities)
};

