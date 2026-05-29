const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function registerCompany(name, email, password) {
  return apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginCompany(email, password) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function createJob(token, jobData) {
  return apiCall('/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(jobData),
  });
}

export async function getJobs(token) {
  return apiCall('/jobs', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getCandidates(token) {
  return apiCall('/candidates', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateCandidateStatus(token, candidateId, status) {
  return apiCall(`/candidates/${candidateId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
}
