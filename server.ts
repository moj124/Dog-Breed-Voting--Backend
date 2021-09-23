import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.
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

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  const dbres = await client.query('select * from Dog');
  res.json(dbres.rows);
});

app.get("/leaderboard", async (req, res) => {
  const dbres = await client.query('select dog.breed as breed, Sum(*) as votes from dog, votes group by dog.breed order by votes desc, dog.breed');
  res.json(dbres.rows);
});

app.get("/top", async (req, res) => {
  const dbres = await client.query('select dog.breed as breed, Sum(*) as votes from dog, votes group by dog.breed order by votes desc, dog.breed limit 3');
  res.json(dbres.rows);
});

// app.post("/add", async (req,res) => {
  
//   try {
//     const response = await fetch("https://api.thedogapi.com/v1/breeds");
//     let breeds = await response.json()
//     // console.log(breeds)
//     breeds = breeds.map((element: { name: any; temperament: any; life_span: any; weight: { metric: any; }; height: { metric: any; }; }) => `(${element.name},${element.temperament},${element.life_span},${element.weight.metric},${element.height.metric})`);
//     // console.log('Working',breeds)
//     const text = 'INSERT INTO dog (breed,temperament,life_span,weight,height) VALUES($1,$2,$3,$4,$5) RETURNING *';
//     const values = [...breeds];
  
//     const rest = await client.query(text, values);
  
//     res.status(201).json({
//       status: "success"
//     });
  
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.get("/:id", async (req, res) =>{
  const {id} = req.params;
  const dbres = await client.query('select dog.breed as breed, images.url as image, votes.votes as votes from dog, images, votes where dog.dog_id = $1 and dog.dog_id = images.dog_id and dog.dog_id = votes.dog_id',[id]);
  res.send(dbres.rows[0])
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    const updateDogVote = await client.query(
      "UPDATE votes SET votes = $1 WHERE dog_id = $2",
      [vote,id]
    );

    res.status(201).json("Dog's vote was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  try{
    const text = "INSERT INTO votes(dog_id,votes) VALUES($1,$2) RETURNING *";
    const values = [id,vote];

    const response = await client.query(text, values);

    res.status(201).json({
      status: "success",
      data : {
        "dog_id" : id,
        "votes" : vote      
      }
    });
  } catch (err){
    console.error(err.message);
  }
});

app.delete("/:id", async (req,res) =>{
  try {
    const { id } = req.params;
    const deleteTodo = await client.query("DELETE FROM dog WHERE dog_id = $1", [
      id
    ]);
    res.json("Breed was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});




//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
