const form = document.getElementById("predictionForm");

const loadingSection = document.getElementById("loadingSection");
const resultSection = document.getElementById("resultSection");

const predictedMarks = document.getElementById("predictedMarks");
const category = document.getElementById("category");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show loading
    if (loadingSection) {
        loadingSection.style.display = "block";
    }

    if (resultSection) {
        resultSection.style.display = "none";
    }

    // Get form values
    const studentData = {
        study_hours: parseFloat(document.getElementById("study_hours").value),
        attendance: parseFloat(document.getElementById("attendance").value),
        previous_marks: parseFloat(document.getElementById("previous_marks").value),
        assignment_score: parseFloat(document.getElementById("assignment_score").value),
        internal_marks: parseFloat(document.getElementById("internal_marks").value),
        sleep_hours: parseFloat(document.getElementById("sleep_hours").value),
        internet_hours: parseFloat(document.getElementById("internet_hours").value),
        extracurricular: parseInt(document.getElementById("extracurricular").value),
        backlogs: parseInt(document.getElementById("backlogs").value)
    };

    try {
        const response = await fetch(
            "https://student-performance-backend-7u34.onrender.com/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            }
        );

        if (!response.ok) {
            throw new Error("Prediction request failed");
        }

        const data = await response.json();

        console.log("Prediction result:", data);

        // Hide loading
        if (loadingSection) {
            loadingSection.style.display = "none";
        }

        // Show result
        if (resultSection) {
            resultSection.style.display = "block";
        }

        // Display prediction
        if (predictedMarks) {
            predictedMarks.textContent = data.predicted_marks;
        }

        if (category) {
            category.textContent = data.category;
        }

    } catch (error) {

        console.error("Prediction error:", error);

        if (loadingSection) {
            loadingSection.style.display = "none";
        }

        alert(
            "Unable to get prediction. Please check the backend connection."
        );
    }
});