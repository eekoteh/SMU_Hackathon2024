let selectedGenres = [];

const genreDescriptions = {
    spam: "This content is unwanted or repetitive. You have seen the same content for many times",
    nudity: "This content contains nudity or sexual activity. Example: Sexual Intercourse, Inappropriate clothings",
    hate: "This content contains any form of expression through which speakers intend to vilify, humiliate or incite hatred against a group or a class of persons on the basis of race, religion, skin color, sexual identity, gender identity, ethnicity, disability or national origin",
    violence: "This content involves violence or dangerous organizations. Visual contents like blood, bruise",
    illegal: "This content is selling illegal or regulated goods. Anything that is against the law",
    bullying: "This content is bullying or harassment.",
    "ip-violation": "This content violates intellectual property rights.",
    suicide: "This content involves suicide or self-injury.",
    "eating-disorders": "This content promotes eating disorders.",
    "deepfakes": "an image or recording that has been convincingly altered and manipulated to misrepresent someone as doing or saying something that was not actually done or said"
};

document.querySelectorAll("#report-options li").forEach(item => {
    item.addEventListener("click", () => {
        if (selectedGenres.length < 5 || item.classList.contains("selected")) {
            item.classList.toggle("selected");
            if (item.classList.contains("selected")) {
                selectedGenres.push(item.dataset.genre);
            } else {
                selectedGenres = selectedGenres.filter(genre => genre !== item.dataset.genre);
            }
        } else {
            alert("You can select up to 5 genres only.");
        }
    });

    item.querySelector("span").addEventListener("click", (e) => {
        e.stopPropagation();
        showDescription(item.dataset.genre);
    });
});

function showDescription(genre) {
    document.getElementById("report-window").classList.add("hidden");
    document.getElementById("description-window").classList.remove("hidden");
    document.getElementById("description-title").textContent = genre;
    document.getElementById("description-text").textContent = genreDescriptions[genre];
}

function goBack() {
    document.getElementById("description-window").classList.add("hidden");
    document.getElementById("report-window").classList.remove("hidden");
}

function goToElaboration() {
    if (selectedGenres.length < 1) {
        alert("Please select at least one genre.");
        return;
    }
    document.getElementById("report-window").classList.add("hidden");
    document.getElementById("elaboration-window").classList.remove("hidden");
}

function submitReport() {
    const elaboration = document.getElementById("elaboration-text").value;
    const data = {
        genres: selectedGenres,
        elaboration: elaboration
    };

    console.log("Submitting report with data:", data); // Debugging data

    fetch("/submit_report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Response status:", response.status); // Debugging response
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Response data:", data); // Debugging response data
        alert("Report submitted, you can view progress under profile");
        window.location.reload();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was a problem with your report submission.");
    });
}

function getAISuggestion() {
    const userInput = prompt("Enter a keyword or phrase:");

    if (!userInput) {
        return;
    }

    fetch("/ai_suggestion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: userInput })
    })
    .then(response => response.json())
    .then(data => {
        const suggestedGenre = data.suggested_genre;

        if (suggestedGenre && !selectedGenres.includes(suggestedGenre)) {
            document.querySelector(`[data-genre="${suggestedGenre}"]`).classList.add("selected");
            selectedGenres.push(suggestedGenre);
        }
    })
    .catch(error => {
        console.error("Error fetching AI suggestion:", error);
    });
}

function goToProfile() {
    window.location.href = "/profile";
}

function checkReportDetails(reportId) {
    fetch(`/check_report/${reportId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Success: ${data.message}`);
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error("Error fetching report details:", error);
    });
}


