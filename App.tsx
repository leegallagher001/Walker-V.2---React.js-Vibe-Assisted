
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Journal from './pages/Journal';
import Habit from './pages/Habit';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/habit" element={<Habit />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
