import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index.tsx";

import AIInversion from "./pages/AIInversion.tsx";
import AutonomousRobotics from "./pages/AutonomousRobotics.tsx";
import PlasmaDrilling from "./pages/PlasmaDrilling.tsx";
import Admin from "./pages/Admin.tsx";
import Signup from "./pages/Signup.tsx";
import LithographicSimulator from "./pages/LithographicSimulator.tsx";
import IndonesiaSimulator from "./pages/IndonesiaSimulator.tsx";
import JapanSimulator from "./pages/JapanSimulator.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-inversion" element={<AIInversion />} />
            <Route path="/autonomous-robotics" element={<AutonomousRobotics />} />
            <Route path="/plasma-drilling" element={<PlasmaDrilling />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/simulator" element={<LithographicSimulator />} />
            <Route path="/simulator/indonesia" element={<IndonesiaSimulator />} />
            <Route path="/simulator/japan" element={<JapanSimulator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
