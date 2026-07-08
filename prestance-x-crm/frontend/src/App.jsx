import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import AddLead from './pages/AddLead';
import EditLead from './pages/EditLead';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected routes - any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/add" element={<AddLead />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/leads/:id/edit" element={<EditLead />} />

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
