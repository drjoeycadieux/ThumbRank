import ThumbRankApp from "@/components/thumb-rank-app";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
          ThumbRank
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Upload your YouTube thumbnails and let our AI predict which one will get the most clicks.
        </p>
      </header>
      <ThumbRankApp />
    </main>
  );
}
