
'use client';
import { CreateStoryForm } from '@/components/story/create-story-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateStoryPage() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-3.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="text-center mb-12 bg-sky-blue/60 shadow-xl rounded-2xl border-none">
            <CardHeader>
                <CardTitle className="font-headline text-5xl md:text-6xl font-bold text-white mt-4">Create Your Story</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mt-4 text-lg text-white/80">
                  Pick a theme, get some ideas from our AI helper, and write your masterpiece!
                </p>
            </CardContent>
          </Card>
          <CreateStoryForm />
        </div>
      </div>
    </div>
  );
}
