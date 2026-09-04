from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String) # 'student', 'teacher', 'admin'
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    avatar = Column(String)
    phone = Column(String)
    dob = Column(Date)
    address = Column(String)
    father_name = Column(String)

    subjects = relationship("Subject", back_populates="teacher")
    attendance = relationship("Attendance", back_populates="student")
    marks = relationship("Mark", back_populates="student")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    credits = Column(Integer)
    teacher_id = Column(Integer, ForeignKey("users.id"))

    teacher = relationship("User", back_populates="subjects")
    assignments = relationship("Assignment", back_populates="subject")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    attended = Column(Integer, default=0)
    total = Column(Integer, default=0)
    
    student = relationship("User", back_populates="attendance")
    subject = relationship("Subject")

class Mark(Base):
    __tablename__ = "marks"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    internal = Column(Integer, default=0)
    mid = Column(Integer, default=0)
    end = Column(Integer, default=0)
    total = Column(Integer, default=0)
    out_of = Column(Integer, default=200)
    semester = Column(Integer, default=1)

    student = relationship("User", back_populates="marks")
    subject = relationship("Subject")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    due_date = Column(Date)
    status = Column(String) # 'Pending', 'Completed'

    subject = relationship("Subject", back_populates="assignments")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(Date)
    content = Column(String)

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    file_url = Column(String, nullable=True)
    score = Column(Integer, nullable=True)
    max_score = Column(Integer, default=100)
    status = Column(String, default="Submitted") # Submitted, Graded

    assignment = relationship("Assignment")
    student = relationship("User")

