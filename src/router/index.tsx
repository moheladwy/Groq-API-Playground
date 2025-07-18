import React from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { TextToSpeech } from "@/components/text-to-speech";
import { SpeechToText } from "@/components/speech-to-text";
import { ImagesAndVision } from "@/components/images-and-vision";
import { VoiceLibrary } from "@/components/voice-library";
import { VisionLibrary } from "@/components/vision-library";
import App from "@/App";

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
        path: "images-and-vision",
        element: <ImagesAndVision />,
      },
      {
        path: "voice-library",
        element: <VoiceLibrary />,
      },
      {
        path: "vision-library",
        element: <VisionLibrary />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
