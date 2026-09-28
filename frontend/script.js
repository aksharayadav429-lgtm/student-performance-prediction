const form = document.getElementById("predictionForm");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const analysisSection = document.getElementById("analysisSection");

const predictedMarks = document.getElementById("predictedMarks");
const categoryBadge = document.getElementById("categoryBadge");
const progressBar = document.getElementById("progressBar");
const scoreMessage = document.getElementById("scoreMessage");

const resetButton = document.getElementById("resetButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const historyBody = document.getElementById("historyBody");


// ==========================================
// PREDICTION
// ==========================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Show loading
    loading.classList.remove("hidden");
    result.classList.add("hidden");
    analysisSection.classList.add("hidden");

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

        const marks = Number(data.predicted_marks);
        const category = data.category;

        // Hide loading
        loading.classList.add("hidden");

        // Show result
        result.classList.remove("hidden");

        // Display predicted marks
        predictedMarks.textContent = marks.toFixed(2);

        // Display category
        categoryBadge.textContent = category;

        // Progress bar
        progressBar.style.width = `${Math.min(Math.max(marks, 0), 100)}%`;

        // Message
        if (category === "Excellent") {

            scoreMessage.textContent =
                "Excellent performance! Keep up the great work.";

        } else if (category === "Good") {

            scoreMessage.textContent =
                "Good performance! Keep working consistently.";

        } else if (category === "Average") {

            scoreMessage.textContent =
                "Average performance. There is room for improvement.";

        } else {

            scoreMessage.textContent =
                "The student may need additional academic support.";

        }


        // ==========================================
        // PERFORMANCE ANALYSIS
        // ==========================================

        analysisSection.classList.remove("hidden");

        const studyHours = studentData.study_hours;
        const attendance = studentData.attendance;
        const previousMarks = studentData.previous_marks;
        const assignmentScore = studentData.assignment_score;
        const internalMarks = studentData.internal_marks;
        const sleepHours = studentData.sleep_hours;


        // Study Hours
        document.getElementById("studyBar").style.width =
            `${Math.min((studyHours / 12) * 100, 100)}%`;

        document.getElementById("studyValue").textContent =
            `${studyHours} hrs`;


        // Attendance
        document.getElementById("attendanceBar").style.width =
            `${attendance}%`;

        document.getElementById("attendanceValue").textContent =
            `${attendance}%`;


        // Previous Marks
        document.getElementById("previousMarksBar").style.width =
            `${previousMarks}%`;

        document.getElementById("previousMarksValue").textContent =
            previousMarks;


        // Assignment
        document.getElementById("assignmentBar").style.width =
            `${assignmentScore}%`;

        document.getElementById("assignmentValue").textContent =
            assignmentScore;


        // Internal Marks
        document.getElementById("internalBar").style.width =
            `${internalMarks}%`;

        document.getElementById("internalValue").textContent =
            internalMarks;


        // Sleep Hours
        document.getElementById("sleepBar").style.width =
            `${Math.min((sleepHours / 12) * 100, 100)}%`;

        document.getElementById("sleepValue").textContent =
            `${sleepHours} hrs`;


        // ==========================================
        // SAVE HISTORY
        // ==========================================

        savePrediction({
            study_hours: studyHours,
            attendance: attendance,
            predicted_marks: marks,
            category: category
        });

        displayHistory();

    } catch (error) {

        console.error("Prediction error:", error);

        loading.classList.add("hidden");

        alert(
            "Unable to get prediction. Please try again."
        );
    }
});


// ==========================================
// RESET FORM
// ==========================================

resetButton.addEventListener("click", function () {

    form.reset();

    result.classList.add("hidden");
    analysisSection.classList.add("hidden");
    loading.classList.add("hidden");

});


// ==========================================
// PREDICTION HISTORY
// ==========================================

function savePrediction(prediction) {

    let history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

    history.unshift(prediction);

    // Keep only latest 10 predictions
    history = history.slice(0, 10);

    localStorage.setItem(
        "predictionHistory",
        JSON.stringify(history)
    );
}


function displayHistory() {

    let history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

    historyBody.innerHTML = "";

    history.forEach(function (item, index) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.study_hours}</td>
            <td>${item.attendance}%</td>
            <td>${Number(item.predicted_marks).toFixed(2)}</td>
            <td>${item.category}</td>
        `;

        historyBody.appendChild(row);

    });
}


// ==========================================
// CLEAR HISTORY
// ==========================================

clearHistoryButton.addEventListener("click", function () {

    localStorage.removeItem("predictionHistory");

    displayHistory();

});


// ==========================================
// LOAD HISTORY WHEN PAGE OPENS
// ==========================================

displayHistory();