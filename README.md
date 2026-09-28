# 🎓 Student Performance Prediction

A Machine Learning web application that predicts a student's final marks based on academic and lifestyle-related factors.

## 🚀 Features

- Student final marks prediction using Machine Learning
- Performance classification:
  - Excellent
  - Good
  - Average
  - At Risk
- Performance score progress bar
- Performance analysis charts
- Prediction history
- Clear prediction history
- Reset form
- Responsive and colorful web interface
- FastAPI REST API
- Frontend and backend deployed separately

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn
- Pandas
- Scikit-learn
- Joblib

### Machine Learning
- Random Forest Regressor

## 📊 Input Features

The model uses the following student details:

1. Study Hours
2. Attendance
3. Previous Marks
4. Assignment Score
5. Internal Marks
6. Sleep Hours
7. Internet Hours
8. Extracurricular Activity
9. Number of Backlogs

## 📁 Project Structure

```text
student-performance-prediction/
│
├── backend/
│   ├── data/
│   │   └── student_data.csv
│   │
│   ├── model/
│   │   └── student_model.pkl
│   │
│   ├── app.py
│   ├── train_model.py
│   ├── predict.py
│   └── check_data.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
├── README.md
└── requirements.txt