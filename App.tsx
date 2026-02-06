
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, Home, Info, User, LayoutDashboard, Settings, 
  Plus, ShieldCheck, LogOut, MessageSquare, Menu, X, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { MockDB } from './db';
import { User as UserType, UserRole } from './types';

// Pages
import HomePage from './pages/HomePage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanel from './pages/Admin/AdminPanel';

const Navbar = ({ user, onLogout }: { user: UserType | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Tournaments', path: '/tournaments', icon: <Trophy size={18} /> },
    { name: 'Announcements', path: '/announcements', icon: <MessageSquare size={18} /> },
  ];

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-sm mc-border">
              <Trophy size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">MC NEPAL</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-1.5 transition-colors ${location.pathname === link.path ? 'text-green-500 font-semibold' : 'hover:text-green-400'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="flex items-center gap-1.5 bg-zinc-800 px-3 py-1.5 rounded hover:bg-zinc-700 transition-all border border-zinc-700">
                  {user.role === UserRole.ADMIN ? <ShieldCheck size={18} /> : <LayoutDashboard size={18} />}
                  <span>{user.username}</span>
                </Link>
                <button onClick={onLogout} className="text-zinc-400 hover:text-red-400">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="mc-button mc-button-green px-6 py-2 text-white font-bold rounded-sm">
                JOIN NOW
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 py-4 px-4 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block py-2 text-lg hover:text-green-400">
              <div className="flex items-center gap-2">
                {link.icon}
                {link.name}
              </div>
            </Link>
          ))}
          <hr className="border-zinc-800" />
          {user ? (
            <div className="space-y-4">
              <Link 
                to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} 
                onClick={() => setIsOpen(false)}
                className="block py-2 text-lg hover:text-green-400"
              >
                Dashboard
              </Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left py-2 text-lg text-red-400">
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center mc-button mc-button-green py-3 text-white font-bold rounded-sm">
              LOGIN / REGISTER
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-zinc-900 border-t border-zinc-800 pt-12 pb-8 mt-20">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-green-600 p-1 rounded-sm">
            <Trophy size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg">MC NEPAL</span>
        </div>
        <p className="text-zinc-400 max-w-sm mb-6">
          The number one Minecraft tournament platform in Nepal. Join our community, compete with the best, and win real rewards.
        </p>
        <div className="flex gap-4">
          <a href="#" className="bg-zinc-800 p-2 rounded hover:bg-green-600 transition-colors">
             <span className="sr-only">Discord</span>
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/></svg>
          </a>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-zinc-400">
          <li><Link to="/tournaments" className="hover:text-green-500">Tournaments</Link></li>
          <li><Link to="/announcements" className="hover:text-green-500">Announcements</Link></li>
          <li><Link to="/rules" className="hover:text-green-500">Global Rules</Link></li>
          <li><Link to="/contact" className="hover:text-green-500">Contact Us</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Support</h4>
        <ul className="space-y-2 text-zinc-400">
          <li><Link to="/faq" className="hover:text-green-500">FAQ</Link></li>
          <li><Link to="/privacy" className="hover:text-green-500">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-green-500">Terms of Service</Link></li>
          <li><Link to="/refunds" className="hover:text-green-500">Refund Policy</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
      &copy; {new Date().getFullYear()} Minecraft Nepal Tournaments. Not an official Minecraft product. Not approved by or associated with Mojang.
    </div>
  </footer>
);

export default function App() {
  const [user, setUser] = useState<UserType | null>(MockDB.getCurrentUser());

  const handleLogin = (u: UserType) => {
    MockDB.setCurrentUser(u);
    setUser(u);
  };

  const handleLogout = () => {
    MockDB.setCurrentUser(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-green-600 selection:text-white">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournaments/:id" element={<TournamentDetailPage user={user} />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/admin/*" element={<AdminPanel user={user} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
