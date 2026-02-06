
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Search } from 'lucide-react';
import { MockDB } from '../db';
import { Tournament, TournamentStatus } from '../types';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<TournamentStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ts = MockDB.getTournaments();
    if (filter !== 'ALL') {
      ts = ts.filter(t => t.status === filter);
    }
    if (search) {
      ts = ts.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    }
    setTournaments(ts);
  }, [filter, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Tournaments</h1>
        <p className="text-zinc-400">Join the current competitive season and prove your skills.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10 justify-between">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search tournaments..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 focus:outline-none focus:border-green-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex bg-zinc-900 p-1 rounded-sm border border-zinc-800 self-start">
          {['ALL', ...Object.values(TournamentStatus)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-6 py-2 text-sm font-bold rounded-sm transition-all ${filter === s ? 'bg-green-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((t) => (
            <Link key={t.id} to={`/tournaments/${t.id}`} className="mc-card group flex flex-col hover:border-zinc-500 transition-all">
              <div className="h-40 bg-zinc-800 relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${t.id}/600/400`} alt={t.name} className="w-full h-full object-cover opacity-80" />
                <div className={`absolute top-4 right-4 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
                  t.status === TournamentStatus.UPCOMING ? 'bg-blue-600' :
                  t.status === TournamentStatus.ONGOING ? 'bg-orange-600' : 'bg-zinc-600'
                }`}>
                  {t.status}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3">{t.name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Prize Pool</span>
                    <span className="text-green-500 font-bold">रु {t.prizePool}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Entry Fee</span>
                    <span>{t.entryFee === 0 ? 'FREE' : `रु ${t.entryFee}`}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Players</span>
                    <span>{t.registeredCount} / {t.maxPlayers}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Date</span>
                    <span>{new Date(t.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-zinc-400 text-sm font-medium">{t.gameMode}</span>
                  <span className="text-green-500 font-bold group-hover:translate-x-1 transition-transform">JOIN →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-zinc-900 border border-dashed border-zinc-800 rounded-lg">
          <Trophy size={48} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Tournaments Found</h3>
          <p className="text-zinc-500">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
}
