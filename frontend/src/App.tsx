import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ToursPage />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
