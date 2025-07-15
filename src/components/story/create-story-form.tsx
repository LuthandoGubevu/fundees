
'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoryStructure, saveStoryAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, BookUp, Save, Loader2, AlertCircle, Lightbulb } from 'lucide-react';
import type { SuggestStoryStructureOutput } from '@/ai/flows/suggest-story-structure';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';


const storyThemes = [
  "A magical African animal",
  "A village celebration",
  "An adventure in the Serengeti",
  "A story about a talking drum",
  "Exploring the pyramids",
  "A folktale about Anansi the Spider",
];

export function CreateStoryForm() {
  const searchParams = useSearchParams();
  const initialTheme = searchParams.get('theme') || '';

  const [theme, setTheme] = useState(initialTheme);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [structure, setStructure] = useState<SuggestStoryStructureOutput | null>(null);

  const [state, formAction] = useActionState(getStoryStructure, { error: null, data: null });
  const [isSaving, startSaving] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (state.data) {
      setStructure(state.data);
    }
  }, [state.data]);

  const useStructure = (part: 'beginning' | 'middle' | 'end') => {
    if (!structure) return;
    const hint = structure[part];
    setContent(prev => `${prev}\n\n${hint}`);
  };

  const handleSave = () => {
    if (!title || !content) {
        toast({
            title: "Uh oh!",
            description: "Please make sure your story has a title and some content.",
            variant: "destructive"
        })
        return;
    }

    if (!user) {
        toast({
            title: "Not Logged In",
            description: "You must be logged in to save a story.",
            variant: "destructive"
        })
        return;
    }
    
    startSaving(async () => {
        try {
            await saveStoryAction({ 
              title, 
              content, 
              theme: theme || "A wonderful adventure",
              author: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                school: user.school,
                grade: user.grade,
              }
            });
            toast({
                title: "Hooray!",
                description: "Your story has been saved and is on its way to the library!",
            });
            router.push('/library');
        } catch (error) {
            toast({
                title: "Oh no!",
                description: error instanceof Error ? error.message : "Something went wrong.",
                variant: "destructive"
            });
        }
    });
  }

  return (
    <Card className="p-4 sm:p-8 bg-sky-blue/60 shadow-2xl rounded-2xl text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Story Creation */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg font-semibold">Story Title</Label>
            <Input id="title" placeholder="The Amazing Adventure of..." value={title} onChange={e => setTitle(e.target.value)} className="mt-2 text-base h-12 text-black" />
          </div>
          <div>
            <Label htmlFor="content" className="text-lg font-semibold">Your Story</Label>
            <Textarea
              id="content"
              placeholder="Once upon a time, in a land filled with sunshine..."
              className="mt-2 min-h-[300px] text-base text-black"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
           <Button onClick={handleSave} size="lg" className="w-full text-lg font-bold" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            {isSaving ? 'Saving your masterpiece...' : 'Save My Story'}
          </Button>
        </div>

        {/* Right side: AI Helper */}
        <div className="space-y-6">
          <form action={formAction} className="space-y-4 p-4 border rounded-lg bg-background/50">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground"><Wand2 className="h-5 w-5 text-primary"/>AI Story Helper</h3>
            <div>
              <Label htmlFor="theme" className="text-foreground">Choose a theme or type your own!</Label>
                <Select onValueChange={setTheme} value={theme}>
                    <SelectTrigger id="theme" className="mt-2 h-12 text-black">
                        <SelectValue placeholder="Select a theme..." />
                    </SelectTrigger>
                    <SelectContent>
                        {storyThemes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Input name="theme" value={theme} onChange={e => setTheme(e.target.value)} className="mt-2 h-12 text-black" placeholder="Or type a custom theme"/>
            </div>
            <Button type="submit" className="w-full">
              <Lightbulb className="mr-2 h-4 w-4" />
              Get Story Structure
            </Button>
            {state.error && <p className="text-sm text-destructive mt-2 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {JSON.stringify(state.error)}</p>}
          </form>

          {structure && (
            <Card className="animate-in fade-in-50 bg-sky-blue/60">
              <CardHeader>
                <CardTitle>Story Structure Ideas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StructureHint title="Beginning" hint={structure.beginning} onClick={() => useStructure('beginning')} />
                <StructureHint title="Middle" hint={structure.middle} onClick={() => useStructure('middle')} />
                <StructureHint title="End" hint={structure.end} onClick={() => useStructure('end')} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}

function StructureHint({ title, hint, onClick }: { title: string, hint: string, onClick: () => void }) {
    return (
        <div className="p-3 border rounded-md bg-background/50">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground my-1">{hint}</p>
            <Button variant="link" size="sm" className="p-0 h-auto" onClick={onClick}>
                <BookUp className="mr-2 h-4 w-4" />
                Use this part
            </Button>
        </div>
    )
}
