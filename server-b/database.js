const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = process.env.DB_PATH || path.join(__dirname, "adoptions.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        age INTEGER NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available'
    );

    CREATE TABLE IF NOT EXISTS adoptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_id INTEGER NOT NULL,
        applicant_name TEXT NOT NULL,
        applicant_email TEXT NOT NULL,
        message TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (animal_id) REFERENCES animals(id)
    );
`);

const result = db.prepare("SELECT COUNT(*) AS count FROM animals").get();

if (result.count === 0) {
    const insert = db.prepare(`
        INSERT INTO animals (name, species, age, description, status)
        VALUES (?, ?, ?, ?, 'available')
    `);

    const animals = [
        ["Misu", "Kissa", 3, "Rauhallinen ja ystävällinen kissa."],
        ["Rekku", "Koira", 5, "Iloinen koira, joka rakastaa ulkoilua."],
        ["Luna", "Kissa", 2, "Leikkisä ja utelias kissa."],
        ["Nöpö", "Kani", 1, "Suloinen kani, joka pitää herkuttelusta."],
        ["Bella", "Koira", 4, "Kiltti ja seurallinen koira."]
    ];

    const seedAnimals = db.transaction(() => {
        for (const animal of animals) {
            insert.run(...animal);
        }
    });

    seedAnimals();
}

module.exports = db;