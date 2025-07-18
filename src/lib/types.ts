export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  school?: string;
  grade?: string;
  totalLikes?: number;
  photoURL?: string;
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
  createdAt: any; // Can be Timestamp from Firebase or string
}
