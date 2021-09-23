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
  const dbres = await client.query('select * from dog');
  res.json(dbres.rows);
});

app.get("/leaderboard", async (req, res) => {
  const dbres = await client.query('select dog.breed as breed, SUM(votes) as votes from dog, votes group by dog.breed order by votes desc, dog.breed');
  res.json(dbres.rows);
});

app.get("/top", async (req, res) => {
  const dbres = await client.query('select dog.breed as breed, SUM(votes) as votes from dog, votes group by dog.breed order by votes desc, dog.breed limit 3');
  res.json(dbres.rows);
});

app.post("/add", async (req,res) => {
  const data = ["(Affenpinscher,Stubborn, Curious, Playful, Adventurous, Active, Fun-loving,3 - 6,23 - 29,10 - 12 years)"
  ,"(Afghan Hound,Aloof, Clownish, Dignified, Independent, Happy,23 - 27,64 - 69,10 - 13 years)"
  ,"(African Hunting Dog,Wild, Hardworking, Dutiful,20 - 30,76,11 years)"
  ,"(Airedale Terrier,Outgoing, Friendly, Alert, Confident, Intelligent, Courageous,18 - 29,53 - 58,10 - 13 years)"
  ,"(Akbash Dog,Loyal, Independent, Intelligent, Brave,41 - 54,71 - 86,10 - 12 years)"
  ,"(Akita,Docile, Alert, Responsive, Dignified, Composed, Friendly, Receptive, Faithful, Courageous,29 - 52,61 - 71,10 - 14 years)"
  ,"(Alapaha Blue Blood Bulldog,Loving, Protective, Trainable, Dutiful, Responsible,25 - 41,46 - 61,12 - 13 years)"
  ,"(Alaskan Husky,Friendly, Energetic, Loyal, Gentle, Confident,17 - 23,58 - 66,10 - 13 years)"
  ,"(Alaskan Malamute,Friendly, Affectionate, Devoted, Loyal, Dignified, Playful,29 - 45,58 - 64,12 - 15 years)"
  ,"(American Bulldog,Friendly, Assertive, Energetic, Loyal, Gentle, Confident, Dominant,27 - 54,56 - 69,10 - 12 years)"
  ,"(American Bully,Strong Willed, Stubborn, Friendly, Clownish, Affectionate, Loyal, Obedient, Intelligent, Courageous,14 - 68,36 - 43,8 – 15 years)"
  ,"(American Eskimo Dog,Friendly, Alert, Reserved, Intelligent, Protective,9 - 18,38 - 48,12 - 15 years)"
  ,"(American Eskimo Dog (Miniature),Friendly, Alert, Reserved, Intelligent, Protective,3 - 5,23 - 30,13 – 15 years)"
  ,"(American Foxhound,Kind, Sweet-Tempered, Loyal, Independent, Intelligent, Loving,29 - 34,53 - 71,8 - 15 years)"
  ,"(American Pit Bull Terrier,Strong Willed, Stubborn, Friendly, Clownish, Affectionate, Loyal, Obedient, Intelligent, Courageous,14 - 27,43 - 53,10 - 15 years)"
  ,"(American Staffordshire Terrier,Tenacious, Friendly, Devoted, Loyal, Attentive, Courageous,23 - 27,43 - 48,12 - 15 years)"
  ,"(American Water Spaniel,Friendly, Energetic, Obedient, Intelligent, Protective, Trainable,11 - 20,38 - 46,10 - 12 years)"
  ,"(Anatolian Shepherd Dog,Steady, Bold, Independent, Confident, Intelligent, Proud,36 - 68,69 - 74,11 - 13 years)"
  ,"(Appenzeller Sennenhund,Reliable, Fearless, Energetic, Lively, Self-assured,22 - 25,51 - 56,12 – 14 years)"
  ,"(Australian Cattle Dog,Cautious, Energetic, Loyal, Obedient, Protective, Brave,20 - 28,43 - 51,12 - 14 years)"
  ,"(Australian Kelpie,Friendly, Energetic, Alert, Loyal, Intelligent, Eager,14 - 21,43 - 51,10 - 13 years)"
  ,"(Australian Shepherd,Good-natured, Affectionate, Intelligent, Active, Protective,16 - 29,46 - 58,12 - 16 years)"
  ,"(Australian Terrier,Spirited, Alert, Loyal, Companionable, Even Tempered, Courageous,6 - 7,25 - 28,15 years)"
  ,"(Azawakh,Aloof, Affectionate, Attentive, Rugged, Fierce, Refined,15 - 25,58 - 74,10 - 13 years)"
  ,"(Barbet,Obedient, Companionable, Intelligent, Joyful,18 - 29,51 - 66,13 – 15 years)"
  ,"(Basenji,Affectionate, Energetic, Alert, Curious, Playful, Intelligent,10 - 11,41 - 43,10 - 12 years)"
  ,"(Basset Bleu de Gascogne,Affectionate, Lively, Agile, Curious, Happy, Active,16 - 18,33 - 38,10 - 14 years)"
  ,"(Basset Hound,Tenacious, Friendly, Affectionate, Devoted, Sweet-Tempered, Gentle,23 - 29,36,12 - 15 years)"
  ,"(Beagle,Amiable, Even Tempered, Excitable, Determined, Gentle, Intelligent,9 - 16,33 - 38,13 - 16 years)"
  ,"(Bearded Collie,Self-confidence, Hardy, Lively, Alert, Intelligent, Active,20 - 25,51 - 56,12 - 14 years)"
  ,"(Beauceron,Fearless, Friendly, Intelligent, Protective, Calm,36 - 50,61 - 70,10 - 12 years)"
  ,"(Bedlington Terrier,Affectionate, Spirited, Intelligent, Good-tempered,8 - 10,38 - 41,14 - 16 years)"
  ,"(Belgian Malinois,Watchful, Alert, Stubborn, Friendly, Confident, Hard-working, Active, Protective,18 - 36,56 - 66,12 - 14 years)"
  ,"(Belgian Tervuren,Energetic, Alert, Loyal, Intelligent, Attentive, Protective,18 - 29,56 - 66,10 - 12 years)"
  ,"(Bernese Mountain Dog,Affectionate, Loyal, Intelligent, Faithful,29 - 54,58 - 70,7 - 10 years)"
  ,"(Bichon Frise,Feisty, Affectionate, Cheerful, Playful, Gentle, Sensitive,5 - 8,24 - 29,15 years)"
  ,"(Black and Tan Coonhound,Easygoing, Gentle, Adaptable, Trusting, Even Tempered, Lovable,29 - 45,58 - 69,10 - 12 years)"
  ,"(Bloodhound,Stubborn, Affectionate, Gentle, Even Tempered,36 - 50,58 - 69,8 - 10 years)"
  ,"(Bluetick Coonhound,Friendly, Intelligent, Active,20 - 36,53 - 69,12 - 14 years)"
  ,"(Boerboel,Obedient, Confident, Intelligent, Dominant, Territorial,50 - 91,56 - 69,10 - 12 years)"
  ,"(Border Collie,Tenacious, Keen, Energetic, Responsive, Alert, Intelligent,14 - 20,46 - 56,12 - 16 years)"
  ,"(Border Terrier,Fearless, Affectionate, Alert, Obedient, Intelligent, Even Tempered,5 - 7,28 - 41,12 - 14 years)"
  ,"(Boston Terrier,Friendly, Lively, Intelligent,5 - 11,41 - 43,11 - 13 years)"
  ,"(Bouvier des Flandres,Protective, Loyal, Gentle, Intelligent, Familial, Rational,32 - 50,60 - 70,10 - 15 years)"
  ,"(Boxer,Devoted, Fearless, Friendly, Cheerful, Energetic, Loyal, Playful, Confident, Intelligent, Bright, Brave, Calm,23 - 32,55 - 64,8 - 10 years)"
  ,"(Boykin Spaniel,Friendly, Energetic, Companionable, Intelligent, Eager, Trainable,11 - 18,36 - 46,10 - 14 years)"
  ,"(Bracco Italiano,Stubborn, Affectionate, Loyal, Playful, Companionable, Trainable,25 - 40,55 - 67,10 - 12 years)"
  ,"(Briard,Fearless, Loyal, Obedient, Intelligent, Faithful, Protective,32 - 41,56 - 69,10 - 12 years)"
  ,"(Brittany,Agile, Adaptable, Quick, Intelligent, Attentive, Happy,14 - 20,44 - 52,12 - 14 years)"
  ,"(Bull Terrier,Trainable, Protective, Sweet-Tempered, Keen, Active,23 - 32,53 - 56,10 - 12 years)"
  ,"(Bull Terrier (Miniature),Trainable, Protective, Sweet-Tempered, Keen, Active, Territorial,11 - 15,25 - 36,11 – 14 years)"
  ,"(Bullmastiff,Docile, Reliable, Devoted, Alert, Loyal, Reserved, Loving, Protective, Powerful, Calm, Courageous,45 - 59,61 - 69,8 - 12 years)"
  ,"(Cairn Terrier,Hardy, Fearless, Assertive, Gay, Intelligent, Active,6 - 6,23 - 25,14 - 15 years)"
  ,"(Cane Corso,Trainable, Reserved, Stable, Quiet, Even Tempered, Calm,40 - 54,60 - 70,10 - 11 years)"
  ,"(Cardigan Welsh Corgi,Affectionate, Devoted, Alert, Companionable, Intelligent, Active,11 - 17,27 - 32,12 - 14 years)"
  ,"(Catahoula Leopard Dog,Energetic, Inquisitive, Independent, Gentle, Intelligent, Loving,23 - 43,51 - 66,10 - 12 years)"
  ,"(Caucasian Shepherd (Ovcharka),Alert, Quick, Dominant, Powerful, Calm, Strong,36 - 45,61 - 85,10 - 12 years)"
  ,"(Cavalier King Charles Spaniel,Fearless, Affectionate, Sociable, Patient, Playful, Adaptable,6 - 8,30 - 33,10 - 14 years)"
  ,"(Chesapeake Bay Retriever,Affectionate, Intelligent, Quiet, Dominant, Happy, Protective,25 - 36,53 - 66,10 - 13 years)"
  ,"(Chinese Crested,Affectionate, Sweet-Tempered, Lively, Alert, Playful, Happy,5 - 6,28 - 33,10 - 14 years)"
  ,"(Chinese Shar-Pei,Suspicious, Affectionate, Devoted, Reserved, Independent, Loving,20 - 27,46 - 51,10 years)"
  ,"(Chinook,Friendly, Alert, Dignified, Intelligent, Calm,23 - 41,56 - 66,12 - 15 years)"
  ,"(Chow Chow,Aloof, Loyal, Independent, Quiet,18 - 32,43 - 51,12 - 15 years)"
  ,"(Clumber Spaniel,Affectionate, Loyal, Dignified, Gentle, Calm, Great-hearted,25 - 39,43 - 51,10 - 12 years)"
  ,"(Cocker Spaniel,Trainable, Friendly, Affectionate, Playful, Quiet, Faithful,9 - 14,36 - 38,12 - 15 years)"
  ,"(Cocker Spaniel (American),Outgoing, Sociable, Trusting, Joyful, Even Tempered, Merry,9 - 14,36 - 38,12 - 15 years)"
  ,"(Coton de Tulear,Affectionate, Lively, Playful, Intelligent, Trainable, Vocal,4 - 7,23 - 28,13 - 16 years)"
  ,"(Dalmatian,Outgoing, Friendly, Energetic, Playful, Sensitive, Intelligent, Active,23 - 25,48 - 58,10 - 13 years)"
  ,"(Doberman Pinscher,Fearless, Energetic, Alert, Loyal, Obedient, Confident, Intelligent,30 - 40,61 - 71,10 years)"
  ,"(Dogo Argentino,Friendly, Affectionate, Cheerful, Loyal, Tolerant, Protective,36 - 45,60 - 69,10 - 12 years)"
  ,"(Dutch Shepherd,Reliable, Affectionate, Alert, Loyal, Obedient, Trainable,23 - 32,56 - 62,15 years)"
  ,"(English Setter,Strong Willed, Mischievous, Affectionate, Energetic, Playful, Companionable, Gentle, Hard-working, Intelligent, Eager, People-Oriented,20 - 36,61 - 64,12 years)"
  ,"(English Shepherd,Kind, Energetic, Independent, Adaptable, Intelligent, Bossy,20 - 30,46 - 58,10 - 13 years)"
  ,"(English Springer Spaniel,Affectionate, Cheerful, Alert, Intelligent, Attentive, Active,16 - 23,48 - 51,12 - 14 years)"
  ,"(English Toy Spaniel,Affectionate, Reserved, Playful, Gentle, Happy, Loving,4 - 6,25,10 - 12 years)"
  ,"(English Toy Terrier,Stubborn, Alert, Companionable, Intelligent, Cunning, Trainable,3 - 4,25 - 30,12 - 13 years)"
  ,"(Eurasier,Alert, Reserved, Intelligent, Even Tempered, Watchful, Calm,18 - 32,52 - 60,12 - 14 years)"
  ,"(Field Spaniel,Docile, Cautious, Sociable, Sensitive, Adaptable, Familial,16 - 23,43 - 46,11 - 15 years)"
  ,"(Finnish Lapphund,Friendly, Keen, Faithful, Calm, Courageous,15 - 24,41 - 53,12 - 15 years)"
  ,"(Finnish Spitz,Playful, Loyal, Independent, Intelligent, Happy, Vocal,10 - 13,39 - 51,12 - 15 years)"
  ,"(French Bulldog,Playful, Affectionate, Keen, Sociable, Lively, Alert, Easygoing, Patient, Athletic, Bright,13,28 - 30,9 - 11 years)"
  ,"(German Pinscher,Spirited, Lively, Intelligent, Loving, Even Tempered, Familial,11 - 20,43 - 51,12 - 14 years)"
  ,"(German Shepherd Dog,Alert, Loyal, Obedient, Curious, Confident, Intelligent, Watchful, Courageous,23 - 41,56 - 66,10 - 13 years)"
  ,"(German Shorthaired Pointer,Boisterous, Bold, Affectionate, Intelligent, Cooperative, Trainable,20 - 32,53 - 64,12 - 14 years)"
  ,"(Giant Schnauzer,Strong Willed, Kind, Loyal, Intelligent, Dominant, Powerful,29 - 41,60 - 70,10 - 12 years)"
  ,"(Glen of Imaal Terrier,Spirited, Agile, Loyal, Gentle, Active, Courageous,15 - 18,32 - 36,12 - 15 years)"
  ,"(Golden Retriever,Intelligent, Kind, Reliable, Friendly, Trustworthy, Confident,25 - 34,55 - 61,10 - 12 years)"
  ,"(Gordon Setter,Fearless, Alert, Loyal, Confident, Gay, Eager,20 - 36,58 - 69,10 - 12 years)"
  ,"(Great Dane,Friendly, Devoted, Reserved, Gentle, Confident, Loving,50 - 86,71 - 81,7 - 10 years)"
  ,"(Great Pyrenees,Strong Willed, Fearless, Affectionate, Patient, Gentle, Confident,39 - 52,64 - 81,10 - 12 years)"
  ,"(Greyhound,Affectionate, Athletic, Gentle, Intelligent, Quiet, Even Tempered,23 - 32,69 - 76,10 - 13 years)"
  ,"(Griffon Bruxellois,Self-important, Inquisitive, Alert, Companionable, Sensitive, Watchful,5,23 - 28,10 – 15 years)"
  ,"(Harrier,Outgoing, Friendly, Cheerful, Sweet-Tempered, Tolerant, Active,18 - 27,46 - 56,12 - 15 years)"
  ,"(Havanese,Affectionate, Responsive, Playful, Companionable, Gentle, Intelligent,3 - 6,22 - 29,14 - 15 years)"
  ,"(Irish Setter,Affectionate, Energetic, Lively, Independent, Playful, Companionable,16 - 32,61 - 69,10 - 11 years)"
  ,"(Irish Terrier,Respectful, Lively, Intelligent, Dominant, Protective, Trainable,11 - 12,46,12 - 16 years)"
  ,"(Irish Wolfhound,Sweet-Tempered, Loyal, Dignified, Patient, Thoughtful, Generous,48 - 82,76 - 89,6 - 8 years)"
  ,"(Italian Greyhound,Mischievous, Affectionate, Agile, Athletic, Companionable, Intelligent,3 - 7,33 - 38,12 - 15 years)"
  ,"(Japanese Chin,Alert, Loyal, Independent, Intelligent, Loving, Cat-like,2 - 4,20 - 28,12 - 14 years)"
  ,"(Japanese Spitz,Affectionate, Obedient, Playful, Companionable, Intelligent, Proud,7 - 9,30 - 38,10 – 16 years)"
  , "(Keeshond,Agile, Obedient, Playful, Quick, Sturdy, Bright,16 - 20,43 - 46,12 - 15 years)"
  , "(Komondor,Steady, Fearless, Affectionate, Independent, Gentle, Calm,36 - 45,65 - 70,10 - 12 years)"
  , "(Kooikerhondje,Benevolent, Agile, Alert, Intelligent, Active, Territorial,9 - 14,36 - 41,12 - 15 years)"
  , "(Kuvasz,Clownish, Loyal, Patient, Independent, Intelligent, Protective,32 - 52,66 - 76,8 - 10 years)"
  , "(Labrador Retriever,Kind, Outgoing, Agile, Gentle, Intelligent, Trusting, Even Tempered,25 - 36,55 - 62,10 - 13 years)"
  , "(Lagotto Romagnolo,Keen, Loyal, Companionable, Loving, Active, Trainable,11 - 16,41 - 48,14 - 16 years)"
  , "(Lancashire Heeler,Clever, Friendly, Alert, Intelligent,3 - 6,25 - 30,12 – 15 years)"
  , "(Leonberger,Obedient, Fearless, Loyal, Companionable, Adaptable, Loving,54 - 77,65 - 80,6 - 8 years)"
  , "(Lhasa Apso,Steady, Fearless, Friendly, Devoted, Assertive, Spirited, Energetic, Lively, Alert, Obedient, Playful, Intelligent,5 - 8,25 - 28,12 - 15 years)"
  , "(Maltese,Playful, Docile, Fearless, Affectionate, Sweet-Tempered, Lively, Responsive, Easygoing, Gentle, Intelligent, Active,2 - 3,20 - 25,15 - 18 years)"
  , "(Miniature American Shepherd,Energetic, Loyal, Intelligent, Trainable,9 - 18,33 - 46,12 - 15 years)"
  , "(Miniature Pinscher,Clever, Outgoing, Friendly, Energetic, Responsive, Playful,4 - 5,25 - 32,15 years)"
  , "(Miniature Schnauzer,Fearless, Friendly, Spirited, Alert, Obedient, Intelligent,5 - 9,30 - 36,12 - 14 years)"
  , "(Newfoundland,Sweet-Tempered, Gentle, Trainable,45 - 68,66 - 71,8 - 10 years)"
  , "(Norfolk Terrier,Self-confidence, Fearless, Spirited, Companionable, Happy, Lovable,5 - 5,23 - 25,12 - 15 years)"
  , "(Norwich Terrier,Hardy, Affectionate, Energetic, Sensitive, Intelligent,5 - 5,25,12 - 15 years)"
  , "(Nova Scotia Duck Tolling Retriever,Outgoing, Alert, Patient, Intelligent, Loving,16 - 23,43 - 53,12 - 14 years)"
  , "(Old English Sheepdog,Sociable, Bubbly, Playful, Adaptable, Intelligent, Loving,27 - 45,53,10 - 12 years)"
  , "(Olde English Bulldogge,Friendly, Alert, Confident, Loving, Courageous, Strong,NaN,38 - 48,9 – 14 years)"
  , "(Papillon,Hardy, Friendly, Energetic, Alert, Intelligent, Happy,1 - 5,20 - 28,13 - 17 years)"
  , "(Pekingese,Opinionated, Good-natured, Stubborn, Affectionate, Aggressive, Intelligent,6,15 - 23,14 - 18 years)"
  , "(Pembroke Welsh Corgi,Tenacious, Outgoing, Friendly, Bold, Playful, Protective,11 - 14,25 - 30,12 - 14 years)"
  , "(Perro de Presa Canario,Strong Willed, Suspicious, Gentle, Dominant, Calm,40 - 50,56 - 65,10 - 12 years)"
  , "(Pharaoh Hound,Affectionate, Sociable, Playful, Intelligent, Active, Trainable,18 - 27,53 - 64,12 - 14 years)"
  , "(Plott,Bold, Alert, Loyal, Intelligent,18 - 27,51 - 64,12 - 14 years)"
  , "(Pomeranian,Extroverted, Friendly, Sociable, Playful, Intelligent, Active,1 - 3,20 - 30,15 years)"
  , "(Poodle (Miniature),undefined,7 - 8,28 - 38,12 – 15 years)"
  , "(Poodle (Toy),undefined,3 - 4,23 - 28,18 years)"
  , "(Pug,Docile, Clever, Charming, Stubborn, Sociable, Playful, Quiet, Attentive,6 - 8,25 - 30,12 - 14 years)"
  , "(Puli,Energetic, Agile, Loyal, Obedient, Intelligent, Faithful,11 - 16,41 - 43,12 - 16 Years years)"
  , "(Pumi,Lively, Reserved, Intelligent, Active, Protective, Vocal,8 - 15,38 - 47,13 - 15 years)"
  , "(Rat Terrier,Affectionate, Lively, Inquisitive, Alert, Intelligent, Loving,4 - 11,25 - 33,12 - 18 years)"
  , "(Redbone Coonhound,Affectionate, Energetic, Independent, Companionable, Familial, Unflappable,20 - 36,53 - 69,10 - 12 years)"
  , "(Rhodesian Ridgeback,Strong Willed, Mischievous, Loyal, Dignified, Sensitive, Intelligent,34 - 36,61 - 69,10 - 12 years)"
  , "(Rottweiler,Steady, Good-natured, Fearless, Devoted, Alert, Obedient, Confident, Self-assured, Calm, Courageous,34 - 50,56 - 69,8 - 10 years)"
  , "(Russian Toy,undefined,1 - 3,19 - 27,10 - 12 years)"
  , "(Saint Bernard,Friendly, Lively, Gentle, Watchful, Calm,59 - 82,65 - 70,7 - 10 years)"
  , "(Saluki,Aloof, Reserved, Intelligent, Quiet,16 - 29,58 - 71,12 - 14 years)"
  , "(Samoyed,Stubborn, Friendly, Sociable, Lively, Alert, Playful,23 - 27,48 - 60,12 - 14 years)"
  , "(Schipperke,Fearless, Agile, Curious, Independent, Confident, Faithful,5 - 7,25 - 33,13 - 15 years)"
  , "(Scottish Deerhound,Docile, Friendly, Dignified, Gentle,32 - 59,71 - 81,8 - 10 years)"
  , "(Scottish Terrier,Feisty, Alert, Independent, Playful, Quick, Self-assured,8 - 10,25,11 - 13 years)"
  , "(Shetland Sheepdog,Affectionate, Lively, Responsive, Alert, Loyal, Reserved, Playful, Gentle, Intelligent, Active, Trainable, Strong,14,33 - 41,12 - 14 years)"
  , "(Shiba Inu,Charming, Fearless, Keen, Alert, Confident, Faithful,8 - 10,34 - 42,12 - 16 years)"
  , "(Shih Tzu,Clever, Spunky, Outgoing, Friendly, Affectionate, Lively, Alert, Loyal, Independent, Playful, Gentle, Intelligent, Happy, Active, Courageous,4 - 7,20 - 28,10 - 18 years)"
  , "(Shiloh Shepherd,Outgoing, Loyal, Companionable, Gentle, Loving, Trainable,54 - 64,66 - 76,9 – 14 years)"
  , "(Siberian Husky,Outgoing, Friendly, Alert, Gentle, Intelligent,16 - 27,51 - 60,12 years)"
  , "(Silky Terrier,Friendly, Responsive, Inquisitive, Alert, Quick, Joyful,4 - 5,23 - 25,12 - 15 years)"
  , "(Smooth Fox Terrier,Fearless, Affectionate, Alert, Playful, Intelligent, Active,NaN - 8,39,12 - 14 years)"
  , "(Soft Coated Wheaten Terrier,Affectionate, Spirited, Energetic, Playful, Intelligent, Faithful,14 - 18,41 - 46,12 - 15 years)"
  , "(Spanish Water Dog,Trainable, Diligent, Affectionate, Loyal, Athletic, Intelligent,14 - 23,41 - 51,12 - 15 years)"
  , "(Spinone Italiano,Docile, Friendly, Affectionate, Loyal, Patient, Gentle,28 - 39,57 - 70,10 - 12 years)"
  , "(Staffordshire Bull Terrier,Reliable, Fearless, Bold, Affectionate, Loyal, Intelligent, Courageous,11 - 17,36 - 41,12 - 14 years)"
  , "(Standard Schnauzer,Trainable, Good-natured, Devoted, Lively, Playful, Intelligent,14 - 23,44 - 50,13 - 15 years)"
  , "(Swedish Vallhund,Fearless, Friendly, Energetic, Alert, Intelligent, Watchful,9 - 14,29 - 34,12 - 14 years)"
  , "(Thai Ridgeback,Protective, Loyal, Independent, Intelligent, Loving, Familial,16 - 25,51 - 61,10 - 12 years)"
  , "(Tibetan Mastiff,Strong Willed, Tenacious, Aloof, Stubborn, Intelligent, Protective,39 - 64,61 - 66,10 - 14 years)"
  , "(Tibetan Spaniel,Willful, Aloof, Assertive, Independent, Playful, Intelligent, Happy,4 - 7,25,12 - 15 years)"
  , "(Tibetan Terrier,Affectionate, Energetic, Amiable, Reserved, Gentle, Sensitive,9 - 11,36 - 43,12 - 15 years)"
  , "(Toy Fox Terrier,Friendly, Spirited, Alert, Loyal, Playful, Intelligent,2 - 4,20 - 28,12 - 15 years)"
  , "(Treeing Walker Coonhound,Clever, Affectionate, Confident, Intelligent, Loving, Trainable,20 - 36,51 - 69,10 - 13 years)"
  , "(Vizsla,Affectionate, Energetic, Loyal, Gentle, Quiet,23 - 29,53 - 61,10 - 14 years)"
  , "(Weimaraner,Steady, Aloof, Stubborn, Energetic, Alert, Intelligent, Powerful, Fast,25 - 41,58 - 69,12 - 15 years)"
  , "(Welsh Springer Spaniel,Stubborn, Friendly, Affectionate, Loyal, Playful, Active,16 - 25,43 - 48,12 - 15 years)"
  , "(West Highland White Terrier,Hardy, Friendly, Alert, Independent, Gay, Active, Courageous,7 - 10,25 - 28,15 - 20 years)"
  , "(Whippet,Friendly, Affectionate, Lively, Gentle, Intelligent, Quiet,11 - 16,46 - 56,12 - 15 years)"
  , "(White Shepherd,Self-confidence, Aloof, Fearless, Alert, Companionable, Eager,27 - 39,56 - 64,12 – 14 years)"
  , "(Wire Fox Terrier,Fearless, Friendly, Bold, Keen, Alert, Quick,7 - 9,33 - 41,13 – 14 years)"
  , "(Wirehaired Pointing Griffon,Loyal, Gentle, Vigilant, Trainable, Proud,20 - 32,51 - 61,12 - 14 years)"
  , "(Wirehaired Vizsla,undefined,20 - 29,55 - 64,12 - 14 years)"
  , "(Xoloitzcuintli,Cheerful, Alert, Companionable, Intelligent, Protective, Calm,4 - 14,25 - 58,12 - 14 years)"
  , "(Yorkshire Terrier,Bold, Independent, Confident, Intelligent, Courageous,2 - 3,20 - 23,12 - 16 years)"]
  try {
  // const response = await fetch("https://api.thedogapi.com/v1/breeds");
  // let breeds = await response.json()
  // console.log(breeds)
  // breeds = breeds.map((element: { name: any; temperament: any;  weight: { metric: any; }; height: { metric: any; }; life_span: any; }) => `(${element.name},${element.temperament},${element.weight.metric},${element.height.metric},${element.life_span})`);
  // console.log('Working',breeds)
  const text = 'INSERT INTO dog(breed,temperament,weight,height,life_span) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const values = data;
  
    const rest = await client.query(text, values);
  
    res.status(201).json({
      status: "success"
    });
  
  } catch (err) {
    console.error(err.message);
  }
});

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
