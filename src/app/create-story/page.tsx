'use client';
import { CreateStoryForm } from '@/components/story/create-story-form';
import Image from 'next/image';

export default function CreateStoryPage() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
            <Image src="/fundee-3.jpg" alt="Friendly character writing a story" width={150} height={150} className="rounded-full" />
        </div>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mt-4">Create Your Story</h1>
        <p className="mt-4 text-lg text-foreground/80">
          Pick a theme, get some ideas from our AI helper, and write your masterpiece!
        </p>
      </div>
      <CreateStoryForm />
    </div>
  );
}
