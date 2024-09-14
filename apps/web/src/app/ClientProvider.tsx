'use client';

import { AuthProvider } from '@/context/AuthContext';
import store from '@/services/store';
import { Provider } from 'react-redux';

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};

export default ClientProvider;
