export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: string;
  password?: string; // Should not be stored in client-side state, but needed for mock lookup
}

export interface Story {
  id: string;
  title: string;
  author: string;
  authorId: string;
  school?: string;
  grade: string;
  subject: string;
  language: string;
  excerpt: string;
  content: string;
  likes: number;
  age: string;
  theme: string;
  imageUrl?: string;
  createdAt: string;
}
