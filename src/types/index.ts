export type Language = "arabic" | "english";

export type LanguageOption = {
  id: Language;
  name: string;
  code: string;
};

export type Voice = {
  id: string;
  name: string;
};

export type VoiceOptions = {
  arabic: Voice[];
  english: Voice[];
};

export type AudioGenerationState = {
  isGenerating: boolean;
  isPlaying: boolean;
  audioUrl: string | null;
  error: string | null;
};

export type TextToSpeechFormData = {
  text: string;
  language: Language;
  voice: string;
};

export type NavigationItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
};

export type Theme = "dark" | "light" | "system";

export type GroqAudioRequest = {
  model: string;
  voice: string;
  response_format: "wav" | "mp3";
  input: string;
};

export type AudioPlaybackOptions = {
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
};

export type SpeechGenerationOptions = {
  language: Language;
  voice: string;
  model: string;
  responseFormat: "wav" | "mp3";
};

export type ApiError = {
  message: string;
  code?: string;
  details?: string;
};

export type HistoryItem = {
  id: string;
  text: string;
  language: Language;
  voice: string;
  audioUrl: string;
  createdAt: Date;
  duration?: number;
};

export type UserPreferences = {
  defaultLanguage: Language;
  defaultVoice: string;
  theme: Theme;
  autoplay: boolean;
  downloadFormat: "wav" | "mp3";
};

export type SpeechToTextModel = {
  id: string;
  name: string;
  description: string;
  languages: string;
  costPerHour: string;
  realTimeSpeedFactor: string;
  wordErrorRate: string;
  transcription: boolean;
  translation: boolean;
  recommended: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type TranscriptionRequest = {
  file: File | Blob;
  model: string;
  language?: string;
  prompt?: string;
  response_format?: "json" | "verbose_json" | "text";
  temperature?: number;
  timestamp_granularities?: ("word" | "segment")[];
};

export type TranscriptionResponse = {
  text: string;
  segments?: TranscriptionSegment[];
  language?: string;
  duration?: number;
};

export type TranscriptionSegment = {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
};

export type AudioFileInfo = {
  name: string;
  size: number;
  type: string;
  duration?: number;
  url: string;
};

export type RecordingState = {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
};

export type AudioTranscriptionState = {
  isTranscribing: boolean;
  transcriptionResult: string;
  selectedModel: string;
  selectedLanguage: string;
  audioFile: File | null;
  recordedBlob: Blob | null;
  error: string | null;
};

export type LanguageCode = {
  code: string;
  name: string;
};
