
const form = document.getElementById("predictionForm");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const predictedMarks =
    document.getElementById("predictedMarks");

const categoryBadge =
    document.getElementById("categoryBadge");

const progressBar =
    document.getElementById("progressBar");

const scoreMessage =
    document.getElementById("scoreMessage");

const resetButton =
    document.getElementById("resetButton");

const historyBody =
    document.getElementById("historyBody");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");


// ==========================================
// PERFORMANCE ANALYSIS ELEMENTS
// ==========================================

const analysisSection =
    document.getElementById("analysisSection");

const studyBar =
    document.getElementById("studyBar");

const attendanceBar =
    document.getElementById("attendanceBar");

const previousMarksBar =
    document.getElementById("previousMarksBar");

const assignmentBar =
    document.getElementById("assignmentBar");

const internalBar =
    document.getElementById("internalBar");

const sleepBar =
    document.getElementById("sleepBar");


const studyValue =
    document.getElementById("studyValue");

const attendanceValue =
    document.getElementById("attendanceValue");

const previousMarksValue =
    document.getElementById("previousMarksValue");

const assignmentValue =
    document.getElementById("assignmentValue");

const internalValue =
    document.getElementById("internalValue");

const sleepValue =
    document.getElementById("sleepValue");


// ==========================================
// LOAD HISTORY
// ==========================================

let predictionHistory =
    JSON.parse(
        localStorage.getItem(
            "predictionHistory"
        )
    ) || [];


// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    historyBody.innerHTML = "";


    if (predictionHistory.length === 0) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td colspan="5">
                No predictions yet
            </td>
        `;

        historyBody.appendChild(row);

        return;
    }


    predictionHistory.forEach(
        (prediction, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${prediction.study_hours}
                </td>

                <td>
                    ${prediction.attendance}%
                </td>

                <td>
                    <strong>
                        ${prediction.predicted_marks}
                    </strong>
                </td>

                <td>
                    <span class="history-category">
                        ${prediction.category}
                    </span>
                </td>

            `;


            historyBody.appendChild(row);

        }
    );
}


// Display history

displayHistory();


// ==========================================
// UPDATE PERFORMANCE ANALYSIS
// ==========================================

function updateAnalysis(studentData) {

    // Show analysis section

    analysisSection.classList.remove(
        "hidden"
    );


    // ==========================================
    // STUDY HOURS
    // Maximum = 12 hours
    // ==========================================

    const studyPercentage =
        Math.min(
            (studentData.study_hours / 12) * 100,
            100
        );


    studyBar.style.width =
        studyPercentage + "%";


    studyValue.textContent =
        studentData.study_hours + " hrs";


    // ==========================================
    // ATTENDANCE
    // Maximum = 100%
    // ==========================================

    attendanceBar.style.width =
        Math.min(
            studentData.attendance,
            100
        ) + "%";


    attendanceValue.textContent =
        studentData.attendance + "%";


    // ==========================================
    // PREVIOUS MARKS
    // Maximum = 100
    // ==========================================

    previousMarksBar.style.width =
        Math.min(
            studentData.previous_marks,
            100
        ) + "%";


    previousMarksValue.textContent =
        studentData.previous_marks;


    // ==========================================
    // ASSIGNMENT
    // Maximum = 100
    // ==========================================

    assignmentBar.style.width =
        Math.min(
            studentData.assignment_score,
            100
        ) + "%";


    assignmentValue.textContent =
        studentData.assignment_score;


    // ==========================================
    // INTERNAL MARKS
    // Maximum = 100
    // ==========================================

    internalBar.style.width =
        Math.min(
            studentData.internal_marks,
            100
        ) + "%";


    internalValue.textContent =
        studentData.internal_marks;


    // ==========================================
    // SLEEP HOURS
    // Maximum = 12 hours
    // ==========================================

    const sleepPercentage =
        Math.min(
            (studentData.sleep_hours / 12) * 100,
            100
        );


    sleepBar.style.width =
        sleepPercentage + "%";


    sleepValue.textContent =
        studentData.sleep_hours + " hrs";

}


// ==========================================
// PREDICTION
// ==========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Show loading

        loading.classList.remove(
            "hidden"
        );


        // Hide previous result

        result.classList.add(
            "hidden"
        );


        // ==========================================
        // COLLECT INPUT
        // ==========================================

        const studentData = {

            study_hours: Number(
                document.getElementById(
                    "study_hours"
                ).value
            ),

            attendance: Number(
                document.getElementById(
                    "attendance"
                ).value
            ),

            previous_marks: Number(
                document.getElementById(
                    "previous_marks"
                ).value
            ),

            assignment_score: Number(
                document.getElementById(
                    "assignment_score"
                ).value
            ),

            internal_marks: Number(
                document.getElementById(
                    "internal_marks"
                ).value
            ),

            sleep_hours: Number(
                document.getElementById(
                    "sleep_hours"
                ).value
            ),

            internet_hours: Number(
                document.getElementById(
                    "internet_hours"
                ).value
            ),

            extracurricular: Number(
                document.getElementById(
                    "extracurricular"
                ).value
            ),

            backlogs: Number(
                document.getElementById(
                    "backlogs"
                ).value
            )

        };


        // ==========================================
        // SEND DATA TO FASTAPI
        // ==========================================

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:8000/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                studentData
                            )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Prediction request failed"
                );

            }


            // ==========================================
            // GET RESPONSE
            // ==========================================

            const data =
                await response.json();


            const marks =
                Number(
                    data.predicted_marks
                );


            // ==========================================
            // DISPLAY PREDICTION
            // ==========================================

            predictedMarks.textContent =
                marks.toFixed(2);


            categoryBadge.textContent =
                data.category;


            categoryBadge.className =
                "category-badge";


            // ==========================================
            // CATEGORY
            // ==========================================

            if (
                data.category ===
                "Excellent"
            ) {

                categoryBadge.classList.add(
                    "excellent"
                );

                scoreMessage.textContent =
                    "🌟 Excellent predicted performance!";

            }

            else if (
                data.category ===
                "Good"
            ) {

                categoryBadge.classList.add(
                    "good"
                );

                scoreMessage.textContent =
                    "👍 Good predicted performance!";

            }

            else if (
                data.category ===
                "Average"
            ) {

                categoryBadge.classList.add(
                    "average"
                );

                scoreMessage.textContent =
                    "📚 There is room for improvement.";

            }

            else {

                categoryBadge.classList.add(
                    "risk"
                );

                scoreMessage.textContent =
                    "⚠️ Consider improving academic habits.";

            }


            // ==========================================
            // PROGRESS BAR
            // ==========================================

            progressBar.style.width =
                Math.min(
                    Math.max(marks, 0),
                    100
                ) + "%";


            // ==========================================
            // PERFORMANCE ANALYSIS
            // ==========================================

            updateAnalysis(
                studentData
            );


            // ==========================================
            // SAVE HISTORY
            // ==========================================

            const historyItem = {

                study_hours:
                    studentData.study_hours,

                attendance:
                    studentData.attendance,

                predicted_marks:
                    marks.toFixed(2),

                category:
                    data.category

            };


            predictionHistory.unshift(
                historyItem
            );


            // Keep latest 10

            predictionHistory =
                predictionHistory.slice(
                    0,
                    10
                );


            localStorage.setItem(
                "predictionHistory",
                JSON.stringify(
                    predictionHistory
                )
            );


            // Update history table

            displayHistory();


            // Show result

            result.classList.remove(
                "hidden"
            );

        }


        catch (error) {

            console.error(error);

            alert(
                "Could not connect to the prediction server. Make sure FastAPI is running."
            );

        }


        finally {

            loading.classList.add(
                "hidden"
            );

        }

    }
);


// ==========================================
// RESET FORM
// ==========================================

resetButton.addEventListener(
    "click",
    function () {

        form.reset();


        result.classList.add(
            "hidden"
        );


        analysisSection.classList.add(
            "hidden"
        );


        predictedMarks.textContent =
            "0";


        categoryBadge.textContent =
            "-";


        categoryBadge.className =
            "category-badge";


        progressBar.style.width =
            "0%";


        scoreMessage.textContent =
            "Your predicted performance is shown above.";


        studyBar.style.width = "0%";

        attendanceBar.style.width = "0%";

        previousMarksBar.style.width = "0%";

        assignmentBar.style.width = "0%";

        internalBar.style.width = "0%";

        sleepBar.style.width = "0%";

    }
);


// ==========================================
// CLEAR HISTORY
// ==========================================

clearHistoryButton.addEventListener(
    "click",
    function () {

        predictionHistory = [];


        localStorage.removeItem(
            "predictionHistory"
        );


        displayHistory();

    }
);
