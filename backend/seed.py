import os
import sys

# Ensure backend module can be imported when running as a script
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine
from backend import models

from datetime import date

def seed_data():
    # Drop all tables and recreate
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Removed early exit so we always seed after dropping.
    print("Seeding database...")

    # 1. Add Users
    users = [
        models.User(name='John Doe', role='student', email='student@school.com', hashed_password='password', avatar='https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'),
        models.User(name='Jane Smith', role='teacher', email='teacher@school.com', hashed_password='password', avatar='https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff'),
        models.User(name='Admin User', role='admin', email='admin@school.com', hashed_password='password', avatar='https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff')
    ]
    db.add_all(users)
    db.commit()

    # 2. Add Subjects
    subjects = [
        models.Subject(name='Data Structures', code='CS201', credits=4, teacher_id=2),
        models.Subject(name='Web Development', code='CS301', credits=3, teacher_id=2),
        models.Subject(name='Database Management', code='CS401', credits=4, teacher_id=2)
    ]
    db.add_all(subjects)
    db.commit()

    # 3. Add Assignments
    assignments = [
        models.Assignment(title='Build a Portfolio', subject_id=2, due_date='2023-12-15', status='Pending', student_id=1),
        models.Assignment(title='Binary Tree Implementation', subject_id=1, due_date='2023-11-20', status='Completed', student_id=1),
        models.Assignment(title='SQL Normalization', subject_id=3, due_date='2023-11-25', status='Completed', student_id=1)
    ]
    db.add_all(assignments)
    db.commit()
    
    # 4. Add Announcements
    announcements = [
        models.Announcement(title='Mid-Sem Exams Scheduled', date='2023-10-15', content='Exams will start from next week.'),
        models.Announcement(title='Holiday on Friday', date='2023-10-20', content='College will remain closed.')
    ]
    db.add_all(announcements)
    db.commit()
    
    # 5. Add Timetable
    timetable = [
        models.Timetable(time='09:00 AM - 10:30 AM', subject_id=1, room='Room 301'),
        models.Timetable(time='11:00 AM - 12:30 PM', subject_id=2, room='Lab 2'),
        models.Timetable(time='02:00 PM - 03:30 PM', subject_id=3, room='Room 105')
    ]
    db.add_all(timetable)
    db.commit()
    
    # 6. Add Grades
    grades = [
        models.Grade(student_id=1, subject_id=1, score=92.5),
        models.Grade(student_id=1, subject_id=2, score=88.0),
        models.Grade(student_id=1, subject_id=3, score=95.0)
    ]
    db.add_all(grades)
    db.commit()
    
    # 7. Add Attendance
    attendance = [
        models.Attendance(student_id=1, date=date(2023, 10, 25), status='Present'),
        models.Attendance(student_id=1, date=date(2023, 10, 26), status='Present'),
        models.Attendance(student_id=1, date=date(2023, 10, 27), status='Absent'),
        models.Attendance(student_id=1, date=date(2023, 10, 28), status='Present'),
        models.Attendance(student_id=1, date=date(2023, 10, 29), status='Present')
    ]
    db.add_all(attendance)
    db.commit()
    
    print("Seeding completed successfully!")
    db.close()
if __name__ == "__main__":
    seed_data()
