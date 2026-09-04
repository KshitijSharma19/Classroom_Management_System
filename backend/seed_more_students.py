import datetime
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from main import get_password_hash

def seed_more():
    db = next(get_db())
    
    # Check if we already seeded them
    existing = db.query(models.User).filter(models.User.email == "student2@school.com").first()
    if existing:
        print("Already seeded additional students.")
        return

    # 4 new students
    s2 = models.User(name="Alice Johnson", role="student", email="student2@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff")
    s3 = models.User(name="Bob Williams", role="student", email="student3@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=Bob+Williams&background=0D8ABC&color=fff")
    s4 = models.User(name="Charlie Davis", role="student", email="student4@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=Charlie+Davis&background=0D8ABC&color=fff")
    s5 = models.User(name="Diana Miller", role="student", email="student5@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=Diana+Miller&background=0D8ABC&color=fff")
    
    db.add_all([s2, s3, s4, s5])
    db.commit()

    # Subjects and assignments
    subjects = db.query(models.Subject).all()
    assignments = db.query(models.Assignment).all()

    # Create marks and attendance for each new student
    for s in [s2, s3, s4, s5]:
        for sub in subjects:
            db.add(models.Attendance(student_id=s.id, subject_id=sub.id, attended=12, total=15))
            db.add(models.Mark(student_id=s.id, subject_id=sub.id, internal=25, mid=40, end=75, total=140, out_of=200))
        
        # Add mock submissions
        for a in assignments:
            db.add(models.Submission(assignment_id=a.id, student_id=s.id, file_url="https://example.com/mock_file.pdf", score=85 if a.status=="Completed" else None, status="Graded" if a.status=="Completed" else "Submitted"))

    # Also add mock submissions for student 1
    student1 = db.query(models.User).filter(models.User.email == "student@school.com").first()
    if student1:
        for a in assignments:
            # Check if submission already exists
            exists = db.query(models.Submission).filter(models.Submission.assignment_id == a.id, models.Submission.student_id == student1.id).first()
            if not exists:
                db.add(models.Submission(assignment_id=a.id, student_id=student1.id, file_url="https://example.com/mock_file.pdf", score=90 if a.status=="Completed" else None, status="Graded" if a.status=="Completed" else "Submitted"))
    
    db.commit()
    print("Added 4 new students and submissions!")

if __name__ == "__main__":
    seed_more()
