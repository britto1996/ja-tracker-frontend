import { all, fork } from 'redux-saga/effects';
import { applicationsSaga } from './sagas/applications.saga';
import { coverLettersSaga } from './sagas/coverLetters.saga';

export function* rootSaga() {
  yield all([fork(applicationsSaga), fork(coverLettersSaga)]);
}
