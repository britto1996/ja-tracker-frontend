'use client';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './rootSaga';
import applicationsReducer from './slices/applications.slice';
import coverLettersReducer from './slices/coverLetters.slice';
import uiReducer from './slices/ui.slice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
    coverLetters: coverLettersReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
