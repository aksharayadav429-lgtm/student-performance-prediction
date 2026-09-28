
const form = document.getElementById("predictionForm");
const resultSection = document.getElementById("resultSection");
const loadingSection = document.getElementById("loadingSection");

const predictedMarks = document.getElementById("predictedMarks");
const categoryBadge = document.getElementById("categoryBadge");
const resultMessage = document.getElementById("resultMessage");
const scoreProgress = document.getElementById("scoreProgress");

const historyBody = document.getElementById("historyBody");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const resetBtn = document.getElementById("resetBtn");


// ===============================
// FORM SUBMISSION
// ===============================

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    loadingSection.style.display = "block";
    resultSection.style.display = "none";

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

        displayResult(data, studentData);
        savePrediction(data, studentData);
        updateAnalysis(studentData);

    } catch (error) {
        console.error("Error:", error);

        alert(
            "Unable to connect to the prediction server. Please try again."
        );

    } finally {
        loadingSection.style.display = "none";
    }
});


// ===============================
// DISPLAY RESULT
// ===============================

function displayResult(data, studentData) {

    resultSection.style.display = "block";

    predictedMarks.textContent = data.predicted_marks;

    categoryBadge.textContent = data.category;

    // Remove previous category classes
    categoryBadge.classList.remove(
        "excellent",
        "good",
        "average",
        "risk"
    );

    // Category styling
    if (data.category === "Excellent") {

        categoryBadge.classList.add("excellent");

        resultMessage.textContent =
            "Excellent performance! Keep maintaining your current study habits.";

    } else if (data.category === "Good") {

        categoryBadge.classList.add("good");

        resultMessage.textContent =
            "Good performance! With a little more improvement, you can reach the excellent category.";

    } else if (data.category === "Average") {

        categoryBadge.classList.add("average");

        resultMessage.textContent =
            "Average performance. Improving study time and attendance may help increase your marks.";

    } else {

        categoryBadge.classList.add("risk");

        resultMessage.textContent =
            "Your predicted performance is at risk. Consider improving your study habits, attendance and academic performance.";
    }


    // Progress bar
    let score = Math.max(0, Math.min(100, data.predicted_marks));

    scoreProgress.style.width = score + "%";

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ===============================
// PERFORMANCE ANALYSIS
// ===============================

function updateAnalysis(studentData) {

    const studyBar = document.getElementById("studyBar");
    const attendanceBar = document.getElementById("attendanceBar");
    const previousBar = document.getElementById("previousBar");
    const assignmentBar = document.getElementById("assignmentBar");
    const internalBar = document.getElementById("internalBar");
    const sleepBar = document.getElementById("sleepBar");


    if (studyBar) {
        studyBar.style.width =
            Math.min((studentData.study_hours / 12) * 100, 100) + "%";
    }

    if (attendanceBar) {
        attendanceBar.style.width =
            Math.min(studentData.attendance, 100) + "%";
    }

    if (previousBar) {
        previousBar.style.width =
            Math.min(studentData.previous_marks, 100) + "%";
    }

    if (assignmentBar) {
        assignmentBar.style.width =
            Math.min(studentData.assignment_score, 100) + "%";
    }

    if (internalBar) {
        internalBar.style.width =
            Math.min(studentData.internal_marks, 100) + "%";
    }

    if (sleepBar) {
        sleepBar.style.width =
            Math.min((studentData.sleep_hours / 12) * 100, 100) + "%";
    }
}


// ===============================
// PREDICTION HISTORY
// ===============================

function savePrediction(data, studentData) {

    const history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

    const prediction = {
        date: new Date().toLocaleString(),
        marks: data.predicted_marks,
        category: data.category,
        study_hours: studentData.study_hours,
        attendance: studentData.attendance
    };

    history.unshift(prediction);

    // Keep only latest 10 predictions
    const latestHistory = history.slice(0, 10);

    localStorage.setItem(
        "predictionHistory",
        JSON.stringify(latestHistory)
    );

    displayHistory();
}


// ===============================
// DISPLAY HISTORY
// ===============================

function displayHistory() {

    if (!historyBody) {
        return;
    }

    const history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

    historyBody.innerHTML = "";

    if (history.length === 0) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="5">
                No prediction history yet.
            </td>
        `;

        historyBody.appendChild(row);

        return;
    }


    history.forEach(function (item) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.marks}</td>
            <td>${item.category}</td>
            <td>${item.study_hours}</td>
            <td>${item.attendance}%</td>
        `;

        historyBody.appendChild(row);
    });
}


// ===============================
// CLEAR HISTORY
// ===============================

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener("click", function () {

        localStorage.removeItem("predictionHistory");

        displayHistory();
    });
}


// ===============================
// RESET FORM
// ===============================

if (resetBtn) {

    resetBtn.addEventListener("click", function () {

        form.reset();

        resultSection.style.display = "none";

        loadingSection.style.display = "none";

        scoreProgress.style.width = "0%";

        // Reset analysis bars
        const bars = [
            "studyBar",
            "attendanceBar",
            "previousBar",
            "assignmentBar",
            "internalBar",
            "sleepBar"
        ];

        bars.forEach(function (barId) {

            const bar = document.getElementById(barId);

            if (bar) {
                bar.style.width = "0%";
            }
        });
    });
}


// ===============================
// LOAD HISTORY WHEN PAGE OPENS
// ===============================

displayHistory();

