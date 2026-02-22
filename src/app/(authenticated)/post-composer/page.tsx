import PostComposerInteractive from './components/PostComposerInteractive';

export const dynamic = 'force-dynamic';

export default function PostComposerPage() {
  return (
    <main className="min-h-screen bg-background">
      <PostComposerInteractive />
    </main>
  );
}
