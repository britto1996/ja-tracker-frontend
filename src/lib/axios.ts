import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Application, CoverLetter, ApiError } from '@/types';

// Axios singleton
export const api = axios.create({
  baseURL: undefined, // we use absolute URLs in ENDPOINTS
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// Normalize backend payloads if shape differs
function normalizeApplication(input: any): Application {
  const a = input ?? {};
  return {
    id: String(a.id ?? a._id ?? ''),
    company: String(a.company ?? ''),
    role: String(a.role ?? ''),
    jobDescription: String(a.jobDescription ?? a.job_description ?? ''),
    // Support both legacy resumeUrl and possible inline resume text references
    resumeUrl: a.resumeUrl ?? a.resume_url ?? a.resumeText ?? a.resume ?? undefined,
    deadline: a.deadline ? new Date(a.deadline).toISOString() : new Date().toISOString(),
    status: (a.status ?? 'applied') as Application['status'],
    createdAt: a.createdAt ?? a.created_at ?? undefined,
    updatedAt: a.updatedAt ?? a.updated_at ?? undefined,
  };
}

function normalizeCoverLetter(input: any): CoverLetter {
  const c = input ?? {};
  return {
    applicationId: String(c.applicationId ?? c.application_id ?? c.id ?? ''),
    // Backend may return as `cover_letter` key per product requirement
    content: String(c.content ?? c.cover_letter ?? ''),
    updatedAt: c.updatedAt ?? c.updated_at ?? undefined,
  };
}

export const adapters = { normalizeApplication, normalizeCoverLetter };

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {};
  config.headers['Content-Type'] = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      status: error.response?.status,
      details: (error.response?.data as any) ?? undefined,
    };
    return Promise.reject(apiError);
  },
);
