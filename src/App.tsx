import './App.scss'

import { BrowserRouter, Routes, Route } from 'react-router';

import HomeView from './views/HomeView';
import ShowView  from './views/ShowView';
import EpisodeView from './views/EpisodeView';
import LoginView from './views/Login';
import DashboardView from './views/admin/DashboardView';
import ProtectedRoute from './components/ProtectedRoute';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false);
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/:show" element={<ShowView />} />
        <Route path="/:show/:episode" element={<EpisodeView />} />
        <Route path="/manager/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardView />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
