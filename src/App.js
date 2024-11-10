import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import LoadingPage from './pages/LoadingPage/lodinpage';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './index.css'; // if you have additional custom styles
import MainPage from './pages/MainPage/MainPage';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/main');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoadingPage />} />
      <Route path="/main" element={<MainPage />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
