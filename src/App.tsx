
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DatabaseSystemProvider } from '@/contexts/DatabaseSystemContext';
import { SystemProvider } from '@/contexts/SystemContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Help from '@/pages/Help';
import Status from '@/pages/Status';
import ErrorPage from '@/pages/ErrorPage';
import NotFound from '@/pages/NotFound';
import './App.css';

const AppContent = () => {
  return (
    <ErrorBoundary>
      <SystemProvider>
        <DatabaseSystemProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/calculator" element={<Index />} />
            <Route path="/help" element={<Help />} />
            <Route path="/status" element={<Status />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DatabaseSystemProvider>
      </SystemProvider>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
