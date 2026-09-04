from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, database
from typing import List
from passlib.context import CryptContext

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/auth/login")
def login(req: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "avatar": user.avatar}

@app.get("/users", response_model=List[schemas.UserResponse])
def get_users(role: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.all()

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/subjects", response_model=List[schemas.SubjectResponse])
def get_subjects(db: Session = Depends(database.get_db)):
    return db.query(models.Subject).all()

@app.get("/attendance/{student_id}", response_model=List[schemas.AttendanceResponse])
def get_attendance(student_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Attendance).filter(models.Attendance.student_id == student_id).all()

@app.get("/marks/{student_id}", response_model=List[schemas.MarkResponse])
def get_marks(student_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Mark).filter(models.Mark.student_id == student_id).all()

@app.get("/assignments", response_model=List[schemas.AssignmentResponse])
def get_assignments(db: Session = Depends(database.get_db)):
    return db.query(models.Assignment).all()

@app.get("/announcements", response_model=List[schemas.AnnouncementResponse])
def get_announcements(db: Session = Depends(database.get_db)):
    return db.query(models.Announcement).all()

@app.post("/assignments", response_model=schemas.AssignmentResponse)
def create_assignment(assignment: schemas.AssignmentBase, db: Session = Depends(database.get_db)):
    db_assignment = models.Assignment(**assignment.dict())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)
    return user

@app.put("/assignments/{assignment_id}/submit", response_model=schemas.AssignmentResponse)
def submit_assignment(assignment_id: int, db: Session = Depends(database.get_db)):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    assignment.status = "Completed"
    db.commit()
    db.refresh(assignment)
    return assignment

@app.post("/announcements", response_model=schemas.AnnouncementResponse)
def create_announcement(announcement: schemas.AnnouncementBase, db: Session = Depends(database.get_db)):
    db_announcement = models.Announcement(**announcement.dict())
    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)
    return db_announcement

@app.delete("/announcements/{announcement_id}")
def delete_announcement(announcement_id: int, db: Session = Depends(database.get_db)):
    announcement = db.query(models.Announcement).filter(models.Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(announcement)
    db.commit()
    return {"message": "Announcement deleted successfully"}

@app.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(database.get_db)):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}

@app.put("/assignments/{assignment_id}", response_model=schemas.AssignmentResponse)
def update_assignment(assignment_id: int, assignment_update: schemas.AssignmentUpdate, db: Session = Depends(database.get_db)):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    update_data = assignment_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assignment, key, value)
        
    db.commit()
    db.refresh(assignment)
    return assignment

@app.put("/marks/{mark_id}", response_model=schemas.MarkResponse)
def update_mark(mark_id: int, mark_update: schemas.MarkUpdate, db: Session = Depends(database.get_db)):
    mark = db.query(models.Mark).filter(models.Mark.id == mark_id).first()
    if not mark:
        raise HTTPException(status_code=404, detail="Mark not found")
    update_data = mark_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(mark, key, value)
    db.commit()
    db.refresh(mark)
    return mark

@app.put("/attendance/{attendance_id}", response_model=schemas.AttendanceResponse)
def update_attendance(attendance_id: int, attendance_update: schemas.AttendanceUpdate, db: Session = Depends(database.get_db)):
    attendance = db.query(models.Attendance).filter(models.Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance not found")
    update_data = attendance_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(attendance, key, value)
    db.commit()
    db.refresh(attendance)
    return attendance

@app.post("/submissions", response_model=schemas.SubmissionResponse)
def create_submission(submission: schemas.SubmissionBase, db: Session = Depends(database.get_db)):
    # Check if exists
    existing = db.query(models.Submission).filter(
        models.Submission.assignment_id == submission.assignment_id,
        models.Submission.student_id == submission.student_id
    ).first()
    if existing:
        existing.file_url = submission.file_url
        existing.status = "Submitted"
        db.commit()
        db.refresh(existing)
        return existing
        
    db_submission = models.Submission(**submission.dict())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

@app.get("/submissions/{assignment_id}", response_model=List[schemas.SubmissionResponse])
def get_submissions(assignment_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Submission).filter(models.Submission.assignment_id == assignment_id).all()

@app.put("/submissions/{submission_id}/grade", response_model=schemas.SubmissionResponse)
def grade_submission(submission_id: int, grade_update: schemas.SubmissionGradeUpdate, db: Session = Depends(database.get_db)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    submission.score = grade_update.score
    submission.status = "Graded"
    db.commit()
    db.refresh(submission)
    return submission

@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        role=user.role,
        hashed_password=hashed_password,
        avatar=user.avatar or f"https://ui-avatars.com/api/?name={user.name.replace(' ', '+')}&background=random&color=fff",
        phone=user.phone,
        dob=user.dob,
        address=user.address,
        father_name=user.father_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

@app.post("/subjects", response_model=schemas.SubjectResponse)
def create_subject(subject: schemas.SubjectBase, db: Session = Depends(database.get_db)):
    db_sub = models.Subject(**subject.dict())
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@app.put("/subjects/{subject_id}", response_model=schemas.SubjectResponse)
def update_subject(subject_id: int, subject_update: schemas.SubjectUpdate, db: Session = Depends(database.get_db)):
    sub = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    update_data = subject_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(sub, key, value)
    db.commit()
    db.refresh(sub)
    return sub

@app.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(database.get_db)):
    sub = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(sub)
    db.commit()
    return {"message": "Subject deleted"}


