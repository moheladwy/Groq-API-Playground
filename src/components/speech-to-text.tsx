import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Mic,
  StopCircle,
  Play,
  Pause,
  FileAudio,
  Loader2,
  X,
  Info,
  Languages,
  Zap,
  Target,
  DollarSign,
} from "lucide-react";
import Groq from "groq-sdk";
import { Textarea } from "@/components/ui/textarea";

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Model specifications
const models = [
  {
    id: "whisper-large-v3-turbo",
    name: "Whisper Large V3 Turbo",
    description:
      "A fine-tuned version of a pruned Whisper Large V3 designed for fast, multilingual transcription tasks.",
    languages: "Multilingual",
    costPerHour: "$0.04",
    realTimeSpeedFactor: "216x",
    wordErrorRate: "12%",
    transcription: true,
    translation: false,
    recommended: "Best price for performance with multilingual support",
    icon: Zap,
  },
  {
    id: "distil-whisper-large-v3-en",
    name: "Distil-Whisper English",
    description:
      "A distilled, or compressed, version of OpenAI's Whisper model, designed to provide faster, lower cost English speech recognition.",
    languages: "English-only",
    costPerHour: "$0.02",
    realTimeSpeedFactor: "250x",
    wordErrorRate: "13%",
    transcription: true,
    translation: false,
    recommended: "Fastest and cheapest for English-only applications",
    icon: DollarSign,
  },
  {
    id: "whisper-large-v3",
    name: "Whisper Large V3",
    description:
      "Provides state-of-the-art performance with high accuracy for multilingual transcription and translation tasks.",
    languages: "Multilingual",
    costPerHour: "$0.111",
    realTimeSpeedFactor: "189x",
    wordErrorRate: "10.3%",
    transcription: true,
    translation: true,
    recommended: "Most accurate for error-sensitive applications",
    icon: Target,
  },
];

// Language options (ISO-639-1 codes)
const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "no", name: "Norwegian" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "pl", name: "Polish" },
  { code: "cs", name: "Czech" },
];

// Supported file types
const supportedFormats = [
  "flac",
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "m4a",
  "ogg",
  "wav",
  "webm",
];
const maxFileSize = 25 * 1024 * 1024; // 25MB in bytes

export function SpeechToText() {
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("auto");
  const [file, setFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateFile = (file: File): string | null => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      return `Unsupported file format. Supported formats: ${supportedFormats.join(", ")}`;
    }

    if (file.size > maxFileSize) {
      return `File size exceeds 25MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setRecordedBlob(null);
    setError(null);
    setTranscriptionResult("");

    // Create audio URL for playback
    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // Convert blob to File object with proper filename
        const file = new File([blob], "recording.wav", { type: "audio/wav" });
        setRecordedBlob(file);
        setFile(null);
        setError(null);
        setTranscriptionResult("");

        // Create audio URL for playback
        const url = URL.createObjectURL(file);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setRecordedBlob(null);
    setTranscriptionResult("");
    setError(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const transcribeAudio = async () => {
    if (!file && !recordedBlob) {
      setError("Please select a file or record audio first.");
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      const audioFile = file || recordedBlob;
      if (!audioFile) {
        throw new Error("No audio file available");
      }

      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: selectedModel,
        language: selectedLanguage === "auto" ? undefined : selectedLanguage,
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
      });

      setTranscriptionResult(transcription.text);
    } catch (err) {
      console.error("Transcription error:", err);
      setError(
        "Failed to transcribe audio. Please check your API key and try again.",
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const selectedModelInfo = models.find((m) => m.id === selectedModel);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Speech to Text</h2>
        <p className="text-lg text-muted-foreground">
          Convert audio files to text with high accuracy using advanced AI
          models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main Content - Left/Middle Column */}
        <div className="lg:col-span-2 space-y-2">
          {/* Audio Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5" />
                Audio Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* File Upload */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Upload Audio File
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drag & drop your audio file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={supportedFormats.map((f) => `.${f}`).join(",")}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: {supportedFormats.join(", ")} • Max size:
                  25MB
                </p>
              </div>

              {/* Recording */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Record Audio
                </Label>
                <div className="flex items-center gap-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="flex items-center gap-2"
                    >
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <StopCircle className="h-4 w-4" />
                      Stop Recording ({formatTime(recordingTime)})
                    </Button>
                  )}
                </div>
              </div>

              {/* Selected File/Recording Display */}
              {(file || recordedBlob) && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileAudio className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">
                          {file ? file.name : "Recorded Audio"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {file
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : "Recording"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Audio Player */}
                  {audioUrl && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={playAudio}
                        className="flex items-center gap-2"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Transcribe Button */}
              <Button
                onClick={transcribeAudio}
                disabled={isTranscribing || (!file && !recordedBlob)}
                className="w-full"
                size="lg"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <FileAudio className="mr-2 h-4 w-4" />
                    Transcribe Audio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Transcription Result */}
          {transcriptionResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="h-5 w-5" />
                  Transcription Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcriptionResult}
                  readOnly
                  className="min-h-[200px] resize-none"
                  placeholder="Transcription will appear here..."
                />
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Transcribed using {selectedModelInfo?.name}
                    {selectedLanguage &&
                      selectedLanguage !== "auto" &&
                      ` (${languages.find((l) => l.code === selectedLanguage)?.name})`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2">
          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Model Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {models.map((model) => {
                  const Icon = model.icon;
                  return (
                    <div
                      key={model.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedModel === model.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {model.description}
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Languages:</span>
                          <span className="font-medium">{model.languages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost/Hour:</span>
                          <span className="font-medium">
                            {model.costPerHour}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span className="font-medium">
                            {model.realTimeSpeedFactor}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Error Rate:</span>
                          <span className="font-medium">
                            {model.wordErrorRate}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-primary font-medium">
                        {model.recommended}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Language Selection */}
              <div className="space-y-2 flex flex-row items-center text-center justify-between">
                <Label htmlFor="language-select">Language (Optional)</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder="Auto-detect language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  • Choose the model that best fits your needs (accuracy vs
                  speed vs cost)
                </p>
                <p>• Upload an audio file or record directly in your browser</p>
                <p>• Optionally specify the language for better accuracy</p>
                <p>• Supported formats: {supportedFormats.join(", ")}</p>
                <p>• Maximum file size: 25MB (free tier)</p>
                <p>
                  • For best results, use clear audio with minimal background
                  noise
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
