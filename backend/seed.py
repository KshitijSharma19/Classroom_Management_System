import datetime
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from main import get_password_hash

def seed_db():
    models.Base.metadata.create_all(bind=engine)
    db = next(get_db())

    if db.query(models.User).first():
        print("Database already seeded.")
        return

    # Users
    student = models.User(name="John Doe", role="student", email="student@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff")
    teacher = models.User(name="Jane Smith", role="teacher", email="teacher@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff")
    admin = models.User(name="Admin User", role="admin", email="admin@school.com", hashed_password=get_password_hash("password"), avatar="https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff")
    
    db.add_all([student, teacher, admin])
    db.commit()

    # Subjects
    sub1 = models.Subject(name="Data Structures", code="CS201", credits=4, teacher_id=teacher.id)
    sub2 = models.Subject(name="Web Development", code="CS301", credits=3, teacher_id=teacher.id)
    sub3 = models.Subject(name="Database Management", code="CS401", credits=4, teacher_id=teacher.id)
    
    db.add_all([sub1, sub2, sub3])
    db.commit()

    # Attendance
    att1 = models.Attendance(student_id=student.id, subject_id=sub1.id, attended=15, total=15)
    att2 = models.Attendance(student_id=student.id, subject_id=sub2.id, attended=12, total=15)
    att3 = models.Attendance(student_id=student.id, subject_id=sub3.id, attended=11, total=15)
    
    db.add_all([att1, att2, att3])

    # Marks
    mark1 = models.Mark(student_id=student.id, subject_id=sub1.id, internal=28, mid=45, end=85, total=158, out_of=200)
    mark2 = models.Mark(student_id=student.id, subject_id=sub2.id, internal=25, mid=42, end=80, total=147, out_of=200)
    mark3 = models.Mark(student_id=student.id, subject_id=sub3.id, internal=22, mid=40, end=75, total=137, out_of=200)
    
    db.add_all([mark1, mark2, mark3])

    # Assignments
    ass1 = models.Assignment(title="Build a Portfolio", subject_id=sub2.id, due_date=datetime.date(2023, 12, 15), status="Pending")
    ass2 = models.Assignment(title="Binary Tree Implementation", subject_id=sub1.id, due_date=datetime.date(2023, 11, 20), status="Completed")
    
    db.add_all([ass1, ass2])

    # Announcements
    ann1 = models.Announcement(title="Mid-Sem Exams Scheduled", date=datetime.date(2023, 10, 15), content="Exams will start from next week.")
    ann2 = models.Announcement(title="Holiday on Friday", date=datetime.date(2023, 10, 20), content="College will remain closed.")

    db.add_all([ann1, ann2])
    db.commit()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_db()
