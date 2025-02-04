import './App.scss'

import { BrowserRouter, Routes, Route } from 'react-router';

import HomeView from './views/HomeView';
import ShowView  from './views/ShowView';
import EpisodeView from './views/EpisodeView';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/:show" element={<ShowView />} />
            <Route path="/:show/:episode" element={<EpisodeView />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
