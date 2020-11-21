require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const axios = require("axios");
const MD5 = require("crypto-js/md5");
const cors = require("cors");
// const mongoose = require("mongoose");

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
  const { searchValue, page } = req.query;
  const offsetNum = 100 * (page - 1);
  try {
    if (searchValue) {
      const response = await axios.get(
        `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchValue}&limit=100&offset=${offsetNum}&ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
      );
      res.json(response.data.data);
    } else {
      const response = await axios.get(
        `http://gateway.marvel.com/v1/public/characters?limit=100&offset=${offsetNum}&ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
      );
      res.json(response.data.data);
    }
  } catch (error) {
    console.log(error.response.data);
  }
});

app.get("/characters/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${req.params.id}/comics?ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
    );
    res.json(response.data.data.results);
  } catch (error) {
    console.log(error.response);
  }
});

app.get("/comics", async (req, res) => {
  const { searchValue, page } = req.query;
  const offsetNum = 100 * (page - 1);
  try {
    if (searchValue) {
      const response = await axios.get(
        `http://gateway.marvel.com/v1/public/comics?titleStartsWith=${searchValue}&limit=100&offset=${offsetNum}&ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
      );
      res.json(response.data.data);
    } else {
      const response = await axios.get(
        `http://gateway.marvel.com/v1/public/comics?limit=100&offset=${offsetNum}&ts=${timeStamp}&apikey=${process.env.API_PUBLIC_KEY}&hash=${hashValue}`
      );
      res.json(response.data.data);
    }
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
