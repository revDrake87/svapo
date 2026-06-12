import { Routes, Route } from 'react-router-dom';
import CustomerView from './CustomerView';
import AdminDashboard from './AdminDashboard';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerView />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
