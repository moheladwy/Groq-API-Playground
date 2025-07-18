# Arabic Text-to-Speech App

A modern React application that converts Arabic text to natural-sounding speech using the Groq API and PlayAI TTS models.

## Features

- 🎤 **Multiple Arabic Voices**: Choose from 4 different Arabic voices (Nasser, Khalid, Amira, Ahmad)
- 🔊 **Real-time Playback**: Play generated audio directly in the browser
- 📥 **Download Audio**: Save generated speech as WAV files
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🌐 **RTL Support**: Proper right-to-left text direction for Arabic content

## Prerequisites

- Node.js 18+ installed
- A Groq API key (get one from [console.groq.com](https://console.groq.com/keys))

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   cd groq-client-api
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_actual_groq_api_key_here
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to use the app.

## Usage

1. **Enter Text**: Type or paste Arabic text into the text area
2. **Select Voice**: Choose from the available Arabic voices:
   - Nasser-PlayAI
   - Khalid-PlayAI
   - Amira-PlayAI
   - Ahmad-PlayAI
3. **Generate Speech**: Click "Generate Speech" to create the audio
4. **Play or Download**: Use the play button to listen or download the WAV file

## Available Voices

| Voice ID | Name | Description |
|----------|------|-------------|
| Nasser-PlayAI | Nasser | Male Arabic voice |
| Khalid-PlayAI | Khalid | Male Arabic voice |
| Amira-PlayAI | Amira | Female Arabic voice |
| Ahmad-PlayAI | Ahmad | Male Arabic voice |

## Technical Details

- **Frontend**: React 19 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **TTS API**: Groq SDK with PlayAI Arabic TTS model
- **Audio Format**: WAV (Web Audio API compatible)
- **Build Tool**: Vite

## API Integration

The app uses the Groq API with the following configuration:

```typescript
const response = await groq.audio.speech.create({
  model: "playai-tts-arabic",
  voice: selectedVoice,
  response_format: "wav",
  input: text,
});
```

## Security Notes

- ⚠️ **API Key Security**: The app uses `dangerouslyAllowBrowser: true` for demo purposes
- 🔐 **Production Use**: For production, implement a backend proxy to protect your API key
- 🌍 **Environment**: Keep your `.env` file private and never commit it to version control

## Troubleshooting

### Common Issues

1. **"Failed to generate speech"**
   - Check your Groq API key in the `.env` file
   - Ensure you have sufficient API credits
   - Verify internet connection

2. **Audio not playing**
   - Check browser audio permissions
   - Try a different browser
   - Ensure audio is not muted

3. **Empty dropdown**
   - The voice list is hardcoded in the app
   - Check if the component is rendering properly

### Browser Compatibility

- Chrome 88+
- Firefox 84+
- Safari 14+
- Edge 88+

## Development

### Project Structure

```
src/
├── components/ui/     # shadcn/ui components
├── lib/              # Utility functions
├── App.tsx           # Main application component
├── main.tsx          # React entry point
└── index.css         # Global styles
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

This project is for educational/demo purposes. Please respect the Groq API terms of service.

## Contributing

Feel free to submit issues and enhancement requests!