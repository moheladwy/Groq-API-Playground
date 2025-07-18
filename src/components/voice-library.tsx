import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Languages,
  Zap,
  Target,
  DollarSign,
  Globe,
  Speaker,
  Info,
  Star,
} from "lucide-react";

// Speech-to-Text Models
const speechToTextModels = [
  {
    id: "whisper-large-v3-turbo",
    name: "Whisper Large V3 Turbo",
    description:
      "A fine-tuned version of a pruned Whisper Large V3 designed for fast, multilingual transcription tasks.",
    type: "Speech-to-Text",
    languages: "Multilingual (99+ languages)",
    costPerHour: "$0.04",
    realTimeSpeedFactor: "216x",
    wordErrorRate: "12%",
    contextWindow: "30 seconds",
    features: [
      "Real-time transcription",
      "Multilingual support",
      "Fast inference",
      "Cost-effective",
    ],
    useCases: [
      "Live transcription",
      "Meeting notes",
      "Voice commands",
      "Content creation",
    ],
    strengths: ["Speed", "Cost efficiency", "Multi-language support"],
    limitations: ["Slightly higher error rate", "Limited context window"],
    recommended: "Best price for performance with multilingual support",
    icon: Zap,
    status: "Production",
    accuracy: "High",
    latency: "Ultra-low",
    supportedFormats: [
      "flac",
      "mp3",
      "mp4",
      "mpeg",
      "mpga",
      "m4a",
      "ogg",
      "wav",
      "webm",
    ],
    maxFileSize: "25MB",
    sampleRate: "16kHz recommended",
  },
  {
    id: "distil-whisper-large-v3-en",
    name: "Distil-Whisper English",
    description:
      "A distilled, or compressed, version of OpenAI's Whisper model, designed to provide faster, lower cost English speech recognition.",
    type: "Speech-to-Text",
    languages: "English only",
    costPerHour: "$0.02",
    realTimeSpeedFactor: "250x",
    wordErrorRate: "13%",
    contextWindow: "30 seconds",
    features: [
      "Ultra-fast inference",
      "English-optimized",
      "Lowest cost",
      "High accuracy",
    ],
    useCases: [
      "English podcasts",
      "Customer service",
      "Voice assistants",
      "Dictation",
    ],
    strengths: ["Fastest speed", "Lowest cost", "English optimization"],
    limitations: ["English only", "Slightly higher error rate"],
    recommended: "Fastest and cheapest for English-only applications",
    icon: DollarSign,
    status: "Production",
    accuracy: "High",
    latency: "Ultra-low",
    supportedFormats: [
      "flac",
      "mp3",
      "mp4",
      "mpeg",
      "mpga",
      "m4a",
      "ogg",
      "wav",
      "webm",
    ],
    maxFileSize: "25MB",
    sampleRate: "16kHz recommended",
  },
  {
    id: "whisper-large-v3",
    name: "Whisper Large V3",
    description:
      "Provides state-of-the-art performance with high accuracy for multilingual transcription and translation tasks.",
    type: "Speech-to-Text",
    languages: "Multilingual (99+ languages)",
    costPerHour: "$0.111",
    realTimeSpeedFactor: "189x",
    wordErrorRate: "10.3%",
    contextWindow: "30 seconds",
    features: [
      "Highest accuracy",
      "Translation support",
      "99+ languages",
      "Professional grade",
    ],
    useCases: [
      "Professional transcription",
      "Medical dictation",
      "Legal documentation",
      "Academic research",
    ],
    strengths: [
      "Highest accuracy",
      "Translation capabilities",
      "Professional quality",
    ],
    limitations: ["Higher cost", "Slower than turbo variants"],
    recommended: "Most accurate for error-sensitive applications",
    icon: Target,
    status: "Production",
    accuracy: "Highest",
    latency: "Low",
    supportedFormats: [
      "flac",
      "mp3",
      "mp4",
      "mpeg",
      "mpga",
      "m4a",
      "ogg",
      "wav",
      "webm",
    ],
    maxFileSize: "25MB",
    sampleRate: "16kHz recommended",
  },
];

// Text-to-Speech Models and Voices
const textToSpeechModels = [
  {
    id: "playai-tts-arabic",
    name: "PlayAI TTS Arabic",
    description:
      "Advanced Arabic text-to-speech model with natural-sounding voices and proper Arabic pronunciation.",
    type: "Text-to-Speech",
    languages: "Arabic",
    costPerRequest: "$0.002 per 1K characters",
    quality: "High fidelity",
    features: [
      "Natural Arabic pronunciation",
      "Emotion support",
      "SSML support",
      "Multiple voices",
    ],
    useCases: [
      "Arabic content creation",
      "E-learning",
      "Accessibility",
      "Voice assistants",
    ],
    strengths: [
      "Native Arabic support",
      "Natural pronunciation",
      "Cultural context",
    ],
    limitations: ["Arabic only", "Limited to Arabic script"],
    recommended: "Best for Arabic content with authentic pronunciation",
    icon: Languages,
    status: "Production",
    outputFormats: ["wav", "mp3"],
    sampleRate: "24kHz",
    voices: [
      {
        id: "Nasser-PlayAI",
        name: "Nasser",
        gender: "Male",
        age: "Adult",
        description:
          "Professional male Arabic voice with clear articulation and warm tone.",
        personality: "Professional, warm, trustworthy",
        useCases: [
          "News reading",
          "Business presentations",
          "Educational content",
        ],
        accent: "Modern Standard Arabic",
        sample: "مرحباً، أنا ناصر. أتحدث بوضوح وطلاقة باللغة العربية.",
      },
      {
        id: "Khalid-PlayAI",
        name: "Khalid",
        gender: "Male",
        age: "Adult",
        description:
          "Confident male Arabic voice with authoritative tone, perfect for formal content.",
        personality: "Confident, authoritative, clear",
        useCases: [
          "Corporate training",
          "Announcements",
          "Formal presentations",
        ],
        accent: "Modern Standard Arabic",
        sample: "السلام عليكم، أنا خالد. صوت واضح ومناسب للمحتوى الرسمي.",
      },
      {
        id: "Amira-PlayAI",
        name: "Amira",
        gender: "Female",
        age: "Adult",
        description:
          "Elegant female Arabic voice with gentle tone, ideal for storytelling and education.",
        personality: "Gentle, elegant, nurturing",
        useCases: [
          "Children's content",
          "Storytelling",
          "Educational materials",
        ],
        accent: "Modern Standard Arabic",
        sample: "مرحباً، أنا أميرة. صوت لطيف ومناسب للقصص والتعليم.",
      },
      {
        id: "Ahmad-PlayAI",
        name: "Ahmad",
        gender: "Male",
        age: "Adult",
        description:
          "Versatile male Arabic voice suitable for various content types.",
        personality: "Versatile, friendly, adaptable",
        useCases: ["General content", "Podcasts", "Voice assistants"],
        accent: "Modern Standard Arabic",
        sample: "أهلاً وسهلاً، أنا أحمد. صوت متنوع ومناسب لمختلف المحتويات.",
      },
    ],
  },
  {
    id: "playai-tts",
    name: "PlayAI TTS English",
    description:
      "High-quality English text-to-speech model with diverse voices and natural intonation.",
    type: "Text-to-Speech",
    languages: "English",
    costPerRequest: "$0.002 per 1K characters",
    quality: "High fidelity",
    features: [
      "Natural English voices",
      "Emotion control",
      "SSML support",
      "Wide voice selection",
    ],
    useCases: [
      "Content creation",
      "Audiobooks",
      "Voice-overs",
      "Accessibility",
    ],
    strengths: ["Voice variety", "Natural intonation", "Emotion support"],
    limitations: ["English only", "Higher cost for large volumes"],
    recommended: "Best for English content with diverse voice options",
    icon: Speaker,
    status: "Production",
    outputFormats: ["wav", "mp3"],
    sampleRate: "24kHz",
    voices: [
      {
        id: "Arista-PlayAI",
        name: "Arista",
        gender: "Female",
        age: "Adult",
        description:
          "Professional female voice with clear articulation and warm personality.",
        personality: "Professional, warm, confident",
        useCases: [
          "Business presentations",
          "Training materials",
          "Customer service",
        ],
        accent: "American English",
        sample:
          "Hello, I'm Arista. I speak with clarity and warmth for professional content.",
      },
      {
        id: "Atlas-PlayAI",
        name: "Atlas",
        gender: "Male",
        age: "Adult",
        description:
          "Strong male voice with authoritative tone, perfect for narration.",
        personality: "Strong, authoritative, reliable",
        useCases: ["Documentaries", "Audiobooks", "Corporate content"],
        accent: "American English",
        sample:
          "Greetings, I'm Atlas. My voice carries strength and authority for impactful narration.",
      },
      {
        id: "Basil-PlayAI",
        name: "Basil",
        gender: "Male",
        age: "Adult",
        description:
          "Sophisticated male voice with British accent, ideal for educational content.",
        personality: "Sophisticated, intellectual, refined",
        useCases: [
          "Educational content",
          "Lectures",
          "Historical documentaries",
        ],
        accent: "British English",
        sample:
          "Good day, I'm Basil. I bring sophistication and intellect to educational material.",
      },
      {
        id: "Briggs-PlayAI",
        name: "Briggs",
        gender: "Male",
        age: "Adult",
        description:
          "Friendly male voice with approachable tone, great for casual content.",
        personality: "Friendly, approachable, casual",
        useCases: ["Podcasts", "Casual content", "Social media"],
        accent: "American English",
        sample:
          "Hey there, I'm Briggs. I keep things friendly and approachable for everyday content.",
      },
      {
        id: "Calum-PlayAI",
        name: "Calum",
        gender: "Male",
        age: "Adult",
        description:
          "Versatile male voice suitable for various content types and moods.",
        personality: "Versatile, adaptable, neutral",
        useCases: ["General content", "Voice assistants", "Announcements"],
        accent: "American English",
        sample:
          "Hello, I'm Calum. I adapt to different content needs with versatility.",
      },
      {
        id: "Celeste-PlayAI",
        name: "Celeste",
        gender: "Female",
        age: "Adult",
        description:
          "Elegant female voice with soothing tone, perfect for relaxation content.",
        personality: "Elegant, soothing, calm",
        useCases: ["Meditation", "Relaxation", "Wellness content"],
        accent: "American English",
        sample:
          "Hello, I'm Celeste. My voice brings calm and elegance to wellness content.",
      },
      // Add more voices with detailed information...
    ],
  },
];

const languageSupport = [
  { code: "ar", name: "Arabic", models: ["playai-tts-arabic"], voices: 4 },
  {
    code: "en",
    name: "English",
    models: ["playai-tts", "distil-whisper-large-v3-en"],
    voices: 15,
  },
  {
    code: "es",
    name: "Spanish",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "fr",
    name: "French",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "de",
    name: "German",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "it",
    name: "Italian",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "pt",
    name: "Portuguese",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "ru",
    name: "Russian",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "ja",
    name: "Japanese",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "ko",
    name: "Korean",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "zh",
    name: "Chinese",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
  {
    code: "hi",
    name: "Hindi",
    models: ["whisper-large-v3-turbo", "whisper-large-v3"],
    voices: 0,
  },
];

export function VoiceLibrary() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  const allModels = [...speechToTextModels, ...textToSpeechModels];

  const ModelCard = ({ model }: { model: any }) => {
    const Icon = model.icon;
    const isSelected = selectedModel === model.id;

    return (
      <Card
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
        }`}
        onClick={() => setSelectedModel(isSelected ? null : model.id)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <span>{model.name}</span>
            <Badge variant="outline" className="ml-auto">
              {model.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{model.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-primary">Type</p>
              <p className="text-muted-foreground">{model.type}</p>
            </div>
            <div>
              <p className="font-medium text-primary">Languages</p>
              <p className="text-muted-foreground">{model.languages}</p>
            </div>
            <div>
              <p className="font-medium text-primary">Cost</p>
              <p className="text-muted-foreground">
                {model.costPerHour || model.costPerRequest}
              </p>
            </div>
            <div>
              <p className="font-medium text-primary">Quality</p>
              <p className="text-muted-foreground">
                {model.accuracy || model.quality}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {model.features.map((feature: string) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>

          <div className="text-xs text-primary font-medium bg-primary/10 p-2 rounded">
            {model.recommended}
          </div>

          {isSelected && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-primary mb-2">Strengths</p>
                  <ul className="text-sm space-y-1">
                    {model.strengths.map((strength: string) => (
                      <li key={strength} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-green-500" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-primary mb-2">Limitations</p>
                  <ul className="text-sm space-y-1">
                    {model.limitations.map((limitation: string) => (
                      <li key={limitation} className="flex items-center gap-2">
                        <Info className="h-3 w-3 text-orange-500" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="font-medium text-primary mb-2">Use Cases</p>
                <div className="flex flex-wrap gap-2">
                  {model.useCases.map((useCase: string) => (
                    <Badge key={useCase} variant="outline" className="text-xs">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>

              {model.voices && (
                <div>
                  <p className="font-medium text-primary mb-2">
                    Available Voices ({model.voices.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {model.voices.map((voice: any) => (
                      <div
                        key={voice.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedVoice === voice.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() =>
                          setSelectedVoice(
                            selectedVoice === voice.id ? null : voice.id,
                          )
                        }
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{voice.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {voice.gender}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {voice.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-primary font-medium">
                            Accent:
                          </span>
                          <span>{voice.accent}</span>
                        </div>
                        {selectedVoice === voice.id && (
                          <div className="mt-3 space-y-2 animate-in fade-in-0">
                            <div className="text-xs">
                              <span className="text-primary font-medium">
                                Personality:
                              </span>
                              <span className="ml-1">{voice.personality}</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-primary font-medium">
                                Sample:
                              </span>
                              <p className="mt-1 p-2 bg-muted rounded text-sm italic">
                                "{voice.sample}"
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {voice.useCases.map((useCase: string) => (
                                <Badge
                                  key={useCase}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {useCase}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Voice Library</h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to all speech-to-text and text-to-speech models
          with detailed voice information
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="speech-to-text">Speech-to-Text</TabsTrigger>
          <TabsTrigger value="text-to-speech">Text-to-Speech</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="speech-to-text" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {speechToTextModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="text-to-speech" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {textToSpeechModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Language Support Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language Support Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languageSupport.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{lang.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lang.models.length} models • {lang.voices} voices
                  </p>
                </div>
                <Badge variant="outline">{lang.code}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
