
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DatabaseSystemProvider } from '@/contexts/DatabaseSystemContext';
import { useAuth } from '@/contexts/AuthContext';
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import './App.css';

const AppContent = () => {
  return (
    <DatabaseSystemProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/calculator" element={<Index />} />
      </Routes>
    </DatabaseSystemProvider>
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
