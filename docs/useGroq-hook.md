# useGroq Hook Documentation

## Overview

The `useGroq` hook is a custom React hook that provides centralized Groq API key management and a single Groq SDK instance for the entire application. It handles API key validation, storage, and provides a user-friendly interface for API key setup.

## Features

- **Automatic API Key Detection**: Checks environment variables, local storage, and session storage
- **Interactive API Key Setup**: Shows a modal dialog when no API key is found
- **API Key Validation**: Validates the API key format and tests the connection
- **Centralized Instance**: Provides a single Groq instance to prevent multiple initializations
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Storage Management**: Handles API key storage in local storage
- **Loading States**: Provides loading states for better UX

## Installation & Setup

### 1. Wrap your app with GroqProvider

```tsx
import { GroqProvider } from '@/hooks/use-groq';

function App() {
  return (
    <GroqProvider>
      {/* Your app components */}
    </GroqProvider>
  );
}
```

### 2. Use the hook in your components

```tsx
import { useGroq } from '@/hooks/use-groq';

function MyComponent() {
  const { groq, isLoading, hasApiKey, error } = useGroq();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasApiKey) {
    return <div>Please set up your API key</div>;
  }

  // Use the groq instance
  const handleApiCall = async () => {
    try {
      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: 'Hello!' }],
      });
      console.log(response);
    } catch (err) {
      console.error('API call failed:', err);
    }
  };

  return (
    <button onClick={handleApiCall}>
      Make API Call
    </button>
  );
}
```

## API Reference

### GroqContextType

```typescript
interface GroqContextType {
  groq: Groq | null;           // The Groq SDK instance
  isLoading: boolean;          // Loading state during initialization
  error: string | null;        // Error message if any
  hasApiKey: boolean;          // Whether a valid API key exists
  clearApiKey: () => void;     // Function to clear the stored API key
  retryConnection: () => void; // Function to retry the connection
}
```

### Properties

#### `groq`
- **Type**: `Groq | null`
- **Description**: The initialized Groq SDK instance. Will be `null` if no API key is available or during loading.

#### `isLoading`
- **Type**: `boolean`
- **Description**: Indicates whether the hook is currently initializing or validating the API key.

#### `error`
- **Type**: `string | null`
- **Description**: Contains error messages if initialization fails. Will be `null` if no errors.

#### `hasApiKey`
- **Type**: `boolean`
- **Description**: Indicates whether a valid API key is available and the Groq instance is ready to use.

#### `clearApiKey`
- **Type**: `() => void`
- **Description**: Function to clear the stored API key from local storage and reset the state.

#### `retryConnection`
- **Type**: `() => void`
- **Description**: Function to retry the API key initialization process.

## API Key Priority

The hook checks for API keys in the following order:

1. **Environment Variables**: `VITE_GROQ_API_KEY`
2. **Local Storage**: `groq_api_key`
3. **Session Storage**: `groq_api_key`
4. **User Input**: Shows modal dialog if none found

## API Key Validation

The hook validates API keys by:

1. **Format Check**: Ensures the key starts with "gsk_" and has sufficient length
2. **Connection Test**: Makes a test API call to verify the key works
3. **Error Handling**: Provides specific error messages for different failure types

## Error Handling

The hook handles various error scenarios:

- **Invalid API Key Format**: Keys that don't match the expected format
- **Authentication Errors**: Invalid or expired API keys
- **Network Errors**: Connection issues
- **Rate Limiting**: Too many requests
- **Permission Errors**: Insufficient API key permissions

## Usage Examples

### Basic Usage

```tsx
function TextToSpeech() {
  const { groq, isLoading, hasApiKey, error } = useGroq();

  const generateSpeech = async (text: string) => {
    if (!groq) {
      console.error('Groq instance not available');
      return;
    }

    try {
      const response = await groq.audio.speech.create({
        model: 'playai-tts',
        voice: 'Arista-PlayAI',
        input: text,
      });

      // Handle the response
      const audioBlob = await response.blob();
      // ... process audio
    } catch (err) {
      console.error('Speech generation failed:', err);
    }
  };

  if (isLoading) {
    return <div>Initializing...</div>;
  }

  if (!hasApiKey) {
    return <div>Please configure your API key</div>;
  }

  return (
    <div>
      <button onClick={() => generateSpeech('Hello World')}>
        Generate Speech
      </button>
    </div>
  );
}
```

### With Error Handling

```tsx
function ImageAnalysis() {
  const { groq, isLoading, hasApiKey, error, retryConnection } = useGroq();

  const analyzeImage = async (imageUrl: string) => {
    if (!groq) {
      alert('Groq instance not available');
      return;
    }

    try {
      const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this image' },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ]
      });

      console.log(response.choices[0].message.content);
    } catch (err) {
      console.error('Image analysis failed:', err);
    }
  };

  if (isLoading) {
    return <div>Loading Groq client...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={retryConnection}>Retry</button>
      </div>
    );
  }

  if (!hasApiKey) {
    return <div>API key required. Please set up your Groq API key.</div>;
  }

  return (
    <div>
      <button onClick={() => analyzeImage('https://example.com/image.jpg')}>
        Analyze Image
      </button>
    </div>
  );
}
```

### API Key Management

```tsx
function Settings() {
  const { hasApiKey, clearApiKey, error } = useGroq();

  return (
    <div>
      <h2>API Key Settings</h2>
      
      {hasApiKey ? (
        <div>
          <p>✅ API Key is configured</p>
          <button onClick={clearApiKey}>Clear API Key</button>
        </div>
      ) : (
        <div>
          <p>❌ No API Key configured</p>
          <p>Please set up your API key to use Groq services</p>
        </div>
      )}

      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Always Check for Groq Instance

```tsx
const { groq } = useGroq();

const makeApiCall = async () => {
  if (!groq) {
    console.error('Groq instance not available');
    return;
  }
  
  // Make API call
};
```

### 2. Handle Loading States

```tsx
const { groq, isLoading, hasApiKey } = useGroq();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!hasApiKey) {
  return <ApiKeySetupPrompt />;
}
```

### 3. Implement Error Boundaries

```tsx
function MyComponent() {
  const { groq, error, retryConnection } = useGroq();

  if (error) {
    return (
      <ErrorBoundary>
        <div>
          <p>Failed to initialize Groq: {error}</p>
          <button onClick={retryConnection}>Retry</button>
        </div>
      </ErrorBoundary>
    );
  }

  // Rest of component
}
```

### 4. Use Proper TypeScript Types

```tsx
import { useGroq } from '@/hooks/use-groq';
import type { ChatCompletionCreateParams } from 'groq-sdk';

const { groq } = useGroq();

const params: ChatCompletionCreateParams = {
  model: 'mixtral-8x7b-32768',
  messages: [{ role: 'user', content: 'Hello' }],
};
```

## Security Considerations

1. **API Key Storage**: Keys are stored in browser's local storage
2. **Client-Side Usage**: The hook uses `dangerouslyAllowBrowser: true`
3. **Key Validation**: Keys are validated before storage
4. **No Server-Side Storage**: Keys are never sent to your server

## Troubleshooting

### Common Issues

1. **"Groq instance not available"**
   - Check if API key is properly configured
   - Verify the key format (should start with "gsk_")
   - Check network connectivity

2. **"Invalid API key format"**
   - Ensure the key starts with "gsk_"
   - Verify the key is complete (not truncated)

3. **"Failed to validate API key"**
   - Check if the key is active in Groq Console
   - Verify API key permissions
   - Check rate limits

4. **Modal not appearing**
   - Ensure GroqProvider wraps your app
   - Check browser console for errors
   - Verify the hook is used within the provider

### Getting Help

1. Check the browser console for detailed error messages
2. Verify your API key in [Groq Console](https://console.groq.com)
3. Use the retry mechanism for transient errors
4. Clear and re-enter your API key if issues persist

## Migration from Direct Groq Usage

If you're migrating from direct Groq SDK usage:

**Before:**
```tsx
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});
```

**After:**
```tsx
import { useGroq } from '@/hooks/use-groq';

const { groq } = useGroq();
```

This provides better error handling, centralized key management, and improved user experience.