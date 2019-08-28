import React from 'react';
import { Router } from "@reach/router"

import './App.scss';

// Pages
import Home from './pages/home/home';
import NotFound from './pages/not-found/not-found';
import Predictions from './pages/predictions/predictions';

// Components
import Navbar from './components/navbar/navbar';
import Leaderboard from './pages/leaderboard/leaderboard';

const App: React.FC = () => {
  return (
    <div className="app">
      <Navbar />

      <Router>
        <Home path="/" />
        <Leaderboard path="/leaderboard" />
        <Predictions path="/predictions" />
        <Predictions path="/predictions/:prediction" />
        <NotFound default={true} />
      </Router>
    </div>
  );
}

export default App;
