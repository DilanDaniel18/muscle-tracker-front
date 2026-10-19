import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginContainer } from './pages/Login/LoginContainer';
import { DashboardContainer } from './pages/Dashboard/DashboardContainer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginContainer />} />

        <Route path="/dashboard" element={<DashboardContainer />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
