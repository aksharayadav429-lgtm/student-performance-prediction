from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="Student Performance Prediction API",
    description="Machine Learning API for predicting student final marks",
    version="1.0"
)

# ==========================================
# ENABLE CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# LOAD ML MODEL
# ==========================================

model = joblib.load("model/student_model.pkl")

# ==========================================
# INPUT DATA MODEL
# ==========================================

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

# ==========================================
# HOME ROUTE
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Student Performance Prediction API is running!"
    }

# ==========================================
# PREDICTION ROUTE
# ==========================================

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

    prediction = model.predict(input_data)[0]

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