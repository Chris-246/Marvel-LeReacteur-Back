require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const axios = require("axios");
const MD5 = require("crypto-js/md5");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

//création de la timestamp
const date = new Date();
const timeStamp = Math.floor(date.getTime() / 1000);
const hashValue = MD5(
  timeStamp + process.env.API_KEY + process.env.API_PUBLIC_KEY
);

app.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
    );
    res.json(response.data.data.results);
  } catch (error) {
    console.log(error.response);
  }
});

app.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
    );
    res.json(response.data.data.results);
  } catch (error) {
    console.log(error.response);
  }
});

app.all("*", (req, res) => {
  res.json("Cette route n'existe pas");
});

app.listen(process.env.PORT || 3300, () => {
  console.log("Server started");
});
