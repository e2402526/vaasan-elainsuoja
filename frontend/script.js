const API_URL = "http://localhost:3000";

const animalsContainer = document.getElementById("animals");
const detailsSection = document.getElementById("animal-details");
const detailsContent = document.getElementById("details-content");
const adoptionForm = document.getElementById("adoption-form");
const formMessage = document.getElementById("form-message");

let selectedAnimalId = null;

const animalEmojis = {
    Kissa: "🐱",
    Koira: "🐶",
    Kani: "🐰"
};

async function loadAnimals() {
    try {
        const response = await fetch(`${API_URL}/animals`);

        if (!response.ok) {
            throw new Error("Eläinten hakeminen epäonnistui.");
        }

        const animals = await response.json();
        animalsContainer.innerHTML = "";

        animals.forEach(animal => {
            const card = document.createElement("article");
            card.className = "animal-card";

            const emoji = animalEmojis[animal.species] || "🐾";
            const available = animal.status === "available";

            card.innerHTML = `
                <div class="animal-emoji">${emoji}</div>
                <h3>${animal.name}</h3>
                <p>${animal.species}, ${animal.age} vuotta</p>
                <p class="${available ? "available" : "adopted"}">
                    ${available ? "Vapaana adoptioon" : "Adoptoitu"}
                </p>
                <button ${available ? "" : "disabled"}>
                    ${available ? "Katso tiedot" : "Ei saatavilla"}
                </button>
            `;

            if (available) {
                card.querySelector("button").addEventListener("click", () => {
                    showAnimalDetails(animal.id);
                });
            }

            animalsContainer.appendChild(card);
        });
    } catch (error) {
        animalsContainer.textContent =
            "Eläinten lataaminen epäonnistui. Tarkista, että palvelimet ovat käynnissä.";
    }
}

async function showAnimalDetails(id) {
    try {
        const response = await fetch(`${API_URL}/animals/${id}`);

        if (!response.ok) {
            throw new Error("Eläimen tietojen hakeminen epäonnistui.");
        }

        const animal = await response.json();

        selectedAnimalId = animal.id;
        const emoji = animalEmojis[animal.species] || "🐾";

        detailsContent.innerHTML = `
            <div class="animal-emoji">${emoji}</div>
            <h3>${animal.name}</h3>
            <p><strong>Eläinlaji:</strong> ${animal.species}</p>
            <p><strong>Ikä:</strong> ${animal.age} vuotta</p>
            <p>${animal.description}</p>
        `;

        adoptionForm.reset();
        formMessage.textContent = "";
        detailsSection.classList.remove("hidden");
        detailsSection.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        alert("Eläimen tietojen hakeminen epäonnistui.");
    }
}

adoptionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (selectedAnimalId === null) return;

    const applicantName = document.getElementById("applicant-name").value;
    const applicantEmail = document.getElementById("applicant-email").value;
    const message = document.getElementById("applicant-message").value;

    try {
        const response = await fetch(
            `${API_URL}/animals/${selectedAnimalId}/adopt`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    applicant_name: applicantName,
                    applicant_email: applicantEmail,
                    message: message
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Hakemuksen lähetys epäonnistui.");
        }

        formMessage.textContent = "✅ Adoptiohakemus lähetetty onnistuneesti!";
        formMessage.className = "success";

        adoptionForm.reset();
        adoptionForm.classList.add("hidden");
        selectedAnimalId = null;

        await loadAnimals();
    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.className = "error";
    }
});

loadAnimals();
