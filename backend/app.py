from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(
    title="Student Performance Prediction API",
    description="Machine Learning API for predicting student final marks",
    version="1.0"
)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://student-performance-prediction-j9p2.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("model/student_model.pkl")


# Input data model
class StudentData(BaseModel):
    study_hours: float
    attendance: float
    previous_marks: float
    assignment_score: float
    internal_marks: float
    sleep_hours: float
    internet_hours: float
    extracurricular: int
    backlogs: int


# Home route
@app.get("/")
def home():
    return {
        "message": "Student Performance Prediction API is running!"
    }


# Prediction route
@app.post("/predict")
def predict(student: StudentData):

    input_data = pd.DataFrame([{
        "study_hours": student.study_hours,
        "attendance": student.attendance,
        "previous_marks": student.previous_marks,
        "assignment_score": student.assignment_score,
        "internal_marks": student.internal_marks,
        "sleep_hours": student.sleep_hours,
        "internet_hours": student.internet_hours,
        "extracurricular": student.extracurricular,
        "backlogs": student.backlogs
    }])

    # Make prediction
    prediction = model.predict(input_data)[0]

    # Categorize performance
    if prediction >= 85:
        category = "Excellent"
    elif prediction >= 70:
        category = "Good"
    elif prediction >= 50:
        category = "Average"
    else:
        category = "At Risk"

    return {
        "predicted_marks": round(float(prediction), 2),
        "category": category
    }