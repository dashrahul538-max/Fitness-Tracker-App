import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersDbPath = path.join(__dirname, 'users.json');
const activitiesDbPath = path.join(__dirname, 'activities.json');

let usersData = [];
let activitiesData = [];

async function saveUsersData() {
  try {
    await fs.writeFile(usersDbPath, JSON.stringify(usersData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

async function saveActivitiesData() {
  try {
    await fs.writeFile(activitiesDbPath, JSON.stringify(activitiesData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving activities data:', error);
  }
}

async function loadUsersData() {
  try {
    const data = await fs.readFile(usersDbPath, 'utf-8');
    usersData = JSON.parse(data);
  } catch (error) {
    usersData = [];
    await saveUsersData();
  }
}

async function loadActivitiesData() {
  try {
    const data = await fs.readFile(activitiesDbPath, 'utf-8');
    activitiesData = JSON.parse(data);
  } catch (error) {
    activitiesData = [];
    await saveActivitiesData();
  }
}

export async function initializeDatabase() {
  await loadUsersData();
  await loadActivitiesData();
  console.log('Database initialized successfully');
}

// USER OPERATIONS
export function signUpUser(name, email, password, age, goal) {
  // Check if user already exists
  if (usersData.find(u => u.email === email)) {
    throw new Error('Email already registered');
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  const user = {
    id,
    name,
    email,
    password, // In production, this should be hashed
    age,
    goal,
    created_at: now,
    updated_at: now
  };

  usersData.push(user);
  saveUsersData();

  return {
    id,
    name,
    email,
    age,
    goal,
    created_at: now
  };
}

export function loginUser(email, password) {
  const user = usersData.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    goal: user.goal
  };
}

export function getUserById(id) {
  const user = usersData.find(u => u.id === id);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    goal: user.goal
  };
}

// ACTIVITY OPERATIONS
export function addActivity(userId, date, type, duration, calories, notes = '') {
  const id = uuidv4();
  const now = new Date().toISOString();

  const activity = {
    id,
    userId,
    date,
    type,
    duration,
    calories,
    notes,
    created_at: now,
    updated_at: now
  };

  activitiesData.push(activity);
  saveActivitiesData();
  return activity;
}

export function getAllActivities(userId) {
  return [...activitiesData]
    .filter(a => a.userId === userId)
    .sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return new Date(b.created_at) - new Date(a.created_at);
    });
}

export function getActivitiesByDate(userId, startDate, endDate) {
  return activitiesData
    .filter(a => a.userId === userId && a.date >= startDate && a.date <= endDate)
    .sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return new Date(b.created_at) - new Date(a.created_at);
    });
}

export function getActivityById(id) {
  return activitiesData.find(a => a.id === id);
}

export function updateActivity(id, date, type, duration, calories, notes = '') {
  const now = new Date().toISOString();
  
  const activityIndex = activitiesData.findIndex(a => a.id === id);
  if (activityIndex === -1) {
    throw new Error('Activity not found');
  }

  const updatedActivity = {
    ...activitiesData[activityIndex],
    date,
    type,
    duration,
    calories,
    notes,
    updated_at: now
  };

  activitiesData[activityIndex] = updatedActivity;
  saveActivitiesData();
  return updatedActivity;
}

export function deleteActivity(id) {
  const index = activitiesData.findIndex(a => a.id === id);
  if (index > -1) {
    activitiesData.splice(index, 1);
    saveActivitiesData();
  }
}

export function getActivitiesByType(userId, type) {
  return activitiesData
    .filter(a => a.userId === userId && a.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getTotalCaloriesByDate(userId, date) {
  return activitiesData
    .filter(a => a.userId === userId && a.date === date)
    .reduce((sum, a) => sum + a.calories, 0);
}

export function getTotalDurationByDate(userId, date) {
  return activitiesData
    .filter(a => a.userId === userId && a.date === date)
    .reduce((sum, a) => sum + a.duration, 0);
}
