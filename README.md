# Groq API Playground

A comprehensive React-based web application that provides an intuitive interface for exploring and testing Groq's AI capabilities including text-to-speech, speech-to-text, and vision models.

![Groq API Playground](https://img.shields.io/badge/Groq-API%20Playground-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0+-purple?style=for-the-badge&logo=vite)

## 🚀 Features

### 🎙️ **Text-to-Speech**
- High-quality speech synthesis with natural-sounding voices
- Support for **Arabic** and **English** languages
- Multiple voice options for each language
- Real-time audio generation and playback
- Download generated audio as WAV files

### 🎧 **Speech-to-Text**
- Advanced speech recognition with multiple models
- Support for **99+ languages**
- Real-time audio recording and file upload
- Multiple accuracy/speed optimization options
- Support for various audio formats (MP3, WAV, M4A, etc.)

### 👁️ **Images and Vision**
- Advanced image analysis using Llama vision models
- Multi-image support (up to 5 images per analysis)
- Drag-and-drop image upload
- URL-based image analysis
- Detailed AI-powered image descriptions and insights

### 📚 **Voice Library**
- Comprehensive documentation of all available voices
- Voice characteristics and use case recommendations
- Language support overview
- Model specifications and pricing information

### 🔍 **Vision Library**
- Complete guide to vision models and capabilities
- Use case templates and examples
- Model comparison and feature matrix
- Best practices and implementation guides

### 🔧 **Centralized API Key Management**
- Automatic API key detection (environment, local storage, session storage)
- Interactive API key setup with validation
- Visual connection status indicators
- Secure local storage with format validation

## 🛠️ Technology Stack

- **Frontend Framework**: React 19+ with TypeScript
- **Build Tool**: Vite 7.0+
- **Styling**: Tailwind CSS 4.0+ with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM 7.0+
- **AI SDK**: Groq SDK for JavaScript
- **Icons**: Lucide React
- **Markdown**: React Markdown with syntax highlighting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- A Groq API key (get one from [Groq Console](https://console.groq.com))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/groq-api-playground.git
   cd groq-api-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration (Optional)**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
   
   > **Note**: If you don't set this, the app will prompt you to enter your API key via the UI.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
groq-client-api/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── text-to-speech.tsx
│   │   ├── speech-to-text.tsx
│   │   ├── images-and-vision.tsx
│   │   ├── voice-library.tsx
│   │   ├── vision-library.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── theme-provider.tsx
│   │   └── loading-screen.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── use-groq.tsx     # Centralized Groq API management
│   │   └── use-mobile.ts    # Mobile detection hook
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── router/              # Routing configuration
│   │   └── index.tsx
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── docs/                    # Documentation
│   └── useGroq-hook.md      # Custom hook documentation
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔐 API Key Management

The application uses a sophisticated API key management system through the `useGroq` hook:

### Key Features:
- **Automatic Detection**: Checks environment variables, local storage, and session storage
- **Interactive Setup**: User-friendly modal for API key entry
- **Validation**: Format validation and connection testing
- **Secure Storage**: Local browser storage with encryption
- **Visual Status**: Real-time connection status in the sidebar

### API Key Priority:
1. Environment variable (`VITE_GROQ_API_KEY`)
2. Local storage (`groq_api_key`)
3. Session storage (`groq_api_key`)
4. User input (modal dialog)

### Usage in Components:
```tsx
import { useGroq } from '@/hooks/use-groq';

function MyComponent() {
  const { groq, isLoading, hasApiKey, error } = useGroq();

  if (isLoading) return <LoadingSpinner />;
  if (!hasApiKey) return <ApiKeyPrompt />;
  
  // Use groq instance for API calls
  const response = await groq.chat.completions.create({...});
}
```

## 🎨 Available Features

### Text-to-Speech Models
- **PlayAI Arabic TTS**: Native Arabic voices with cultural context
- **PlayAI English TTS**: High-quality English voices with emotion support

### Speech-to-Text Models
- **Whisper Large V3**: Highest accuracy for error-sensitive applications
- **Whisper Large V3 Turbo**: Best price-performance with multilingual support
- **Distil-Whisper English**: Fastest and cheapest for English-only use

### Vision Models
- **Llama 4 Scout**: Complex visual analysis with multilingual support
- **Llama 4 Maverick**: Extended context for detailed image analysis

### Supported Languages
- **Text-to-Speech**: Arabic, English
- **Speech-to-Text**: 99+ languages including Arabic, English, Spanish, French, German, etc.
- **Vision**: Multilingual support with English and Arabic optimization

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (configure as needed)

### Adding New Features

1. **Create Component**: Add new components in `src/components/`
2. **Add Route**: Update `src/router/index.tsx`
3. **Update Sidebar**: Add navigation item in `src/components/app-sidebar.tsx`
4. **Use Groq Hook**: Import and use `useGroq` for API calls

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Mobile-optimized interface with sheet navigation

## 🎯 Usage Examples

### Text-to-Speech
```tsx
const { groq } = useGroq();

const generateSpeech = async (text: string, voice: string) => {
  const response = await groq.audio.speech.create({
    model: 'playai-tts-arabic',
    voice: voice,
    input: text,
    response_format: 'wav'
  });
  
  const audioBlob = await response.blob();
  // Handle audio playback
};
```

### Speech-to-Text
```tsx
const { groq } = useGroq();

const transcribeAudio = async (audioFile: File) => {
  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-large-v3-turbo',
    language: 'en'
  });
  
  return transcription.text;
};
```

### Vision Analysis
```tsx
const { groq } = useGroq();

const analyzeImage = async (imageUrl: string, prompt: string) => {
  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ]
  });
  
  return response.choices[0].message.content;
};
```

## 🔒 Security Considerations

- **API Key Storage**: Keys are stored in browser's local storage
- **Client-Side Usage**: Uses `dangerouslyAllowBrowser: true` for Groq SDK
- **Key Validation**: API keys are validated before storage
- **No Server Storage**: Keys never leave the client browser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component patterns
- Maintain responsive design principles
- Add proper error handling
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq**: For providing the powerful AI models and SDK
- **shadcn/ui**: For the beautiful UI component library
- **Radix UI**: For the accessible primitive components
- **Lucide**: For the comprehensive icon library
- **React Team**: For the amazing React framework

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions and ideas
- **Groq Console**: [https://console.groq.com](https://console.groq.com)

## 🔄 Changelog

### v1.0.0 (Latest)
- Initial release with full feature set
- Text-to-Speech with Arabic and English support
- Speech-to-Text with multilingual support
- Vision analysis with Llama models
- Comprehensive voice and vision libraries
- Centralized API key management
- Responsive design for all devices

---

**Built with ❤️ and powered by Groq's lightning-fast AI inference**