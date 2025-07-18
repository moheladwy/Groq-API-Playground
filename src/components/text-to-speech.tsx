import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Loader2, Languages } from "lucide-react";
import { useGroq } from "@/hooks/use-groq";
import { AudioPlayer } from "@/components/audio-player";
import type { Language, VoiceOptions, LanguageOption } from "@/types";

// Available voices for different languages
const voiceOptions: VoiceOptions = {
  arabic: [
    { id: "Nasser-PlayAI", name: "Nasser" },
    { id: "Khalid-PlayAI", name: "Khalid" },
    { id: "Amira-PlayAI", name: "Amira" },
    { id: "Ahmad-PlayAI", name: "Ahmad" },
  ],
  english: [
    { id: "Arista-PlayAI", name: "Arista" },
    { id: "Atlas-PlayAI", name: "Atlas" },
    { id: "Basil-PlayAI", name: "Basil" },
    { id: "Briggs-PlayAI", name: "Briggs" },
    { id: "Calum-PlayAI", name: "Calum" },
    { id: "Celeste-PlayAI", name: "Celeste" },
    { id: "Cheyenne-PlayAI", name: "Cheyenne" },
    { id: "Chip-PlayAI", name: "Chip" },
    { id: "Cillian-PlayAI", name: "Cillian" },
    { id: "Deedee-PlayAI", name: "Deedee" },
    { id: "Fritz-PlayAI", name: "Fritz" },
    { id: "Gail-PlayAI", name: "Gail" },
    { id: "Indigo-PlayAI", name: "Indigo" },
    { id: "Mamaw-PlayAI", name: "Mamaw" },
    { id: "Mason-PlayAI", name: "Mason" },
    { id: "Mikail-PlayAI", name: "Mikail" },
    { id: "Mitch-PlayAI", name: "Mitch" },
    { id: "Quinn-PlayAI", name: "Quinn" },
    { id: "Thunder-PlayAI", name: "Thunder" },
  ],
};

const languageOptions: LanguageOption[] = [
  { id: "arabic", name: "Arabic", code: "ar" },
  { id: "english", name: "English", code: "en" },
];

export function TextToSpeech() {
  const { groq, isLoading, hasApiKey } = useGroq();
  const [text, setText] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("arabic");
  const [selectedVoice, setSelectedVoice] = useState<string>(
    voiceOptions.arabic[0].id,
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update voice when language changes
  useEffect(() => {
    const availableVoices = voiceOptions[selectedLanguage];
    setSelectedVoice(availableVoices[0].id);
  }, [selectedLanguage]);

  const generateSpeech = async () => {
    if (!groq) {
      setError("Groq client not initialized. Please check your API key.");
      return;
    }

    if (!text.trim()) {
      setError("Please enter some text to convert to speech");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const model =
        selectedLanguage === "arabic" ? "playai-tts-arabic" : "playai-tts";

      const response = await groq.audio.speech.create({
        model: model,
        voice: selectedVoice,
        response_format: "wav",
        input: text,
      });

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error("Error generating speech:", err);
      setError(
        "Failed to generate speech. Please check your API key and try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const currentVoices = voiceOptions[selectedLanguage];
  const isRTL = selectedLanguage === "arabic";
  const placeholder =
    selectedLanguage === "arabic"
      ? "أدخل النص هنا ليتم تحويله إلى كلام..."
      : "Enter your text here to convert to speech...";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Convert your text to natural-sounding speech
        </h2>
        <p className="text-lg text-muted-foreground">
          Enter your text below and generate high-quality speech in multiple
          languages
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Text-to-Speech Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language-select">Select Language</Label>
            <Select
              value={selectedLanguage}
              onValueChange={(value: Language) => setSelectedLanguage(value)}
            >
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Choose a language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((language) => (
                  <SelectItem key={language.id} value={language.id}>
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      {language.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text-input">Enter Text</Label>
            <Textarea
              id="text-input"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`min-h-[120px] ${isRTL ? "text-right" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice-select">Select Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger id="voice-select">
                <SelectValue placeholder="Choose a voice" />
              </SelectTrigger>
              <SelectContent>
                {currentVoices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateSpeech}
            disabled={isGenerating || !text.trim() || isLoading || !hasApiKey}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Speech...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Speech
              </>
            )}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <AudioPlayer
              src={audioUrl}
              title={`speech-${selectedLanguage}-${selectedVoice}-${Date.now()}.wav`}
              onError={(error) => setError(error)}
            />
          )}

          {/* API Key Information */}
          {!hasApiKey && (
            <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded-md p-4">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                API Key Required:
              </h3>
              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <li>• You need a Groq API key to use this service</li>
                <li>
                  • Get your free API key from{" "}
                  <a
                    href="https://console.groq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    Groq Console
                  </a>
                </li>
                <li>• The API key will be stored securely in your browser</li>
                <li>• Check the sidebar for API key status</li>
              </ul>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 rounded-md p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Instructions:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>
                •{" "}
                {!hasApiKey
                  ? "First, set up your API key (see above)"
                  : "Select your preferred language from the dropdown"}
              </li>
              <li>• Enter text in the selected language</li>
              <li>• Choose from available voices for that language</li>
              <li>• Click "Generate Speech" to create the audio</li>
              <li>• Play the audio directly or download it as a WAV file</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
