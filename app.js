const express = require("express");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;
const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon?limit=10"; // Fetch 10 Pokémon

function fetchPokemons(url, callback) {
  https
    .get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        callback(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.error("Error fetching Pokémon:", err);
      callback(null);
    });
}

app.get("/", (req, res) => {
  fetchPokemons(POKE_API_URL, (data) => {
    if (!data) {
      res.status(500).send("Failed to fetch Pokémon data1.");
      return;
    }

    const pokemonList = data.results
      .map(
        (pokemon, index) => `
      <div class="pokemon">
        <p><strong>#${index + 1} - ${pokemon.name}</strong></p>
      </div>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pokédex</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            text-align: center;
            padding: 20px;
          }
          .pokemon {
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            margin: 10px auto;
            width: 200px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        <h1>Pokédex</h1>
        <div>
          ${pokemonList}
        </div>
      </body>
      </html>
    `;

    res.send(html);
  });
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
