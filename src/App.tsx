
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DatabaseSystemProvider } from '@/contexts/DatabaseSystemContext';
import { SystemProvider } from '@/contexts/SystemContext';
import { useAuth } from '@/contexts/AuthContext';
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Help from '@/pages/Help';
import './App.css';

const AppContent = () => {
  return (
    <SystemProvider>
      <DatabaseSystemProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/calculator" element={<Index />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </DatabaseSystemProvider>
    </SystemProvider>
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
