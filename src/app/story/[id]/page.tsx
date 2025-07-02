import { getStoryById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function StoryPage({ params }: { params: { id: string } }) {
  const story = await getStoryById(params.id);

  if (!story) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-2xl rounded-2xl bg-card/90">
        <CardHeader className="p-0">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={story.imageUrl || 'https://placehold.co/800x400.png'}
              alt={story.title}
              fill
              className="object-cover"
              data-ai-hint={story.theme.toLowerCase()}
            />
          </div>
          <div className="p-6">
            <CardTitle className="text-4xl md:text-5xl font-bold font-headline mb-4">{story.title}</CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
              <span>by {story.author}</span>
              <span>&middot;</span>
              <span>{new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
             <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="border-orange-400 text-orange-600">{story.age} yrs</Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-600">{story.grade}</Badge>
                <Badge variant="secondary">{story.theme}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
            <div className="text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {story.content}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
