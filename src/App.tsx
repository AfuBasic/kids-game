import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChildProvider } from '@/providers/ChildProvider';
import { Welcome } from '@/pages/Welcome';
import { KidsDashboard } from '@/pages/KidsDashboard';
import { CountUp } from '@/features/numeracy/CountUp';
import { CountDown } from '@/features/numeracy/CountDown';
import { ParentSettings } from '@/pages/ParentSettings';
import { NumeracyHome } from '@/features/numeracy/NumeracyHome';
import { GamePlayer } from '@/features/numeracy/GamePlayer';

const App: React.FC = () => {
  return (
    <ChildProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/kids" element={<KidsDashboard />} />
          <Route path="/kids/count-up" element={<CountUp />} />
          <Route path="/kids/count-down" element={<CountDown />} />
          <Route path="/kids/numeracy" element={<NumeracyHome />} />
          <Route path="/kids/numeracy/:gameId" element={<GamePlayer />} />
          <Route path="/parent" element={<ParentSettings />} />
        </Routes>
      </Router>
    </ChildProvider>
  );
};

export default App;

