import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './action/store.ts';
import NulRouter from './router/NulRouter.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <NulRouter />
    </StrictMode>
  </Provider>
);
