
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart, Trophy, CreditCard, MessageSquare, 
  Settings, Plus, Check, X, Trash2, ShieldCheck, 
  Users, DollarSign, ExternalLink, Clock, Calendar, Sword, AlignLeft, ListOrdered
} from 'lucide-react';
import { MockDB } from '../../db';
import { 
  User as UserType, UserRole, Tournament, 
  Payment, PaymentStatus, Announcement, TournamentStatus
} from '../../types';

const AdminOverview = () => {
  const ts = MockDB.getTournaments();
  const payments = MockDB.getPayments();
  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING);
  
  const stats = [
    { label: 'Total Tournaments', value: ts.length, icon: <Trophy />, color: 'text-blue-500' },
    { label: 'Active Players', value: 124, icon: <Users />, color: 'text-green-500' },
    { label: 'Pending Approvals', value: pendingPayments.length, icon: <Clock />, color: 'text-orange-500' },
    { label: 'Total Revenue', value: `रु ${payments.reduce((acc, curr) => curr.status === PaymentStatus.PAID ? acc + curr.amount : acc, 0)}`, icon: <DollarSign />, color: 'text-emerald-500' }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="mc-card p-6 flex items-start justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase mb-2">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-zinc-800 ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="mc-card p-6">
          <h3 className="font-bold text-xl mb-6 flex items-center justify-between">
            Recent Payments
            <Link to="payments" className="text-xs text-green-500 hover:underline">View All</Link>
          </h3>
          <div className="space-y-4">
            {payments.slice(-5).reverse().map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded">
                <div>
                  <p className="font-bold text-sm">{p.method} Transfer</p>
                  <p className="text-xs text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">रु {p.amount}</p>
                  <span className={`text-[10px] font-bold uppercase ${p.status === PaymentStatus.PAID ? 'text-green-500' : 'text-orange-500'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mc-card p-6">
          <h3 className="font-bold text-xl mb-6">Tournament Activity</h3>
          <div className="space-y-4">
            {ts.map((t) => (
               <div key={t.id} className="flex items-center gap-4 p-3 bg-zinc-950/50 border border-zinc-800 rounded">
                  <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center rounded">
                    <Trophy size={20} className="text-zinc-600" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-sm">{t.name}</p>
                    <div className="w-full bg-zinc-800 h-2 rounded-full mt-1">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(t.registeredCount / t.maxPlayers) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">{t.registeredCount}/{t.maxPlayers}</div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagePayments = () => {
  const [payments, setPayments] = useState<Payment[]>(MockDB.getPayments());

  const handleApprove = (id: string) => {
    MockDB.approvePayment(id);
    setPayments(MockDB.getPayments());
  };

  const handleReject = (id: string) => {
    MockDB.rejectPayment(id);
    setPayments(MockDB.getPayments());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Verifications</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-zinc-900 rounded-lg overflow-hidden text-left border border-zinc-800">
          <thead className="bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {payments.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-500">No payments found</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {p.method === 'ESEWA' ? <CreditCard size={14} className="text-green-500" /> : <DollarSign size={14} className="text-blue-500" />}
                    {p.method}
                  </td>
                  <td className="px-6 py-4">रु {p.amount}</td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{p.transactionId}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      p.status === PaymentStatus.PAID ? 'bg-green-600/10 text-green-500' :
                      p.status === PaymentStatus.PENDING ? 'bg-orange-600/10 text-orange-500' : 'bg-red-600/10 text-red-500'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {p.status === PaymentStatus.PENDING && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(p.id)} className="p-1.5 bg-green-600 hover:bg-green-700 rounded text-white"><Check size={14} /></button>
                        <button onClick={() => handleReject(p.id)} className="p-1.5 bg-red-600 hover:bg-red-700 rounded text-white"><X size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ManageTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>(MockDB.getTournaments());
  const [showAdd, setShowAdd] = useState(false);
  const [currentRule, setCurrentRule] = useState('');
  
  // Format current date for datetime-local input
  const defaultDate = new Date();
  defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
  const formattedDefaultDate = defaultDate.toISOString().slice(0, 16);

  const [newT, setNewT] = useState<Omit<Tournament, 'id' | 'registeredCount'>>({
    name: '', 
    description: '', 
    entryFee: 0, 
    prizePool: 0, 
    maxPlayers: 64,
    startDate: formattedDefaultDate, 
    status: TournamentStatus.UPCOMING,
    gameMode: 'Bedwars 4v4', 
    rules: []
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    MockDB.addTournament({
      ...newT,
      startDate: new Date(newT.startDate).toISOString()
    });
    setTournaments(MockDB.getTournaments());
    setShowAdd(false);
    // Reset form
    setNewT({
      name: '', description: '', entryFee: 0, prizePool: 0, maxPlayers: 64,
      startDate: formattedDefaultDate, status: TournamentStatus.UPCOMING,
      gameMode: 'Bedwars 4v4', rules: []
    });
  };

  const addRule = () => {
    if (currentRule.trim()) {
      setNewT({ ...newT, rules: [...newT.rules, currentRule.trim()] });
      setCurrentRule('');
    }
  };

  const removeRule = (index: number) => {
    const updatedRules = newT.rules.filter((_, i) => i !== index);
    setNewT({ ...newT, rules: updatedRules });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Tournaments</h2>
        <button onClick={() => setShowAdd(true)} className="mc-button mc-button-green px-4 py-2 flex items-center gap-2 font-bold text-sm">
          <Plus size={16} /> NEW TOURNAMENT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="mc-card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{t.name}</h3>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                t.status === TournamentStatus.UPCOMING ? 'bg-blue-600/10 text-blue-500' :
                t.status === TournamentStatus.ONGOING ? 'bg-orange-600/10 text-orange-500' : 'bg-zinc-600/10 text-zinc-500'
              }`}>{t.status}</span>
            </div>
            <p className="text-zinc-500 text-xs mb-4 flex items-center gap-1">
              <Sword size={12} /> {t.gameMode}
            </p>
            <div className="flex justify-between text-sm mb-4 mt-auto">
              <span className="flex items-center gap-1 text-zinc-400"><Users size={14} /> {t.registeredCount}/{t.maxPlayers}</span>
              <span className="text-green-500 font-bold">रु {t.entryFee === 0 ? 'FREE' : t.entryFee}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-grow bg-zinc-800 border border-zinc-700 py-1.5 text-xs font-bold rounded hover:bg-zinc-700">EDIT</button>
              <button className="px-3 bg-red-900/30 text-red-500 border border-red-900/50 py-1.5 text-xs font-bold rounded hover:bg-red-900/50">CLOSE</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
           <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl p-8 my-8 rounded-lg shadow-2xl relative">
              <button type="button" onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Trophy className="text-green-500" />
                Create New Tournament
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Tournament Name</label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" value={newT.name} onChange={e => setNewT({...newT, name: e.target.value})} placeholder="e.g. Kathmandu Survival Series" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Description</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 text-zinc-700" size={18} />
                    <textarea required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 h-24 rounded focus:border-green-600 outline-none transition-all resize-none" value={newT.description} onChange={e => setNewT({...newT, description: e.target.value})} placeholder="Describe the tournament events and flow..." />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Game Mode</label>
                  <div className="relative">
                    <Sword className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" value={newT.gameMode} onChange={e => setNewT({...newT, gameMode: e.target.value})} placeholder="e.g. Bedwars 4v4" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Start Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input type="datetime-local" required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" value={newT.startDate} onChange={e => setNewT({...newT, startDate: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Entry Fee (रु)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input type="number" required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" value={newT.entryFee} onChange={e => setNewT({...newT, entryFee: Number(e.target.value)})} placeholder="0 for Free" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Prize Pool (रु)</label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input type="number" required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" value={newT.prizePool} onChange={e => setNewT({...newT, prizePool: Number(e.target.value)})} placeholder="e.g. 5000" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Max Players</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input type="number" required className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" value={newT.maxPlayers} onChange={e => setNewT({...newT, maxPlayers: Number(e.target.value)})} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Status</label>
                  <select className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded focus:border-green-600 outline-none transition-all appearance-none cursor-pointer" value={newT.status} onChange={e => setNewT({...newT, status: e.target.value as TournamentStatus})}>
                    {Object.values(TournamentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Tournament Rules</label>
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-grow">
                      <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                      <input 
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-10 rounded focus:border-green-600 outline-none transition-all" 
                        value={currentRule} 
                        onChange={e => setCurrentRule(e.target.value)} 
                        placeholder="Add a rule (e.g. No Hacking)" 
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRule())}
                      />
                    </div>
                    <button type="button" onClick={addRule} className="bg-zinc-800 px-4 rounded font-bold hover:bg-zinc-700 transition-colors">ADD</button>
                  </div>
                  
                  <div className="space-y-2">
                    {newT.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-zinc-800/50 border border-zinc-800 rounded text-sm group">
                        <span className="text-zinc-300"><span className="text-zinc-600 mr-2">{idx + 1}.</span> {rule}</span>
                        <button type="button" onClick={() => removeRule(idx)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {newT.rules.length === 0 && <p className="text-zinc-600 text-xs italic p-4 text-center bg-zinc-950/30 border border-dashed border-zinc-800 rounded">No rules added yet.</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-800">
                <button type="submit" className="mc-button mc-button-green flex-grow py-4 font-black text-white text-lg rounded-sm uppercase tracking-widest">
                  PUBLISH TOURNAMENT
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-10 py-4 bg-zinc-800 font-bold rounded hover:bg-zinc-700 transition-all text-zinc-400">
                  CANCEL
                </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MockDB.getAnnouncements());
  const [showAdd, setShowAdd] = useState(false);
  const [newA, setNewA] = useState<Omit<Announcement, 'id' | 'createdAt'>>({
    title: '', content: '', isPinned: false
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    MockDB.addAnnouncement(newA);
    setAnnouncements(MockDB.getAnnouncements());
    setShowAdd(false);
    setNewA({ title: '', content: '', isPinned: false });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      MockDB.deleteAnnouncement(id);
      setAnnouncements(MockDB.getAnnouncements());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Announcements</h2>
        <button onClick={() => setShowAdd(true)} className="mc-button mc-button-green px-4 py-2 flex items-center gap-2 font-bold text-sm">
          <Plus size={16} /> NEW POST
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="mc-card p-6 flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{a.title}</h3>
                {a.isPinned && <ShieldCheck size={14} className="text-green-500" />}
              </div>
              <p className="text-zinc-500 text-sm line-clamp-1">{a.content}</p>
              <p className="text-zinc-600 text-[10px] mt-2 uppercase tracking-widest">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {announcements.length === 0 && <div className="p-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">No announcements posted yet.</div>}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 w-full max-w-xl p-8 rounded-lg shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">New Announcement</h3>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Title</label>
                  <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded outline-none focus:border-green-600" value={newA.title} onChange={e => setNewA({...newA, title: e.target.value})} placeholder="Announcement Title" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Content</label>
                  <textarea required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded outline-none focus:border-green-600 h-32 resize-none" value={newA.content} onChange={e => setNewA({...newA, content: e.target.value})} placeholder="Detailed message..." />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-green-600" checked={newA.isPinned} onChange={e => setNewA({...newA, isPinned: e.target.checked})} />
                  <span className="text-sm font-bold text-zinc-400">Pin this announcement</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="mc-button mc-button-green flex-grow py-3 font-bold uppercase tracking-widest">PUBLISH</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-8 py-3 bg-zinc-800 font-bold rounded text-zinc-500">CANCEL</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default function AdminPanel({ user }: { user: UserType | null }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart size={20} /> },
    { name: 'Tournaments', path: '/admin/tournaments', icon: <Trophy size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <h2 className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Control Panel</h2>
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${
                isActive ? 'bg-green-600/10 border-green-600/50 text-green-500' : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="font-bold">{link.name}</span>
            </Link>
          );
        })}
        <hr className="border-zinc-800 my-6" />
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white">
          <ExternalLink size={20} />
          <span>Exit Admin</span>
        </Link>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/tournaments" element={<ManageTournaments />} />
          <Route path="/payments" element={<ManagePayments />} />
          <Route path="/announcements" element={<ManageAnnouncements />} />
        </Routes>
      </main>
    </div>
  );
}
