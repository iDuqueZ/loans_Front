import { useUser } from '@clerk/clerk-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './components/SignInPage';
import Home from './components/Home';

function App() {
  const { isSignedIn } = useUser();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isSignedIn ? <Navigate to="/home" /> : <SignInPage />} 
      />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;