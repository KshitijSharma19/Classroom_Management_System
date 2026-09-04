from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class UserBase(BaseModel):
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    father_name: Optional[str] = None

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    phone: Optional[str] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    father_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int
    teacher_id: Optional[int] = None

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    teacher_id: Optional[int] = None

class SubjectResponse(SubjectBase):
    id: int
    
    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    student_id: int
    subject_id: int
    attended: int
    total: int

class AttendanceResponse(AttendanceBase):
    id: int
    subject: SubjectResponse
    
    class Config:
        from_attributes = True

class MarkBase(BaseModel):
    student_id: int
    subject_id: int
    internal: int
    mid: int
    end: int
    total: int
    out_of: int
    semester: int

class MarkUpdate(BaseModel):
    internal: Optional[int] = None
    mid: Optional[int] = None
    end: Optional[int] = None
    total: Optional[int] = None

class AttendanceUpdate(BaseModel):
    attended: Optional[int] = None
    total: Optional[int] = None


class MarkResponse(MarkBase):
    id: int
    subject: SubjectResponse
    
    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    title: str
    subject_id: int
    due_date: date
    status: str

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    subject_id: Optional[int] = None
    due_date: Optional[date] = None
    status: Optional[str] = None

class AssignmentResponse(AssignmentBase):
    id: int
    subject: SubjectResponse
    
    class Config:
        from_attributes = True

class AnnouncementBase(BaseModel):
    title: str
    date: date
    content: str

class AnnouncementResponse(AnnouncementBase):
    id: int
    
    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    assignment_id: int
    student_id: int
    file_url: Optional[str] = None

class SubmissionResponse(SubmissionBase):
    id: int
    score: Optional[int] = None
    max_score: int
    status: str
    student: UserResponse

    class Config:
        from_attributes = True

class SubmissionGradeUpdate(BaseModel):
    score: int

