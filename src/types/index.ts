export type ApplicationStatus =
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'archived';

export interface Application {
  id: string;
  company: string;
  role: string;
  jobDescription: string; // markdown or plain text
  resumeUrl?: string; // legacy: uploaded link or text ref
  // Note: creation now sends `resume` text in payload; backend may echo it back via another field.
  deadline: string; // ISO string
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoverLetter {
  applicationId: string;
  content: string; // markdown/plain
  updatedAt?: string;
}

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};
