import { call, put, takeLatest } from 'redux-saga/effects';
import { coverLettersActions } from '../slices/coverLetters.slice';
import type { EditCoverLetterPayload } from '../slices/coverLetters.slice';
import { adapters, api } from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { CoverLetter } from '@/types';
import { toast } from 'sonner';

function* generateWorker(action: ReturnType<typeof coverLettersActions.generateCoverLetter.request>): any {
  try {
    const id = action.payload;
    const res: any = yield call(api.post, ENDPOINTS.generateCoverLetter(id), {});
    const letter: CoverLetter = adapters.normalizeCoverLetter({ applicationId: id, ...res });
    yield put(coverLettersActions.generateCoverLetter.success(letter));
    toast.success('Cover letter generated');
  } catch (err: any) {
    toast.error(err.message ?? 'Failed to generate letter');
    yield put(
      coverLettersActions.generateCoverLetter.failure({ id: action.payload, error: err.message ?? 'Network error' }),
    );
  }
}

function* editWorker(action: ReturnType<typeof coverLettersActions.editCoverLetter.request>): any {
  try {
    const { applicationId, content, mode = 'replace', note } = action.payload as EditCoverLetterPayload;
    const body = { mode, cover_letter: content, note };
    const res: any = yield call(api.patch, ENDPOINTS.editCoverLetter(applicationId), body);
    const letter: CoverLetter = adapters.normalizeCoverLetter({ applicationId, ...res });
    yield put(coverLettersActions.editCoverLetter.success(letter));
    toast.success('Cover letter saved');
  } catch (err: any) {
    toast.error(err.message ?? 'Failed to save letter');
    yield put(coverLettersActions.editCoverLetter.failure(err.message ?? 'Network error'));
  }
}

export function* coverLettersSaga() {
  yield takeLatest(
    coverLettersActions.generateCoverLetter.request.type,
    generateWorker,
  );
  yield takeLatest(coverLettersActions.editCoverLetter.request.type, editWorker);
}
