import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: 'inherit' },
        }}
      />
    </div>
  );
};

export default App;
