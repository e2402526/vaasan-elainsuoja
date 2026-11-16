# Vaasan Eläinsuoja – Adoptiosovellus

## Projektin kuvaus

Vaasan Eläinsuojan adoptiosovellus on verkkosovellus, jossa käyttäjä voi selata adoptoitavia eläimiä, tarkastella niiden tietoja ja lähettää adoptiohakemuksen.

## Käytetyt teknologiat

- HTML, CSS ja JavaScript
- Node.js ja Express
- REST API
- SQLite (better-sqlite3)
- Docker ja Docker Compose

## Sovelluksen arkkitehtuuri

Frontend → Server A → Server B → SQLite

### Frontend

Näyttää eläinkortit, eläinten tiedot ja adoptiohakemuslomakkeen.

### Server A

Vastaanottaa frontendin REST-pyynnöt ja välittää ne Server B:lle.

### Server B

Hakee ja tallentaa tietoja SQLite-tietokantaan sekä käsittelee adoptiohakemukset.

## Sovelluksen käynnistäminen

1. Käynnistä Docker Desktop.
2. Avaa terminaali projektin pääkansiossa.
3. Suorita komento:

    docker compose up --build -d

4. Avaa frontend/index.html selaimessa.

Palvelimet toimivat osoitteissa:

- Server A: http://localhost:3000
- Server B: http://localhost:3001

Sammuta palvelimet komennolla:

    docker compose down

## REST API

### Server A

- GET /animals – Hakee kaikki eläimet.
- GET /animals/:id – Hakee yhden eläimen.
- POST /animals/:id/adopt – Lähettää adoptiohakemuksen.

### Server B

- GET /animals – Hakee kaikki eläimet tietokannasta.
- GET /animals/:id – Hakee yhden eläimen.
- POST /adoptions – Tallentaa adoptiohakemuksen.

## Tietokanta

SQLite-tietokannassa on kaksi taulua:

- animals – Eläinten tiedot ja adoptiotilanne.
- adoptions – Adoptiohakemukset.

Kun eläimestä lähetetään onnistunut adoptiohakemus, sen tilaksi muuttuu adopted.

Samaa eläintä ei voi adoptoida kahdesti.

Tietokanta tallennetaan Dockerin sqlite_data-volyymiin, joten tiedot säilyvät konttien uudelleenkäynnistyksissä.

## Testaus

Sovelluksessa on testattu:

- Eläinten hakeminen REST API:n kautta.
- Eläinten näyttäminen verkkosivulla.
- Eläinten tarkempien tietojen avaaminen.
- Adoptiohakemuksen lähettäminen.
- Eläimen adoptiotilan muuttuminen.
- Tietojen säilyminen Docker-konttien uudelleenkäynnistyksessä.
