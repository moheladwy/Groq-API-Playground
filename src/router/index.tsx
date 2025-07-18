import React from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { TextToSpeech } from "@/components/text-to-speech";
import { SpeechToText } from "@/components/speech-to-text";
import App from "@/App";

// Placeholder components for other routes
const History: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">History</h2>
      <p className="text-lg text-muted-foreground">
        Your speech generation history will appear here
      </p>
    </div>
  </div>
);

const VoiceLibrary: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">Voice Library</h2>
      <p className="text-lg text-muted-foreground">
        Explore available voices and their samples
      </p>
    </div>
  </div>
);

const Settings: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">Settings</h2>
      <p className="text-lg text-muted-foreground">
        Configure your preferences and API settings
      </p>
    </div>
  </div>
);

const HelpCenter: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">Help Center</h2>
      <p className="text-lg text-muted-foreground">
        Find answers to common questions and support
      </p>
    </div>
  </div>
);

const UpgradePlan: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-2">Upgrade Plan</h2>
      <p className="text-lg text-muted-foreground">
        Choose a plan that fits your needs
      </p>
    </div>
  </div>
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <TextToSpeech />,
      },
      {
        path: "text-to-speech",
        element: <TextToSpeech />,
      },
      {
        path: "speech-to-text",
        element: <SpeechToText />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "voice-library",
        element: <VoiceLibrary />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "help",
        element: <HelpCenter />,
      },
      {
        path: "upgrade",
        element: <UpgradePlan />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
