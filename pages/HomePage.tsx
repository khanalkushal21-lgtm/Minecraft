
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight, Sword, Shield } from 'lucide-react';
import { MockDB } from '../db';
import { Tournament, Announcement } from '../types';

export default function HomePage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    setTournaments(MockDB.getTournaments().slice(0, 3));
    setAnnouncements(MockDB.getAnnouncements().slice(0, 2));
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/400/1920/1080?grayscale" 
            alt="Minecraft Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            NEPAL'S ULTIMATE MINECRAFT ARENA
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light">
            Competitive tournaments, real rewards, and a thriving Nepali community. 
            Are you ready to claim your throne?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tournaments" className="mc-button mc-button-green px-10 py-4 text-white font-bold text-lg rounded-sm transform transition hover:scale-105">
              EXPLORE TOURNAMENTS
            </Link>
            <a href="https://discord.gg/minecraft-nepal" target="_blank" className="bg-zinc-800 border-2 border-zinc-700 px-10 py-4 text-white font-bold text-lg rounded-sm hover:bg-zinc-700 transition transform hover:scale-105">
              JOIN DISCORD
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Trophy className="text-yellow-500" size={32} />, label: "Total Prizes", value: "रु 50,000+" },
          { icon: <Users className="text-blue-500" size={32} />, label: "Active Players", value: "1,200+" },
          { icon: <Sword className="text-red-500" size={32} />, label: "Tournaments Played", value: "45+" }
        ].map((stat, i) => (
          <div key={i} className="mc-card p-8 rounded-lg flex flex-col items-center text-center">
            {stat.icon}
            <h3 className="text-3xl font-bold mt-4 mb-1">{stat.value}</h3>
            <p className="text-zinc-400 uppercase tracking-widest text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Featured Tournaments */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Tournaments</h2>
            <p className="text-zinc-400">Jump straight into the action</p>
          </div>
          <Link to="/tournaments" className="text-green-500 font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tournaments.map((t) => (
            <div key={t.id} className="mc-card overflow-hidden group">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${t.id}/600/400`} 
                  alt={t.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">
                  {t.status}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-4">
                  <div className="flex items-center gap-1"><Trophy size={14} /> रु {t.prizePool}</div>
                  <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(t.startDate).toLocaleDateString()}</div>
                </div>
                <Link 
                  to={`/tournaments/${t.id}`} 
                  className="w-full block text-center py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 font-bold transition-colors"
                >
                  DETAILS
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Blocks */}
      <section className="bg-zinc-900 py-20 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Built for Nepali Crafters</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-green-600/10 p-3 rounded h-fit">
                  <Shield className="text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Easy Payments</h4>
                  <p className="text-zinc-400">Pay entry fees instantly via eSewa or manual bank transfer. Secure and trusted by thousands.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-green-600/10 p-3 rounded h-fit">
                  <Trophy className="text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Competitive Play</h4>
                  <p className="text-zinc-400">Professional matchmaking, anti-cheat measures, and fair rules for every single tournament.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mc-card p-4 rounded-lg transform rotate-2">
             <img src="https://picsum.photos/seed/showcase/800/600" alt="Showcase" className="rounded-sm" />
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Latest From Staff</h2>
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="mc-card p-6 text-left hover:border-green-600 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{a.title}</h4>
                <span className="text-xs text-zinc-500">{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-zinc-400 line-clamp-2">{a.content}</p>
            </div>
          ))}
        </div>
        <Link to="/announcements" className="inline-block mt-8 text-zinc-400 hover:text-white underline font-medium">
          View all updates
        </Link>
      </section>
    </div>
  );
}
