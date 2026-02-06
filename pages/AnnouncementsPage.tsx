
import React, { useState, useEffect } from 'react';
import { MessageSquare, Pin, Calendar, User } from 'lucide-react';
import { MockDB } from '../db';
import { Announcement } from '../types';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    setAnnouncements(MockDB.getAnnouncements());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <div className="bg-green-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="text-green-500" size={32} />
        </div>
        <h1 className="text-5xl font-black mb-4">LATEST UPDATES</h1>
        <p className="text-zinc-400 text-lg">Official news, maintenance alerts, and tournament results.</p>
      </div>

      <div className="space-y-8">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <article key={a.id} className="mc-card p-10 rounded-lg relative overflow-hidden group">
              {a.isPinned && (
                <div className="absolute top-0 right-0 p-3 text-zinc-700">
                  <Pin size={20} className="transform rotate-45 fill-zinc-700" />
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(a.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><User size={14} /> MC Nepal Staff</span>
                {a.isPinned && <span className="text-green-500 flex items-center gap-1"><Pin size={12} /> PINNED</span>}
              </div>

              <h2 className="text-2xl font-bold mb-4 group-hover:text-green-500 transition-colors">{a.title}</h2>
              <div className="prose prose-invert max-w-none leading-relaxed text-zinc-400">
                {a.content}
              </div>
            </article>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900 border border-dashed border-zinc-800 rounded-lg">
             <MessageSquare size={48} className="mx-auto text-zinc-800 mb-4" />
             <p className="text-zinc-500">No announcements posted yet.</p>
          </div>
        )}
      </div>

      <div className="mt-20 p-12 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4">Never miss an update!</h3>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">Join over 1,000+ players in our Discord community for real-time notifications and community discussions.</p>
        <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-10 py-4 font-bold rounded flex items-center gap-2 mx-auto transition-all">
           JOIN DISCORD COMMUNITY
        </button>
      </div>
    </div>
  );
}
