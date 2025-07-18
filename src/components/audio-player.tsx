import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Download, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title?: string;
  className?: string;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

export function AudioPlayer({
  src,
  title = "Audio Track",
  className,
  onLoadStart,
  onLoadEnd,
  onError,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Truncate title intelligently, preserving extension
  const truncateTitle = (title: string, maxLength: number = 50) => {
    if (title.length <= maxLength) return title;

    const lastDotIndex = title.lastIndexOf(".");
    const hasExtension = lastDotIndex > 0 && lastDotIndex > title.length - 6;

    if (hasExtension) {
      const extension = title.substring(lastDotIndex);
      const nameWithoutExtension = title.substring(0, lastDotIndex);
      const availableLength = maxLength - extension.length - 5; // 5 for " ... "

      if (availableLength > 10) {
        const startLength = Math.ceil(availableLength * 0.7);
        const endLength = Math.floor(availableLength * 0.3);
        const start = nameWithoutExtension.substring(0, startLength);
        const end = nameWithoutExtension.substring(
          nameWithoutExtension.length - endLength,
        );
        return `${start} ... ${end}${extension}`;
      }
    }

    // Fallback for titles without extension or very short available length
    const startLength = Math.ceil(maxLength * 0.7);
    const endLength = Math.floor(maxLength * 0.3) - 5;
    const start = title.substring(0, startLength);
    const end = title.substring(title.length - endLength);
    return `${start} ... ${end}`;
  };

  // Handle play/pause toggle
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to play audio";
      setError(errorMessage);
      onError?.(errorMessage);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stop
  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;

    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;

    const newVolume = value[0] / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = "Failed to download audio file";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      onLoadStart?.();
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      onLoadEnd?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      const errorMessage = "Failed to load audio file";
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Add event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    // Cleanup
    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [src, onLoadStart, onLoadEnd, onError]);

  // Reset state when src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, [src]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardContent className="px-4 py-0">
        {/* Hidden audio element */}
        <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 max-w-[65%] sm:max-w-none flex-1 min-w-0">
            <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg" title={title}>
                {truncateTitle(title)}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-2 sm:items-stretch sm:justify-between flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              disabled={!src || isLoading}
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              disabled={!src || isLoading}
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!src || isLoading}
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-2">
          <Slider
            value={[progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={0.1}
            disabled={!duration || isLoading}
            className="w-full touch-manipulation"
          />
          <div className="flex justify-between text-xs sm:text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1 touch-manipulation"
          />
          <span className="text-xs sm:text-sm text-muted-foreground min-w-[2.5rem] sm:min-w-[3rem] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
