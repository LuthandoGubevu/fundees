'use client';
import { CreateStoryForm } from '@/components/story/create-story-form';
import { PencilRuler } from 'lucide-react';

export default function CreateStoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <PencilRuler className="mx-auto h-16 w-16 text-primary drop-shadow-lg" />
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mt-4">Create Your Story</h1>
        <p className="mt-4 text-lg text-foreground/80">
          Pick a theme, get some ideas from our AI helper, and write your masterpiece!
        </p>
      </div>
      <CreateStoryForm />
    </div>
  );
}
