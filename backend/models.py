from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Date
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'student', 'teacher', 'admin'
    avatar = Column(String)

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    credits = Column(Integer)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    
    teacher = relationship("User")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    due_date = Column(String)
    status = Column(String) # 'Pending', 'Completed'
    student_id = Column(Integer, ForeignKey("users.id"))

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    date = Column(String)
    content = Column(String)

class Timetable(Base):
    __tablename__ = "timetable"
    
    id = Column(Integer, primary_key=True, index=True)
    time = Column(String)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    room = Column(String)
    
    subject = relationship("Subject")

class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    score = Column(Float)
    
    student = relationship("User")
    subject = relationship("Subject")

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    status = Column(String) # 'Present', 'Absent', 'Late'
    
    student = relationship("User")
