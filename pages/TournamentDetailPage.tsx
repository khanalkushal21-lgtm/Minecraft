
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, Calendar, Users, MapPin, Sword, 
  CheckCircle2, CreditCard, Wallet, Banknote, ShieldAlert,
  Loader2, Clock, X
} from 'lucide-react';
import { MockDB } from '../db';
import { 
  Tournament, User, Registration, PaymentMethod, PaymentStatus, 
  TournamentStatus 
} from '../types';

export default function TournamentDetailPage({ user }: { user: User | null }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (id) {
      const t = MockDB.getTournament(id);
      if (t) {
        setTournament(t);
        if (user) {
          const regs = MockDB.getRegistrations();
          const userReg = regs.find(r => r.userId === user.id && r.tournamentId === id);
          if (userReg) setRegistration(userReg);
        }
      }
    }
  }, [id, user]);

  const handleRegisterClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  const processEsewa = async () => {
    if (!user || !tournament) return;
    setLoading(true);
    // Simulate redirect to eSewa
    await new Promise(r => setTimeout(r, 2000));
    
    MockDB.addPayment({
      userId: user.id,
      tournamentId: tournament.id,
      method: PaymentMethod.ESEWA,
      amount: tournament.entryFee,
      transactionId: `ESEWA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });

    const newReg = MockDB.registerForTournament(user.id, tournament.id, PaymentStatus.PAID);
    setRegistration(newReg);
    setLoading(false);
    setShowPayment(false);
  };

  const processBank = async () => {
    if (!user || !tournament || !transactionId) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    MockDB.addPayment({
      userId: user.id,
      tournamentId: tournament.id,
      method: PaymentMethod.BANK,
      amount: tournament.entryFee,
      transactionId: transactionId,
      receiptImage: 'placeholder-receipt-image'
    });

    const newReg = MockDB.registerForTournament(user.id, tournament.id, PaymentStatus.PENDING);
    setRegistration(newReg);
    setLoading(false);
    setShowPayment(false);
  };

  if (!tournament) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Header */}
          <section>
            <Link to="/tournaments" className="text-zinc-500 hover:text-green-500 mb-4 inline-block">← Back to listing</Link>
            <h1 className="text-5xl font-black mb-6">{tournament.name}</h1>
            <div className="flex flex-wrap gap-4 items-center mb-8">
              <span className={`px-4 py-1.5 rounded-sm font-bold text-xs tracking-widest uppercase ${
                tournament.status === TournamentStatus.UPCOMING ? 'bg-blue-600' : 'bg-orange-600'
              }`}>
                {tournament.status}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                <Calendar size={18} />
                {new Date(tournament.startDate).toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                <Users size={18} />
                {tournament.registeredCount} / {tournament.maxPlayers} Registered
              </div>
            </div>
          </section>

          {/* Banner */}
          <div className="h-80 w-full rounded-lg overflow-hidden mc-border">
             <img src={`https://picsum.photos/seed/${tournament.id}/1200/600`} alt="Banner" className="w-full h-full object-cover" />
          </div>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sword className="text-green-500" />
              Tournament Details
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg leading-relaxed text-zinc-300">
              <p className="mb-6">{tournament.description}</p>
              
              <h3 className="font-bold text-white mb-3">Game Mode: {tournament.gameMode}</h3>
              
              <h3 className="font-bold text-white mb-3 underline">Rules:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {tournament.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Right: Sidebar / Sticky CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="mc-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-zinc-800">Registration</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase text-xs font-bold">Prize Pool</span>
                  <span className="text-green-500 text-xl font-black">रु {tournament.prizePool}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase text-xs font-bold">Entry Fee</span>
                  <span className="text-white text-xl font-bold">रु {tournament.entryFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase text-xs font-bold">Players</span>
                  <span className="text-white font-bold">{tournament.registeredCount} / {tournament.maxPlayers}</span>
                </div>
              </div>

              {registration ? (
                <div className={`p-4 rounded-sm border flex items-center gap-3 ${
                  registration.status === PaymentStatus.PAID ? 'bg-green-600/10 border-green-600 text-green-500' :
                  registration.status === PaymentStatus.PENDING ? 'bg-orange-600/10 border-orange-600 text-orange-500' :
                  'bg-red-600/10 border-red-600 text-red-500'
                }`}>
                  {/* Fixed missing icon: Clock */}
                  {registration.status === PaymentStatus.PAID ? <CheckCircle2 /> : <Clock />}
                  <div className="font-bold">
                    {registration.status === PaymentStatus.PAID ? 'REGISTRATION PAID' : 
                     registration.status === PaymentStatus.PENDING ? 'PAYMENT PENDING APPROVAL' : 'PAYMENT REJECTED'}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleRegisterClick}
                  disabled={tournament.status !== TournamentStatus.UPCOMING || tournament.registeredCount >= tournament.maxPlayers}
                  className="w-full mc-button mc-button-green py-4 text-lg font-black tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  JOIN TOURNAMENT
                </button>
              )}

              {tournament.status !== TournamentStatus.UPCOMING && (
                <p className="mt-4 text-center text-zinc-500 text-sm">Registrations are closed for this tournament.</p>
              )}
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ShieldAlert size={16} className="text-zinc-500" />
                Support Info
              </h4>
              <p className="text-sm text-zinc-400">
                Facing issues with registration? Contact us on Discord or email support@mc.np for immediate help.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Complete Registration</h3>
              {/* Fixed missing icon: X */}
              <button onClick={() => setShowPayment(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-8">
              <p className="text-zinc-400 mb-8">
                You are registering for <span className="text-white font-bold">{tournament.name}</span>. 
                Total amount to pay: <span className="text-green-500 font-bold">रु {tournament.entryFee}</span>
              </p>

              {!paymentMethod ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.ESEWA)}
                    className="flex flex-col items-center gap-4 p-8 bg-zinc-800 border-2 border-zinc-700 hover:border-green-500 transition-all rounded-lg group"
                  >
                    <div className="p-4 bg-green-600/10 rounded-full group-hover:scale-110 transition-transform">
                      <Wallet size={32} className="text-green-500" />
                    </div>
                    <span className="font-bold text-lg">Pay with eSewa</span>
                    <span className="text-xs text-zinc-500">Instant Activation</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod(PaymentMethod.BANK)}
                    className="flex flex-col items-center gap-4 p-8 bg-zinc-800 border-2 border-zinc-700 hover:border-blue-500 transition-all rounded-lg group"
                  >
                    <div className="p-4 bg-blue-600/10 rounded-full group-hover:scale-110 transition-transform">
                      <Banknote size={32} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-lg">Bank Transfer</span>
                    <span className="text-xs text-zinc-500">Manual Approval</span>
                  </button>
                </div>
              ) : paymentMethod === PaymentMethod.ESEWA ? (
                <div className="text-center py-10 space-y-6">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mx-auto text-green-500" size={48} />
                      <p className="text-lg">Connecting to eSewa securely...</p>
                    </>
                  ) : (
                    <>
                      <div className="p-6 bg-zinc-800 rounded-lg">
                        <p className="text-zinc-300">Clicking below will open the eSewa gateway.</p>
                      </div>
                      <button 
                        onClick={processEsewa}
                        className="w-full bg-[#60bb46] hover:bg-[#52a03c] text-white py-4 font-bold text-lg rounded-sm"
                      >
                        PROCEED TO ESEWA
                      </button>
                      <button onClick={() => setPaymentMethod(null)} className="text-zinc-500 hover:text-white">← Go back</button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold mb-2">Bank Details</h4>
                    <p className="text-zinc-400 text-sm">Bank Name: <span className="text-white">NIC ASIA Bank</span></p>
                    <p className="text-zinc-400 text-sm">Account Name: <span className="text-white">Minecraft Nepal Org</span></p>
                    <p className="text-zinc-400 text-sm">Account Number: <span className="text-white">1234 5678 9012 3456</span></p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Transaction ID / Reference</label>
                    <input 
                      type="text" 
                      placeholder="Enter the 10-digit code"
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-sm focus:outline-none focus:border-blue-600"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>

                  <div className="border-2 border-dashed border-zinc-800 p-8 text-center rounded-lg">
                    <p className="text-zinc-500 mb-2">Upload Voucher/Screenshot (Mock)</p>
                    <div className="mc-button bg-zinc-800 px-4 py-2 inline-block text-xs font-bold cursor-pointer">SELECT FILE</div>
                  </div>

                  <button 
                    onClick={processBank}
                    disabled={!transactionId || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 font-bold text-lg rounded-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'SUBMIT FOR APPROVAL'}
                  </button>
                  <button onClick={() => setPaymentMethod(null)} className="w-full text-zinc-500 hover:text-white">← Go back</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
