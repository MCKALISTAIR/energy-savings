
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DatabaseSystemProvider } from '@/contexts/DatabaseSystemContext';
import { useAuth } from '@/contexts/AuthContext';
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();
  
  // Check for development bypass flag
  const devBypass = localStorage.getItem('devBypass') === 'true';

  return (
    <DatabaseSystemProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/" 
          element={
            (user || devBypass) ? (
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            ) : (
              <Landing />
            )
          } 
        />
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
