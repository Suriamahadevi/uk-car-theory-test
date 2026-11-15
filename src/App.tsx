import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TopicsPage from './pages/TopicsPage';
import TopicPage from './pages/TopicPage';
import PracticePage from './pages/PracticePage';
import SessionPage from './pages/SessionPage';
import MockStart from './pages/MockStart';
import MockExam from './pages/MockExam';
import MockResults from './pages/MockResults';
import HazardPage from './pages/HazardPage';
import HazardClipPage from './pages/HazardClipPage';
import MistakesPage from './pages/MistakesPage';
import RevisionPage from './pages/RevisionPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import { useAppData } from './store/store';

export default function App() {
  const { pathname } = useLocation();
  const data = useAppData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', data.settings.largeText);
  }, [data.settings.largeText]);

  return (
    <Routes>
      {/* Distraction-free exam screens: no site navigation */}
      <Route path="/mock/exam" element={<MockExam />} />
      <Route path="/hazard/test" element={<HazardClipPage full />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:id" element={<TopicPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="session" element={<SessionPage />} />
        <Route path="mock" element={<MockStart />} />
        <Route path="mock/results/:id" element={<MockResults />} />
        <Route path="hazard" element={<HazardPage />} />
        <Route path="hazard/clip/:id" element={<HazardClipPage />} />
        <Route path="mistakes" element={<MistakesPage />} />
        <Route path="revision" element={<RevisionPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
