const API_URL = 'http://127.0.0.1:8000/api';

function authHeaders() {
const token =
  localStorage.getItem("scms_token") ||
  sessionStorage.getItem("scms_token");

  return {
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}



export async function getSeniorCitizens() {
  const response = await fetch(`${API_URL}/senior-citizens`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load senior citizens");
  }

  return response.json();
}

export async function createSeniorCitizen(data) {
  const response = await fetch(`${API_URL}/senior-citizens`, {
    method: "POST",
    headers: {
  ...authHeaders(),
  "Content-Type": "application/json",
},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Laravel validation error:", errorData);
    throw new Error("Failed to create senior citizen");
  }

  return response.json();
}

export async function deleteSeniorCitizen(id) {
  const response = await fetch(`${API_URL}/senior-citizens/${id}`, {
    method: "DELETE",
   headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete senior citizen");
  }

  return response.json();
}

export async function updateSeniorCitizen(id, data) {
  const response = await fetch(`${API_URL}/senior-citizens/${id}`, {
    method: "PATCH",
    headers: {
  ...authHeaders(),
  "Content-Type": "application/json",
},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Laravel update error:", errorData);
    throw new Error("Failed to update senior citizen");
  }

  return response.json();
}

export async function getAnnouncements() {
  const response = await fetch(`${API_URL}/announcements`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load announcements");
  }

  return response.json();
}
export async function createAnnouncement(data) {
  const response = await fetch(`${API_URL}/announcements`, {
    method: "POST",
    headers: {
  ...authHeaders(),
  "Content-Type": "application/json",
},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Laravel announcement error:", errorData);
    throw new Error("Failed to create announcement");
  }

  return response.json();
}
export async function updateAnnouncement(id, data) {
  const response = await fetch(`${API_URL}/announcements/${id}`, {
    method: "PATCH",
    headers: {
  ...authHeaders(),
  "Content-Type": "application/json",
},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Laravel announcement update error:", errorData);
    throw new Error("Failed to update announcement");
  }

  return response.json();
}
export async function deleteAnnouncement(id) {
  const response = await fetch(`${API_URL}/announcements/${id}`, {
    method: "DELETE",
   headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete announcement");
  }

  return response.json();
}
export async function getApplications() {
  const response = await fetch(`${API_URL}/applications`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load applications");
  }

  return response.json();
}

export async function updateApplication(id, data) {
  const response = await fetch(`${API_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
  ...authHeaders(),
  "Content-Type": "application/json",
},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Laravel application update error:", errorData);
    throw new Error("Failed to update application");
  }

  return response.json();
}
export async function deleteApplication(id) {
  const response = await fetch(`${API_URL}/applications/${id}`, {
    method: "DELETE",
   headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete application");
  }

  return response.json();
}

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function logoutUser() {
 const token =
  localStorage.getItem("scms_token") ||
  sessionStorage.getItem("scms_token");

  if (!token) return;

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}