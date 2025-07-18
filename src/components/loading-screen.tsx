import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Groq API Playground
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Initializing Groq Client</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we set up your AI playground...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
