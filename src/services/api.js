const BASE_URL_Task = process.env.NEXT_PUBLIC_API_URL_TASK || "http://localhost:5002"; 
const BASE_URL_AUTH = process.env.NEXT_PUBLIC_API_URL_AUTH || "http://localhost:5001";

// Utility function to get the token from localStorage
const getToken = () => {
  const token = localStorage.getItem("access_token");  // Retrieve access_token from localStorage
  console.log("Retrieved token from localStorage:", token);  // Log token value
  return token;
};

// Function to set the token in localStorage
const setToken = (token) => {
  console.log("Setting token:", token); 
  localStorage.setItem("access_token", token);  // Store token as access_token
};

// Function to remove the token from localStorage
const removeToken = () => {
  localStorage.removeItem("access_token");  // Remove access_token from localStorage
};

export const fetchTasks = async () => {
  const token = getToken();
  console.log("Token in fetchTasks:", token);
  if (!token) {
    console.error("No token found! User may not be authenticated.");
    return { error: "Unauthorized: No token provided." };
  }

  const res = await fetch(`${BASE_URL_Task}/v1/tasks`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // Direct use of token
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error fetching tasks: ${res.status} - ${errorText}`);
    return { error: `Error fetching tasks: ${res.status}` };
  }

  return res.json();
};

export const addTask = async (task) => {
  const token = getToken();
  if (!token) {
    console.error("No token found! User may not be authenticated.");
    return { error: "Unauthorized: No token provided." };
  }

  const res = await fetch(`${BASE_URL_Task}/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  // Direct use of token
    },
    body: JSON.stringify(task),
    body: JSON.stringify({
      task:task
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error adding task: ${res.status} - ${errorText}`);
    return { error: `Error adding task: ${res.status}` };
  }

  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL_Task}/v1/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, 
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Error deleting task: ${res.status} - ${errorText}`);
    return { error: `Error deleting task: ${res.status}` };
  }

  return res.json();  // Corrected return statement
};

export const registerUser = async (email, password) => {
  const res = await fetch(`${BASE_URL_AUTH}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // Check if response is not ok (status code outside 2xx range)
  if (!res.ok) {
    try {
      const errorText = await res.text(); // Get error message text if available
      console.error(`Error registering user: ${res.status} - ${errorText}`);
      return { error: `Error registering user: ${res.status} - ${errorText}` };
    } catch (err) {
      console.error("Error parsing the error response:", err);
      return { error: "An unknown error occurred." };
    }
  }

  // If the registration was successful and the server returned a JSON response with a token
  const data = await res.json();

  if (data.access_token) {  // Fix the typo here
    setToken(data.access_token); // Store token in localStorage
  }

  return data; // Return the successful response data (e.g., user data or token)
};

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL_AUTH}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error logging in: ${res.status} - ${errorText}`);
      return { error: `Error logging in: ${res.status}` };
    }

    const data = await res.json();

    if (data.access_token) {
      setToken(data.access_token);  // Store the access_token in localStorage
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return { error: error.message };
  }
};

export const logoutUser = () => {
  removeToken();  // Remove token from localStorage when logging out
};
