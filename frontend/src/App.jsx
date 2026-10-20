import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NewReviewPage from './pages/NewReviewPage';
import ReviewHistoryPage from './pages/ReviewHistoryPage';
import ReviewDetailsPage from './pages/ReviewDetailsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page (Independent, No Sidebar) */}
        <Route path="/" element={<LandingPage />} />

        {/* Application Layout Shell (With Sidebar, App Navbar, Footer) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reviews" element={<ReviewHistoryPage />} />
          <Route path="/reviews/new" element={<NewReviewPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}