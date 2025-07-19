"use client";

import { useState } from "react";
import { rankThumbnailsAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { RankThumbnailsOutput } from "@/ai/flows/rank-thumbnails";
import { useRouter } from 'next/navigation';

import { ThumbnailUploader } from "@/components/thumbnail-uploader";
import { ThumbnailCard } from "@/components/thumbnail-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AppState = "idle" | "preview" | "loading" | "results";

export default function ThumbRankApp() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [rankedThumbnails, setRankedThumbnails] = useState<RankThumbnailsOutput["rankedThumbnails"]>([]);
  const [appState, setAppState] = useState<AppState>("idle");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;

    const filePromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then(newPreviews => {
        setPreviews(newPreviews);
        setAppState("preview");
      })
      .catch(error => {
        console.error("Error reading files:", error);
        toast({
          variant: "destructive",
          title: "Error reading files",
          description: "There was a problem processing your uploaded files. Please try again.",
        });
      });
  };

  const handleRank = async () => {
    if (previews.length > 1) {
      setShowUpgradeDialog(true);
      return;
    }
    
    setAppState("loading");
    try {
      const result = await rankThumbnailsAction(previews);
      const sorted = result.rankedThumbnails;
      setRankedThumbnails(sorted);
      setAppState("results");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Ranking Failed",
        description: errorMessage,
      });
      setAppState("preview");
    }
  };
  
  const handleUpgrade = () => {
    setShowUpgradeDialog(false);
    router.push('/pricing');
  };

  const handleReset = () => {
    setPreviews([]);
    setRankedThumbnails([]);
    setAppState("idle");
  };

  const renderContent = () => {
    switch (appState) {
      case "idle":
        return <ThumbnailUploader onFilesSelected={handleFilesSelected} />;
      case "preview":
        return (
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-2xl font-bold text-center">Your Thumbnails</h2>
            <div className={`grid gap-4 md:gap-6 ${previews.length > 1 ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {previews.map((src, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                  <Image src={src} alt={`Thumbnail preview ${index + 1}`} width={320} height={180} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Button size="lg" onClick={handleRank}>
                <Sparkles className="mr-2" />
                {previews.length > 1 ? 'Rank Thumbnails' : 'Analyze Thumbnail'}
                {previews.length > 1 && <ArrowRight className="ml-2" />}
              </Button>
               <Button size="lg" variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        );
      case "loading":
        return <LoadingSkeleton count={previews.length} />;
      case "results":
        return (
          <div className="flex flex-col items-center gap-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-center text-primary">{previews.length > 1 ? "Ranking Results" : "Analysis Complete"}</h2>
              <p className="text-muted-foreground mt-2">{previews.length > 1 ? "Here's how your thumbnails stack up based on predicted click-through rate." : "Here is the analysis of your thumbnail."}</p>
            </div>
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rankedThumbnails.map((thumbnail, index) => (
                <ThumbnailCard
                  key={thumbnail.dataUri}
                  rank={index + 1}
                  {...thumbnail}
                />
              ))}
            </div>
             <Button size="lg" variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2" />
                {previews.length > 1 ? "Rank More Thumbnails" : "Analyze Another"}
              </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full">{renderContent()}</div>
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
             <div className="flex justify-center">
                <div className="bg-primary/10 rounded-full p-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
             </div>
            <AlertDialogTitle className="text-center text-2xl">Upgrade to Rank Multiple Thumbnails</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Our free plan allows you to analyze one thumbnail at a time. To compare and rank multiple thumbnails, please upgrade to our Pro plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpgrade}>
              View Pricing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
