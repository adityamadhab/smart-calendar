import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import Login from './components/Login';
import Register from './components/Register';
import EditEvent from './components/EditEvent';
import MiniCalendar from './components/MiniCalendar';
import EventsPage from './components/EventsPage';
import './App.css';

function AppContent({ user, setUser, currentDate, setCurrentDate }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} setUser={setUser} />
      <div className={`container mx-auto px-4 py-8 ${isAuthPage ? '' : 'grid grid-cols-1 lg:grid-cols-4 gap-6'}`}>
        {!isAuthPage && user && (
          <div className="lg:col-span-1 space-y-6">
            <MiniCalendar currentDate={currentDate} onDateChange={setCurrentDate} />
            {/* Add more sidebar components here */}
          </div>
        )}
        <div className={isAuthPage ? '' : 'lg:col-span-3'}>
          <Routes>
            <Route path="/" element={<Calendar user={user} currentDate={currentDate} onDateChange={setCurrentDate} />} />
            <Route path="/event/new" element={<EventForm user={user} />} />
            <Route path="/event/edit/:id" element={<EditEvent user={user} />} />
            <Route path="/events" element={<EventsPage user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.verifyToken();
        setUser({ token, ...userData });
      } catch (error) {
        console.error('Token verification failed:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      try {
        const userData = await authService.verifyToken();
        setUser(prev => ({ ...prev, ...userData }));
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent 
        user={user}
        setUser={setUser}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
    </Router>
  );
}

export default App;
