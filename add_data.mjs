// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
// import axios from "axios";
// import cheerio from "cheerio";
import { writeFile } from "fs";
import fetch from "node-fetch";


// Async function which scrapes the data
 async function getLyrics() {
  try {
    // Fetch HTML of the page we want to scrape
    const response = await fetch("https://api.thedogapi.com/v1/breeds");
  let breeds = await response.json()
  console.log(breeds)
  breeds = breeds.map(element => [
    element.name,
    element.temperament,
    element.weight.metric,
    element.height.metric,
    element.life_span
  ]);
    // Write songs array in songs.json file
    writeFile(
      "data.json",
      JSON.stringify(breeds, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
}
// Invoke the above function
getLyrics();

