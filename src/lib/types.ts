export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = "admin",
  CANDIDATE = "candidate",
  VOTER = "voter",
  SPECTATOR = "spectator",
}

export enum UserStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  BLOCKED = "blocked",
}

export interface Election {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ElectionStatus;
  positions: Position[];
  createdBy: string;
  createdAt: Date;
}

export enum ElectionStatus {
  DRAFT = "draft",
  OPEN_FOR_CANDIDACY = "open_for_candidacy",
  VOTING_OPEN = "voting_open",
  VOTING_CLOSED = "voting_closed",
  RESULTS_PUBLISHED = "results_published",
}

export interface Position {
  id: string;
  name: string;
  description: string;
  numberOfSeats: number;
  candidates: Candidate[];
  electionId: string;
}

export interface Candidate {
  id: string;
  userId: string;
  positionId: string;
  description: string;
  photoUrl?: string;
  documentUrl?: string;
  status: CandidateStatus;
  rejectionReason?: string;
  votes: number;
  submittedAt: Date;
  user?: User;
}

export enum CandidateStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Vote {
  id: string;
  voterId: string;
  electionId: string;
  positionId: string;
  candidateIds: string[];
  submittedAt: Date;
}

export interface VotingSession {
  id: string;
  voterId: string;
  electionId: string;
  votes: Vote[];
  isCompleted: boolean;
  submittedAt?: Date;
}
