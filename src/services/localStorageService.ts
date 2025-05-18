import { User, Todo, CalendarEvent, JournalEntry, GalleryImage, Quote } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const USERS_KEY = 'productivityHub_users';
const CURRENT_USER_KEY = 'productivityHub_currentUser';
const TODOS_KEY = 'productivityHub_todos';
const EVENTS_KEY = 'productivityHub_events';
const JOURNAL_KEY = 'productivityHub_journal';
const GALLERY_KEY = 'productivityHub_gallery';
const QUOTES_KEY = 'productivityHub_quotes';
const LAST_QUOTE_DATE_KEY = 'productivityHub_lastQuoteDate';

// User related services
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser = { ...user, id: uuidv4() };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const logout = (): void => {
  setCurrentUser(null);
};

// Todo related services
export const getTodos = (userId: string): Todo[] => {
  const todos = localStorage.getItem(TODOS_KEY);
  const allTodos = todos ? JSON.parse(todos) : [];
  return allTodos.filter((todo: Todo) => todo.userId === userId);
};

export const saveTodo = (todo: Omit<Todo, 'id' | 'createdAt'>): Todo => {
  const todos = localStorage.getItem(TODOS_KEY);
  const allTodos = todos ? JSON.parse(todos) : [];
  const newTodo = { 
    ...todo, 
    id: uuidv4(), 
    createdAt: new Date().toISOString() 
  };
  allTodos.push(newTodo);
  localStorage.setItem(TODOS_KEY, JSON.stringify(allTodos));
  return newTodo;
};

export const updateTodo = (updatedTodo: Todo): Todo => {
  const todos = localStorage.getItem(TODOS_KEY);
  const allTodos = todos ? JSON.parse(todos) : [];
  const index = allTodos.findIndex((t: Todo) => t.id === updatedTodo.id);
  if (index !== -1) {
    allTodos[index] = updatedTodo;
    localStorage.setItem(TODOS_KEY, JSON.stringify(allTodos));
  }
  return updatedTodo;
};

export const deleteTodo = (id: string): void => {
  const todos = localStorage.getItem(TODOS_KEY);
  const allTodos = todos ? JSON.parse(todos) : [];
  const filteredTodos = allTodos.filter((t: Todo) => t.id !== id);
  localStorage.setItem(TODOS_KEY, JSON.stringify(filteredTodos));
};

// Calendar event related services
export const getEvents = (userId: string): CalendarEvent[] => {
  const events = localStorage.getItem(EVENTS_KEY);
  const allEvents = events ? JSON.parse(events) : [];
  return allEvents.filter((event: CalendarEvent) => event.userId === userId);
};

export const saveEvent = (event: Omit<CalendarEvent, 'id'>): CalendarEvent => {
  const events = localStorage.getItem(EVENTS_KEY);
  const allEvents = events ? JSON.parse(events) : [];
  const newEvent = { ...event, id: uuidv4() };
  allEvents.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(allEvents));
  return newEvent;
};

export const updateEvent = (updatedEvent: CalendarEvent): CalendarEvent => {
  const events = localStorage.getItem(EVENTS_KEY);
  const allEvents = events ? JSON.parse(events) : [];
  const index = allEvents.findIndex((e: CalendarEvent) => e.id === updatedEvent.id);
  if (index !== -1) {
    allEvents[index] = updatedEvent;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(allEvents));
  }
  return updatedEvent;
};

export const deleteEvent = (id: string): void => {
  const events = localStorage.getItem(EVENTS_KEY);
  const allEvents = events ? JSON.parse(events) : [];
  const filteredEvents = allEvents.filter((e: CalendarEvent) => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filteredEvents));
};

// Journal related services
export const getJournalEntries = (userId: string): JournalEntry[] => {
  const entries = localStorage.getItem(JOURNAL_KEY);
  const allEntries = entries ? JSON.parse(entries) : [];
  return allEntries.filter((entry: JournalEntry) => entry.userId === userId);
};

export const saveJournalEntry = (entry: Omit<JournalEntry, 'id'>): JournalEntry => {
  const entries = localStorage.getItem(JOURNAL_KEY);
  const allEntries = entries ? JSON.parse(entries) : [];
  const newEntry = { ...entry, id: uuidv4() };
  allEntries.push(newEntry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(allEntries));
  return newEntry;
};

export const updateJournalEntry = (updatedEntry: JournalEntry): JournalEntry => {
  const entries = localStorage.getItem(JOURNAL_KEY);
  const allEntries = entries ? JSON.parse(entries) : [];
  const index = allEntries.findIndex((e: JournalEntry) => e.id === updatedEntry.id);
  if (index !== -1) {
    allEntries[index] = updatedEntry;
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(allEntries));
  }
  return updatedEntry;
};

export const deleteJournalEntry = (id: string): void => {
  const entries = localStorage.getItem(JOURNAL_KEY);
  const allEntries = entries ? JSON.parse(entries) : [];
  const filteredEntries = allEntries.filter((e: JournalEntry) => e.id !== id);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(filteredEntries));
};

// Gallery related services
export const getGalleryImages = (userId: string): GalleryImage[] => {
  const images = localStorage.getItem(GALLERY_KEY);
  const allImages = images ? JSON.parse(images) : [];
  return allImages.filter((image: GalleryImage) => image.userId === userId);
};

export const saveGalleryImage = (image: Omit<GalleryImage, 'id' | 'uploadDate'>): GalleryImage => {
  const images = localStorage.getItem(GALLERY_KEY);
  const allImages = images ? JSON.parse(images) : [];
  const newImage = { 
    ...image, 
    id: uuidv4(), 
    uploadDate: new Date().toISOString() 
  };
  allImages.push(newImage);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(allImages));
  return newImage;
};

export const deleteGalleryImage = (id: string): void => {
  const images = localStorage.getItem(GALLERY_KEY);
  const allImages = images ? JSON.parse(images) : [];
  const filteredImages = allImages.filter((i: GalleryImage) => i.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(filteredImages));
};

// Quotes related services
const defaultQuotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" }
];

export const initializeQuotes = (): void => {
  const quotes = localStorage.getItem(QUOTES_KEY);
  if (!quotes) {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(defaultQuotes));
  }
};

export const getQuotes = (): Quote[] => {
  const quotes = localStorage.getItem(QUOTES_KEY);
  return quotes ? JSON.parse(quotes) : defaultQuotes;
};

export const getDailyQuote = (): Quote => {
  initializeQuotes();
  const quotes = getQuotes();
  const today = new Date().toDateString();
  const lastQuoteDate = localStorage.getItem(LAST_QUOTE_DATE_KEY);
  
  // If we already have a quote for today, return it
  if (lastQuoteDate === today) {
    const savedQuoteIndex = localStorage.getItem(QUOTES_KEY + '_current');
    const index = savedQuoteIndex ? parseInt(savedQuoteIndex, 10) : 0;
    return quotes[index];
  }
  
  // Otherwise, get a new random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  localStorage.setItem(LAST_QUOTE_DATE_KEY, today);
  localStorage.setItem(QUOTES_KEY + '_current', randomIndex.toString());
  return quotes[randomIndex];
};