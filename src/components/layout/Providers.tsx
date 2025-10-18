'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'sonner';
import { useReminders } from '@/hooks/useReminders';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RemindersBridge />
      {children}
      <Toaster richColors position="top-right" />
    </Provider>
  );
}

function RemindersBridge() {
  useReminders();
  return null;
}
