import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { CoverLetter } from '@/types';

export interface CoverLettersState {
  byId: Record<string, CoverLetter>;
  generatingById: Record<string, boolean>;
  saving: boolean;
  error?: string;
}

const initialState: CoverLettersState = {
  byId: {},
  generatingById: {},
  saving: false,
  error: undefined,
};

const generateCoverLetterRequest = createAction<string>('coverLetters/generate/request');
const generateCoverLetterSuccess = createAction<CoverLetter>('coverLetters/generate/success');
const generateCoverLetterFailure = createAction<{ id: string; error: string }>('coverLetters/generate/failure');

export type EditCoverLetterPayload = {
  applicationId: string;
  content: string;
  note?: string;
  mode?: 'replace' | 'append';
};

const editCoverLetterRequest = createAction<EditCoverLetterPayload>('coverLetters/edit/request');
const editCoverLetterSuccess = createAction<CoverLetter>('coverLetters/edit/success');
const editCoverLetterFailure = createAction<string>('coverLetters/edit/failure');

const coverLettersSlice = createSlice({
  name: 'coverLetters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateCoverLetterRequest, (state, action: PayloadAction<string>) => {
        state.generatingById[action.payload] = true;
        state.error = undefined;
      })
      .addCase(generateCoverLetterSuccess, (state, action: PayloadAction<CoverLetter>) => {
        state.byId[action.payload.applicationId] = action.payload;
        state.generatingById[action.payload.applicationId] = false;
      })
      .addCase(
        generateCoverLetterFailure,
        (state, action: PayloadAction<{ id: string; error: string }>) => {
          state.generatingById[action.payload.id] = false;
          state.error = action.payload.error;
        },
      )
      .addCase(editCoverLetterRequest, (state) => {
        state.saving = true;
        state.error = undefined;
      })
      .addCase(editCoverLetterSuccess, (state, action: PayloadAction<CoverLetter>) => {
        state.saving = false;
        state.byId[action.payload.applicationId] = action.payload;
      })
      .addCase(editCoverLetterFailure, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const coverLettersActions = {
  generateCoverLetter: {
    request: generateCoverLetterRequest,
    success: generateCoverLetterSuccess,
    failure: generateCoverLetterFailure,
  },
  editCoverLetter: {
    request: editCoverLetterRequest,
    success: editCoverLetterSuccess,
    failure: editCoverLetterFailure,
  },
};

export default coverLettersSlice.reducer;
