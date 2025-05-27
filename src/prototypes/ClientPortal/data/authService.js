// Mock users data
const users = [
  {
    id: 1,
    email: 'client@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'client',
    caseIds: [101, 102],
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    email: 'attorney@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'attorney',
    specialization: 'Family Law',
    caseIds: [101, 102, 103, 104],
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/20.jpg'
  }
];

// Simulate localStorage persistence
const LOCAL_STORAGE_KEY = 'psn_portal_user';

// Helper to handle async behavior like a real API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (email, password) => {
  await delay(800); // Simulate network request
  
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  // Remove password before storing/returning
  const { password: _, ...userWithoutPassword } = user;
  
  // Save to localStorage to persist session
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

export const logoutUser = async () => {
  await delay(300); // Simulate network request
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return true;
};

export const getCurrentUser = async () => {
  await delay(300); // Simulate network latency
  const userData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const registerUser = async (userData) => {
  await delay(1000); // Simulate network request
  
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already in use');
  }
  
  // In a real app, this would be handled by the backend
  const newUser = {
    id: users.length + 1,
    ...userData,
    role: 'client', // New registrations default to client role
  };
  
  users.push(newUser);
  
  // Remove password before returning
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};