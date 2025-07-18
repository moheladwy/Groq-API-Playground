import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useGroq } from "@/hooks/use-groq";
import {
  Mic,
  BookOpen,
  AudioWaveform,
  Eye,
  Sparkles,
  Key,
  CheckCircle,
  XCircle,
  Loader2,
  PlayCircle,
} from "lucide-react";

// Navigation items
const navItems = [
  {
    title: "Text to Speech",
    url: "/text-to-speech",
    icon: Mic,
  },
  {
    title: "Speech to Text",
    url: "/speech-to-text",
    icon: AudioWaveform,
  },
  {
    title: "Images and Vision",
    url: "/images-and-vision",
    icon: Eye,
  },
  {
    title: "Voice Library",
    url: "/voice-library",
    icon: BookOpen,
  },
  {
    title: "Vision Library",
    url: "/vision-library",
    icon: Sparkles,
  },
  {
    title: "Audio Player",
    url: "/audio-player",
    icon: PlayCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { hasApiKey, isLoading, clearApiKey } = useGroq();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 hover:bg-sidebar-accent rounded-md"
        >
          <img
            src="https://console.groq.com/powered-by-groq.svg"
            alt="Powered by Groq for fast inference."
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.url ||
                      (location.pathname === "/" &&
                        item.url === "/text-to-speech")
                    }
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-3 px-4 py-2">
          {/* API Key Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">API Key</span>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : hasApiKey ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <Badge variant="outline" className="text-xs">
                    Connected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearApiKey}
                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    title="Clear API Key"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-destructive" />
                  <Badge variant="destructive" className="text-xs">
                    Missing
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Theme</div>
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
