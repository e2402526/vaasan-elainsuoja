
const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3001;

app.use(express.json());

// Haetaan kaikki eläimet
app.get("/animals", (req, res) => {
    try {
        const animals = db.prepare("SELECT * FROM animals").all();
        res.json(animals);
    } catch (error) {
        res.status(500).json({ error: "Eläinten hakeminen epäonnistui." });
    }
});

// Haetaan yksittäinen eläin
app.get("/animals/:id", (req, res) => {
    const animal = db.prepare(
        "SELECT * FROM animals WHERE id = ?"
    ).get(req.params.id);

    if (!animal) {
        return res.status(404).json({ error: "Eläintä ei löytynyt." });
    }

    res.json(animal);
});

// Lähetetään adoptiohakemus
app.post("/adoptions", (req, res) => {
    const { animal_id, applicant_name, applicant_email, message } = req.body;

    if (!Number.isInteger(animal_id) ||
        typeof applicant_name !== "string" ||
        !applicant_name.trim() ||
        typeof applicant_email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant_email)) {
        return res.status(400).json({
            error: "Täytä nimi ja kelvollinen sähköpostiosoite."
        });
    }

    try {
        const adopt = db.transaction(() => {
            const animal = db.prepare(
                "SELECT * FROM animals WHERE id = ?"
            ).get(animal_id);

            if (!animal) {
                return { status: 404, error: "Eläintä ei löytynyt." };
            }

            if (animal.status !== "available") {
                return { status: 409, error: "Eläin on jo adoptoitu." };
            }

            const result = db.prepare(`
                INSERT INTO adoptions
                (animal_id, applicant_name, applicant_email, message)
                VALUES (?, ?, ?, ?)
            `).run(
                animal_id,
                applicant_name.trim(),
                applicant_email.trim(),
                typeof message === "string" ? message.trim() : ""
            );

            db.prepare(
                "UPDATE animals SET status = 'adopted' WHERE id = ?"
            ).run(animal_id);

            return {
                status: 201,
                data: {
                    message: "Adoptiohakemus lähetetty onnistuneesti!",
                    adoption_id: result.lastInsertRowid
                }
            };
        });

        const result = adopt();

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(result.status).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Adoptiohakemuksen tallentaminen epäonnistui."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server B toimii portissa ${PORT}`);
});
