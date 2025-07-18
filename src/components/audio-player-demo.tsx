import { useState } from "react";
import { AudioPlayer } from "@/components/audio-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Music,
  Mic,
  Globe,
  Upload,
  PlayCircle,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

export function AudioPlayerDemo() {
  const [customAudioUrl, setCustomAudioUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample audio files (you can replace these with actual audio URLs)
  const sampleAudios = [
    {
      id: "sample1",
      title: "Classical Piano",
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      description: "Short classical piano piece for testing",
      category: "Music",
    },
    {
      id: "sample2",
      title: "Nature Sounds",
      src: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
      description: "Relaxing nature sounds and birds chirping",
      category: "Ambient",
    },
    {
      id: "sample3",
      title: "Podcast Sample",
      src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      description: "Sample podcast episode excerpt",
      category: "Speech",
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        setErrors(prev => ({
          ...prev,
          upload: 'Please select a valid audio file'
        }));
        return;
      }

      // Clear previous errors
      setErrors(prev => ({ ...prev, upload: '' }));

      // Create object URL for the file
      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setUploadedFileUrl(url);
    }
  };

  const handleLoadStart = (id: string) => {
    setLoadingStatus(prev => ({ ...prev, [id]: true }));
  };

  const handleLoadEnd = (id: string) => {
    setLoadingStatus(prev => ({ ...prev, [id]: false }));
  };

  const handleError = (id: string, error: string) => {
    setErrors(prev => ({ ...prev, [id]: error }));
    setLoadingStatus(prev => ({ ...prev, [id]: false }));
  };

  const addCustomAudio = () => {
    if (!customAudioUrl.trim()) return;

    try {
      new URL(customAudioUrl);
      // URL is valid, you can add it to a state or directly use it
    } catch {
      setErrors(prev => ({ ...prev, custom: 'Please enter a valid URL' }));
      return;
    }

    setErrors(prev => ({ ...prev, custom: '' }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <PlayCircle className="h-10 w-10 text-primary" />
          Audio Player Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive audio management component with play/pause/stop controls,
          progress tracking, volume control, and download functionality.
        </p>
      </div>

      <Tabs defaultValue="samples" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="samples">Sample Audio</TabsTrigger>
          <TabsTrigger value="custom">Custom URL</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Sample Audio Files */}
        <TabsContent value="samples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Sample Audio Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Try out the audio player with these sample audio files. Each demonstrates
                different aspects of the player functionality.
              </p>

              <div className="space-y-8">
                {sampleAudios.map((audio) => (
                  <div key={audio.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{audio.category}</Badge>
                        <div>
                          <h3 className="font-semibold">{audio.title}</h3>
                          <p className="text-sm text-muted-foreground">{audio.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {loadingStatus[audio.id] && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Info className="h-3 w-3" />
                            Loading...
                          </div>
                        )}
                        {errors[audio.id] && (
                          <div className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            Error
                          </div>
                        )}
                      </div>
                    </div>

                    <AudioPlayer
                      src={audio.src}
                      title={audio.title}
                      onLoadStart={() => handleLoadStart(audio.id)}
                      onLoadEnd={() => handleLoadEnd(audio.id)}
                      onError={(error) => handleError(audio.id, error)}
                    />

                    {audio.id !== sampleAudios[sampleAudios.length - 1].id && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom URL */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Custom Audio URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Enter a URL to any audio file to test the player with your own content.
              </p>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="audio-url">Audio URL</Label>
                  <Input
                    id="audio-url"
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={customAudioUrl}
                    onChange={(e) => setCustomAudioUrl(e.target.value)}
                  />
                  {errors.custom && (
                    <p className="text-sm text-destructive">{errors.custom}</p>
                  )}
                </div>
                <Button
                  onClick={addCustomAudio}
                  className="mt-8"
                  disabled={!customAudioUrl.trim()}
                >
                  Load Audio
                </Button>
              </div>

              {customAudioUrl && !errors.custom && (
                <div className="mt-6">
                  <AudioPlayer
                    src={customAudioUrl}
                    title="Custom Audio"
                    onLoadStart={() => handleLoadStart('custom')}
                    onLoadEnd={() => handleLoadEnd('custom')}
                    onError={(error) => handleError('custom', error)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Upload */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Audio File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Upload an audio file from your device to test the player.
              </p>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Audio File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                />
                {errors.upload && (
                  <p className="text-sm text-destructive">{errors.upload}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Supported formats: MP3, WAV, OGG, M4A, and more
                </p>
              </div>

              {uploadedFileUrl && uploadedFile && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">File uploaded successfully: {uploadedFile.name}</span>
                  </div>
                  <AudioPlayer
                    src={uploadedFileUrl}
                    title={uploadedFile.name}
                    onLoadStart={() => handleLoadStart('upload')}
                    onLoadEnd={() => handleLoadEnd('upload')}
                    onError={(error) => handleError('upload', error)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Playback Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Play/Pause toggle with loading states
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Stop button to reset to beginning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Keyboard shortcuts support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Auto-pause when audio ends
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Audio Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Interactive progress bar with scrubbing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Volume control slider
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Time display (current/total)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time progress updates
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  File Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Download button for audio files
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Support for various audio formats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    URL and file upload support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Automatic file naming for downloads
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error Handling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Graceful error handling and display
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Loading states and indicators
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    File format validation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Network error recovery
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm text-muted-foreground">
{`import { AudioPlayer } from "@/components/audio-player";

function MyComponent() {
  return (
    <AudioPlayer
      src="https://example.com/audio.mp3"
      title="My Audio Track"
      onLoadStart={() => console.log("Loading started")}
      onLoadEnd={() => console.log("Loading finished")}
      onError={(error) => console.error("Error:", error)}
    />
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
