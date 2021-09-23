// const fetchP = import('node-fetch').then(mod => mod.default)
// const fetch = (...args: any[]) => fetchP.then(fn => fn(...args))
/* eslint-disable import/first */
require('dotenv').config();
const pg = require("pg");
const express= require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//Read .env file lines as though they were env vars.
//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new pg.Client(dbConfig);


async function getData(){
  try {
    const response = await fetch( `https://api.thedogapi.com/v1/breeds`);
    let breeds = await response.json()
    // console.log(breeds)
    breeds = breeds.map(element => `(${element.name},${element.temperament},${element.life_span},${element.weight.metric},${element.height.metric})`);
    console.log(await breeds)
    client.connect();
    try{
      const text = "INSERT INTO dog(breed,temperament,life_span,weight,height) VALUES($1,$2,$3,$4,$5)";
      const values = breeds;
  
      const response = await client.query(text, values);
  
      res.status(201).json({
        status: "success",
      });
    } catch (err){
      console.error(err.message);
    }
    client.end()
  } catch (error) {
    console.log(error);
  }
}
