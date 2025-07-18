import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Info,
  Eye,
  Sparkles,
  Target,
  Copy,
  Download,
  Trash2,
  Plus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGroq } from "@/hooks/use-groq";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

// Vision models
const visionModels = [
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout",
    description:
      "A powerful multimodal model capable of processing both text and image inputs with multilingual support, tool use, and JSON mode.",
    contextWindow: "128K tokens",
    maxImages: 5,
    maxImageSize: "20MB (URL) / 4MB (base64)",
    maxResolution: "33 megapixels",
    features: [
      "Multi-turn conversations",
      "Tool use",
      "JSON mode",
      "Multilingual",
    ],
    recommended: "Best for complex visual analysis and reasoning tasks",
    icon: Sparkles,
    status: "Preview",
  },
  {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "Llama 4 Maverick",
    description:
      "Advanced multimodal model with extended context window for complex image analysis and detailed visual understanding.",
    contextWindow: "128K tokens",
    maxImages: 5,
    maxImageSize: "20MB (URL) / 4MB (base64)",
    maxResolution: "33 megapixels",
    features: [
      "Extended context",
      "Multi-turn conversations",
      "Tool use",
      "JSON mode",
    ],
    recommended: "Ideal for detailed image analysis and extended conversations",
    icon: Target,
    status: "Preview",
  },
];

// Default prompts
const defaultSystemPrompt = `You are a helpful AI assistant with advanced vision capabilities. You can analyze images and provide detailed, accurate descriptions and insights. When analyzing images, consider:

- Objects, people, animals, and their relationships
- Colors, lighting, and composition
- Text or signage present in the image
- Emotions, actions, and context
- Artistic elements and style

Provide clear, comprehensive responses while being concise and relevant to the user's specific questions.`;

const defaultUserPrompt =
  "What do you see in this image? Please provide a detailed description.";

interface UploadedImage {
  id: string;
  file?: File;
  url: string;
  base64?: string;
  imageUrl?: string;
  name: string;
  size?: number;
  type: "upload" | "url";
}

interface DetailedError {
  message: string;
  code?: string;
  details?: string;
  statusCode?: number;
  timestamp: string;
}

export function ImagesAndVision() {
  const { groq, isLoading, hasApiKey } = useGroq();
  const [selectedModel, setSelectedModel] = useState(visionModels[0].id);
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [userPrompt, setUserPrompt] = useState(defaultUserPrompt);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<DetailedError | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Validate image file
  const validateImage = (file: File): string | null => {
    const maxSize = 4 * 1024 * 1024; // 4MB for base64
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file type. Please use JPEG, PNG, GIF, or WebP.";
    }

    if (file.size > maxSize) {
      return `File size exceeds 4MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null;
  };

  // Create detailed error
  const createDetailedError = (
    message: string,
    code?: string,
    details?: string,
    statusCode?: number,
  ): DetailedError => {
    return {
      message,
      code,
      details,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  };

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const currentImages = images.length;
      const maxImages = 5;

      if (currentImages + fileArray.length > maxImages) {
        setError(
          createDetailedError(
            `Maximum ${maxImages} images allowed. You can upload ${maxImages - currentImages} more.`,
            "FILE_LIMIT_EXCEEDED",
            `Current images: ${currentImages}, Attempting to add: ${fileArray.length}, Maximum allowed: ${maxImages}`,
          ),
        );
        return;
      }

      const newImages: UploadedImage[] = [];

      for (const file of fileArray) {
        const validationError = validateImage(file);
        if (validationError) {
          setError(
            createDetailedError(
              validationError,
              "VALIDATION_ERROR",
              `File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`,
            ),
          );
          continue;
        }

        try {
          const base64 = await fileToBase64(file);
          const imageUrl = URL.createObjectURL(file);

          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
            url: imageUrl,
            base64,
            name: file.name,
            size: file.size,
            type: "upload",
          });
        } catch (err) {
          console.error("Error processing image:", err);
          setError(
            createDetailedError(
              "Failed to process image.",
              "PROCESSING_ERROR",
              `File: ${file.name}, Error: ${err instanceof Error ? err.message : "Unknown error"}`,
            ),
          );
        }
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
        setError(null);
      }
    },
    [images],
  );

  // Handle drag events
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

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Handle file input change
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  // Handle paste from clipboard
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        handleFileSelect(imageFiles);
      }
    },
    [handleFileSelect],
  );

  // Add paste event listener
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      // Cleanup URL for uploaded images
      const imageToRemove = prev.find((img) => img.id === id);
      if (
        imageToRemove &&
        imageToRemove.type === "upload" &&
        imageToRemove.url
      ) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return updated;
    });
  };

  // Add URL image
  const addUrlImage = () => {
    if (!imageUrl.trim()) {
      setError(
        createDetailedError(
          "Please enter a valid image URL.",
          "EMPTY_URL",
          "URL input field is empty",
        ),
      );
      return;
    }

    if (images.length >= 5) {
      setError(
        createDetailedError(
          "Maximum 5 images allowed.",
          "URL_LIMIT_EXCEEDED",
          `Current images: ${images.length}, Maximum allowed: 5`,
        ),
      );
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      setError(
        createDetailedError(
          "Please enter a valid URL.",
          "INVALID_URL",
          `Invalid URL format: ${imageUrl}`,
        ),
      );
      return;
    }

    const newImage: UploadedImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: imageUrl,
      imageUrl: imageUrl,
      name: imageUrl.split("/").pop() || "URL Image",
      type: "url",
    };

    setImages((prev) => [...prev, newImage]);
    setImageUrl("");
    setError(null);
  };

  // Clear all images
  const clearAllImages = () => {
    images.forEach((img) => {
      if (img.type === "upload" && img.url) {
        URL.revokeObjectURL(img.url);
      }
    });
    setImages([]);
  };

  // Analyze images
  const analyzeImages = async () => {
    if (!groq) {
      setError(
        createDetailedError(
          "Groq client not initialized. Please check your API key.",
          "NO_GROQ_CLIENT",
          "Groq instance is not available",
        ),
      );
      return;
    }

    if (images.length === 0) {
      setError(
        createDetailedError(
          "Please upload at least one image to analyze.",
          "NO_IMAGES",
          "No images have been uploaded or added via URL",
        ),
      );
      return;
    }

    if (!userPrompt.trim()) {
      setError(
        createDetailedError(
          "Please enter a prompt to analyze the images.",
          "EMPTY_PROMPT",
          "User prompt field is empty",
        ),
      );
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult("");

    try {
      const messages = [];

      // Add system message if provided
      if (systemPrompt.trim()) {
        messages.push({
          role: "system" as const,
          content: systemPrompt,
        });
      }

      // Add user message with text and images
      const userContent = [
        {
          type: "text" as const,
          text: userPrompt,
        },
        ...images.map((img) => ({
          type: "image_url" as const,
          image_url: {
            url: img.type === "url" ? img.imageUrl! : img.base64!,
          },
        })),
      ];

      messages.push({
        role: "user" as const,
        content: userContent,
      });

      const completion = await groq.chat.completions.create({
        model: selectedModel,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        setResult(response);
      } else {
        setError(
          createDetailedError(
            "No response received from the model.",
            "EMPTY_RESPONSE",
            "The API returned an empty response",
          ),
        );
      }
    } catch (err) {
      console.error("Vision analysis error:", err);

      let errorMessage =
        "Failed to analyze images. Please check your API key and try again.";
      let errorCode = "ANALYSIS_ERROR";
      let errorDetails = "Unknown error occurred";
      let statusCode: number | undefined;

      if (err instanceof Error) {
        errorMessage = err.message;
        errorDetails = err.stack || err.message;

        // Check for specific error types
        if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized")
        ) {
          errorCode = "UNAUTHORIZED";
          errorMessage = "Invalid API key. Please check your Groq API key.";
        } else if (err.message.includes("429")) {
          errorCode = "RATE_LIMIT";
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (err.message.includes("400")) {
          errorCode = "BAD_REQUEST";
          errorMessage =
            "Invalid request. Please check your images and prompt.";
        } else if (err.message.includes("413")) {
          errorCode = "PAYLOAD_TOO_LARGE";
          errorMessage =
            "Images are too large. Please use smaller images or URLs.";
        } else if (err.message.includes("500")) {
          errorCode = "SERVER_ERROR";
          errorMessage = "Server error. Please try again later.";
        }

        // Extract status code if available
        const statusMatch = err.message.match(/(\d{3})/);
        if (statusMatch) {
          statusCode = parseInt(statusMatch[1]);
        }
      }

      setError(
        createDetailedError(errorMessage, errorCode, errorDetails, statusCode),
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy result to clipboard
  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
    }
  };

  // Download result as text file
  const downloadResult = () => {
    if (result) {
      const blob = new Blob([result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vision-analysis-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const selectedModelInfo = visionModels.find((m) => m.id === selectedModel);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Images and Vision</h2>
        <p className="text-lg text-muted-foreground">
          Analyze images with advanced AI vision models for detailed insights
          and understanding
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Prompts Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt to define the AI's behavior..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-prompt">User Prompt</Label>
                <Textarea
                  id="user-prompt"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Enter your question or request about the images..."
                  className="min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Upload
                <span className="text-sm text-muted-foreground font-normal">
                  ({images.length}/5)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                  dragOver
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50 hover:bg-primary/5",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="animate-bounce">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop images here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse files, or paste from clipboard (Ctrl+V)
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-4">
                  Supported: JPEG, PNG, GIF, WebP • Max: 4MB per image • Up to 5
                  images
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="image-url">Or enter image URL</Label>
                <div className="flex gap-2">
                  <input
                    id="image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 h-9 px-3 py-1 text-sm border border-input rounded-md bg-background"
                  />
                  <Button
                    variant="outline"
                    onClick={addUrlImage}
                    disabled={!imageUrl.trim() || images.length >= 5}
                  >
                    Add URL
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add images from web URLs (max 20MB per image)
                </p>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Uploaded Images</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllImages}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="relative group bg-muted rounded-lg p-2 animate-in fade-in-0 slide-in-from-bottom-5 duration-300"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute top-1 left-1">
                          <span className="text-xs bg-background/80 px-1 py-0.5 rounded">
                            {image.type === "url" ? "URL" : "Upload"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {image.name}
                        </p>
                        {image.size && (
                          <p className="text-xs text-muted-foreground">
                            {(image.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={analyzeImages}
                disabled={
                  isAnalyzing ||
                  images.length === 0 ||
                  !userPrompt.trim() ||
                  isLoading ||
                  !hasApiKey
                }
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Images...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Analyze Images
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/10 animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Error
                  {error.code && (
                    <span className="text-xs bg-destructive/20 px-2 py-1 rounded font-mono">
                      {error.code}
                    </span>
                  )}
                  <div className="ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowErrorDetails(!showErrorDetails)}
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive/20"
                    >
                      {showErrorDetails ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-destructive font-medium">{error.message}</p>

                {showErrorDetails && (
                  <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    {error.details && (
                      <div className="bg-destructive/5 rounded-md p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          Details:
                        </p>
                        <p className="text-sm text-destructive/80 font-mono whitespace-pre-wrap">
                          {error.details}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Timestamp:</p>
                        <p className="font-mono">
                          {new Date(error.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {error.statusCode && (
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Status Code:</p>
                          <p className="font-mono">{error.statusCode}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="h-7 text-xs"
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const errorText = `Error: ${error.message}
Code: ${error.code || "N/A"}
Details: ${error.details || "N/A"}
Timestamp: ${error.timestamp}
Status: ${error.statusCode || "N/A"}`;
                          navigator.clipboard.writeText(errorText);
                        }}
                        className="h-7 text-xs"
                      >
                        Copy Error
                      </Button>
                    </div>
                  </div>
                )}

                {!showErrorDetails && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(error.timestamp).toLocaleString()}</span>
                    {error.statusCode && (
                      <span>Status: {error.statusCode}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analysis Result */}
          {result && (
            <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Analysis Result
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyResult}
                      className="h-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResult}
                      className="h-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // Custom styling for code blocks
                      code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: {
                        node?: any;
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                        [key: string]: any;
                      }) => {
                        return !inline ? (
                          <code
                            className={cn(
                              "block bg-muted p-2 rounded text-sm",
                              className,
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <code
                            className={cn(
                              "bg-muted px-1 py-0.5 rounded text-sm",
                              className,
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      // Custom styling for tables
                      table: ({ children, ...props }) => (
                        <div className="overflow-x-auto">
                          <table
                            className="w-full border-collapse border border-border"
                            {...props}
                          >
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children, ...props }) => (
                        <th
                          className="border border-border p-2 bg-muted font-semibold text-left"
                          {...props}
                        >
                          {children}
                        </th>
                      ),
                      td: ({ children, ...props }) => (
                        <td className="border border-border p-2" {...props}>
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Analyzed using {selectedModelInfo?.name} with{" "}
                    {images.length} image{images.length > 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  • Configure system and user prompts to guide the AI's analysis
                </p>
                <p>
                  • Upload images by dragging, clicking browse, or pasting
                  (Ctrl+V)
                </p>
                <p>• Supports JPEG, PNG, GIF, and WebP formats</p>
                <p>• Maximum 5 images per analysis, 4MB per image</p>
                <p>
                  • Ask specific questions about objects, text, colors, or
                  context
                </p>
                <p>
                  • Models support multi-turn conversations and detailed
                  analysis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Vision Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visionModels.map((model) => {
                  const Icon = model.icon;
                  return (
                    <div
                      key={model.id}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                        selectedModel === model.id
                          ? "border-primary bg-primary/5 scale-105"
                          : "border-border hover:border-primary/50 hover:bg-primary/5",
                      )}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                        <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                          {model.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {model.description}
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Context:</span>
                          <span className="font-medium">
                            {model.contextWindow}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Images:</span>
                          <span className="font-medium">{model.maxImages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Size:</span>
                          <span className="font-medium">
                            {model.maxImageSize}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">
                          Features:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {model.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-xs bg-secondary px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-primary font-medium">
                        {model.recommended}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
