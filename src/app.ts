import express, { Request, Response } from "express";
import https from "https";
import { sum } from "./helpers/numbers";

const app = express();
const PORT = process.env.PORT || 3000;
const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon?limit=10"; // Fetch 10 Pokémon

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonAPIResponse {
  results: Pokemon[];
}

function fetchPokemons(url: string): Promise<PokemonAPIResponse | null> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error) {
            console.error("Error parsing Pokémon data:", error);
            resolve(null);
          }
        });
      })
      .on("error", (err) => {
        console.error("Error fetching Pokémon:", err);
        resolve(null);
      });
  });
}

app.get("/", async (req: Request, res: Response) => {
  try {
    const data = await fetchPokemons(POKE_API_URL);

    if (!data) {
      res.status(500).send("Failed to fetch Pokémon data.");
      return;
    }

    const pokemonList = data.results
      .map(
        (pokemon, index) => `
      <div class="pokemon">
        <p><strong>#${index + 1} - ${pokemon.name} - ${sum(index + 1,2)}</strong></p>
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
        <title>Pokédex Pipeline 3</title>
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
        <h1>Pokédex chingona TS another one</h1>
        <div>
          ${pokemonList}
        </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
