from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Classroom Management API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Classroom Management API"}

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    # Note: In a real app, hash the password here
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(
        email=user.email,
        hashed_password=fake_hashed_password,
        name=user.name,
        role=user.role,
        avatar=user.avatar
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for var, value in vars(user).items():
        setattr(db_user, var, value) if value else None
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"ok": True}

@app.get("/subjects/", response_model=List[schemas.Subject])
def read_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Subject).offset(skip).limit(limit).all()

@app.post("/subjects/", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    db_subject = models.Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.put("/subjects/{subject_id}", response_model=schemas.Subject)
def update_subject(subject_id: int, subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for var, value in vars(subject).items():
        setattr(db_subject, var, value) if value else None
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
    return {"ok": True}

@app.get("/assignments/", response_model=List[schemas.Assignment])
def read_assignments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Assignment).offset(skip).limit(limit).all()

@app.post("/assignments/", response_model=schemas.Assignment)
def create_assignment(assignment: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = models.Assignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@app.put("/assignments/{assignment_id}", response_model=schemas.Assignment)
def update_assignment(assignment_id: int, assignment: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    for var, value in vars(assignment).items():
        setattr(db_assignment, var, value) if value else None
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@app.delete("/assignments/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(db_assignment)
    db.commit()
    return {"ok": True}

@app.get("/announcements/", response_model=List[schemas.Announcement])
def read_announcements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Announcement).offset(skip).limit(limit).all()

@app.post("/announcements/", response_model=schemas.Announcement)
def create_announcement(announcement: schemas.AnnouncementCreate, db: Session = Depends(get_db)):
    db_announcement = models.Announcement(**announcement.dict())
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

@app.put("/announcements/{announcement_id}", response_model=schemas.Announcement)
def update_announcement(announcement_id: int, announcement: schemas.AnnouncementCreate, db: Session = Depends(get_db)):
    db_announcement = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    for var, value in vars(announcement).items():
        setattr(db_announcement, var, value) if value else None
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

@app.delete("/announcements/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(announcement_id: int, db: Session = Depends(get_db)):
    db_announcement = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(db_announcement)
    db.commit()
    return {"ok": True}

@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    # Basic mock login
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Simplified for migration (we stored raw passwords in mock data for now)
    return {"user": user, "token": "fake-jwt-token"}

@app.get("/grades/{student_id}", response_model=List[schemas.Grade])
def read_grades(student_id: int, db: Session = Depends(get_db)):
    return db.query(models.Grade).filter(models.Grade.student_id == student_id).all()

@app.post("/grades/", response_model=schemas.Grade)
def create_grade(grade: schemas.GradeBase, db: Session = Depends(get_db)):
    db_grade = models.Grade(**grade.dict())
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@app.get("/attendance/{student_id}", response_model=List[schemas.Attendance])
def read_attendance(student_id: int, db: Session = Depends(get_db)):
    return db.query(models.Attendance).filter(models.Attendance.student_id == student_id).all()

@app.post("/attendance/", response_model=schemas.Attendance)
def create_attendance(attendance: schemas.AttendanceBase, db: Session = Depends(get_db)):
    db_attendance = models.Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@app.get("/timetable/{student_id}", response_model=List[schemas.Timetable])
def read_timetable(student_id: int, db: Session = Depends(get_db)):
    # For now, we return the entire timetable. In a real app, filter by student's subjects.
    return db.query(models.Timetable).all()

@app.get("/system-status")
def read_system_status():
    return {
        "status": "Operational",
        "uptime": "99.9%",
        "database": "Connected",
        "api": "Running",
        "active_users": 156
    }
