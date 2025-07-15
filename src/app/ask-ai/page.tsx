'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';

const mockResponses: Record<string, string> = {
  'why is the sky blue?': "That's a fantastic question! The sky looks blue because of how the sun's light spreads out. Sunlight is made of all the colors of the rainbow, but the blue light gets scattered more than other colors by the tiny little molecules in the air. So, when we look up, we see a beautiful blue sky!",
  'how do bees make honey?': "Buzz-worthy question! Honeybees make honey as food to eat during winter. They fly from flower to flower collecting a sweet juice called nectar. They store it in their special 'honey stomach' and take it back to the hive. There, they pass it to other bees who chew it and add special enzymes. They spread it in the honeycomb and fan it with their wings to make it thicker. Voila, honey!",
  'default': "Wow, that's a really interesting thought! Imagine a world where that's true. What kind of adventures could happen? Maybe you could write a story about it!",
};

export default function AskAiPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setIsLoading(true);
    setResponse('');
    setTimeout(() => {
      const key = question.toLowerCase().trim().replace('?', '');
      setResponse(mockResponses[key] || mockResponses.default);
      setIsLoading(false);
    }, 1500);
  };

  const useAsIdea = () => {
    router.push(`/create-story?theme=${encodeURIComponent(question)}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fundee-4.jpg')" }}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-foreground mt-4">Ask a Question</h1>
            <p className="mt-4 text-lg text-foreground/80">
              Got a tricky question? Our wise AI friend is here to help you find the answer!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Why is the sky blue?"
              className="flex-grow text-lg h-14 bg-white/90"
              disabled={isLoading}
            />
            <Button type="submit" size="lg" className="h-14" disabled={isLoading}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Ask</span>
            </Button>
          </form>

          {isLoading && (
            <Card className="p-6 text-center animate-pulse bg-white/90">
                <p className="text-muted-foreground">Our AI friend is thinking hard...</p>
            </Card>
          )}

          {response && (
            <Card className="bg-white/90 shadow-xl transition-all duration-500 animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Here's a thought...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-foreground/90 leading-relaxed">{response}</p>
                <Button onClick={useAsIdea} className="mt-6">
                  Use as a Story Idea
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
