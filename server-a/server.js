const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;
const SERVER_B = process.env.SERVER_B_URL || "http://localhost:3001";

app.use(cors());
app.use(express.json());

app.get("/animals", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_B}/animals`);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Eläinten hakeminen epäonnistui." });
    }
});

app.get("/animals/:id", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_B}/animals/${req.params.id}`);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Eläimen tietojen hakeminen epäonnistui." });
    }
});

app.post("/animals/:id/adopt", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_B}/adoptions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...req.body,
                animal_id: Number(req.params.id)
            })
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: "Adoptiohakemuksen lähettäminen epäonnistui." });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server A toimii portissa ${PORT}`);
});