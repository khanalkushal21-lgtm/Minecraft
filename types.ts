
export enum UserRole {
  ADMIN = 'ADMIN',
  PLAYER = 'PLAYER'
}

export enum TournamentStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export enum PaymentMethod {
  ESEWA = 'ESEWA',
  BANK = 'BANK'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  startDate: string;
  status: TournamentStatus;
  gameMode: string;
  rules: string[];
  registeredCount: number;
}

export interface Registration {
  id: string;
  userId: string;
  tournamentId: string;
  status: PaymentStatus;
  paymentId?: string;
  registeredAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  tournamentId: string;
  method: PaymentMethod;
  amount: number;
  transactionId: string;
  receiptImage?: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}
