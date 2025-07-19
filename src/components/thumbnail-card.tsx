"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Award, Trophy } from "lucide-react";

interface ThumbnailCardProps {
  rank: number;
  dataUri: string;
  predictedCtr: number;
  explanation: string;
}

const rankIcons = [
  <Trophy key="1" className="text-yellow-400" />,
  <Award key="2" className="text-slate-400" />,
  <CheckCircle2 key="3" className="text-yellow-600" />,
];

export function ThumbnailCard({ rank, dataUri, predictedCtr, explanation }: ThumbnailCardProps) {
  const ctrPercentage = Math.round(predictedCtr * 100);
  const rankIcon = rank <= 3 ? rankIcons[rank-1] : <span className="font-bold text-muted-foreground">#{rank}</span>

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-in fade-in-0 zoom-in-95">
      <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 flex items-center justify-center">{rankIcon}</div>
           <CardTitle className="text-2xl font-bold">Rank #{rank}</CardTitle>
        </div>
        {rank === 1 && <Badge variant="default" className="bg-accent text-accent-foreground">Top Pick</Badge>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div className="aspect-video w-full rounded-md overflow-hidden ring-2 ring-offset-2 ring-border">
          <Image
            src={dataUri}
            alt={`Ranked thumbnail ${rank}`}
            width={640}
            height={360}
            className="w-full h-full object-cover"
            data-ai-hint="youtube thumbnail"
          />
        </div>
         <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-semibold text-muted-foreground">Predicted CTR Score</h4>
            <span className="text-lg font-bold text-primary">{ctrPercentage}%</span>
          </div>
          <Progress value={ctrPercentage} className="h-3 bg-accent/20" />
        </div>
      </CardContent>
      <CardFooter>
        <CardDescription className="text-sm italic">"{explanation}"</CardDescription>
      </CardFooter>
    </Card>
  );
}
