
import { 
  User, Tournament, Registration, Payment, Announcement, 
  UserRole, TournamentStatus, PaymentStatus, PaymentMethod 
} from './types';

const STORAGE_KEYS = {
  USERS: 'mc_nepal_users',
  TOURNAMENTS: 'mc_nepal_tournaments',
  REGISTRATIONS: 'mc_nepal_registrations',
  PAYMENTS: 'mc_nepal_payments',
  ANNOUNCEMENTS: 'mc_nepal_announcements',
  CURRENT_USER: 'mc_nepal_current_user'
};

// Initial Mock Data
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'Kathmandu Bedwars Cup',
    description: 'The ultimate Bedwars showdown for Kathmandu players. Join the fight!',
    entryFee: 150,
    prizePool: 5000,
    maxPlayers: 64,
    startDate: '2024-06-15T14:00:00Z',
    status: TournamentStatus.UPCOMING,
    gameMode: 'Bedwars 4v4',
    rules: ['No hacking', 'No toxicity', 'Must join Discord'],
    registeredCount: 12
  },
  {
    id: '2',
    name: 'Nepal Survival Games',
    description: 'Can you survive against 23 other players in a shrinking arena?',
    entryFee: 100,
    prizePool: 3000,
    maxPlayers: 24,
    startDate: '2024-06-20T18:00:00Z',
    status: TournamentStatus.UPCOMING,
    gameMode: 'Survival Games',
    rules: ['Teaming is allowed up to 2 people', 'No exploit use'],
    registeredCount: 5
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to Minecraft Nepal!',
    content: 'We are officially launching our tournament platform. Register now to win amazing prizes!',
    isPinned: true,
    createdAt: new Date().toISOString()
  }
];

export const MockDB = {
  // Helpers
  _get: <T,>(key: string, initial: T[] = []): T[] => {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  _save: <T,>(key: string, data: T[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Auth
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  register: (username: string, email: string): User => {
    const users = MockDB._get<User>(STORAGE_KEYS.USERS);
    const isAdmin = email === 'admin@mc.np'; // Simple admin check
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      role: isAdmin ? UserRole.ADMIN : UserRole.PLAYER,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    MockDB._save(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  // Tournaments
  getTournaments: () => MockDB._get<Tournament>(STORAGE_KEYS.TOURNAMENTS, INITIAL_TOURNAMENTS),
  getTournament: (id: string) => MockDB.getTournaments().find(t => t.id === id),
  addTournament: (t: Omit<Tournament, 'id' | 'registeredCount'>) => {
    const ts = MockDB.getTournaments();
    const newT = { ...t, id: Math.random().toString(36).substr(2, 9), registeredCount: 0 };
    ts.push(newT);
    MockDB._save(STORAGE_KEYS.TOURNAMENTS, ts);
    return newT;
  },
  updateTournament: (id: string, updates: Partial<Tournament>) => {
    const ts = MockDB.getTournaments();
    const idx = ts.findIndex(t => t.id === id);
    if (idx > -1) {
      ts[idx] = { ...ts[idx], ...updates };
      MockDB._save(STORAGE_KEYS.TOURNAMENTS, ts);
    }
  },

  // Registrations
  getRegistrations: () => MockDB._get<Registration>(STORAGE_KEYS.REGISTRATIONS),
  registerForTournament: (userId: string, tournamentId: string, status: PaymentStatus = PaymentStatus.PENDING) => {
    const regs = MockDB.getRegistrations();
    const existing = regs.find(r => r.userId === userId && r.tournamentId === tournamentId);
    if (existing) return existing;

    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      tournamentId,
      status,
      registeredAt: new Date().toISOString()
    };
    regs.push(newReg);
    MockDB._save(STORAGE_KEYS.REGISTRATIONS, regs);

    // Increment tournament count
    const t = MockDB.getTournament(tournamentId);
    if (t) MockDB.updateTournament(tournamentId, { registeredCount: t.registeredCount + 1 });
    
    return newReg;
  },

  // Payments
  getPayments: () => MockDB._get<Payment>(STORAGE_KEYS.PAYMENTS),
  addPayment: (p: Omit<Payment, 'id' | 'createdAt' | 'status'>) => {
    const payments = MockDB.getPayments();
    const newP: Payment = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: p.method === PaymentMethod.ESEWA ? PaymentStatus.PAID : PaymentStatus.PENDING
    };
    payments.push(newP);
    MockDB._save(STORAGE_KEYS.PAYMENTS, payments);

    // Update registration status
    const regs = MockDB.getRegistrations();
    const regIdx = regs.findIndex(r => r.userId === p.userId && r.tournamentId === p.tournamentId);
    if (regIdx > -1) {
      regs[regIdx].status = newP.status;
      regs[regIdx].paymentId = newP.id;
      MockDB._save(STORAGE_KEYS.REGISTRATIONS, regs);
    }
    return newP;
  },
  approvePayment: (paymentId: string) => {
    const payments = MockDB.getPayments();
    const pIdx = payments.findIndex(p => p.id === paymentId);
    if (pIdx > -1) {
      payments[pIdx].status = PaymentStatus.PAID;
      MockDB._save(STORAGE_KEYS.PAYMENTS, payments);

      const regs = MockDB.getRegistrations();
      const regIdx = regs.findIndex(r => r.userId === payments[pIdx].userId && r.tournamentId === payments[pIdx].tournamentId);
      if (regIdx > -1) {
        regs[regIdx].status = PaymentStatus.PAID;
        MockDB._save(STORAGE_KEYS.REGISTRATIONS, regs);
      }
    }
  },
  rejectPayment: (paymentId: string) => {
    const payments = MockDB.getPayments();
    const pIdx = payments.findIndex(p => p.id === paymentId);
    if (pIdx > -1) {
      payments[pIdx].status = PaymentStatus.REJECTED;
      MockDB._save(STORAGE_KEYS.PAYMENTS, payments);

      const regs = MockDB.getRegistrations();
      const regIdx = regs.findIndex(r => r.userId === payments[pIdx].userId && r.tournamentId === payments[pIdx].tournamentId);
      if (regIdx > -1) {
        regs[regIdx].status = PaymentStatus.REJECTED;
        MockDB._save(STORAGE_KEYS.REGISTRATIONS, regs);
      }
    }
  },

  // Announcements
  getAnnouncements: () => MockDB._get<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  addAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt'>) => {
    const ans = MockDB.getAnnouncements();
    const newA = { ...a, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    ans.unshift(newA);
    MockDB._save(STORAGE_KEYS.ANNOUNCEMENTS, ans);
    return newA;
  },
  deleteAnnouncement: (id: string) => {
    const ans = MockDB.getAnnouncements().filter(a => a.id !== id);
    MockDB._save(STORAGE_KEYS.ANNOUNCEMENTS, ans);
  }
};
