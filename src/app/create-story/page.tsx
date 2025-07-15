
'use client';
import { CreateStoryForm } from '@/components/story/create-story-form';

export default function CreateStoryPage() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-3.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mt-4">Create Your Story</h1>
            <p className="mt-4 text-lg text-foreground/80">
              Pick a theme, get some ideas from our AI helper, and write your masterpiece!
            </p>
          </div>
          <CreateStoryForm />
        </div>
      </div>
    </div>
  );
}
