export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, never store plain text passwords
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  userId: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  userId: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  uploadDate: string;
  userId: string;
}

export interface Quote {
  text: string;
  author: string;
}