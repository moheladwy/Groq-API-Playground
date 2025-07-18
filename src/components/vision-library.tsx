import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Sparkles,
  Target,
  Image as ImageIcon,
  FileText,
  Languages,
  Zap,
  Brain,
  Scan,
  Camera,
  Palette,
  Users,
  Globe,
  Info,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Layers,
  Code,
  BookOpen,
  Lightbulb,
  Shield,
  Cpu,
} from "lucide-react";

// Vision Models Data
const visionModels = [
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout",
    shortName: "Scout",
    description: "A powerful multimodal model capable of processing both text and image inputs with multilingual support, tool use, and JSON mode.",
    type: "Vision-Language Model",
    developer: "Meta",
    version: "17B Parameters",
    contextWindow: "128K tokens",
    status: "Preview",
    maxImages: 5,
    maxImageSize: "20MB (URL) / 4MB (base64)",
    maxResolution: "33 megapixels",
    inputFormats: ["JPEG", "PNG", "GIF", "WebP"],
    outputFormats: ["Text", "JSON", "Structured Data"],
    features: [
      "Multi-turn conversations",
      "Tool use capability",
      "JSON mode",
      "Multilingual support",
      "Image understanding",
      "OCR capabilities",
      "Visual reasoning",
      "Object detection",
      "Scene analysis",
      "Text extraction",
      "Emotion recognition",
      "Spatial understanding",
    ],
    capabilities: [
      {
        category: "Visual Understanding",
        items: [
          "Object detection and recognition",
          "Scene understanding and description",
          "Spatial relationship analysis",
          "Color and composition analysis",
          "Style and artistic element recognition",
        ],
      },
      {
        category: "Text Processing",
        items: [
          "OCR (Optical Character Recognition)",
          "Text extraction from images",
          "Handwriting recognition",
          "Document analysis",
          "Sign and label reading",
        ],
      },
      {
        category: "Advanced Analysis",
        items: [
          "Emotion and sentiment detection",
          "Activity and action recognition",
          "Medical image analysis",
          "Technical diagram interpretation",
          "Chart and graph analysis",
        ],
      },
      {
        category: "Interactive Features",
        items: [
          "Multi-turn conversations about images",
          "Tool integration for extended functionality",
          "JSON structured output",
          "Multilingual responses",
          "Context-aware analysis",
        ],
      },
    ],
    useCases: [
      {
        category: "Content Creation",
        examples: [
          "Automatic image captioning",
          "Social media content generation",
          "Alt text generation for accessibility",
          "Image-based storytelling",
          "Creative writing prompts",
        ],
      },
      {
        category: "Business Applications",
        examples: [
          "Product catalog descriptions",
          "Quality control analysis",
          "Document digitization",
          "Brand compliance monitoring",
          "Market research analysis",
        ],
      },
      {
        category: "Education & Research",
        examples: [
          "Educational content creation",
          "Scientific image analysis",
          "Historical document analysis",
          "Art and culture studies",
          "Visual learning aids",
        ],
      },
      {
        category: "Accessibility",
        examples: [
          "Screen reader descriptions",
          "Visual impairment assistance",
          "Audio descriptions for media",
          "Navigation aid descriptions",
          "Real-time scene description",
        ],
      },
    ],
    strengths: [
      "Excellent multilingual support",
      "Fast inference speed",
      "Tool use integration",
      "JSON mode for structured output",
      "Multi-turn conversation capability",
      "Wide range of visual understanding",
      "Cost-effective for preview model",
      "High accuracy for complex reasoning",
    ],
    limitations: [
      "Preview status - may change",
      "Limited to 5 images per request",
      "4MB limit for base64 images",
      "Some specialized domains may need fine-tuning",
      "May struggle with very small text",
      "Limited real-time processing",
    ],
    technicalSpecs: {
      architecture: "Transformer-based multimodal",
      parameters: "17B",
      training: "Instruction-tuned",
      inference: "Cloud-based",
      latency: "Low (1-3 seconds)",
      throughput: "High",
      scaling: "Auto-scaling",
    },
    pricing: {
      model: "Pay-per-use",
      costPer1K: "$0.02",
      freeQuota: "Limited free tier",
      enterprise: "Custom pricing available",
    },
    recommended: "Best for complex visual analysis and reasoning tasks with multilingual support",
    icon: Sparkles,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "Llama 4 Maverick",
    shortName: "Maverick",
    description: "Advanced multimodal model with extended context window for complex image analysis and detailed visual understanding.",
    type: "Vision-Language Model",
    developer: "Meta",
    version: "17B Parameters",
    contextWindow: "128K tokens",
    status: "Preview",
    maxImages: 5,
    maxImageSize: "20MB (URL) / 4MB (base64)",
    maxResolution: "33 megapixels",
    inputFormats: ["JPEG", "PNG", "GIF", "WebP"],
    outputFormats: ["Text", "JSON", "Structured Data"],
    features: [
      "Extended context window",
      "Multi-turn conversations",
      "Tool use capability",
      "JSON mode",
      "Deep visual analysis",
      "Complex reasoning",
      "Detailed descriptions",
      "Pattern recognition",
      "Comparative analysis",
      "Historical context",
      "Cultural understanding",
      "Technical analysis",
    ],
    capabilities: [
      {
        category: "Deep Visual Analysis",
        items: [
          "Detailed scene composition analysis",
          "Advanced object relationship mapping",
          "Complex spatial reasoning",
          "Multi-layered visual interpretation",
          "Contextual understanding",
        ],
      },
      {
        category: "Extended Context Processing",
        items: [
          "Long-form image discussions",
          "Multi-image comparative analysis",
          "Historical and cultural context",
          "Cross-reference capabilities",
          "Memory of previous interactions",
        ],
      },
      {
        category: "Professional Applications",
        items: [
          "Medical imaging insights",
          "Legal document analysis",
          "Technical drawing interpretation",
          "Scientific data visualization",
          "Art historical analysis",
        ],
      },
      {
        category: "Creative Intelligence",
        items: [
          "Artistic style analysis",
          "Creative concept generation",
          "Design feedback and suggestions",
          "Aesthetic evaluation",
          "Trend identification",
        ],
      },
    ],
    useCases: [
      {
        category: "Professional Services",
        examples: [
          "Medical image consultation",
          "Legal document review",
          "Technical documentation",
          "Architectural analysis",
          "Engineering drawing review",
        ],
      },
      {
        category: "Creative Industries",
        examples: [
          "Art curation and analysis",
          "Design consultation",
          "Creative project feedback",
          "Style guide development",
          "Brand visual analysis",
        ],
      },
      {
        category: "Research & Academia",
        examples: [
          "Visual research analysis",
          "Historical document study",
          "Cultural artifact examination",
          "Scientific image interpretation",
          "Comparative visual studies",
        ],
      },
      {
        category: "Enterprise Solutions",
        examples: [
          "Quality assurance analysis",
          "Process optimization",
          "Compliance monitoring",
          "Risk assessment",
          "Performance evaluation",
        ],
      },
    ],
    strengths: [
      "Extended context for complex analysis",
      "Superior detailed descriptions",
      "Advanced reasoning capabilities",
      "Professional-grade accuracy",
      "Multi-image comparative analysis",
      "Cultural and historical awareness",
      "Technical domain expertise",
      "Creative and artistic understanding",
    ],
    limitations: [
      "Preview status - subject to changes",
      "Higher computational requirements",
      "May be slower for simple tasks",
      "Limited to 5 images per request",
      "Requires clear, high-quality images",
      "May over-analyze simple queries",
    ],
    technicalSpecs: {
      architecture: "Advanced transformer multimodal",
      parameters: "17B",
      training: "Extended instruction-tuning",
      inference: "Cloud-based",
      latency: "Medium (2-5 seconds)",
      throughput: "Medium-High",
      scaling: "Auto-scaling",
    },
    pricing: {
      model: "Pay-per-use",
      costPer1K: "$0.025",
      freeQuota: "Limited free tier",
      enterprise: "Custom pricing available",
    },
    recommended: "Ideal for detailed image analysis and extended conversations requiring deep understanding",
    icon: Target,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];

// Vision Capabilities Overview
const visionCapabilities = [
  {
    category: "Object Recognition",
    description: "Identify and classify objects, people, animals, and items in images",
    examples: ["Product identification", "Wildlife recognition", "Vehicle detection", "Person identification"],
    icon: Eye,
  },
  {
    category: "Scene Understanding",
    description: "Comprehensive analysis of environments, settings, and contexts",
    examples: ["Location identification", "Activity recognition", "Atmosphere analysis", "Setting description"],
    icon: Camera,
  },
  {
    category: "Text Extraction (OCR)",
    description: "Extract and interpret text from images, documents, and signs",
    examples: ["Document digitization", "Sign reading", "Handwriting recognition", "Label extraction"],
    icon: FileText,
  },
  {
    category: "Visual Reasoning",
    description: "Analyze relationships, patterns, and logical connections in visual data",
    examples: ["Cause-effect analysis", "Pattern recognition", "Logical deduction", "Problem solving"],
    icon: Brain,
  },
  {
    category: "Creative Analysis",
    description: "Evaluate artistic elements, style, composition, and aesthetic qualities",
    examples: ["Art critique", "Design feedback", "Style analysis", "Creative suggestions"],
    icon: Palette,
  },
  {
    category: "Technical Analysis",
    description: "Interpret technical diagrams, charts, graphs, and specialized imagery",
    examples: ["Engineering drawings", "Medical scans", "Scientific data", "Technical documentation"],
    icon: Scan,
  },
];

// Use Case Templates
const useCaseTemplates = [
  {
    title: "E-commerce Product Analysis",
    description: "Automatically generate product descriptions and analyze product images",
    prompt: "Analyze this product image and provide a detailed description including features, style, and potential uses.",
    industries: ["Retail", "E-commerce", "Marketing"],
    benefits: ["Automated content creation", "Consistent descriptions", "Time savings"],
  },
  {
    title: "Medical Image Insights",
    description: "Assist healthcare professionals with preliminary image analysis",
    prompt: "Describe the anatomical structures and any notable features visible in this medical image.",
    industries: ["Healthcare", "Medical", "Research"],
    benefits: ["Preliminary insights", "Educational support", "Documentation assistance"],
  },
  {
    title: "Educational Content Creation",
    description: "Generate educational materials and explanations from visual content",
    prompt: "Explain what's happening in this image in simple terms suitable for educational purposes.",
    industries: ["Education", "Training", "E-learning"],
    benefits: ["Accessible content", "Visual learning", "Engagement"],
  },
  {
    title: "Accessibility Support",
    description: "Create detailed descriptions for visually impaired users",
    prompt: "Provide a comprehensive description of this image for someone who cannot see it.",
    industries: ["Accessibility", "Public Service", "Technology"],
    benefits: ["Inclusive design", "Compliance", "Better user experience"],
  },
];

export function VisionLibrary() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const ModelCard = ({ model }: { model: typeof visionModels[0] }) => {
    const Icon = model.icon;
    const isSelected = selectedModel === model.id;

    return (
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
          isSelected
            ? `ring-2 ring-primary shadow-xl scale-105 ${model.bgColor} ${model.borderColor}`
            : 'hover:shadow-md hover:scale-102'
        }`}
        onClick={() => setSelectedModel(isSelected ? null : model.id)}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${model.color}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold">{model.name}</span>
                <Badge variant="outline" className="text-xs">
                  {model.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                {model.version} • {model.contextWindow}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {model.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">Max Images</span>
              </div>
              <p className="text-muted-foreground pl-6">{model.maxImages}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="font-medium">Max Size</span>
              </div>
              <p className="text-muted-foreground pl-6">{model.maxImageSize}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="font-medium">Resolution</span>
              </div>
              <p className="text-muted-foreground pl-6">{model.maxResolution}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="font-medium">Developer</span>
              </div>
              <p className="text-muted-foreground pl-6">{model.developer}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {model.features.slice(0, 6).map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {model.features.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{model.features.length - 6} more
              </Badge>
            )}
          </div>

          <div className={`text-xs font-medium p-3 rounded-lg ${model.bgColor} ${model.borderColor} border`}>
            <Lightbulb className="h-4 w-4 inline mr-2" />
            {model.recommended}
          </div>

          {isSelected && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">
              {/* Capabilities */}
              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Capabilities
                </h4>
                <div className="space-y-4">
                  {model.capabilities.map((capability) => (
                    <div key={capability.category} className="space-y-2">
                      <h5 className="font-medium text-sm">{capability.category}</h5>
                      <div className="grid grid-cols-1 gap-1 pl-4">
                        {capability.items.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Use Cases
                </h4>
                <div className="space-y-4">
                  {model.useCases.map((useCase) => (
                    <div key={useCase.category} className="space-y-2">
                      <h5 className="font-medium text-sm">{useCase.category}</h5>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example) => (
                          <Badge key={example} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths and Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {model.strengths.map((strength) => (
                      <li key={strength} className="flex items-start gap-2 text-sm">
                        <Star className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Limitations
                  </h4>
                  <ul className="space-y-2">
                    {model.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(model.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {Object.entries(model.pricing).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Vision Library</h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to advanced vision models with detailed capabilities and use cases
        </p>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 gap-8">
            {visionModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionCapabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <Card key={capability.category} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {capability.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {capability.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {capability.examples.map((example) => (
                          <Badge key={example} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="use-cases" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCaseTemplates.map((template) => (
              <Card key={template.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    {template.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sample Prompt:</h4>
                    <div className="p-3 bg-muted rounded-lg text-sm italic">
                      "{template.prompt}"
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Industries:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.industries.map((industry) => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Benefits:</h4>
                    <ul className="space-y-1">
                      {template.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Feature</th>
                      {visionModels.map((model) => (
                        <th key={model.id} className="border border-border p-3 text-center">
                          {model.shortName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">Context Window</td>
                      {visionModels.map((model) => (
                        <td key={model.id} className="border border-border p-3 text-center">
                          {model.contextWindow}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Max Images</td>
                      {visionModels.map((model) => (
                        <td key={model.id} className="border border-border p-3 text-center">
                          {model.maxImages}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Max Image Size</td>
                      {visionModels.map((model) => (
                        <td key={model.id} className="border border-border p-3 text-center">
                          {model.maxImageSize}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Best For</td>
                      {visionModels.map((model) => (
                        <td key={model.id} className="border border-border p-3 text-center text-sm">
                          {model.recommended}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
