
import { getStoryById } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function StoryPage({ params }: { params: { id: string } }) {
  const story = await getStoryById(params.id);

  if (!story) {
    notFound();
  }
  
  const formattedDate = story.createdAt?.seconds 
    ? format(new Date(story.createdAt.seconds * 1000), 'PPP') 
    : 'a while ago';

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/fundee-6.jpg')" }}
    >
      <div className="min-h-screen w-full bg-background/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link href="/library">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
          </div>

          <Card className="overflow-hidden shadow-2xl rounded-2xl bg-sky-blue/60">
            <CardHeader className="p-6">
              <CardTitle className="text-4xl md:text-5xl font-bold font-headline mb-4">{story.title}</CardTitle>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                <span>by {story.author}</span>
                <span>&middot;</span>
                <span>{formattedDate}</span>
              </div>
               <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="border-orange-400 text-orange-600">{story.age} yrs</Badge>
                  <Badge variant="outline" className="border-blue-400 text-blue-600">{story.grade}</Badge>
                  <Badge variant="secondary">{story.theme}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {story.content}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
