import type { Story } from './types';

// Use a global variable to persist stories across hot reloads in dev.
// In a real app, you'd use a database.
const globalForStories = globalThis as unknown as { stories: Story[] | undefined };

if (!globalForStories.stories) {
  globalForStories.stories = [
  {
    id: '1',
    title: 'The First Fundee',
    author: 'The Fundees Team',
    grade: '2nd Grade',
    subject: 'Creativity',
    language: 'English',
    excerpt: "The story of Fundees itself! A magical place where a little sunbeam's idea for a story turned into a grand adventure with a beautiful, AI-generated picture...",
    content: "In a world shimmering with imagination, a new friend was born: Fundee! Fundee wasn't a person, but a magical place on a screen where stories could come to life. Its first-ever story was about a brave little sunbeam who wanted to paint the whole world with happy colors. With a little help from a friendly AI, the sunbeam's story got a beautiful picture, showing everyone that even the smallest idea can become a grand adventure.",
    likes: 30,
    age: '7-8',
    theme: 'Creativity',
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: '2',
    title: 'Anansi the Spider',
    author: 'Amina',
    grade: '3rd Grade',
    subject: 'Folklore',
    language: 'English',
    excerpt: 'A classic West African tale about the clever spider Anansi, who tries to hoard all the wisdom in the world...',
    content: 'Anansi the spider was very clever, but he was also very greedy. He decided he wanted to have all the wisdom in the world for himself. He went around and collected all the wisdom he could find and put it in a big pot. He decided to hide the pot on top of a very tall tree. As he was climbing, his son saw him and asked what he was doing. Anansi was so annoyed that he let go of the pot, it smashed, and all the wisdom flew out to all the corners of the world. And that is why no one person has all the wisdom.',
    likes: 42,
    age: '8-9',
    theme: 'Folklore',
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];
}

const stories = globalForStories.stories!;


// Wrap in functions to simulate async API calls
export const getStories = async (): Promise<Story[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...stories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, 500);
  });
};

export const getStoryById = async (id: string): Promise<Story | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(stories.find(story => story.id === id));
        }, 300);
    });
};

export const addStory = async (story: Omit<Story, 'id' | 'createdAt' | 'likes'>): Promise<Story> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newStory: Story = {
        ...story,
        id: (stories.length + 1).toString(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      stories.push(newStory);
      resolve(newStory);
    }, 700);
  });
};
