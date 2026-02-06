
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Trophy, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { MockDB } from '../db';
import { User as UserType, Tournament, Registration, PaymentStatus } from '../types';

export default function DashboardPage({ user }: { user: UserType | null }) {
  const navigate = useNavigate();
  const [regs, setRegs] = useState<(Registration & { tournament?: Tournament })[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const userRegs = MockDB.getRegistrations().filter(r => r.userId === user.id);
    const enrichedRegs = userRegs.map(r => ({
      ...r,
      tournament: MockDB.getTournament(r.tournamentId)
    }));
    setRegs(enrichedRegs);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center mc-border border-zinc-700">
          <User size={48} className="text-zinc-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase">{user.username}</h1>
          <p className="text-zinc-500 flex items-center gap-2">
            <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">{user.role}</span>
            • Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-green-500" />
            My Tournaments
          </h2>

          {regs.length > 0 ? (
            <div className="space-y-4">
              {regs.map((reg) => (
                <div key={reg.id} className="mc-card p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                      <img src={`https://picsum.photos/seed/${reg.tournamentId}/200/200`} alt="T" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{reg.tournament?.name}</h3>
                      <p className="text-zinc-500 text-sm flex items-center gap-1">
                        <Calendar size={14} /> 
                        {new Date(reg.tournament?.startDate || '').toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`px-4 py-2 rounded-sm border flex items-center gap-2 text-sm font-bold w-full sm:w-auto justify-center ${
                      reg.status === PaymentStatus.PAID ? 'bg-green-600/10 border-green-600 text-green-500' :
                      reg.status === PaymentStatus.PENDING ? 'bg-orange-600/10 border-orange-600 text-orange-500' :
                      'bg-red-600/10 border-red-600 text-red-500'
                    }`}>
                      {reg.status === PaymentStatus.PAID ? <CheckCircle size={16} /> : 
                       reg.status === PaymentStatus.PENDING ? <Clock size={16} /> : <AlertCircle size={16} />}
                      {reg.status}
                    </div>
                    <Link to={`/tournaments/${reg.tournamentId}`} className="p-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded transition-colors">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 p-12 text-center rounded-lg">
              <Trophy size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500 mb-6">You haven't joined any tournaments yet.</p>
              <Link to="/tournaments" className="mc-button mc-button-green px-8 py-3 font-bold inline-block">
                BROWSE TOURNAMENTS
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <h2 className="text-2xl font-bold">Account Stats</h2>
           <div className="grid grid-cols-1 gap-4">
              <div className="mc-card p-6">
                <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-1">Registered</p>
                <p className="text-3xl font-black">{regs.length}</p>
              </div>
              <div className="mc-card p-6">
                <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-1">Won</p>
                <p className="text-3xl font-black">0</p>
              </div>
              <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-zinc-400">If your payment is pending for more than 24 hours, please contact support.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
