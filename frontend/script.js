const form = document.getElementById("predictionForm");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const predictedMarks = document.getElementById("predictedMarks");
const categoryBadge = document.getElementById("categoryBadge");
const progressBar = document.getElementById("progressBar");
const scoreMessage = document.getElementById("scoreMessage");

const analysisSection = document.getElementById("analysisSection");

const studyBar = document.getElementById("studyBar");
const studyValue = document.getElementById("studyValue");

const attendanceBar = document.getElementById("attendanceBar");
const attendanceValue = document.getElementById("attendanceValue");

const previousMarksBar = document.getElementById("previousMarksBar");
const previousMarksValue = document.getElementById("previousMarksValue");

const assignmentBar = document.getElementById("assignmentBar");
const assignmentValue = document.getElementById("assignmentValue");

const internalBar = document.getElementById("internalBar");
const internalValue = document.getElementById("internalValue");

const sleepBar = document.getElementById("sleepBar");
const sleepValue = document.getElementById("sleepValue");

const resetButton = document.getElementById("resetButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const historyBody = document.getElementById("historyBody");


/* ================================
   PREDICTION
================================ */

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    loading.style.display = "block";
    result.style.display = "none";
    analysisSection.style.display = "none";

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
            "https://student-performance-backend-docker.onrender.com/predict",
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

        /* Show predicted marks */
        predictedMarks.textContent = marks.toFixed(2);

        /* Show category */
        categoryBadge.textContent = data.category;

        /* Progress bar */
        progressBar.style.width = `${Math.min(Math.max(marks, 0), 100)}%`;

        /* Message */
        if (marks >= 85) {
            scoreMessage.textContent =
                "Excellent performance! Keep up the good work.";
        } else if (marks >= 70) {
            scoreMessage.textContent =
                "Good performance. Keep working consistently.";
        } else if (marks >= 50) {
            scoreMessage.textContent =
                "Average performance. There is room for improvement.";
        } else {
            scoreMessage.textContent =
                "The student may be at risk. Consider improving study habits and academic performance.";
        }

        /* Show result */
        result.style.display = "block";

        /* ================================
           ANALYSIS
        ================================= */

        studyValue.textContent = `${studentData.study_hours} hrs`;

        studyBar.style.width =
            `${Math.min((studentData.study_hours / 12) * 100, 100)}%`;


        attendanceValue.textContent =
            `${studentData.attendance}%`;

        attendanceBar.style.width =
            `${Math.min(studentData.attendance, 100)}%`;


        previousMarksValue.textContent =
            `${studentData.previous_marks}%`;

        previousMarksBar.style.width =
            `${Math.min(studentData.previous_marks, 100)}%`;


        assignmentValue.textContent =
            `${studentData.assignment_score}%`;

        assignmentBar.style.width =
            `${Math.min(studentData.assignment_score, 100)}%`;


        internalValue.textContent =
            `${studentData.internal_marks}%`;

        internalBar.style.width =
            `${Math.min(studentData.internal_marks, 100)}%`;


        sleepValue.textContent =
            `${studentData.sleep_hours} hrs`;

        sleepBar.style.width =
            `${Math.min((studentData.sleep_hours / 12) * 100, 100)}%`;


        analysisSection.style.display = "block";


        /* ================================
           SAVE HISTORY
        ================================= */

        saveHistory(studentData, data);

    } catch (error) {

        console.error("Prediction error:", error);

        alert(
            "Unable to connect to the prediction server. Please try again."
        );

    } finally {

        loading.style.display = "none";
    }
});


/* ================================
   SAVE HISTORY
================================ */

function saveHistory(studentData, prediction) {

    let history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

    const record = {
        date: new Date().toLocaleString(),
        study_hours: studentData.study_hours,
        attendance: studentData.attendance,
        predicted_marks: prediction.predicted_marks,
        category: prediction.category
    };

    history.unshift(record);

    /* Keep latest 10 predictions */
    history = history.slice(0, 10);

    localStorage.setItem(
        "predictionHistory",
        JSON.stringify(history)
    );

    displayHistory();
}


/* ================================
   DISPLAY HISTORY
================================ */

function displayHistory() {

    const history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

    historyBody.innerHTML = "";

    if (history.length === 0) {

        historyBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No prediction history available.
                </td>
            </tr>
        `;

        return;
    }

    history.forEach(record => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.study_hours}</td>
            <td>${record.attendance}%</td>
            <td>${Number(record.predicted_marks).toFixed(2)}</td>
            <td>${record.category}</td>
        `;

        historyBody.appendChild(row);
    });
}


/* ================================
   RESET FORM
================================ */

resetButton.addEventListener("click", function () {

    form.reset();

    result.style.display = "none";
    analysisSection.style.display = "none";
    loading.style.display = "none";

});


/* ================================
   CLEAR HISTORY
================================ */

clearHistoryButton.addEventListener("click", function () {

    localStorage.removeItem("predictionHistory");

    displayHistory();

});


/* ================================
   LOAD HISTORY WHEN PAGE OPENS
================================ */

displayHistory();