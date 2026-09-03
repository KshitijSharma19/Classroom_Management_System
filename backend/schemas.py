from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: str
    role: str
    avatar: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int
    teacher_id: int

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int

    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    title: str
    subject_id: int
    due_date: str
    status: str
    student_id: int

class AssignmentCreate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: int

    class Config:
        from_attributes = True

class AnnouncementBase(BaseModel):
    title: str
    date: str
    content: str

class AnnouncementCreate(AnnouncementBase):
    pass

class Announcement(AnnouncementBase):
    id: int

    class Config:
        from_attributes = True

from datetime import date

class TimetableBase(BaseModel):
    time: str
    subject_id: int
    room: str

class Timetable(TimetableBase):
    id: int

    class Config:
        from_attributes = True

class GradeBase(BaseModel):
    student_id: int
    subject_id: int
    score: float

class Grade(GradeBase):
    id: int

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    student_id: int
    date: date
    status: str

class Attendance(AttendanceBase):
    id: int

    class Config:
        from_attributes = True
