import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { applicationsActions } from '../slices/applications.slice';
import { adapters, api } from '@/lib/axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { Application } from '@/types';
import { toast } from 'sonner';

function* fetchApplicationsWorker(): any {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res: any = yield call(api.get, ENDPOINTS.listApplications);
      const items: Application[] = Array.isArray(res)
        ? res.map(adapters.normalizeApplication)
        : Array.isArray(res?.data)
        ? res.data.map(adapters.normalizeApplication)
        : [];
      yield put(applicationsActions.fetchApplications.success(items));
      return;
    } catch (err: any) {
      if (attempt === maxAttempts) {
        toast.error(err.message ?? 'Failed to load applications');
        yield put(applicationsActions.fetchApplications.failure(err.message ?? 'Network error'));
      } else {
        yield delay(500 * attempt);
      }
    }
  }
}

function* createApplicationWorker(
  action: ReturnType<typeof applicationsActions.createApplication.request>,
): any {
  try {
    const payload = action.payload;
    const res: any = yield call(api.post, ENDPOINTS.createApplication, payload);
    const item: Application = adapters.normalizeApplication(res);
    yield put(applicationsActions.createApplication.success(item));
  } catch (err: any) {
    toast.error(err.message ?? 'Failed to create application');
    yield put(applicationsActions.createApplication.failure(err.message ?? 'Network error'));
  }
}

function* fetchApplicationByIdWorker(
  action: ReturnType<typeof applicationsActions.fetchApplicationById.request>,
): any {
  const id = action.payload;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res: any = yield call(api.get, ENDPOINTS.getApplication(id));
      const item: Application = adapters.normalizeApplication(res);
      yield put(applicationsActions.fetchApplicationById.success(item));
      return;
    } catch (err: any) {
      if (attempt === maxAttempts) {
        toast.error(err.message ?? 'Failed to load application');
        yield put(applicationsActions.fetchApplicationById.failure(err.message ?? 'Network error'));
      } else {
        yield delay(500 * attempt);
      }
    }
  }
}

function* updateStatusWorker(
  action: ReturnType<typeof applicationsActions.updateStatus.request>,
): any {
  try {
    const { id, status } = action.payload;
    const res: any = yield call(api.patch, ENDPOINTS.updateStatus(id), { status });
    const item: Application = adapters.normalizeApplication(res);
    yield put(applicationsActions.updateStatus.success(item));
    toast.success('Status updated');
  } catch (err: any) {
    toast.error(err.message ?? 'Failed to update status');
    yield put(applicationsActions.updateStatus.failure(err.message ?? 'Network error'));
  }
}

export function* applicationsSaga() {
  yield takeLatest(applicationsActions.fetchApplications.request.type, fetchApplicationsWorker);
  yield takeLatest(applicationsActions.createApplication.request.type, createApplicationWorker);
  yield takeLatest(
    applicationsActions.fetchApplicationById.request.type,
    fetchApplicationByIdWorker,
  );
  yield takeLatest(applicationsActions.updateStatus.request.type, updateStatusWorker);
}
