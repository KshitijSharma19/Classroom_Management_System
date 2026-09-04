const BASE_URL = 'http://localhost:8000';

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function fetchSubjects() {
  const res = await fetch(`${BASE_URL}/subjects`);
  return res.json();
}

export async function fetchUsers(role) {
  const url = role ? `${BASE_URL}/users?role=${role}` : `${BASE_URL}/users`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchAttendance(studentId) {
  const res = await fetch(`${BASE_URL}/attendance/${studentId}`);
  return res.json();
}

export async function fetchMarks(studentId) {
  const res = await fetch(`${BASE_URL}/marks/${studentId}`);
  return res.json();
}

export async function fetchAssignments() {
  const res = await fetch(`${BASE_URL}/assignments`);
  return res.json();
}

export const fetchAnnouncements = async () => {
  const response = await fetch(`${BASE_URL}/announcements`);
  return response.json();
};

export const updateUserProfile = async (userId, data) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const submitAssignment = async (assignmentId) => {
  const response = await fetch(`${BASE_URL}/assignments/${assignmentId}/submit`, {
    method: 'PUT'
  });
  return response.json();
};

export async function createAnnouncement(data) {
  const res = await fetch(`${BASE_URL}/announcements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function deleteAnnouncement(id) {
  const res = await fetch(`${BASE_URL}/announcements/${id}`, { method: 'DELETE' });
  return res.json();
}
export async function createAssignment(data) {
  const res = await fetch(`${BASE_URL}/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function updateAssignment(id, data) {
  const res = await fetch(`${BASE_URL}/assignments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function deleteAssignment(id) {
  const res = await fetch(`${BASE_URL}/assignments/${id}`, { method: 'DELETE' });
  return res.json();
}
export async function updateMark(id, data) {
  const res = await fetch(`${BASE_URL}/marks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function updateAttendance(id, data) {
  const res = await fetch(`${BASE_URL}/attendance/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}

export async function fetchSubmissions(assignmentId) {
  const res = await fetch(`${BASE_URL}/submissions/${assignmentId}`);
  return res.json();
}
export async function createSubmission(data) {
  const res = await fetch(`${BASE_URL}/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function gradeSubmission(id, data) {
  const res = await fetch(`${BASE_URL}/submissions/${id}/grade`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
  return res.json();
}
export async function createSubject(data) {
  const res = await fetch(`${BASE_URL}/subjects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function updateSubject(id, data) {
  const res = await fetch(`${BASE_URL}/subjects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
export async function deleteSubject(id) {
  const res = await fetch(`${BASE_URL}/subjects/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function sendChatMessage(message, role) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, role })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to send message');
  }
  return res.json();
}
