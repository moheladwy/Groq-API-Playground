import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import Groq from "groq-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Key, Lock, RefreshCw } from "lucide-react";

// Types
interface GroqContextType {
  groq: Groq | null;
  isLoading: boolean;
  error: string | null;
  hasApiKey: boolean;
  clearApiKey: () => void;
  retryConnection: () => void;
}

// Context
const GroqContext = createContext<GroqContextType | undefined>(undefined);

// Provider component
export function GroqProvider({ children }: { children: ReactNode }) {
  const [groq, setGroq] = useState<Groq | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkForApiKey = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Check environment variables first
      const envApiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (envApiKey) {
        createGroqInstance(envApiKey);
        return;
      }

      // 2. Check local storage
      const storedApiKey = localStorage.getItem("groq_api_key");
      if (storedApiKey) {
        createGroqInstance(storedApiKey);
        return;
      }

      // 3. Check session storage
      const sessionApiKey = sessionStorage.getItem("groq_api_key");
      if (sessionApiKey) {
        createGroqInstance(sessionApiKey);
        return;
      }

      // 4. No API key found, show modal
      setShowModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to initialize Groq client:", error);
      setError("Failed to initialize Groq client");
      setIsLoading(false);
    }
  }, []);

  // Check for API key on mount
  useEffect(() => {
    checkForApiKey();
  }, [checkForApiKey]);

  const createGroqInstance = (apiKey: string) => {
    try {
      const groqInstance = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
      setGroq(groqInstance);
      setHasApiKey(true);
      setIsLoading(false);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create Groq instance:", error);
      setError("Failed to create Groq instance");
      setIsLoading(false);
    }
  };

  const validateApiKeyFormat = (apiKey: string): boolean => {
    // Basic validation for Groq API key format
    return apiKey.startsWith("gsk_") && apiKey.length > 20;
  };

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setError("Please enter a valid API key");
      return;
    }

    if (!validateApiKeyFormat(trimmedKey)) {
      setError(
        'Invalid API key format. Groq API keys should start with "gsk_"',
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Test the API key by creating a simple instance
      const testGroq = new Groq({
        apiKey: trimmedKey,
        dangerouslyAllowBrowser: true,
      });

      // Test the connection with a simple request
      await testGroq.models.list();

      // Store in local storage
      localStorage.setItem("groq_api_key", trimmedKey);

      // Create the actual instance
      createGroqInstance(trimmedKey);
      setApiKeyInput("");
      setRetryCount(0);
    } catch (err: unknown) {
      console.error("API key validation error:", err);

      let errorMessage = "Failed to validate API key. Please try again.";

      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      setRetryCount((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "message" in err) {
      const message = (err as { message: string }).message;

      if (message.includes("401") || message.includes("Unauthorized")) {
        return "Invalid API key. Please check your key and try again.";
      } else if (message.includes("403") || message.includes("Forbidden")) {
        return "API key lacks necessary permissions. Please check your key.";
      } else if (message.includes("429")) {
        return "Rate limit exceeded. Please wait a moment and try again.";
      } else if (
        message.includes("Network Error") ||
        message.includes("fetch")
      ) {
        return "Network error. Please check your connection and try again.";
      }
    }

    return "Failed to validate API key. Please try again.";
  };

  const clearApiKey = () => {
    localStorage.removeItem("groq_api_key");
    sessionStorage.removeItem("groq_api_key");
    setGroq(null);
    setHasApiKey(false);
    setShowModal(true);
    setApiKeyInput("");
    setError(null);
    setRetryCount(0);
  };

  const retryConnection = () => {
    setError(null);
    setRetryCount(0);
    checkForApiKey();
  };

  const contextValue: GroqContextType = {
    groq,
    isLoading,
    error,
    hasApiKey,
    clearApiKey,
    retryConnection,
  };

  return (
    <GroqContext.Provider value={contextValue}>
      {children}

      {/* API Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Enter Groq API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter your Groq API key"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                    {retryCount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Attempt {retryCount + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setError(null)}
                          className="h-6 px-2 text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !apiKeyInput.trim()}
                    className="w-full"
                  >
                    {isSubmitting
                      ? "Validating API Key..."
                      : "Save & Validate API Key"}
                  </Button>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Your API key will be stored locally in your browser</p>
                    <p>
                      • Get your API key from{" "}
                      <a
                        href="https://console.groq.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Groq Console
                      </a>
                    </p>
                    <p>• API keys should start with "gsk_"</p>
                    <p>• The key will be validated before saving</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </GroqContext.Provider>
  );
}

// Custom hook
export function useGroq(): GroqContextType {
  const context = useContext(GroqContext);
  if (context === undefined) {
    throw new Error("useGroq must be used within a GroqProvider");
  }
  return context;
}
