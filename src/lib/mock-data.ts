import type { Story } from './types';

let stories: Story[] = [
  {
    id: '1',
    title: 'The Lion and the Mouse',
    author: 'Leo',
    grade: '1st Grade',
    subject: 'Reading',
    language: 'English',
    excerpt: 'A story about a mighty lion who is spared by a tiny mouse, and later learns that kindness is never wasted...',
    content: 'Once when a lion, the king of the jungle, was asleep, a little mouse began running up and down on him. This soon awakened the lion, who placed his huge paw on the mouse, and opened his big jaws to swallow him. "Pardon, O King!" cried the little Mouse, "Forgive me this time. I shall never repeat it and I shall never forget your kindness. And who knows, I may be able to do you a good turn one of these days!” The Lion was so tickled by the idea of the mouse being able to help him that he lifted his paw and let him go. Sometime later, a few hunters captured the lion, and tied him to a tree. After that they went in search of a wagon, to take him to the zoo. Just then the little mouse happened to pass by. On seeing the lion’s plight, he ran up to him and gnawed away the ropes that bound him, the king of the jungle. “Was I not right?” said the little mouse, very happy to help the lion.',
    likes: 25,
    age: '6-7',
    theme: 'Animals',
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
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
