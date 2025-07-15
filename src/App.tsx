// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './login/LoginForm';
import DashBoard from './Dashboard/DashBoard';
import NotFound from './notFound/NotFound';
import DriverRequests from './pages/DriverRequests/DriverRequests';
import RescuerRequests from './pages/RescuerRequests/RescuerRequests';
import ProtectedRoute from './components/protectedRoute';
import DashboardView from './pages/view/view';
import DriverDetail from './pages/DriverDetail/DriverDetail';
import RescuerDetail from './pages/RescuerDetail/RescuerDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashBoard />}>
          <Route index element={<DashboardView />} />
          <Route path="driver-requests" element={<DriverRequests />} />
          <Route path="driver/:id" element={<DriverDetail />} />
          <Route path="rescuer-requests" element={<RescuerRequests />} />
          <Route path="rescuer/:id" element={<RescuerDetail />} />
          <Route path="drivers" element={<div>Drivers</div>} />
          <Route path="rescuers" element={<div>Rescuers</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
