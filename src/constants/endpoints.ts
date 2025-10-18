export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://ja-tracker-backend-production.up.railway.app';

export const ENDPOINTS = {
  listApplications: `${API_BASE_URL}/applications`,
  createApplication: `${API_BASE_URL}/applications`,
  getApplication: (id: string) => `${API_BASE_URL}/applications/${id}`,
  updateStatus: (id: string) => `${API_BASE_URL}/applications/${id}/status`,
  generateCoverLetter: (id: string) => `${API_BASE_URL}/applications/${id}/cover-letter`,
  editCoverLetter: (id: string) => `${API_BASE_URL}/applications/${id}/cover-letter`,
} as const;
