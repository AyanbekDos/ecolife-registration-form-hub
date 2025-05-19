import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LanguageRouter } from "./components/LanguageRouter";

const queryClient = new QueryClient();

// Компонент для обработки языковых маршрутов
const LocalizedRoutes = () => {
  return (
    <Routes>
      {/* Основной маршрут с языковым префиксом */}
      <Route path=":lang">
        <Route index element={<Index />} />
        {/* Здесь можно добавить другие страницы с поддержкой языка */}
        {/* Например: <Route path="about" element={<About />} /> */}
      </Route>
      
      {/* Перенаправление с корня на язык браузера */}
      <Route 
        path="/" 
        element={<LanguageRouter />} 
      />
      
      {/* Обработка 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LocalizedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
