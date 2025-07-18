import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { GroqProvider, useGroq } from "@/hooks/use-groq";
import { LoadingScreen } from "@/components/loading-screen";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function AppContent() {
  const { isLoading } = useGroq();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold">Groq API Playground</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <GroqProvider>
      <ThemeProvider defaultTheme="system" storageKey="adawyat-theme">
        <AppContent />
      </ThemeProvider>
    </GroqProvider>
  );
}

export default App;
