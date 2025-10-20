import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { Application, ApplicationStatus } from '@/types';

export interface ApplicationsState {
  items: Application[];
  loading: boolean;
  error?: string;
  selected?: Application | null;
  createApplicationSuccess?: boolean;
}

const initialState: ApplicationsState = {
  items: [],
  loading: false,
  error: undefined,
  selected: null,
  createApplicationSuccess: false,
};

// Request action creators for sagas
const fetchApplicationsRequest = createAction('applications/fetchApplications/request');
const fetchApplicationsSuccess = createAction<Application[]>(
  'applications/fetchApplications/success',
);
const fetchApplicationsFailure = createAction<string>('applications/fetchApplications/failure');

const createApplicationRequest = createAction<
  Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: ApplicationStatus }
>('applications/createApplication/request');
const createApplicationSuccess = createAction<Application>(
  'applications/createApplication/success',
);
const createApplicationFailure = createAction<string>('applications/createApplication/failure');

const fetchApplicationByIdRequest = createAction<string>(
  'applications/fetchApplicationById/request',
);
const fetchApplicationByIdSuccess = createAction<Application>(
  'applications/fetchApplicationById/success',
);
const fetchApplicationByIdFailure = createAction<string>(
  'applications/fetchApplicationById/failure',
);

const updateStatusRequest = createAction<{ id: string; status: ApplicationStatus }>(
  'applications/updateStatus/request',
);
const updateStatusSuccess = createAction<Application>('applications/updateStatus/success');
const updateStatusFailure = createAction<string>('applications/updateStatus/failure');

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<Application[]>) {
      // Merge by id; keep existing to preserve client-side updates
      const map = new Map(state.items.map((i) => [i.id, i] as const));
      for (const it of action.payload) map.set(it.id, it);
      state.items = Array.from(map.values());
    },
    upsert(state, action: PayloadAction<Application>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    setSelected(state, action: PayloadAction<string | null>) {
      state.selected = state.items.find((i: Application) => i.id === action.payload) ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsRequest, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchApplicationsSuccess, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApplicationsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createApplicationRequest, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createApplicationSuccess, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.selected = action.payload;
        state.createApplicationSuccess = true;
      })
      .addCase(createApplicationFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplicationByIdRequest, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchApplicationByIdSuccess, (state, action: PayloadAction<Application>) => {
        state.loading = false;
        const idx = state.items.findIndex((i: Application) => i.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
        state.selected = action.payload;
      })
      .addCase(fetchApplicationByIdFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStatusRequest, (state, action: PayloadAction<{ id: string; status: ApplicationStatus }>) => {
        // Only apply optimistic update if the status is actually different
        const app = state.items.find((i: Application) => i.id === action.payload.id);
        if (app && app.status !== action.payload.status) {
          app.status = action.payload.status;
        }
      })
      .addCase(updateStatusSuccess, (state, action: PayloadAction<Application>) => {
        const idx = state.items.findIndex((i: Application) => i.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(updateStatusFailure, (state, action) => {
        state.error = action.payload;
        // Note: For now, we'll rely on the saga to handle rollback logic
        // A future improvement could track previous states for rollback
      });
  },
});

export const applicationsActions = {
  fetchApplications: {
    request: fetchApplicationsRequest,
    success: fetchApplicationsSuccess,
    failure: fetchApplicationsFailure,
  },
  createApplication: {
    request: createApplicationRequest,
    success: createApplicationSuccess,
    failure: createApplicationFailure,
  },
  fetchApplicationById: {
    request: fetchApplicationByIdRequest,
    success: fetchApplicationByIdSuccess,
    failure: fetchApplicationByIdFailure,
  },
  updateStatus: {
    request: updateStatusRequest,
    success: updateStatusSuccess,
    failure: updateStatusFailure,
  },
  ...applicationsSlice.actions,
};

export default applicationsSlice.reducer;
